-- Migration 007: Drip campaign tracking
-- Logs sent drip emails to prevent re-sending

create table if not exists public.drip_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  drip_type text not null,
  email_to text not null,
  subject text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_drip_log_user on public.drip_log(user_id);
create index if not exists idx_drip_log_type on public.drip_log(user_id, drip_type);

-- No RLS needed — only accessed server-side via service role
