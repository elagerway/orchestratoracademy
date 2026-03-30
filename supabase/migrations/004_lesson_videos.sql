-- Lesson videos (HeyGen AI avatar videos)
create table public.lesson_videos (
  id uuid default uuid_generate_v4() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade not null unique,
  heygen_video_id text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  video_url text,
  thumbnail_url text,
  duration_seconds integer,
  avatar_id text,
  voice_id text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_lesson_videos_lesson_id on public.lesson_videos(lesson_id);
create index idx_lesson_videos_heygen_id on public.lesson_videos(heygen_video_id);

alter table public.lesson_videos enable row level security;

create policy "Lesson videos are viewable by everyone"
  on public.lesson_videos for select using (true);
