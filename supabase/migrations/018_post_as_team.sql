-- Migration 018: per-profile "post as team" override
-- When true, the user's forum posts + replies render as the brand
-- ("Orchestrator Academy Team") instead of their personal name.
alter table public.profiles
  add column if not exists post_as_team boolean not null default false;

-- Primary admin posts under the brand by default.
update public.profiles
  set post_as_team = true
  where user_id = '386c403d-cf7e-4e99-8b91-56da3d72a860';
