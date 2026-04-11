-- Migration 012: Blog posts
-- Stores blog articles for what's new, SEO, and content marketing

create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text not null default '',
  content text not null default '',
  featured_image_url text,
  author_id uuid references auth.users(id),
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_slug on public.blog_posts(slug);
create index if not exists idx_blog_posts_published on public.blog_posts(published, published_at desc);

-- Public read access for published posts
alter table public.blog_posts enable row level security;

create policy "Anyone can read published posts"
  on public.blog_posts for select
  using (published = true);

create policy "Admins can do everything"
  on public.blog_posts for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.user_id = auth.uid()
      and profiles.role = 'admin'
    )
  );
