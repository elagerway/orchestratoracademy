# AI Orchestrator Academy — Architecture

## Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Hosting**: Vercel
- **Database**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Auth**: Supabase Auth (Email, Google, GitHub)
- **Payments**: Stripe (legacy — retained for refund/portal flow; new revenue via Buy Me a Coffee + Cal.com 1:1 bookings)
- **Booking**: Cal.com (`@calcom/embed-react`, 1-hour $220 consult, 7-day rolling window)
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
│   │   │   ├── jobs/route.ts                # Admin CRUD for job listings (POST/PATCH/DELETE/GET)
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
│   │   ├── link-preview/route.ts            # GET: OG meta tag fetcher for URL previews (SSRF-safe)
│   ├── dashboard/
│   │   ├── layout.tsx                        # Dashboard layout (sidebar + latest blog post)
│   │   ├── page.tsx                          # Student dashboard (leaderboard + stats + courses)
│   │   ├── achievements/page.tsx            # Achievements grid
│   │   ├── certificates/page.tsx            # User's certificates
│   │   ├── profile/page.tsx                 # User profile + leaderboard display settings
│   │   ├── api-token/page.tsx               # CLI API token display
│   │   ├── messages/page.tsx                # Direct messages (Discord-style)
│   │   ├── support/page.tsx                 # Community forum (categories, posts, replies)
│   │   └── admin/page.tsx                   # Admin dashboard (role-gated)
│   ├── for-companies/
│   │   └── page.tsx                          # B2B landing page
│   ├── book/
│   │   └── page.tsx                          # 1:1 booking (inline Cal.com embed, $220/hr)
│   └── jobs/
│       └── page.tsx                          # Public job board (admin-curated listings)
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
│   │   ├── upgrade-button.tsx               # Checkout CTA (legacy, courses now free)
│   │   └── manage-subscription-button.tsx   # Billing portal CTA (existing subscribers)
│   ├── buy-me-coffee.tsx                    # BMaC CTA (button/inline/card variants)
│   ├── book-call.tsx                        # Cal.com booking CTA (button/inline/card variants)
│   ├── layout/
│   │   ├── header.tsx                        # Global header (context-aware: student vs public nav)
│   │   ├── footer.tsx                        # Global footer
│   │   ├── conditional-chrome.tsx           # Client-side header/footer toggle (hidden on dashboard + lessons)
│   │   ├── dashboard-sidebar.tsx            # Dashboard sidebar (nav, user popover, Recent News card)
│   │   ├── lesson-sidebar-user.tsx          # Lesson sidebar user popover (profile, theme, sign out)
│   │   └── impersonation-banner.tsx         # Admin impersonation return banner
│   ├── rich-text.tsx                         # Shared rich text renderer (URLs, link previews, images)
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
│   ├── regen-outros-m8.ts                  # Targeted outro rewrite + re-stitch (sample-rate-safe)
│   ├── upload-m8-to-vimeo.ts               # Vimeo tus upload + OA folder + DB patch (per-lesson)
│   ├── upload-m29-to-vimeo.ts              # Vimeo tus upload + OA folder + DB patch (one video → N lessons)
│   ├── upload-superpowers-to-vimeo.ts      # Batch Vimeo tus upload for Superpowers course (per-chunk retries)
│   ├── upload-superpowers-l2-to-vimeo.ts   # Batch Vimeo upload for Superpowers L2 lessons
│   ├── upload-monitoring-to-vimeo.ts       # Batch Vimeo upload for monitoring course
│   ├── upload-superpowers-mp4s-to-assets.ts # Uploads module mp4s to Supabase assets bucket
│   ├── generate-course-thumbnail.py        # Gemini 3 Pro whiteboard-style course thumbnails
│   ├── shuffle-quiz-answers.ts             # Fisher-Yates shuffle to avoid skewed correct-answer distribution
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
│   ├── 008_leaderboard_display_preferences.sql  # Username + leaderboard display preference
│   └── 017_jobs.sql                         # Job board table (RLS: public read active, no direct writes)
├── seed.sql                                  # Free course content (7 original modules)
├── seed_foundations_expanded.sql             # Modules 8-20 (APIs, MCP, Claude Code, etc.)
├── seed_foundations_infra.sql                # Modules 21-28 (Next.js, Supabase, Vercel, etc.)
├── seed_premium_courses.sql                 # CrewAI, LangGraph, Magpipe modules
├── seed_assessments.sql                     # Certification exams (4 courses, 40 questions)
├── seed_module_quizzes.sql                  # Module quizzes (51 modules, 153 questions)
├── seed_monitoring_self_healing.sql         # Application Monitoring & Self-Healing course (7 modules, 14 lessons, 7 quizzes)
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
- **forum_categories**: Community forum categories (hierarchical: parent + subcategories)
- **forum_posts**: Community forum posts (title, body, pinned, per-category)
- **forum_replies**: Threaded replies on forum posts
- **forum_reactions**: Emoji reactions on forum posts (unique per user+post+emoji)
- **direct_messages**: Private DMs between users (sender, recipient, read status)
- **jobs**: Admin-curated job listings (title, company, salary range, remote, employment_type, seniority, apply_url, active). Public SELECT on `active=true` via RLS; writes only via admin API (service role)

## Course Content
All courses are now free (`is_free=true`). Revenue comes from Buy Me a Coffee tips and paid 1:1 consults via `/book`. Existing Stripe subscribers are grandfathered.

| Course | Level | Modules | Lessons | Free |
|--------|-------|---------|---------|------|
| AI Orchestration Foundations | Entry | 28 | 77 | Yes |
| Claude Code Superpowers | Intermediate | 8 | 16 | Yes |
| Supercharging Context & Memory | Intermediate | 7 | 14 | Yes |
| Application Monitoring & Self-Healing | Intermediate | 7 | 14 | Yes |
| CrewAI Mastery | Advanced | 7 | 14 | Yes |
| LangGraph Advanced | Advanced | 7 | 14 | Yes |
| AI Communications with Magpipe | Advanced | 9 | 18 | Yes |
| AI Agent Security & Governance | Advanced | 7 | 14 | Yes |
| Autonomous Self-Improving Agents | Advanced | 7 | 14 | Yes |
| Multi-Agent Systems with Paperclip | Advanced | 9 | 18 | Yes (deactivated in admin) |
| **Total** | | **96** | **213** | |

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
- **Process**: Transcript → ElevenLabs audio → HeyGen avatar → Remotion graphics → ffmpeg filter_complex stitch
- **Automation**: `generate-module-video.ts` — fully automated per-module pipeline, `generate-all-scripts.ts` — batch script+audio generation
- **Segment types**: Talking head (raw HeyGen), Claude Code screen (Remotion), Full-screen graphic (Gemini images + Remotion)
- **Audio rule**: Talking heads use HeyGen audio (lip-synced). Code screens use raw ElevenLabs mp3 applied at ffmpeg stitch (NOT Remotion audio). This ensures consistent voice.
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

## Monetization
- **Courses**: All free as of 2026-04-22. Stripe subscription code path retained for existing subscribers (billing portal, webhook). `upgrade-button.tsx` + `manage-subscription-button.tsx` kept; paid-tier marketing removed
- **Tips**: Buy Me a Coffee — `<BuyMeCoffeeButton>` component (button / inline / card variants) on home, course detail footer, every lesson footer, dashboard sidebar. Destination in `NEXT_PUBLIC_BMAC_URL`
- **Consults**: `/book` — inline Cal.com embed (1 hour, $220, 7-day rolling window). `<BookCallButton>` surfaces the page throughout the app. Env: `NEXT_PUBLIC_CAL_LINK`, `NEXT_PUBLIC_CAL_EVENT_TYPE_ID`, `CAL_API_KEY`

## Job Board
- **Route**: `/jobs` (public, admin-curated V1)
- **Admin**: Jobs tab in `/dashboard/admin` + `/api/admin/jobs` (POST/PATCH/DELETE/GET, service-role-bypassed RLS)
- **Schema**: `jobs` table with active/posted_at indexes, RLS allows public `SELECT` on `active=true`, all client writes denied
- **Dark mode**: course thumbnails + hero rotator use the `dark:invert dark:hue-rotate-180` filter pattern from the home page
- **V2 (planned)**: applications, featured paid posts, AI matching, employer self-serve

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
7. **Community & Messaging**: Forum (categories, posts, replies, reactions), DMs, member profiles, link previews ✅
8. **Job Board V1**: Admin-curated listings at `/jobs`, admin CRUD, dark mode ✅
9. **Free pivot**: All courses free, Buy Me a Coffee + paid 1:1 booking at `/book` ✅
10. **Job Board V2**: Applications, featured paid posts, AI matching, employer self-serve (next)
