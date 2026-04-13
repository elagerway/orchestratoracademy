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
│   │   ├── signup/page.tsx                   # Signup page (first + last name required)
│   │   ├── callback/route.ts                # OAuth callback (redirects new users to profile)
│   │   └── actions.ts                        # Server actions (signOut)
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts            # Create Stripe checkout session
│   │   │   ├── webhook/route.ts             # Stripe webhook handler
│   │   │   └── portal/route.ts              # Stripe billing portal
│   │   ├── assess/route.ts                  # POST: CLI team assessment results
│   │   ├── verify-lab/route.ts              # POST: Hands-on lab evidence verification
│   │   ├── deploy-complete/route.ts         # POST: Project scaffold deploy completion
│   │   ├── learning-path/
│   │   │   ├── [userId]/route.ts            # GET: User learning path (web)
│   │   │   └── me/route.ts                  # GET: Learning path from Bearer token (CLI)
│   │   ├── admin/
│   │   │   ├── social/route.ts              # POST: Manual X/LinkedIn posting from admin
│   │   │   └── ...
│   │   ├── cron/
│   │   │   ├── publish-scheduled/route.ts   # GET: Hourly blog publish + YouTube public + X auto-post
│   │   │   └── drip-campaign/route.ts       # GET: Daily drip email cron (Vercel cron)
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
│   │           └── [lessonSlug]/page.tsx     # Lesson player (own sidebar, no header/footer)
│   ├── certificates/
│   │   └── [number]/page.tsx                # Public certificate verification
│   ├── dashboard/
│   │   ├── layout.tsx                        # Dashboard layout (uses DashboardSidebar)
│   │   ├── page.tsx                          # Student dashboard (leaderboard + stats + courses)
│   │   ├── achievements/page.tsx            # Achievements grid
│   │   ├── certificates/page.tsx            # User's certificates
│   │   ├── profile/page.tsx                 # User profile + leaderboard display settings
│   │   ├── api-token/page.tsx               # CLI API token display
│   │   └── admin/page.tsx                   # Admin dashboard (role-gated)
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
│   │   ├── header.tsx                        # Global header (context-aware: student vs public nav)
│   │   ├── footer.tsx                        # Global footer
│   │   ├── conditional-chrome.tsx           # Client-side header/footer toggle (hidden on dashboard + lessons)
│   │   ├── dashboard-sidebar.tsx            # Dashboard sidebar (OA logo, nav, user popover)
│   │   ├── lesson-sidebar-user.tsx          # Lesson sidebar user popover (profile, theme, sign out)
│   │   └── impersonation-banner.tsx         # Admin impersonation return banner
│   └── ui/                                   # shadcn/ui components
├── components/
│   └── lab-challenge.tsx                     # In-lesson hands-on lab submission
├── lib/
│   ├── supabase/
│   │   ├── client.ts                         # Browser Supabase client
│   │   ├── server.ts                         # Server Supabase client
│   │   ├── server-with-token.ts             # Dual auth: cookie (web) + Bearer token (CLI)
│   │   └── middleware.ts                     # Auth middleware (protects /dashboard, /lessons)
│   ├── stripe/
│   │   ├── client.ts                         # Browser Stripe (loadStripe)
│   │   ├── server.ts                         # Server Stripe (lazy init)
│   │   ├── config.ts                         # Plan/price configuration
│   │   └── helpers.ts                        # getUserSubscription helper
│   ├── social/
│   │   └── post-to-x.ts                     # X (Twitter) API v2 posting via OAuth 1.0a
│   ├── email/
│   │   ├── client.ts                         # Postmark send helper
│   │   └── templates.ts                     # Branded drip email templates (day 3/7/14)
│   ├── heygen/
│   │   └── client.ts                         # HeyGen API (avatars, video gen)
│   ├── elevenlabs/
│   │   └── client.ts                         # ElevenLabs TTS
│   ├── data/
│   │   └── lab-challenges.json              # Lab challenge definitions per lesson
│   ├── types/
│   │   ├── database.ts                      # All TypeScript types
│   │   └── lab-challenges.ts                # Lab challenge type
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
│   ├── generate-all.ts                     # Batch runner
│   ├── generate-thumb-backgrounds.py       # Gemini AI background generation (step 12a)
│   ├── composite-thumbnails.py             # Leo + background alpha blend (step 12b)
│   ├── news-thumbnail.mjs                  # Puppeteer text overlay (step 12c)
│   ├── update-thumbnails.mjs               # Re-upload thumbnails to YouTube
│   ├── batch-upload.mjs                    # Batch YouTube upload (video + Short + thumbnail)
│   ├── batch2-blog-posts.mjs              # Batch blog post creation via Supabase REST
│   ├── tweet-card.mjs                      # Tweet card renderer (highlighted text)
│   ├── text-card.mjs                       # Text card renderer
│   ├── youtube-upload.mjs                  # Single YouTube upload with OAuth
│   └── x-auth.mjs                          # One-time X OAuth token generation
└── output/
    └── Module {N}/Lesson {N}/               # Final videos, transcripts, thumbnails

supabase/
├── migrations/
│   ├── 001_initial_schema.sql               # Profiles, courses, modules, lessons, progress, enrollments
│   ├── 002_m2_monetization.sql              # Subscriptions, payments, assessments, certificates
│   ├── 003_gamification.sql                 # XP, module quizzes, achievements, streaks
│   ├── 006_b2b_assess_train_deploy.sql      # Team assessments, lab verifications, deploy completions
│   ├── 007_drip_campaign_log.sql            # Drip email tracking
│   └── 008_leaderboard_display_preferences.sql  # Username + leaderboard display preference
├── seed.sql                                  # Free course content (7 original modules)
├── seed_foundations_expanded.sql             # Modules 8-20 (APIs, MCP, Claude Code, etc.)
├── seed_foundations_infra.sql                # Modules 21-28 (Next.js, Supabase, Vercel, etc.)
├── seed_premium_courses.sql                 # CrewAI, LangGraph, Magpipe modules
├── seed_assessments.sql                     # Certification exams (4 courses, 40 questions)
├── seed_module_quizzes.sql                  # Module quizzes (51 modules, 153 questions)
└── update_*.sql                             # Content expansion scripts
```

## Database Schema
- **profiles**: User profiles + XP, level, streak, username, leaderboard_display, company info (auto-created on signup)
- **courses**: Course catalog (title, slug, description, is_free, price, level [entry/intermediate/advanced])
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
- **achievements**: Achievement catalog (24 badges, including B2B pipeline)
- **user_achievements**: Unlocked achievements per user
- **xp_log**: XP award history
- **team_assessments**: CLI-submitted maturity assessments (tools, APIs, repo analysis, score 1-5)
- **lab_verifications**: Hands-on lab evidence submissions (API response, terminal output, config, file hash)
- **deploy_completions**: Project scaffold deployment milestones
- **drip_log**: Tracks sent drip campaign emails per user (prevents re-sending)
- **blog_posts**: Blog CMS with WYSIWYG content, SEO fields, scheduling, YouTube video/short IDs, social posting timestamps

## Course Content
| Course | Level | Modules | Lessons | Free |
|--------|-------|---------|---------|------|
| AI Orchestration Foundations | Entry | 28 | 77 | Yes |
| Claude Code Superpowers | Intermediate | 8 | 16 | No ($29/mo) |
| Supercharging Context & Memory | Intermediate | 7 | 14 | No ($29/mo) |
| CrewAI Mastery | Advanced | 7 | 14 | No ($29/mo) |
| LangGraph Advanced | Advanced | 7 | 14 | No ($29/mo) |
| AI Communications with Magpipe | Advanced | 9 | 18 | No ($29/mo) |
| AI Agent Security & Governance | Advanced | 7 | 14 | No ($29/mo) |
| Autonomous Self-Improving Agents | Advanced | 7 | 14 | No ($29/mo) |
| Multi-Agent Systems with Paperclip | Advanced | 9 | 18 | No ($29/mo) |
| **Total** | | **89** | **199** | |

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
- **Course thumbnails**: Leo frame + title + CSS diagram (rendered at 850×480 display size, uploaded via Vimeo API)
- **News thumbnails**: 3-step process — (a) Gemini AI background, (b) Leo alpha-blend composite, (c) Puppeteer text overlay with hero backing + glow
- **End screen**: CSS overlay on video end (Replay + Next Lesson) via @vimeo/player SDK
- **Watermark**: CSS overlay in web player linking to course overview
- **Hosting**: Vimeo (private, whitelist embed, hidden details, OA folder)
- **77 foundation lessons** produced (M1-M28, all on Vimeo with thumbnails)
- **14 news videos** produced (Daily Dose of AI, on YouTube with AI thumbnails)
- Full pipeline documented in `docs/news-video-pipeline.md`
- Thumbnail design guide in `docs/thumbnail/` (SKILL.md, FORMATS.md, PROMPT_TEMPLATE.md, EXAMPLES.md)

## Email
- **Provider**: Postmark (SMTP via Supabase Auth + Postmark SDK for drip)
- **Server**: Orchestrator Academy
- **Senders**: help@OrchestratorAcademy.com, learn@orchestratoracademy.com
- **Auth templates**: Supabase default (reset password, confirm signup, etc.)
- **Drip campaign**: 3 branded emails (day 3, 7, 14 inactive) with XP stats + leaderboard
  - Runs daily at 2pm UTC via Vercel cron (`/api/cron/drip-campaign`)
  - Tracks sent emails in `drip_log` table to prevent duplicates
  - OA dark theme: #0a0a0a bg, #171717 cards, #34d399 emerald CTAs

## B2B Pipeline (Assess → Train → Deploy)
- **Assess**: CLI skill (`/assess-team`) scans tools, APIs, repos → posts maturity score (1-5) to API
- **Train**: Personalized learning path based on maturity level, hands-on labs with evidence verification
- **Deploy**: CLI skill (`/deploy-project`) scaffolds a project based on completed courses
- **Lab types**: API response ID, terminal output (AI-verified via Haiku), config content, file hash
- **Auth**: Dual-mode Supabase client supports both cookie (web) and Bearer token (CLI)
- **Achievements**: first-assessment, maturity-3, maturity-5, first-lab, five-labs, first-deploy, full-pipeline

## Admin Dashboard
- **Route**: `/dashboard/admin` (role-gated, admin only)
- **Tabs**: Overview stats, Users, Teams, Assessments, Labs, Deploys, Courses, Blog
- **User detail**: Full activity log, assessments, labs, deployments, XP history, grant course access, impersonate
- **Teams**: Expandable detail with member table + bulk grant course access for entire team
- **Courses**: Activate/deactivate toggle with affected-user warning before deactivation
- **Impersonation**: Swap to user's session, amber banner to return to admin (session preserved)
- **Blog**: WYSIWYG editor (Tiptap), YouTube embed, scheduling, "Post to X" API button
- **Data**: Fetched server-side via service role (bypasses RLS)

## Social Publishing
- **X (Twitter)**: Auto-posts via X API v2 (OAuth 1.0a) when cron publishes a blog post
- **Admin override**: Manual "Post to X" / "Re-post to X" button in Blog tab
- **Post format**: Title + excerpt + blog URL + hashtags (under 280 chars)
- **Tracking**: `twitter_posted_at` and `linkedin_posted_at` timestamps on `blog_posts`
- **LinkedIn**: Browser share link (manual) — API integration planned

## Milestones
1. **MVP**: Landing page, auth, free course, progress tracking ✅
2. **Monetization**: Stripe, paid courses, certifications, B2B page ✅
3. **Gamification**: XP, quizzes, achievements, streaks ✅
4. **Video Production**: 77 foundation lesson videos (M1-M28), all on Vimeo ✅
5. **B2B Pipeline**: Assess → Train → Deploy, CLI tools, admin dashboard, drip campaign ✅
6. **Blog & Content**: Blog CMS, Daily Dose of AI news videos, X auto-posting, scheduled publishing ✅
7. **Job Board**: Graduate profiles, company directory, messaging (next)
