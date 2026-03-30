# Changelog

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
