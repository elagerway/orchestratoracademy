# Project Status

## Milestone 1 — MVP ✅
- [x] Next.js 15 + Tailwind CSS 4 + shadcn/ui
- [x] Supabase auth, database, RLS policies
- [x] Landing page (Supabase-style design, dark mode)
- [x] Auth flow (email/password + Google/GitHub OAuth + forgot password)
- [x] Course catalog and course detail pages
- [x] Lesson player with markdown rendering
- [x] Enrollment and progress tracking
- [x] Student dashboard
- [x] Deployed to Vercel + GitHub repo

## Milestone 2 — Monetization ✅
- [x] Stripe integration (checkout, webhooks, billing portal)
- [x] Subscription plans (Free / Pro $29/mo / Team $99/mo)
- [x] Paywall for premium courses
- [x] For Companies B2B landing page
- [x] Premium courses: CrewAI (7 modules), LangGraph (7 modules), Magpipe (9 modules)
- [x] All lesson content expanded to 800-1200 words
- [x] Certification system (exam engine, PDF certificates, public verification)
- [x] Free course expanded to 28 modules (MCP, Claude Code, APIs, infra)

## Milestone 2.5 — Gamification ✅
- [x] XP system with 20 levels
- [x] Module quizzes (51 quizzes, 153 questions)
- [x] Dedicated quiz pages with locked/unlocked states
- [x] 17 achievement badges
- [x] Streak tracking
- [x] Confetti animations, XP toasts, achievement notifications
- [x] Lesson completion gating (must complete to proceed)
- [x] Hero images + video placeholders per lesson
- [x] Button hover effects

## Milestone 3 — Video Production (In Progress)

### Pipeline ✅
- [x] Remotion compositions (TalkingHead, CodeScreen, BrandIntro, OutroCards)
- [x] CodeScreen: dark terminal, typing animation, syntax highlighting
- [x] ElevenLabs integration (Chad voice, American English)
- [x] HeyGen integration (Silas/Leo avatar, Avatar 4, custom background)
- [x] Script generator (Claude API, lesson-aware, per-lesson previews)
- [x] Build-Instructions.md student template
- [x] 25fps→30fps conversion in pipeline
- [x] Brand intro: 1.5s black screen with OA icon fade
- [x] OA watermark via CSS overlay (not burned in)

### Content direction ✅
- [x] Orchestrator = human, agent does the building
- [x] Screen captures show natural language instructions to Claude Code
- [x] Full workflow: Define → Build → Test → Review → Test → Push
- [x] Markdown documents as core tool (PRD, specs, CLAUDE.md)
- [x] Leo addresses students as "you", not first person
- [x] Commas instead of periods for tighter audio pacing

### Foundations Modules 1-7 (14 lessons) ✅
- [x] All 14 videos produced (ElevenLabs audio + HeyGen talking head + Remotion code screens)
- [x] All 14 uploaded to Vimeo (OA folder, domain whitelisted, details hidden)
- [x] Custom thumbnails (Leo frame + lesson title + CSS diagram, 850×480)
- [x] Vimeo end screens (Replay + Next Lesson buttons via Vimeo Player SDK)
- [x] Full transcripts for all 14 lessons
- [x] All 17 outros fixed — every video has a unique ending
- [x] Time estimates on course overview, per-module, per-lesson

### Terminal-style quizzes ✅
- [x] LLM-graded spec-writing quizzes (Claude Haiku evaluation) for M4-M5
- [x] `/api/quiz/evaluate-spec` — free-text spec evaluation
- [x] `/api/quiz/evaluate` — per-question LLM grading with keyword fallback
- [x] Quiz answer storage in `answers` jsonb column for review
- [x] Color-coded correct/user answers on completion review

### Foundations Modules 8-10 (9 lessons) ✅
- [x] M8: Understanding APIs (3 lessons) — uploaded to Vimeo
- [x] M9: Working with AI APIs (3 lessons) — stitched, pending Vimeo upload
- [x] M10: Introduction to MCP (3 lessons) — stitched, pending Vimeo upload

### Remaining video production
- [ ] Generate videos for Modules 11-28 (54 lessons remaining in Foundations)
- [ ] Generate videos for CrewAI Mastery (7 modules, 14 lessons)
- [ ] Generate videos for LangGraph Advanced (7 modules, 14 lessons)
- [ ] Generate videos for Magpipe (9 modules, 18 lessons)
- [ ] ~393 HeyGen clips total needed for all remaining content

## Milestone 4 — Job Board & Community (Not Started)
- [ ] Graduate Job Board (profiles, skills, rates, availability)
- [ ] Company directory with search and filters
- [ ] Contact request and messaging system
- [ ] Company onboarding flow
- [ ] Job Board opt-in in user settings

## Pending / Nice to Have
- [ ] Configure OAuth providers in Supabase (Google, GitHub)
- [x] Connect custom domain (orchestratoracademy.com)
- [ ] Postmark email integration (transactional emails)
- [ ] End-to-end testing with Playwright
- [ ] Email notifications (welcome, streak reminders, certificate)
- [ ] Update assessment questions to cover expanded course content

## Content Stats
- **4 courses** | **51 modules** | **120+ lessons**
- **51 module quizzes** (153 questions)
- **17 achievement badges**
- **20 videos produced** (Modules 1-10, Foundations; M1-M8 on Vimeo)
- **5 database migrations**
- **6 seed files** (11,037 lines)
