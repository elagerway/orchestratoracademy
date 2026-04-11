-- Migration 011: Course active flag
-- Allows admin to activate/deactivate courses

alter table public.courses
  add column if not exists active boolean not null default true;

-- Deactivate Paperclip course by default
update public.courses set active = false where slug = 'multi-agent-paperclip';
