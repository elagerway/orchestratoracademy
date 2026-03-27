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
│   │   ├── lesson-content.tsx               # Markdown renderer + hero image
│   │   └── paywall-banner.tsx               # Premium course gate
│   ├── gamification/
│   │   ├── module-quiz.tsx                  # Fun 3-question quiz
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
│   ├── types/
│   │   └── database.ts                      # All TypeScript types
│   └── utils.ts                              # cn() utility
└── middleware.ts                              # Next.js middleware

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
- **module_quiz_results**: Quiz scores and pass/fail
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
4. Pass quiz (2/3 correct) → Earn 25 XP + unlock next module
5. Complete all modules → Take Certification Exam
6. Pass exam (70%) → Earn certificate + 100 XP

## Milestones
1. **MVP**: Landing page, auth, free course, progress tracking ✅
2. **Monetization**: Stripe, paid courses, certifications, B2B page ✅
3. **Gamification**: XP, quizzes, achievements, streaks ✅
4. **Job Board**: Graduate profiles, company directory, messaging (next)
