-- M2: Monetization — subscriptions, payments, certificates, assessments

-- Subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  stripe_customer_id text not null,
  stripe_subscription_id text unique,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due', 'incomplete', 'trialing')),
  current_period_end timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Payments table
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_payment_id text not null unique,
  amount integer not null,
  currency text not null default 'usd',
  status text not null default 'succeeded' check (status in ('succeeded', 'pending', 'failed', 'refunded')),
  created_at timestamptz default now() not null
);

-- Assessments (per-course final exams)
create table public.assessments (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null unique,
  title text not null,
  description text not null default '',
  questions jsonb not null default '[]'::jsonb,
  passing_score integer not null default 70,
  time_limit_minutes integer,
  created_at timestamptz default now() not null
);

-- Assessment attempts
create table public.assessment_attempts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  assessment_id uuid references public.assessments(id) on delete cascade not null,
  answers jsonb not null default '[]'::jsonb,
  score integer not null,
  passed boolean not null default false,
  attempted_at timestamptz default now() not null
);

-- Certificates
create table public.certificates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  certificate_number text not null unique,
  assessment_score integer not null,
  issued_at timestamptz default now() not null,
  unique(user_id, course_id)
);

-- Indexes
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_stripe_customer_id on public.subscriptions(stripe_customer_id);
create index idx_payments_user_id on public.payments(user_id);
create index idx_assessment_attempts_user_id on public.assessment_attempts(user_id);
create index idx_certificates_user_id on public.certificates(user_id);
create index idx_certificates_number on public.certificates(certificate_number);

-- RLS Policies

-- Subscriptions: users can read their own
alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);

-- Payments: users can read their own
alter table public.payments enable row level security;

create policy "Users can view their own payments"
  on public.payments for select using (auth.uid() = user_id);

-- Assessments: readable by everyone (questions are public, answers aren't stored here)
alter table public.assessments enable row level security;

create policy "Assessments are viewable by everyone"
  on public.assessments for select using (true);

-- Assessment attempts: users can read/insert their own
alter table public.assessment_attempts enable row level security;

create policy "Users can view their own attempts"
  on public.assessment_attempts for select using (auth.uid() = user_id);

create policy "Users can insert their own attempts"
  on public.assessment_attempts for insert with check (auth.uid() = user_id);

-- Certificates: publicly readable (for verification), users can view their own
alter table public.certificates enable row level security;

create policy "Certificates are publicly viewable"
  on public.certificates for select using (true);
