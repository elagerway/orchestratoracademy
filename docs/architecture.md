# AI Orchestrator Academy — Architecture

## Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Hosting**: Vercel
- **Database**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Auth**: Supabase Auth (Email, Google, GitHub)
- **Payments**: Stripe (Milestone 2)
- **AI Communications**: Magpipe (Milestone 2)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Testing**: Playwright (E2E), Vitest (unit)

## Domain
- `orchestratoracademy.com`

## Project Structure
```
src/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── layout.tsx                        # Root layout (Header + Footer)
│   ├── auth/
│   │   ├── login/page.tsx                # Login page
│   │   ├── signup/page.tsx               # Signup page
│   │   ├── callback/route.ts             # OAuth callback handler
│   │   └── actions.ts                    # Server actions (signOut)
│   ├── courses/
│   │   ├── page.tsx                      # Course catalog
│   │   └── [slug]/
│   │       ├── page.tsx                  # Individual course page
│   │       └── lessons/
│   │           └── [lessonSlug]/page.tsx  # Lesson player
│   └── dashboard/
│       ├── layout.tsx                    # Dashboard sidebar layout
│       └── page.tsx                      # Student dashboard
├── components/
│   ├── auth/
│   │   └── auth-button.tsx               # Auth state-aware button
│   ├── courses/
│   │   ├── enroll-button.tsx             # Course enrollment CTA
│   │   └── lesson-complete-button.tsx    # Mark lesson complete
│   ├── layout/
│   │   ├── header.tsx                    # Site header/navbar
│   │   └── footer.tsx                    # Site footer
│   └── ui/                              # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Browser Supabase client
│   │   ├── server.ts                     # Server Supabase client
│   │   └── middleware.ts                 # Auth middleware helper
│   ├── types/
│   │   └── database.ts                  # TypeScript types
│   └── utils.ts                         # Utility functions (cn)
└── middleware.ts                         # Next.js middleware (auth protection)

supabase/
└── migrations/
    └── 001_initial_schema.sql            # Database schema + RLS policies
```

## Database Schema
- **profiles**: User profiles (auto-created on signup via trigger)
- **courses**: Course catalog (title, slug, description, is_free, price)
- **modules**: Course modules (ordered within a course)
- **lessons**: Module lessons (video, text, interactive, quiz content types)
- **user_enrollments**: Tracks which courses a user is enrolled in
- **user_progress**: Tracks lesson completion per user

## Auth Flow
1. User signs up via email/password or OAuth (Google/GitHub)
2. Supabase Auth creates user → trigger auto-creates profile
3. Middleware checks auth on protected routes (/dashboard, /courses/)
4. OAuth callback exchanges code for session at /auth/callback
5. Auth state managed client-side via onAuthStateChange

## RLS Policies
- Courses, modules, lessons: publicly readable
- Profiles: publicly readable, self-editable
- Enrollments: self-readable, self-insertable
- Progress: self-readable, self-insertable, self-updatable

## Milestones
1. **MVP** (current): Landing page, auth, free course, progress tracking, dashboard
2. **Monetization**: Stripe, paid courses (CrewAI, LangGraph, Magpipe), certifications, For Companies page
3. **Job Board**: Graduate profiles, company directory, contact/messaging
