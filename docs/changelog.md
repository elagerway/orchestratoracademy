# Changelog

## [0.12.0] - 2026-04-13

### Added
- **New course: Claude Code Superpowers** — 8 modules, 16 lessons, 8 quizzes ($29/mo)
  - Covers Context7 (real-time docs), Chrome DevTools MCP (browser automation), OpenSpec (spec-first dev), Superpowers plugin (structured workflows + subagent TDD)
  - Module 8 is a complete skills reference for all 26+ commands and 29 MCP tools
  - Gemini-generated hero image in whiteboard sketch style matching existing courses
  - Seed file: `supabase/seed_claude_code_superpowers.sql`
- **Course level system** — `level` column on courses table (entry, intermediate, advanced)
  - Entry: Foundations (free)
  - Intermediate: Claude Code Superpowers, Context & Memory
  - Advanced: CrewAI, LangGraph, Magpipe, Security, Self-Improving, Paperclip
  - Level badges displayed on course catalog and course detail pages (green/amber/red pills)
  - Migration 014: `ALTER TABLE courses ADD COLUMN level`
- `level` field added to TypeScript `Course` interface

### Changed
- Course catalog table in architecture docs updated with Level column and all 9 courses (199 total lessons)

## [0.11.1] - 2026-04-13

### Added
- **3-step thumbnail pipeline** for news videos — AI backgrounds (Gemini) → Leo composite (PIL alpha blend) → text overlay (Puppeteer)
  - `generate-thumb-backgrounds.py` — structured Gemini prompts per topic (cinematic, photo-realistic, 16:9)
  - `composite-thumbnails.py` — extracts unique Leo expression per video, gradient alpha mask blend onto AI background
  - `news-thumbnail.mjs` — hero text with dark backing, 14px outlines, color glow, drop shadows
  - `update-thumbnails.mjs` — batch re-upload thumbnails to YouTube
- **Thumbnail design guide** translated to English at `docs/thumbnail/` — SKILL.md, FORMATS.md, PROMPT_TEMPLATE.md, EXAMPLES.md
- **`/youtube-thumbnail` skill** installed at `.claude/commands/youtube-thumbnail.md`
- Rules 36-38 added to news video pipeline (X auto-post, unique Leo expressions, hero text dominance)

### Changed
- News video pipeline step 12 rewritten as 3-step process (was single-step CSS-only thumbnails)
- Rule 16 updated to reference the full 3-step thumbnail workflow
- Thumbnail backgrounds are now AI-generated (Gemini) instead of CSS gradients
- Leo frames are now per-video expressions instead of a single reused neutral frame
- Hero text now has semi-transparent dark backing + color glow + thicker outlines for readability over rich backgrounds

## [0.11.0] - 2026-04-12

### Added
- **X (Twitter) auto-posting** — publish-scheduled cron now auto-posts to X when a blog goes live
  - Posts title + excerpt + blog URL + hashtags via X API v2 (OAuth 1.0a)
  - Tracks `twitter_posted_at` timestamp to prevent double-posting
  - Env vars: `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`
- **Admin "Post to X" button** — in Blog tab, posts directly via API (replaces browser share link)
  - Shows "Re-post to X" with last-posted timestamp if already posted
  - `POST /api/admin/social` endpoint (admin-gated)
- **Social posting utility** (`src/lib/social/post-to-x.ts`) — reusable X posting with auto-truncation to 280 chars
- **Batch 2 news videos** — 10 new Daily Dose of AI videos produced, uploaded, and scheduled
  - Topics: GPT-5.4, Amazon layoffs, MCP 97M, OWASP Top 10, OpenAI $852B, Perplexity $450M, $242B AI investment, Meta Muse Spark, 92% devs AI code, ChatGPT super app
  - 10 regular (16:9) + 10 Shorts (9:16) uploaded to YouTube as unlisted
  - 10 thumbnails generated (Leo + bold headline + green highlight)
  - 10 blog posts created with YouTube embeds, scheduled Apr 25 – May 22 (every 3 days)
- **News thumbnail generator** (`video-pipeline/scripts/news-thumbnail.mjs`) — reusable Puppeteer script
- **Batch YouTube uploader** (`video-pipeline/scripts/batch-upload.mjs`) — uploads regular + Short + thumbnail in sequence
- **Batch blog post creator** (`video-pipeline/scripts/batch2-blog-posts.mjs`) — creates scheduled blog posts via Supabase REST API
- **X OAuth auth script** (`video-pipeline/scripts/x-auth.mjs`) — one-time OAuth 1.0a flow for access tokens
- `oauth` and `@types/oauth` packages added

### Changed
- `docs/social-strategy.md` updated with batch 2 schedule, video IDs, and file locations
- Publish-scheduled cron now selects `excerpt` and `tags` columns for X post content
- Admin Blog tab X button changed from browser share link to API-powered direct post

## [0.10.2] - 2026-04-11

### Added
- **Admin course management** — Courses tab with activate/deactivate toggle per course
  - Checks affected enrolled users before deactivation, shows warning with names/emails
  - "Deactivate Anyway" confirmation required when users are affected
  - `active` boolean column on courses table (migration 011), replaces hardcoded slug filtering
- **Admin grant course access** — enroll individual users or entire teams in pro courses
  - Available in user detail panel and team detail view
  - Checkbox UI with "Select all" shortcut, upserts enrollments (skips duplicates)
  - `POST /api/admin/enroll` endpoint
- **Admin user impersonation** — view the platform as any user
  - "Impersonate" button on user detail panel, swaps to user's session
  - Admin session preserved in sessionStorage, restored on return
  - Amber banner "You are viewing as another user" with "Return to Admin" button
  - `POST /api/admin/impersonate` endpoint (generates magic link + verifies OTP)
- **My Courses page** at `/dashboard/courses` with enrolled courses + recommended next courses section
- **Conditional header/footer** via client-side `ConditionalChrome` component (replaces unreliable middleware header approach)
- **Context-aware header nav** — logged-in users see Courses, Dashboard, My Courses, Achievements instead of marketing links
- **Team detail view** — expandable team cards with member email, role, and bulk grant access
- **`POST /api/admin/courses/affected`** — preview affected users before course deactivation
- Achievements page now shows all titles, descriptions, and proper icons (24 icons mapped)
- `active` field added to `Course` TypeScript interface

### Changed
- Course visibility now uses `active` column instead of hardcoded slug filter
- Paperclip course deactivated via migration (was filtered by slug)
- "My Courses" sidebar/header link now goes to `/dashboard/courses` instead of `/courses`
- Course deactivation requires confirmation when enrolled users exist (was fire-and-forget)

### Fixed
- Impersonation shows error feedback when admin session is expired instead of silent failure
- Course `active` field added to TypeScript `Course` interface (was only accessed via casts)

## [0.10.1] - 2026-04-11

### Added
- Reusable dashboard sidebar component (`dashboard-sidebar.tsx`) with OA logo, active-page highlighting, and user popover menu
- User popover on sidebar bottom-left — Profile, Dark/Light Mode, Sign Out (replaces inline items)
- Lesson pages now have their own full-height sidebar with OA logo, home icon, scrollable course nav, and user popover
- XP pop+shake animation on lesson completion (replaces bouncing bubble toast)
- `xp-pop` and `xp-shake` CSS keyframes in globals.css

### Changed
- Global header and footer hidden on `/dashboard` and lesson pages — each has its own sidebar navigation
- Dashboard leaderboard moved to top of page (above stats cards)
- Dashboard stat cards now single-line layout (icon + number + label inline)
- Lesson XP award is now optimistic — shows immediately on click, confirms with API in background
- Middleware passes `x-pathname` header for conditional header/footer rendering
- Profile link moved from sidebar nav into user popover menu

### Removed
- Floating bounce XP toast with speech-bubble triangle on lesson completion

## [0.10.0] - 2026-04-11

### Added
- **B2B Assess → Train → Deploy pipeline**
  - `POST /api/assess` — receives CLI team assessment results, awards XP + achievements
  - `POST /api/verify-lab` — verifies hands-on lab evidence (API responses, terminal output via Haiku, configs, file hashes)
  - `POST /api/deploy-complete` — records project scaffold deployments, checks full-pipeline achievement
  - `GET /api/learning-path/me` — returns assessment, course progress, and recommendations from Bearer token
  - `GET /api/learning-path/[userId]` — same for web (cookie auth)
  - Dual-auth Supabase client (`server-with-token.ts`) supports both cookie (web) and Bearer token (CLI)
  - CLI commands: `/assess-team` (environment scan + maturity scoring) and `/deploy-project` (project scaffolding)
  - 10 hands-on lab challenges mapped to foundation lessons
  - 7 new achievements: first-assessment, maturity-3, maturity-5, first-lab, five-labs, first-deploy, full-pipeline
  - Migration 006: team_assessments, lab_verifications, deploy_completions tables + profile fields
- **Admin dashboard** at `/dashboard/admin` (role-gated)
  - Overview tab with stats (users, companies, assessments, labs, deploys, avg maturity)
  - Users tab — searchable table with email, XP, level, maturity, last activity, last sign-in; click for full detail
  - Teams tab — grouped by company with member list, avg maturity, assessment/deploy counts
  - Assessments, Labs, Deploys tabs with full data tables
  - User detail panel — profile info, assessments with tool/API badges, lab submissions, deployments, XP activity log
  - Admin link in sidebar only visible to admin role users
- **Profile page** at `/dashboard/profile`
  - Editable: full name, bio, company, role
  - Leaderboard display preference: first name + last initial (default), full name, or custom username
  - Live preview of leaderboard display name
  - Welcome mode (`?welcome=true`) with onboarding copy and redirect to courses
- **Dashboard leaderboard** — top 10 by XP with medals, respects display preferences, highlights current user
- **Drip campaign** for dormant user re-engagement
  - Day 3: "You left off at [lesson]" with next lesson card
  - Day 7: Progress report with visual progress bar
  - Day 14: Community stats with social proof
  - All emails include XP badge (XP, level, rank) and top-5 leaderboard
  - Branded dark theme matching OA design (emerald CTAs, card layout, OA logo)
  - Vercel cron job runs daily at 2pm UTC (`/api/cron/drip-campaign`)
  - `drip_log` table prevents re-sending (migration 007)
  - First names only on leaderboard (privacy)
- **API token page** at `/dashboard/api-token` — displays session JWT for CLI tool usage
- **Lab challenge component** (`lab-challenge.tsx`) — in-lesson evidence submission with verification feedback
- Signup form now requires first name and last name separately
- OAuth callback redirects new users (no name set) to profile setup
- `vercel.json` with cron schedule
- Migration 008: username (unique) + leaderboard_display columns on profiles

### Fixed
- `.single()` → `.maybeSingle()` on all XP/achievement existence checks — prevents double XP awards on retries (affected assess, verify-lab, deploy-complete routes)
- verify-lab response no longer lies about XP on resubmission — tracks actual XP awarded vs. hardcoded value
- `file_hash` lab verification now validates hex characters (`/^[0-9a-f]{64}$/i`), not just string length
- Expired Bearer tokens now return helpful error: "Token expired. Visit /dashboard/api-token for a fresh token."
- `learning-path/[userId]` N+1 query eliminated — single modules query with lookup map instead of per-course DB calls
- Dead query removed from learning-path route (fetched lessons but never used result)

### Changed
- Postmark API key updated for Orchestrator Academy server
- Email sender set to `learn@orchestratoracademy.com`

## [0.9.0] - 2026-04-09

### Added
- All 77 foundation lesson videos complete (M1-M28) — all uploaded to Vimeo with thumbnails, domain whitelisting, OA folder, and database URLs
- 54 new videos for M11-M28: scripts, ElevenLabs audio, HeyGen talking heads, Remotion code screens, ffmpeg stitching
- 108 Remotion code screen compositions for M11-M28 in Root.tsx
- New premium course: "Multi-Agent Systems with Paperclip" ($29/mo)
  - 9 modules (7 core + 2 bonus), 18 lessons, 9 quizzes
  - Bonus: Hermes Agent Adapter (GEPA self-improvement, cross-framework workflows)
  - Bonus: Org Charts (5 ready-to-use company architecture templates with cost breakdowns)
- New foundations module: M29 OpenRouter — Universal AI Gateway (3 lessons, quiz)
- Seed file: `supabase/seed_paperclip_course.sql`

### Changed
- Foundations video production milestone complete — all 77 lessons have videos
- Updated architecture docs to reflect 67 modules, 155 lessons across 7 courses

## [0.8.0] - 2026-04-09

### Added
- New premium course: "Supercharging Context & Memory" ($29/mo)
  - 7 modules, 14 lessons, 7 module quizzes (21 questions)
  - Covers Karpathy's LLM Wiki pattern, AI 2027 context thesis, Obsidian knowledge management
  - Modules: Context Bottleneck, LLM Wiki Pattern, Obsidian Setup, Claude Code Wiki Engine, Interlinking Strategies, Scaling, Capstone
- Seed file: `supabase/seed_context_memory_course.sql` (eeee UUID prefix)
- Course, modules, lessons, and quizzes deployed to production database

## [0.7.1] - 2026-04-09

### Added
- 6 lesson videos for Module 9: Working with AI APIs (The OpenAI API, The Anthropic API, Comparing AI APIs)
- 6 lesson videos for Module 10: Introduction to MCP (What is MCP?, MCP Architecture, MCP Capabilities)
- 12 Remotion code screen compositions for M9-M10 in Root.tsx
- Full transcripts for all 6 new lessons

### Fixed
- Hybrid quiz API: server now hardcodes `total=5` instead of trusting client-supplied total (prevents score inflation)
- Hybrid quiz API: score clamped and `passed` re-derived server-side
- Terminal submit logic extracted from event handler (no more FormEvent/KeyboardEvent type mismatch)
- Silent fallback to wrong module's quiz questions replaced with thrown error
- Removed overly-broad `"0"` keyword from M9 quiz acceptedKeywords
- Tab-fill now works even when textarea has content (overwrites instead of no-op)
- Already-passed review page skips per-question display for hybrid modules (stored answers don't match)
- Stale `quiz.questions` removed from `submitQuiz` useCallback dependency array

## [0.7.0] - 2026-04-09

### Added
- Hybrid terminal quizzes for all 26 foundation modules (M1-M3, M6-M28) — mix of multiple choice + hands-on terminal commands
- `hybrid-quiz.tsx` component with 5 questions per module (3 MC + 2 terminal), keyword-graded with Tab-fill templates
- Each module's terminal questions are tailored to its topic (API calls, git commands, Claude Code usage, Supabase CLI, etc.)
- Quiz page routes foundation modules to hybrid format via `HYBRID_MODULE_SLUGS` array

### Changed
- Quiz page container widened from `max-w-2xl` to `max-w-4xl`
- All quiz cards (intro, results, MC, terminal) widened from `max-w-lg` to `max-w-3xl`
- Terminal quiz UI scaled up — larger text (`text-base`), taller textarea (`min-h-[120px]`), bigger traffic light dots, more padding
- `ModuleQuiz` (standard MC) now only used for premium courses (CrewAI, LangGraph, Magpipe)
- Updated `docs/project_status.md` — broke out Milestone 3 into completed sections, added content stats
- Hybrid quiz result message generalized ("Well done" instead of API-specific)

## [0.6.0] - 2026-04-02

### Added
- Custom thumbnails for all 14 Vimeo videos (Leo frame + title + CSS diagram, designed at player display size)
- Thumbnail generation pipeline: HTML template → Playwright screenshot → Vimeo upload
- Video end screen overlay — shows Replay + Next Lesson buttons when video finishes (Vimeo Player SDK)
- OA icon on video player links to course overview with hover opacity effect
- Terminal-style quizzes for M4 (Prompt Engineering) and M5 (Building Workflows) — students write specs in a Claude Code-like interface, evaluated by Claude Haiku
- Quiz spec evaluation API (`/api/quiz/evaluate-spec`) — LLM-graded free-text responses with rubric feedback
- Quiz answer evaluation API (`/api/quiz/evaluate`) — per-question LLM grading with keyword fallback
- Quiz answer storage — `answers` jsonb column on `module_quiz_results` for review after completion
- Completed quiz review — shows all questions with user's answer vs correct answer, color-coded
- Time estimates on course overview (total course hours), per-module, and per-lesson (based on video + reading time)
- XP chat bubble animation on lesson completion (replaces bouncing pill)
- `@vimeo/player` SDK for reliable video end detection
- `claude-logo.png` rendered via PIL for cross-browser block character support

### Changed
- Vimeo end screens disabled on all 14 OA videos (no more "More from Snapsonic")
- All 14 OA videos moved to the OA folder on Vimeo
- Lesson hero illustrations replaced with CSS diagram component (SVG diagrams per lesson topic)
- Thumbnail design documented in `docs/video-pipeline.md` (replaces Gemini-generated approach)
- `tsconfig.json` excludes `video-pipeline/scripts` from type checking
- Quiz page shows full question review when revisiting a passed quiz

### Fixed
- Quiz review showing wrong answers for perfect scores (pre-migration results without stored answers)

## [0.5.0] - 2026-04-01

### Added
- 14 foundation lesson videos (Modules 1-7, ~35 min total content)
- Video pipeline: ElevenLabs → HeyGen → Remotion → ffmpeg → Vimeo
- Gemini-generated illustrations for conceptual lessons (models, frameworks, ethics, etc.)
- Claude Code terminal UI for code screen segments
- Brand intro (1.5s OA icon fade) prepended to all videos
- Outro summary cards (PNG overlay via ffmpeg, jitter-free)
- Custom thumbnails for all Vimeo videos (Gemini-generated)
- OA watermark on video player via CSS overlay
- Vimeo integration — upload, thumbnails, domain whitelist, hidden details
- Postmark SMTP configured for Supabase Auth emails
- Password reset flow working end-to-end via Postmark
- Middleware redirect for auth codes landing on root (/?code=)
- Video pipeline documentation (docs/video-pipeline.md)
- /update-docs-commit skill for pre-commit doc updates
- Trust-gap rules integrated into M6L2 (force blank, penalize guessing, show source)

### Changed
- Lesson content hides hero illustration when video is present
- Code screens redesigned as authentic Claude Code UI (dark bg, green prompt, status bar)
- Video segments: talking heads never re-encoded (raw HeyGen), graphics rendered independently
- Supabase site_url updated to production domain
- Supabase redirect allowlist includes localhost + production

### Fixed
- Password reset redirect (/?code= now routes to /auth/callback with reset-password redirect)
- Video jitter eliminated by never passing HeyGen through Remotion
- ElevenLabs pause gaps fixed by replacing periods with commas in scripts

## [0.4.0] - 2026-03-30

### Added
- Video production pipeline (Remotion + HeyGen + ElevenLabs)
- Remotion compositions: TalkingHead + CodeScreen with typing animation
- CodeScreen: dark terminal, syntax highlighting, Claude Code style
- ElevenLabs integration (Chad voice, American English)
- HeyGen integration (Silas avatar, Avatar 4 motion, custom background)
- Build-Instructions.md template for students (living document)
- Forgot password + reset password auth flow
- Postmark email integration (SDK installed)

### Changed
- Video approach: audio-first validation, then layer HeyGen video
- Script generator now lesson-aware with per-lesson previews
- Code screens show orchestrator workflow (human instructs agent) not code writing
- Leo (avatar) addresses students as "you", not first person

## [0.3.0] - 2026-03-27

### Added
- Gamification system — XP, levels (1-20), streaks, achievements
- Module quizzes — 3 fun questions per module (51 quizzes, 153 questions total)
- Dedicated quiz pages at /courses/[slug]/quiz/[moduleSlug]
- 17 achievement badges (First Steps, Quiz Ace, Week Warrior, etc.)
- XP bar, streak badge, confetti animations, achievement toasts
- Lesson completion gating — must mark complete before proceeding
- Quiz locked state with progress indicator when lessons incomplete
- Hover effects on all buttons (scale, shadow, press feedback)

### Changed
- Lesson content now renders with proper markdown (react-markdown + remark-gfm)
- Custom markdown components with generous paragraph spacing
- Hero image per lesson from 64-image Unsplash pool (hash-based, unique per lesson)
- Video placeholder with play button on every lesson
- Expanded AI Orchestration Foundations from 7 to 28 modules (77 lessons)
- All lesson content expanded to 800-1200 words with code examples and exercises
- Landing page updated to reflect 28-module free course

## [0.2.0] - 2026-03-26

### Added
- Stripe integration — checkout, webhooks, billing portal
- Paywall for premium courses (Pro $29/mo, Team $99/mo)
- For Companies B2B landing page at /for-companies
- Premium course content: CrewAI (7 modules), LangGraph (7 modules), Magpipe (9 modules)
- Certification system — assessment engine, PDF certificates, public verification
- 10-question certification exams for all 4 courses
- Supabase-style design system (white/black/green, Sora font, dark mode toggle)

### Fixed
- Open redirect vulnerability in auth callback
- N+1 queries on dashboard (single joined query)
- Enrollment check on lesson pages (access control)
- RLS WITH CHECK on user_progress UPDATE policy
- AuthButton wired into header (shows avatar when logged in)
- Course pages made public (no login required to browse)
- Autocomplete attributes on auth forms

## [0.1.0] - 2026-03-25

### Added
- Project initialized with Next.js 15, Tailwind CSS 4, shadcn/ui
- Supabase integration (client, server, middleware)
- Landing page with hero, course preview, pricing, FAQ
- Authentication flow (email/password + Google/GitHub OAuth)
- Course catalog, course detail, lesson player
- Lesson completion tracking, course enrollment
- Student dashboard with progress tracking
- Database schema with full RLS policies
- Deployed to Vercel, GitHub repo created
