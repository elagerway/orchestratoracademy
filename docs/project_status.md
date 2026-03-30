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
### Pipeline built:
- [x] Remotion compositions (TalkingHead + CodeScreen)
- [x] CodeScreen: dark terminal, typing animation, syntax highlighting
- [x] ElevenLabs integration (Chad voice, American English)
- [x] HeyGen integration (Silas/Leo avatar, Avatar 4, custom background)
- [x] Script generator (Claude API, lesson-aware, per-lesson previews)
- [x] Build-Instructions.md student template
- [x] 25fps→30fps conversion in pipeline

### Content direction locked:
- [x] Orchestrator = human, agent does the building
- [x] Screen captures show natural language instructions to Claude Code
- [x] Full workflow: Define → Build → Test → Review → Test → Push
- [x] Markdown documents as core tool (PRD, specs, CLAUDE.md)
- [x] Leo addresses students as "you", not first person
- [x] Commas instead of periods for tighter audio pacing

### Next steps (audio-first approach):
- [ ] Generate Module 1 intro — audio only (ElevenLabs + Remotion code screen)
- [ ] Generate Lesson 1 video — audio only
- [ ] Validate content, pacing, and flow
- [ ] If good: batch generate all 51 module intros + 120 lesson videos (audio only)
- [ ] Then: generate HeyGen talking head clips for all videos (393 clips)
- [ ] Composite final videos (Remotion: talking head + code screen + audio)
- [ ] Upload to Supabase Storage, update lesson video_url fields

### Video structure:
**Module intro** (51 total):
- Talking head: intro + transitions + outro (3 HeyGen clips)
- Code screens with ElevenLabs audio between them
- Covers all lessons in the module with code previews

**Lesson video** (120+ total):
- Talking head: short intro + outro (2 HeyGen clips)
- Code screen with ElevenLabs audio for main content
- Shows spec-driven workflow in context

**Total HeyGen clips needed: ~393**

## Milestone 4 — Job Board & Community (Not Started)
- [ ] Graduate Job Board (profiles, skills, rates, availability)
- [ ] Company directory with search and filters
- [ ] Contact request and messaging system
- [ ] Company onboarding flow
- [ ] Job Board opt-in in user settings

## Pending / Nice to Have
- [ ] Configure OAuth providers in Supabase (Google, GitHub)
- [ ] Connect custom domain (orchestratoracademy.com) ✅ done
- [ ] Postmark email integration (transactional emails)
- [ ] End-to-end testing with Playwright
- [ ] Email notifications (welcome, streak reminders, certificate)
- [ ] Update assessment questions to cover expanded course content
