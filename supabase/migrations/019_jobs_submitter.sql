-- Migration 019: capture who submitted a job so admins can reach them
-- before publishing. Populated by the public /jobs/submit intake form.
alter table public.jobs
  add column if not exists submitter_name text,
  add column if not exists submitter_email text;
