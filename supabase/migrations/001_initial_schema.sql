-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table public.profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text not null default '',
  avatar_url text,
  bio text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz default now() not null
);

-- Courses table
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  description text not null default '',
  thumbnail_url text,
  is_free boolean not null default false,
  price numeric(10,2),
  "order" integer not null default 0,
  created_at timestamptz default now() not null
);

-- Modules table
create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  slug text not null,
  description text not null default '',
  "order" integer not null default 0,
  created_at timestamptz default now() not null,
  unique(course_id, slug)
);

-- Lessons table
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  slug text not null,
  content_type text not null default 'text' check (content_type in ('video', 'text', 'interactive', 'quiz')),
  content text not null default '',
  video_url text,
  "order" integer not null default 0,
  created_at timestamptz default now() not null,
  unique(module_id, slug)
);

-- User enrollments
create table public.user_enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  enrolled_at timestamptz default now() not null,
  unique(user_id, course_id)
);

-- User progress
create table public.user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  unique(user_id, lesson_id)
);

-- Indexes
create index idx_modules_course_id on public.modules(course_id);
create index idx_lessons_module_id on public.lessons(module_id);
create index idx_user_enrollments_user_id on public.user_enrollments(user_id);
create index idx_user_progress_user_id on public.user_progress(user_id);
create index idx_user_progress_lesson_id on public.user_progress(lesson_id);

-- RLS Policies

-- Profiles: users can read all profiles, update only their own
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = user_id);

-- Courses: readable by everyone
alter table public.courses enable row level security;

create policy "Courses are viewable by everyone"
  on public.courses for select using (true);

-- Modules: readable by everyone
alter table public.modules enable row level security;

create policy "Modules are viewable by everyone"
  on public.modules for select using (true);

-- Lessons: readable by everyone
alter table public.lessons enable row level security;

create policy "Lessons are viewable by everyone"
  on public.lessons for select using (true);

-- User enrollments: users can read/insert their own
alter table public.user_enrollments enable row level security;

create policy "Users can view their own enrollments"
  on public.user_enrollments for select using (auth.uid() = user_id);

create policy "Users can enroll themselves"
  on public.user_enrollments for insert with check (auth.uid() = user_id);

-- User progress: users can read/insert/update their own
alter table public.user_progress enable row level security;

create policy "Users can view their own progress"
  on public.user_progress for select using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.user_progress for insert with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.user_progress for update using (auth.uid() = user_id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
