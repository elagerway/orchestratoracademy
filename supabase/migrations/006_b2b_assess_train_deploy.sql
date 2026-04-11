-- Migration 006: B2B Assess → Train → Deploy
-- Adds team assessments, lab verifications, deploy completions, and new achievements

-- ============================================================================
-- Extend profiles with assessment fields
-- ============================================================================

alter table public.profiles
  add column if not exists assessment_score integer,
  add column if not exists maturity_level integer,
  add column if not exists company_name text,
  add column if not exists company_role text;

-- ============================================================================
-- Team Assessments — CLI assessment results posted from /assess-team skill
-- ============================================================================

create table if not exists public.team_assessments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  tool_checks jsonb not null default '{}',
  api_checks jsonb not null default '{}',
  repo_analysis jsonb not null default '{}',
  maturity_score integer not null check (maturity_score between 1 and 5),
  gap_report text not null,
  raw_results jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_team_assessments_user on public.team_assessments(user_id);

alter table public.team_assessments enable row level security;

create policy "Users can view own assessments"
  on public.team_assessments for select
  using (auth.uid() = user_id);

create policy "Users can insert own assessments"
  on public.team_assessments for insert
  with check (auth.uid() = user_id);

-- ============================================================================
-- Lab Verifications — hands-on lab evidence submissions
-- ============================================================================

create table if not exists public.lab_verifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  lab_type text not null check (lab_type in ('api_response', 'terminal_output', 'config_content', 'file_hash')),
  evidence text not null,
  verified boolean not null default false,
  verification_details jsonb default '{}',
  xp_earned integer not null default 0,
  created_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create index if not exists idx_lab_verifications_user on public.lab_verifications(user_id);
create index if not exists idx_lab_verifications_lesson on public.lab_verifications(lesson_id);

alter table public.lab_verifications enable row level security;

create policy "Users can view own lab verifications"
  on public.lab_verifications for select
  using (auth.uid() = user_id);

create policy "Users can insert own lab verifications"
  on public.lab_verifications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own lab verifications"
  on public.lab_verifications for update
  using (auth.uid() = user_id);

-- ============================================================================
-- Deploy Completions — project scaffold deployment milestones
-- ============================================================================

create table if not exists public.deploy_completions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  project_name text not null,
  use_case text not null,
  scaffold_type text not null default 'nextjs-supabase',
  technologies jsonb not null default '[]',
  assessment_id uuid references public.team_assessments(id),
  completed_courses jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create index if not exists idx_deploy_completions_user on public.deploy_completions(user_id);

alter table public.deploy_completions enable row level security;

create policy "Users can view own deploy completions"
  on public.deploy_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert own deploy completions"
  on public.deploy_completions for insert
  with check (auth.uid() = user_id);

-- ============================================================================
-- New achievements for the B2B pipeline
-- ============================================================================

insert into public.achievements (slug, title, description, icon, xp_reward) values
  ('first-assessment', 'Assessed', 'Complete your first team assessment', 'clipboard-check', 100),
  ('maturity-3', 'Getting There', 'Reach AI maturity level 3', 'trending-up', 150),
  ('maturity-5', 'AI Native', 'Reach AI maturity level 5', 'crown', 500),
  ('first-lab', 'Lab Rat', 'Complete your first hands-on lab', 'flask-conical', 50),
  ('five-labs', 'Lab Expert', 'Complete 5 hands-on labs', 'microscope', 150),
  ('first-deploy', 'Shipped It', 'Deploy your first AI project scaffold', 'rocket', 200),
  ('full-pipeline', 'Full Pipeline', 'Complete Assess + Train + Deploy', 'workflow', 500)
on conflict (slug) do nothing;
