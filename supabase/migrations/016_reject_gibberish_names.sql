-- Migration 016: Server-side rejection of gibberish full_name values at signup
-- Second pass on this issue — OAuth callback already validates, but email
-- signups bypass it. Bots were filling the form with random camelCase strings.

create or replace function public.looks_real_name(n text)
returns boolean as $$
begin
  -- Heuristic: must have a space, length >= 3, no camelCase run (lowercase
  -- followed immediately by uppercase), and must not consist entirely of
  -- alpha characters with no vowel pattern breaks.
  if n is null or length(trim(n)) < 3 then
    return false;
  end if;
  if position(' ' in trim(n)) = 0 then
    return false;
  end if;
  -- Reject camelCase-style gibberish: any lowercase-then-uppercase run
  if n ~ '[a-z][A-Z]' then
    return false;
  end if;
  return true;
end;
$$ language plpgsql immutable;

-- Update signup trigger: store empty string if full_name fails real-name check.
-- The OAuth callback will redirect to /dashboard/profile?welcome=true to force setup.
-- Email-confirmed users will show "Anonymous" in UI until they edit their profile.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_name text;
  clean_name text;
begin
  raw_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '');
  if public.looks_real_name(raw_name) then
    clean_name := raw_name;
  else
    clean_name := '';
  end if;

  insert into public.profiles (user_id, full_name, avatar_url, username)
  values (
    new.id,
    clean_name,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    public.generate_username()
  );
  return new;
end;
$$ language plpgsql security definer;

-- Scrub existing gibberish names (these are almost certainly bot signups)
update public.profiles
set full_name = ''
where full_name is not null
  and full_name <> ''
  and not public.looks_real_name(full_name);
