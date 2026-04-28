-- Migration 020: separate auto-generated public alias from user-editable username
--
-- Background: profiles.username was both auto-generated on signup AND
-- user-editable in /dashboard/profile. Public-facing surfaces (Members
-- sidebar, forum author labels, DMs) showed it directly, which leaked
-- whatever the user had set it to — including real names.
--
-- Fix: a second column, auto_alias, that is system-generated, sticky,
-- and what every public surface shows by default. The username column
-- stays user-editable but is only displayed when a user has explicitly
-- opted into `leaderboard_display = 'username'`.

alter table public.profiles
  add column if not exists auto_alias text;

-- Backfill: if the existing username matches the auto-generated pattern
-- (adjective + animal + 3-5 digits), use it; otherwise generate fresh.
update public.profiles
  set auto_alias = username
  where auto_alias is null
    and username ~ '^[a-z]+[a-z]+[0-9]{3,5}$';

update public.profiles
  set auto_alias = public.generate_username()
  where auto_alias is null;

alter table public.profiles
  alter column auto_alias set not null;

create unique index if not exists idx_profiles_auto_alias
  on public.profiles(auto_alias);

-- Update the signup trigger to populate auto_alias on new signups.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name, avatar_url, username, auto_alias)
  values (
    new.id,
    case
      when public.looks_real_name(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''))
      then coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
      else ''
    end,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    public.generate_username(),
    public.generate_username()
  );
  return new;
end;
$$ language plpgsql security definer;
