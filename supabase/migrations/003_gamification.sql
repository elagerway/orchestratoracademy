-- M3: Gamification — XP, module quizzes, achievements, streaks

-- Add XP fields to profiles
alter table public.profiles
  add column if not exists xp integer not null default 0,
  add column if not exists level integer not null default 1,
  add column if not exists streak_days integer not null default 0,
  add column if not exists last_activity_date date;

-- Module quizzes (3 quick questions per module)
create table public.module_quizzes (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade not null unique,
  questions jsonb not null default '[]'::jsonb,
  xp_reward integer not null default 25,
  created_at timestamptz default now() not null
);

-- Module quiz results
create table public.module_quiz_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  module_quiz_id uuid references public.module_quizzes(id) on delete cascade not null,
  score integer not null,
  total integer not null,
  passed boolean not null default false,
  xp_earned integer not null default 0,
  completed_at timestamptz default now() not null,
  unique(user_id, module_quiz_id)
);

-- Achievements catalog
create table public.achievements (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  title text not null,
  description text not null,
  icon text not null default 'trophy',
  xp_reward integer not null default 0,
  created_at timestamptz default now() not null
);

-- User achievements (unlocked)
create table public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  achievement_id uuid references public.achievements(id) on delete cascade not null,
  unlocked_at timestamptz default now() not null,
  unique(user_id, achievement_id)
);

-- XP log (track what gave XP)
create table public.xp_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  amount integer not null,
  source text not null,
  source_id text,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_module_quizzes_module_id on public.module_quizzes(module_id);
create index idx_module_quiz_results_user_id on public.module_quiz_results(user_id);
create index idx_user_achievements_user_id on public.user_achievements(user_id);
create index idx_xp_log_user_id on public.xp_log(user_id);

-- RLS

alter table public.module_quizzes enable row level security;
create policy "Module quizzes are viewable by everyone"
  on public.module_quizzes for select using (true);

alter table public.module_quiz_results enable row level security;
create policy "Users can view their own quiz results"
  on public.module_quiz_results for select using (auth.uid() = user_id);
create policy "Users can insert their own quiz results"
  on public.module_quiz_results for insert with check (auth.uid() = user_id);

alter table public.achievements enable row level security;
create policy "Achievements are viewable by everyone"
  on public.achievements for select using (true);

alter table public.user_achievements enable row level security;
create policy "User achievements are viewable by everyone"
  on public.user_achievements for select using (true);
create policy "Users can insert their own achievements"
  on public.user_achievements for insert with check (auth.uid() = user_id);

alter table public.xp_log enable row level security;
create policy "Users can view their own XP log"
  on public.xp_log for select using (auth.uid() = user_id);
create policy "Users can insert their own XP log"
  on public.xp_log for insert with check (auth.uid() = user_id);

-- Seed achievements catalog
insert into public.achievements (slug, title, description, icon, xp_reward) values
  ('first-lesson', 'First Steps', 'Complete your first lesson', 'rocket', 10),
  ('first-module', 'Module Master', 'Complete all lessons in a module', 'book-check', 25),
  ('quiz-ace', 'Quiz Ace', 'Score 100% on a module quiz', 'zap', 50),
  ('five-lessons', 'Getting Warmed Up', 'Complete 5 lessons', 'flame', 25),
  ('ten-lessons', 'Double Digits', 'Complete 10 lessons', 'star', 50),
  ('twenty-five-lessons', 'Quarter Century', 'Complete 25 lessons', 'award', 100),
  ('fifty-lessons', 'Half Way Hero', 'Complete 50 lessons', 'medal', 200),
  ('first-quiz', 'Quiz Taker', 'Pass your first module quiz', 'check-circle', 15),
  ('five-quizzes', 'Quiz Champion', 'Pass 5 module quizzes', 'crown', 75),
  ('streak-3', 'On a Roll', 'Learn 3 days in a row', 'flame', 30),
  ('streak-7', 'Week Warrior', 'Learn 7 days in a row', 'calendar', 75),
  ('streak-30', 'Monthly Machine', 'Learn 30 days in a row', 'trophy', 300),
  ('first-certificate', 'Certified', 'Earn your first certificate', 'graduation-cap', 200),
  ('speed-learner', 'Speed Learner', 'Complete 5 lessons in one day', 'bolt', 50),
  ('night-owl', 'Night Owl', 'Complete a lesson after midnight', 'moon', 15),
  ('early-bird', 'Early Bird', 'Complete a lesson before 7am', 'sunrise', 15),
  ('all-foundations', 'Foundation Builder', 'Complete all AI Orchestration Foundations modules', 'building', 500);
