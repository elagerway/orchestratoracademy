-- Migration 017: Job board (V1 — admin-curated listings, public read)

create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  company_name text not null,
  company_logo_url text,
  company_url text,
  location text,
  remote boolean not null default false,
  employment_type text not null default 'full_time' check (employment_type in ('full_time', 'contract', 'freelance', 'part_time', 'internship')),
  seniority text check (seniority in ('junior', 'mid', 'senior', 'staff', 'principal', 'director')),
  salary_min integer,
  salary_max integer,
  salary_currency text default 'USD',
  description text not null,
  apply_url text not null,
  posted_at timestamptz default now() not null,
  active boolean not null default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_jobs_active_posted on public.jobs(active, posted_at desc);
create index idx_jobs_remote on public.jobs(remote) where active = true;

alter table public.jobs enable row level security;

-- Public read: only active rows
create policy "Active jobs are viewable by everyone"
  on public.jobs for select
  using (active = true);

-- Admin full access (RLS bypassed by service role key in admin API routes,
-- so no explicit admin policy needed — but lock down direct writes)
create policy "No direct writes from clients"
  on public.jobs for all
  using (false)
  with check (false);
