-- Migration 009: Prevent duplicate XP awards via unique constraint
-- Fixes race condition where concurrent requests could double-award XP

create unique index if not exists idx_xp_log_unique_award
  on public.xp_log(user_id, source, source_id);
