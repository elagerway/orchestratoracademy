-- Migration 010: Auto-generate fun usernames on signup
-- Format: adjective + animal + 3 digits (e.g. swiftpanda427)

create or replace function public.generate_username()
returns text as $$
declare
  adjectives text[] := array[
    'swift', 'bold', 'cosmic', 'neon', 'pixel', 'cyber', 'turbo', 'quantum',
    'lunar', 'sonic', 'hyper', 'nova', 'azure', 'ember', 'frost', 'iron',
    'jade', 'ruby', 'onyx', 'amber', 'coral', 'vivid', 'rapid', 'bright',
    'clever', 'witty', 'keen', 'nimble', 'sleek', 'epic', 'calm', 'wild',
    'zen', 'prime', 'elite', 'ace', 'mega', 'ultra', 'giga', 'alpha',
    'beta', 'delta', 'sigma', 'omega', 'lucky', 'noble', 'brave', 'mint'
  ];
  animals text[] := array[
    'panda', 'fox', 'wolf', 'hawk', 'orca', 'lynx', 'raven', 'tiger',
    'eagle', 'cobra', 'shark', 'bear', 'lion', 'crane', 'falcon', 'otter',
    'bison', 'viper', 'heron', 'gecko', 'mantis', 'drake', 'phoenix', 'owl',
    'jaguar', 'panther', 'condor', 'dolphin', 'badger', 'coyote', 'puma', 'stag',
    'moose', 'rhino', 'toucan', 'parrot', 'husky', 'corgi', 'ferret', 'koala'
  ];
  candidate text;
  attempts int := 0;
begin
  loop
    candidate := adjectives[1 + floor(random() * array_length(adjectives, 1))::int]
      || animals[1 + floor(random() * array_length(animals, 1))::int]
      || lpad(floor(random() * 1000)::text, 3, '0');

    -- Check uniqueness
    if not exists (select 1 from public.profiles where username = candidate) then
      return candidate;
    end if;

    attempts := attempts + 1;
    if attempts > 20 then
      -- Fallback: append more digits
      return candidate || floor(random() * 100)::text;
    end if;
  end loop;
end;
$$ language plpgsql;

-- Update the signup trigger to assign a username
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name, avatar_url, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    public.generate_username()
  );
  return new;
end;
$$ language plpgsql security definer;

-- Backfill existing users who don't have a username
update public.profiles
set username = public.generate_username()
where username is null;
