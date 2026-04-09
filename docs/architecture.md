# AI Orchestrator Academy — Architecture

## Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Hosting**: Vercel
- **Database**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Auth**: Supabase Auth (Email, Google, GitHub)
- **Payments**: Stripe (subscriptions, checkout, webhooks, billing portal)
- **AI Communications**: Magpipe (course content)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Fonts**: Sora (headings), Geist Sans (body)
- **Design**: Supabase-style — white/black/green (#3ECF8E), dark mode toggle

## Domain
- `orchestratoracademy.com`
- Deployed: `orchestratoracademy.vercel.app`

## Project Structure
```
src/
├── app/
│   ├── page.tsx                              # Landing page
│   ├── layout.tsx                            # Root layout (Header + Footer + fonts)
│   ├── auth/
│   │   ├── login/page.tsx                    # Login page
│   │   ├── signup/page.tsx                   # Signup page
│   │   ├── callback/route.ts                # OAuth callback handler
│   │   └── actions.ts                        # Server actions (signOut)
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts            # Create Stripe checkout session
│   │   │   ├── webhook/route.ts             # Stripe webhook handler
│   │   │   └── portal/route.ts              # Stripe billing portal
│   │   ├── assessments/
│   │   │   └── submit/route.ts              # Submit certification exam
│   │   ├── quiz/
│   │   │   ├── evaluate/route.ts            # LLM-graded quiz answers (Haiku)
│   │   │   └── evaluate-spec/route.ts       # LLM-graded spec submissions (Haiku)
│   │   └── gamification/
│   │       ├── quiz-complete/route.ts       # Submit module quiz
│   │       └── lesson-xp/route.ts           # Award XP for lesson completion
│   ├── courses/
│   │   ├── page.tsx                          # Course catalog
│   │   └── [slug]/
│   │       ├── page.tsx                      # Course detail + paywall
│   │       ├── assessment/page.tsx           # Certification exam
│   │       ├── quiz/
│   │       │   └── [moduleSlug]/page.tsx     # Module quiz (own page)
│   │       └── lessons/
│   │           └── [lessonSlug]/page.tsx     # Lesson player
│   ├── certificates/
│   │   └── [number]/page.tsx                # Public certificate verification
│   ├── dashboard/
│   │   ├── layout.tsx                        # Dashboard sidebar layout
│   │   ├── page.tsx                          # Student dashboard
│   │   ├── achievements/page.tsx            # Achievements grid
│   │   └── certificates/page.tsx            # User's certificates
│   └── for-companies/
│       └── page.tsx                          # B2B landing page
├── components/
│   ├── auth/
│   │   └── auth-button.tsx                   # Auth state-aware header button
│   ├── courses/
│   │   ├── course-progress.tsx              # Progress bar wrapper
│   │   ├── enroll-button.tsx                # Course enrollment CTA
│   │   ├── lesson-complete-button.tsx       # Mark complete + XP award
│   │   ├── lesson-content.tsx               # Markdown renderer + video player + end screen
│   │   └── paywall-banner.tsx               # Premium course gate
│   ├── gamification/
│   │   ├── module-quiz.tsx                  # Multiple choice quiz (premium courses)
│   │   ├── terminal-quiz.tsx                # Terminal-style spec-writing quiz (M4-M5)
│   │   ├── hybrid-quiz.tsx                  # MC + terminal command quiz (M1-M3, M6-M28)
│   │   ├── xp-bar.tsx                       # XP progress + level display
│   │   ├── streak-badge.tsx                 # Daily streak indicator
│   │   ├── confetti.tsx                     # CSS confetti animation
│   │   └── achievement-toast.tsx            # Achievement unlock notification
│   ├── stripe/
│   │   ├── upgrade-button.tsx               # Checkout CTA
│   │   └── manage-subscription-button.tsx   # Billing portal CTA
│   ├── layout/
│   │   ├── header.tsx                        # Header + dark mode toggle + AuthButton
│   │   └── footer.tsx                        # Footer
│   └── ui/                                   # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts                         # Browser Supabase client
│   │   ├── server.ts                         # Server Supabase client
│   │   └── middleware.ts                     # Auth middleware (protects /dashboard, /lessons)
│   ├── stripe/
│   │   ├── client.ts                         # Browser Stripe (loadStripe)
│   │   ├── server.ts                         # Server Stripe (lazy init)
│   │   ├── config.ts                         # Plan/price configuration
│   │   └── helpers.ts                        # getUserSubscription helper
│   ├── heygen/
│   │   └── client.ts                         # HeyGen API (avatars, video gen)
│   ├── elevenlabs/
│   │   └── client.ts                         # ElevenLabs TTS
│   ├── types/
│   │   └── database.ts                      # All TypeScript types
│   └── utils.ts                              # cn() utility
└── middleware.ts                              # Next.js middleware

video-pipeline/                                # Video production (separate from app)
├── remotion.config.ts                        # Remotion config
├── video-pipeline.md → docs/video-pipeline.md # Full pipeline documentation
├── public/
│   └── Module {N}/Lesson {N}/               # HeyGen videos, voiceovers, Gemini images
├── src/
│   ├── index.tsx                             # Remotion entry
│   ├── Root.tsx                              # Composition registration
│   ├── compositions/
│   │   ├── ModuleVideo.tsx                  # Main composition (TH + CS segments)
│   │   ├── BrandIntro.tsx                  # 1.5s branded intro (OA icon fade)
│   │   ├── ImageSlideshow.tsx              # Full-screen Gemini image slides
│   │   ├── OutroCards.tsx                  # Transparent outro summary cards
│   │   └── FrameworksGraphic.tsx           # Per-lesson graphic compositions
│   └── components/
│       ├── CodeScreen.tsx                   # Claude Code terminal UI
│       └── CodeHighlighter.tsx             # Syntax highlighting
├── scripts/
│   ├── generate-scripts.ts                  # Claude API script generator
│   ├── generate-module-video.ts            # Per-module orchestrator
│   └── generate-all.ts                     # Batch runner
└── output/
    └── Module {N}/Lesson {N}/               # Final videos, transcripts, thumbnails

supabase/
├── migrations/
│   ├── 001_initial_schema.sql               # Profiles, courses, modules, lessons, progress, enrollments
│   ├── 002_m2_monetization.sql              # Subscriptions, payments, assessments, certificates
│   └── 003_gamification.sql                 # XP, module quizzes, achievements, streaks
├── seed.sql                                  # Free course content (7 original modules)
├── seed_foundations_expanded.sql             # Modules 8-20 (APIs, MCP, Claude Code, etc.)
├── seed_foundations_infra.sql                # Modules 21-28 (Next.js, Supabase, Vercel, etc.)
├── seed_premium_courses.sql                 # CrewAI, LangGraph, Magpipe modules
├── seed_assessments.sql                     # Certification exams (4 courses, 40 questions)
├── seed_module_quizzes.sql                  # Module quizzes (51 modules, 153 questions)
└── update_*.sql                             # Content expansion scripts
```

## Database Schema
- **profiles**: User profiles + XP, level, streak (auto-created on signup)
- **courses**: Course catalog (title, slug, description, is_free, price)
- **modules**: Course modules (ordered within a course)
- **lessons**: Module lessons (video, text, interactive, quiz content types)
- **user_enrollments**: Tracks which courses a user is enrolled in
- **user_progress**: Tracks lesson completion per user
- **subscriptions**: Stripe subscription status per user
- **payments**: Payment history
- **assessments**: Certification exam questions per course
- **assessment_attempts**: Exam attempt history
- **certificates**: Issued certificates with unique numbers
- **module_quizzes**: 3-question quizzes per module
- **module_quiz_results**: Quiz scores, pass/fail, and stored answers (jsonb)
- **achievements**: Achievement catalog (17 badges)
- **user_achievements**: Unlocked achievements per user
- **xp_log**: XP award history

## Course Content
| Course | Modules | Lessons | Free |
|--------|---------|---------|------|
| AI Orchestration Foundations | 28 | 77 | Yes |
| CrewAI Mastery | 7 | 14 | No ($29/mo) |
| LangGraph Advanced | 7 | 14 | No ($29/mo) |
| AI Communications with Magpipe | 9 | 18 | No ($29/mo) |
| **Total** | **51** | **123** | |

## Learning Flow
1. Browse courses → Enroll (free or paid)
2. Read lesson → Mark as Complete (awards 10 XP)
3. Complete all module lessons → Unlock Module Quiz
4. Pass quiz → Earn 25 XP + unlock next module
   - M4-M5: Terminal-style spec writing (LLM-graded, 3/5 rubric to pass)
   - M1-M3, M6-M28: Hybrid quiz — MC + terminal commands (5 questions, keyword-graded)
   - Premium courses: Multiple choice (3 questions, 2/3 to pass)
5. Complete all modules → Take Certification Exam
6. Pass exam (70%) → Earn certificate + 100 XP

## Video Pipeline
- **Process**: Transcript → ElevenLabs audio → HeyGen avatar → Remotion graphics → ffmpeg stitch
- **Segment types**: Talking head (raw HeyGen), Claude Code screen (Remotion), Full-screen graphic (Gemini images + Remotion)
- **Outro**: PNG overlay composited via ffmpeg (avoids Remotion jitter)
- **Brand intro**: 1.5s OA icon fade prepended to every video
- **Thumbnails**: Leo frame + title + CSS diagram (rendered at 850×480 display size, uploaded via Vimeo API)
- **End screen**: CSS overlay on video end (Replay + Next Lesson) via @vimeo/player SDK
- **Watermark**: CSS overlay in web player linking to course overview
- **Hosting**: Vimeo (private, whitelist embed, hidden details, OA folder)
- **14 foundation lessons** produced (~35 min total)
- Full pipeline documented in `docs/video-pipeline.md`

## Email
- **Provider**: Postmark (SMTP via Supabase Auth)
- **Server**: Orchestrator Academy (519ab24f...)
- **Sender**: help@OrchestratorAcademy.com (SPF + DKIM verified)
- **Templates**: Supabase default (reset password, confirm signup, etc.)

## Milestones
1. **MVP**: Landing page, auth, free course, progress tracking ✅
2. **Monetization**: Stripe, paid courses, certifications, B2B page ✅
3. **Gamification**: XP, quizzes, achievements, streaks ✅
4. **Video Production**: 14 foundation lesson videos, Vimeo hosting ✅
5. **Job Board**: Graduate profiles, company directory, messaging (next)
