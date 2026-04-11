-- Migration 008: Leaderboard display preferences
-- Adds username and display preference for leaderboard privacy

alter table public.profiles
  add column if not exists username text unique,
  add column if not exists leaderboard_display text not null default 'first_initial'
    check (leaderboard_display in ('full_name', 'first_initial', 'username'));

create index if not exists idx_profiles_username on public.profiles(username);
