-- Migration 013: Enhanced blog fields for SEO and social posting

alter table public.blog_posts
  add column if not exists meta_description text not null default '',
  add column if not exists tags text[] not null default '{}',
  add column if not exists author_name text not null default 'Orchestrator Academy',
  add column if not exists status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'published')),
  add column if not exists scheduled_at timestamptz,
  add column if not exists twitter_posted_at timestamptz,
  add column if not exists linkedin_posted_at timestamptz;
