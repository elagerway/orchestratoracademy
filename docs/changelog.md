# Changelog

## [0.15.6] - 2026-04-23

### Added
- **Job submission intake form** at `/jobs/submit` — Cloudflare Turnstile-protected public form with every jobs-table field plus submitter name + email. Form posts to `/api/jobs/submit`, which verifies the token via Cloudflare `siteverify`, whitelists + length-caps every field, enum-checks `employment_type` / `seniority`, rejects non-http apply URLs, then inserts to `public.jobs` with `active=false` so admins review before publish. RLS stays locked — client writes still denied; the API route uses service role on sanitized input only. Replaces the earlier `/contact` 404 link on `/jobs`
- **Per-profile team-brand toggle** — new `profiles.post_as_team boolean not null default false` column (migration `018_post_as_team.sql`, pre-set to `true` for the primary admin). Admin user-edit UI has a checkbox ("Post as Orchestrator Academy Team"). When on, that user's forum posts + replies render as the brand (name override + `orchestratoracademy` username, no avatar) — real author still recorded on the row. Replaces the hardcoded `erik@snapsonic.com` user_id check
- **Forum markdown rendering** — `RichText` component used to be plain-text-only (URL autolinking + image previews). Swapped the body path to `react-markdown` + `remark-gfm` so `**bold**`, lists, and `[link text](url)` actually render across every forum post and reply. Link + image preview cards still run after the markdown pass
- **Community nav badge** — localStorage-tracked `forum-last-seen` timestamp. On each sidebar mount, count `forum_posts` with `created_at > last_seen` and render a green pill next to "Community". Clears on `/dashboard/support` visit. First-time visitors get a `now` baseline so no backlog count
- Migration `019_jobs_submitter.sql` — adds `jobs.submitter_name` + `jobs.submitter_email`. Already applied to prod via Supabase Management API
- Admin API `/api/admin/users` whitelist split into `STRING_FIELDS` + `BOOLEAN_FIELDS` so the new boolean `post_as_team` gets type-coerced properly

### Fixed
- **Zero forum posts rendered** — the server query on `/dashboard/support` used `.select("*, profiles:user_id(...)")` which needs a FK between `forum_posts.user_id` and `profiles.user_id`. No such FK exists in prod (both columns reference `auth.users`) so PostgREST returned `PGRST200` and `supabase-js` swallowed it, yielding an empty array. **The entire forum has been rendering zero posts, not just the new announcements.** Replaced the embed with a manual join in code (fetch posts → collect unique user_ids → fetch profiles → map by user_id). Same fix applied to the reply loader

### Notes
- **Supabase migration tracking is effectively disabled on prod** — `api.supabase.com/v1/projects/.../database/migrations` returns 0 applied, but the schema has every table. Migrations have been applied out-of-band (dashboard SQL editor / psql). New schema changes now go through the Supabase Management API `POST /database/query` endpoint using the CLI's cached PAT. Migration files in `supabase/migrations/` stay as the canonical diff, but don't run `supabase db push` — it would try to re-apply all 17 existing migrations

## [0.15.5] - 2026-04-23

### Added
- **Admin SMS alert on new signups** via Magpipe. Fires once per user from `auth/callback/route.ts` in the existing `!profile.signup_ip` branch (so only on first confirmed login, not every session). `src/lib/magpipe/client.ts` is a thin POST to `https://api.magpipe.ai/functions/v1/send-user-sms`. Fire-and-forget so SMS never blocks auth
- Env vars: `MAGPIPE_API_KEY`, `MAGPIPE_SERVICE_NUMBER` (+16044123888 — "Erik's Assistant"), `ADMIN_SIGNUP_NOTIFY_PHONE` (+16045628647). Set on Vercel Production + `.env.local`
- **Blog post + YouTube video: "Claude Routines vs n8n vs Make.com"** — shipped the full companion: blog at `/blog/claude-routines-vs-n8n-vs-make` with featured image matching YouTube thumbnail, video at `youtube.com/watch?v=ocKapEL1qww`, forum Announcement posts for both free-courses and routines-vs-n8n topics
- **Remotion compositions**: `RoutinesKnobs` (natural-language-vs-knobs split panel with typewriter + wiring diagram) and `RoutinesDecision` (4-card decision tree fading in on narration beats) at `video-pipeline/src/compositions/`

### Changed
- **Auth popover formatting** — the user-menu dropdown in the header had `DropdownMenuContent` at default width, which truncated long emails mid-character (`erik@snapsonic.co` instead of `erik@snapsonic.com`). Now `min-w-[16rem]` with `truncate` on the email lines — fits the full domain, falls back to ellipsis if still too long

## [0.15.4] - 2026-04-23

### Changed
- **`/book/confirmed` swaps heading after booking** — heading ownership moved from the server page into the client embed component so it can react to Cal.com's `bookingSuccessfulV2` postMessage. Pre-booking shows "Payment received / You're in — now pick a slot". Post-booking flips to "Session booked / See you then / Calendar invite sent to …". Also listens for the deprecated `bookingSuccessful` as a fallback
- `getCalApi` is now called with `{ namespace: "consult-paid" }` to match the `<Cal>` instance — the default-namespace listener was silently dropping events because Cal.com's action manager is per-namespace. Verified end-to-end in the browser: booking a slot flips the heading live

## [0.15.3] - 2026-04-23

### Added
- **Payment-gated consult booking** — `/book` now starts with a $220 Stripe Checkout (one-time, payment mode) instead of dropping the user straight into the Cal.com embed. After checkout, Stripe redirects to `/book/confirmed?session_id=…`, which server-verifies `payment_status === "paid"` via `stripe.checkout.sessions.retrieve` and only then renders the scheduler. Canceled checkouts return to `/book?canceled=1` with a non-blocking banner. Charged via inline `price_data` ($220 USD, "1-hour AI Orchestrator consult") — no Stripe product/price setup required
- `src/app/api/stripe/book-checkout/route.ts` — no-auth POST endpoint; metadata `{ type: "consult_booking" }` so the existing subscription webhook skips it via the `!userId` guard
- `src/app/book/confirmed/page.tsx` + `embed.tsx` — split into server (verification) + client (Cal.com iframe) components

### Changed
- `/book` Cal.com embed drops the fixed `height: 720px` — lets the iframe auto-resize so the container no longer leaves a huge white block after the "meeting scheduled" confirmation state shrinks

### Known gap
- A determined user could still navigate directly to `cal.com/robotfood/consult` and book without paying (the Cal.com event type is still public). Full gating requires marking the event type private in Cal.com — flagged for follow-up

## [0.15.2] - 2026-04-23

### Changed
- **Compact BMaC + Book Call cards** — shrank icon (size-10 → size-9), padding (p-5 → p-4), dropped the trailing "Book →" / "Tip →" CTA text that was wrapping the titles to 4 lines in the narrow dashboard sidebar (w-60). Titles and subtitles now `truncate` so they always stay on one line regardless of container width
- **New default copy**: "1:1 Coaching" / "1-hour paid consult — $220" (was "Work with Erik — $220 / hour" / "1-hour 1:1 consult. Pick a slot this week and book in one step."); "Buy Team a Coffee" / "Help keep the lessons free" (was "Found this useful?" / "The Academy is free. If it helped, buy us a coffee.")
- **`/book` page title** — "Book a 1-hour session with Erik" → "Book a 1-hour session with our team"
- **`/book` embed wrapper** — dropped the outer `rounded-xl border border-border bg-card` container so the Cal.com embed's own chrome isn't double-framed
- **Free badge on every enrolled course card** — `/dashboard` and `/dashboard/courses` now render a consistent emerald-tinted `Free` badge on every course (paired with the existing `Done` badge when a course is 100% complete)
- **Dashboard "Recommended Next" badge** — dropped the dead `is_free ? Free : Pro` ternary; all courses are free so the Pro branch was unreachable. Always shows the emerald `Free` badge now

## [0.15.1] - 2026-04-22

### Added
- **Book a Call card on every lesson footer** — `<BookCallButton variant="card" />` now sits below the existing `<BuyMeCoffeeButton>` in `lesson-content.tsx`, so paid 1:1 Cal.com scheduling is surfaced at the bottom of every lesson (matching the course-detail footer pattern)

### Removed
- **SaaS subscription gating from the lesson/course flow**
  - `src/app/courses/[slug]/page.tsx` — dropped the dead `hasActiveSubscription` query; it was still hitting `subscriptions` on every course page load even though all courses are now `is_free=true` and the result was never read in the JSX
  - `src/components/courses/paywall-banner.tsx` — deleted (orphaned after free-pivot; no importers)
  - `src/app/page.tsx` — deleted the orphaned `pricingPlans` array (Free / Pro $29 / Team $99 data, no longer rendered; the `#pricing` section was swapped to BMaC + 1:1 copy in 0.15.0) and the now-unused `Check` icon import

### Notes
- Stripe API routes (`/api/stripe/*`), `components/stripe/*`, and the for-companies B2B subscription pitch are **kept** — existing grandfathered subscribers still need billing-portal access, and the team SaaS pricing still applies

## [0.15.0] - 2026-04-22

### Added
- **New course: Application Monitoring & Self-Healing Systems** — 7 modules, 14 lessons, 7 quizzes, thumbnail, all lessons have video. Covers Sentry (capture/observability/alerting), Dependabot, Claude Routines-driven self-healing, and the weekly review + SLO discipline. Seed at `supabase/seed_monitoring_self_healing.sql`
- **Job board V1** at `/jobs` — admin-curated listings, `jobs` table with RLS (public read active, no direct writes), admin POST/PATCH/DELETE/GET API, Jobs tab in admin dashboard, footer link
- **Course thumbnail pipeline** — `video-pipeline/scripts/generate-course-thumbnail.py` uses Gemini 3 Pro image-preview to produce hand-drawn whiteboard-style thumbnails matching the existing course family. Saves to `public/images/courses/{slug}.jpg` + patches DB
- **All courses flipped to free** (`is_free=true` for all 10) + `<BuyMeCoffeeButton>` + `<BookCallButton>` components (3 variants: button/inline/card) placed on home page, course detail footer, every lesson footer, and dashboard sidebar. Stripe tier marketing retired
- **`/book` page with inline Cal.com embed** — 60-min $220 consult, rolling 7-day window. Uses `@calcom/embed-react`. API key + event type ID also stored for future custom slot picker if embed continues to behave weird
- **`/jobs` dark mode** — `dark:invert dark:hue-rotate-180` filter pattern applied to course thumbnails + hero rotator, matching home page methodology
- **`upload-monitoring-to-vimeo.ts`** — batch Vimeo tus uploader for the monitoring course

### Fixed
- **Quiz answer distribution** — all 276 existing module quiz questions had the correct answer at index 1 (87% option B). One-shot Fisher-Yates shuffle with correct-index remapping redistributed to ~25% per option. Now 297 questions total (monitoring course quizzes included) stay balanced
- **Typo in Cal link** — was `erik-lagerway/consult`, actual Cal handle is `robotfood/consult`. Fixed in env + hardcoded fallback in `src/app/book/page.tsx`
- **Monitoring course seed mismatch** — `seed_monitoring_self_healing.sql` still had `is_free=false, price=29.00` from pre-free-flip. Updated to `is_free=true, price=0` so re-seeding a fresh DB doesn't paywall the course

### Environment
- `NEXT_PUBLIC_BMAC_URL` — Buy Me a Coffee destination (placeholder set; register real handle)
- `NEXT_PUBLIC_CAL_LINK` — Cal.com event path (`robotfood/consult`)
- `NEXT_PUBLIC_CAL_EVENT_TYPE_ID` — `5458431`
- `CAL_API_KEY` — server-side Cal.com API key (secret, not public)

## [0.14.0] - 2026-04-21

### Added
- **Drip emails now include a "What's new at the Academy" block** — the daily cron fetches the latest 3 Announcements forum posts and surfaces them in every day3 / day7 / day14 email, so dormant users see ships when they come back. Any new post in the Announcements category automatically flows through on the next run
- `AnnouncementEntry` type exported from `@/lib/email/templates` for reuse
- **Supercharging Context & Memory is now free** (`is_free=true`) — announced via forum post + blog post
- **Superpowers L2 launch announced** — forum post + blog post
- **`publish-whats-new.ts`** — batch script that publishes announcements to both the Announcements forum category and the blog in one run (pattern for future `/whats-new` invocations)

### Changed
- `/whats-new` slash command now documents the automatic drip integration

## [0.13.9] - 2026-04-21

### Added
- **Superpowers course — L2 lessons now have videos** — all 8 L2 lessons produced via the new single-lesson pipeline mode and published to Vimeo, then patched to `content_type=video`. Every Superpowers lesson (16/16) now has video
- **`generate-module-video.ts --lesson <slug>`** — new flag filters a module to a single lesson so the pipeline produces a short per-lesson video instead of a module-level overview. Asset cache, output filename, and Supabase storage path all use the `{moduleSlug}-{lessonSlug}` job slug
- **`upload-superpowers-l2-to-vimeo.ts`** — batch Vimeo uploader for the 8 L2 mp4s (same tus-with-retries pattern as the L1 uploader, patches `lessons.video_url` + `content_type` for each)

## [0.13.8] - 2026-04-21

### Added
- **Admin — edit user profile inline** — click a user row → new Edit button on the detail page lets admins update `full_name`, `company_name`, and `company_role` with Save/Cancel. Useful after the gibberish scrub since some accounts are left with blank names
- `/api/admin/users` PATCH route — admin-only, whitelists allowed fields (`full_name`, `company_name`, `company_role`), trims strings, rejects unknown keys

## [0.13.7] - 2026-04-21

### Added
- **Cloudflare Turnstile captcha on signup + login** — `<Turnstile>` React wrapper lazy-loads the Cloudflare widget and passes the token via Supabase Auth's `options.captchaToken`. Token verification happens inside Supabase (secret key configured in the Supabase dashboard). Widget resets on failed submission so the user can retry with a fresh token
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` env var (public), `TURNSTILE_SECRET_KEY` in `.env.local` (for reference — Supabase holds the enforcing copy in dashboard config)

### Fixed
- **Open-redirect on login** — `?redirect=https://evil.com` could send users off-origin after login. Now only accepts same-origin relative paths (matches the pattern already used in `auth/callback`)
- Turnstile script-load race: if the `<script>` tag existed but the global wasn't populated yet, the widget could silently fail to render on second mount
- Single-use captcha tokens re-submitted after error: token and widget now reset on failure so Supabase doesn't reject the second attempt with an already-consumed token

## [0.13.6] - 2026-04-21

### Fixed
- **Bot gibberish names in admin table** (second pass) — the prior OAuth-callback fix (`72d04ed`) didn't cover email signups, so bots were submitting random camelCase strings like `mzmjRGpElsBPImqAM ISDBkhgKVEVQZmfBWKV` as first/last name. Now enforced at the DB trigger level (`handle_new_user`) — any non-real name is stored as empty string, which the admin UI already handles with "Unnamed User" / "—" fallbacks. Existing gibberish scrubbed in the migration
- **Signup form client-side guard** — rejects camelCase input with "Please enter your real name — unusual capitalization detected."

### Added
- **`public.looks_real_name(text)` function** — shared heuristic (length >= 3, contains space, no camelCase run). Reusable from other validation paths

## [0.13.5] - 2026-04-20

### Fixed
- **`generate-module-video.ts` silent storage upload failure** — the pipeline was uploading to a non-existent `videos` bucket and silently swallowing the error in a try/catch. Every "Uploaded: ..." log this session was a lie. Now uploads to `assets/module-videos/{slug}/{slug}.mp4` (the bucket that actually exists and is public), and throws loudly on any storage error

## [0.13.4] - 2026-04-20

### Added
- **Superpowers course videos now served to students** — all 8 module videos uploaded to Vimeo (OA folder) and patched into each module's L1 lesson as `content_type=video`. Previously the mp4s sat in Supabase Storage with no DB linkage, so students couldn't see them
- **`upload-superpowers-to-vimeo.ts`** — batch Vimeo tus uploader with per-chunk retries, server-offset verification after each chunk, HEAD-based resume, and per-module try/catch so one bad mp4 doesn't abort the rest
- **`upload-superpowers-mp4s-to-assets.ts`** — uploads module mp4s to the `assets` bucket (the `videos` bucket doesn't exist; `generate-module-video.ts` was silently failing storage uploads)

### Fixed
- Corrupt M2 mp4 (missing `moov` atom) — re-stitched from cached HeyGen + ElevenLabs assets
- `generate-module-video.ts` Supabase upload was swallowing errors and reporting success when the target bucket didn't exist. The Vimeo-pull attempts that followed failed because the public URLs returned 400 Bucket not found

## [0.13.3] - 2026-04-20

### Added
- **M29 OpenRouter video** — full pipeline run for the Foundations "OpenRouter — Universal AI Gateway" module (3 lessons: what-is-openrouter, model-routing-fallbacks-openrouter, openrouter-in-practice). Single module video (36.2 MB, 260s), uploaded to Vimeo `1184960004` + OA folder. All 3 lesson `video_url` fields patched to the same Vimeo embed URL
- **`upload-m29-to-vimeo.ts`** — one-shot Vimeo tus uploader that patches multiple lesson slugs to the same Vimeo ID (for module-level videos that serve across a module's lessons)

## [0.13.2] - 2026-04-20

### Added
- **Claude Code Superpowers videos (M1–M8)** — full 8-module video set produced via the rewritten pipeline, uploaded to Supabase Storage (`videos/module-videos/{slug}/`)
- **Foundations M8 outro refresh** — new unique outros for M8L1/L2/L3 that explicitly point to the next lesson/module (completes the M1–M8 outro-variety pass)
- **`regen-outros-m8.ts`** — script to rewrite + regenerate a lesson's outro (ElevenLabs → HeyGen → ffmpeg re-stitch with sample-rate-safe concat via `filter_complex`)
- **`upload-m8-to-vimeo.ts`** — Vimeo tus uploader that creates the video, waits for transcode, applies OA embed/privacy settings, adds to the OA folder, uploads thumbnail, and patches `lessons.video_url` in Supabase

### Changed
- Paperclip A2A course (`multi-agent-paperclip`) flipped to `active=true` and publicly visible
- M8L1/L2/L3 in Foundations now point to freshly-uploaded Vimeo videos with outros that tease the next lesson (improves session flow for students watching back-to-back)

### Fixed
- Sample-rate mismatch in outro concat — HeyGen outputs 48 kHz, pre-outro segments are 44.1 kHz; concat demuxer silently duplicated audio producing 2× durations. Now resamples to 44.1 kHz stereo + 25 fps before concat and uses `filter_complex` concat (handles param mismatches safely)

## [0.13.1] - 2026-04-16

### Added
- **Admin course access revocation** — admins can now uncheck granted courses to revoke access (red "Revoke" button with strikethrough preview)
  - `DELETE /api/admin/enroll` endpoint for bulk revocation
  - Grant Access panel renamed to "Manage Pro Course Access" with grant + revoke in one UI
- **Video pipeline batch script** (`generate-all-scripts.ts`) — generates scripts + ElevenLabs audio for all modules without HeyGen/Remotion
- **Code screen voiceover validation** — batch script warns when voiceover is too short for target duration

### Changed
- **`generate-module-video.ts` rewritten from scratch** to follow `docs/video-pipeline.md` exactly:
  - Code screen audio: raw ElevenLabs mp3 applied at ffmpeg stitch via filter_complex concat (NOT baked into Remotion, NOT processed through HeyGen)
  - Talking head audio: HeyGen-processed (lip-synced to avatar)
  - Code screen duration driven by voiceover audio length
  - Remotion renders code screens with voiceover for timing only — audio discarded at stitch
  - Assets cached in `output/{slug}-assets/` — re-runs skip existing files
  - HeyGen timeout increased to 20 minutes
  - Audio uploaded to Supabase Storage for public URLs (fixes HeyGen upload API issues)
- Video pipeline script generator updated: longer voiceover narrations (120-200 words per code screen), line delays for animation pacing
- `CodeScreen.tsx` uses `staticFile()` for voiceover URL resolution

### Fixed
- Voice inconsistency between talking head and code screen segments — ffmpeg now uses raw ElevenLabs mp3 for code screens (same voice throughout)
- Code screen animation cut off before voiceover finished — duration now matches audio length
- Remotion `[0,0]` interpolation crash — transition duration set to 10 frames minimum
- Brand intro missing audio track broke ffmpeg concat

## [0.13.0] - 2026-04-13

### Added
- **Community forum** — full forum at `/dashboard/support` with category sidebar (Onboarding, Community), posts with likes/replies, threaded replies, rich text (URL detection, link previews with OG metadata, inline image previews)
  - Categories: Start here, Say hello, Announcements (admin-only posting), General Discussion, Show & Tell, Help & Support
  - Member profiles modal with public info (username, level, XP, company, join date)
  - Database: `forum_categories`, `forum_posts`, `forum_replies`, `forum_reactions` tables with RLS
- **Direct messaging** — Discord-style DM system at `/dashboard/messages`
  - Conversation list with search, unread badges, last message preview
  - Chat view with message bubbles, timestamps, delete own messages
  - New conversation from member search or Community member profiles
  - Database: `direct_messages` table with RLS (sender/recipient read, sender delete)
- **Rich text component** (`src/components/rich-text.tsx`) — shared URL/image/link-preview renderer used in both Community and Messages
- **Link preview API** (`/api/link-preview`) — fetches OG meta tags for URL cards, with SSRF protection (blocks private IPs, localhost, metadata endpoints)
- **Recent News sidebar card** — shows latest blog post above user section in dashboard sidebar, dismissible (persisted to localStorage)
- **Messages nav link** in dashboard sidebar (Inbox icon)
- **Community nav link** in dashboard sidebar (replaces Support, MessageCircle icon)
- **Paywall feature flag** — `NEXT_PUBLIC_DISABLE_PAYWALL=true` in `.env.local` bypasses paywalls and auto-enrolls for testing
- **Free course auto-enroll** — direct lesson links now auto-enroll users for free courses (no redirect to course page)
- **Generic ModuleVideo composition** in Remotion Root.tsx for automated video pipeline

### Changed
- "Support" renamed to "Community" in dashboard sidebar
- "API Token" moved from sidebar nav to user popover menu (alongside Profile, Dark Mode, Sign Out)
- Announcements category gated to admin-only posting (non-admins can read but not create)
- Members panel shows usernames (not "Anonymous") with generic user icon avatars
- Video pipeline `generate-scripts.ts` updated: Silas → Leo, added comma-over-dash rule, no filler phrases, unique outros
- `/update-docs-commit` skill now includes mandatory code review step before committing

### Fixed
- SSRF vulnerability in link-preview API — now validates URLs and blocks private/internal addresses
- N+1 database queries on forum page — replaced per-post loop with single joined Supabase query
- Null crash on `lastMessage` access in messages conversation list
- Stateful regex bug in `RichText` — fresh regex instance per render to avoid `lastIndex` issues
- News card dismissal resets on navigation — now persisted to localStorage by post slug

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
