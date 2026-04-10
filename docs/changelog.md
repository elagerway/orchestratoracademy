# Changelog

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
