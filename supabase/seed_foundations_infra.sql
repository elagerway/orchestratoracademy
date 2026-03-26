-- Seed: AI Orchestration Foundations — Infrastructure & Stack Modules 21-28
-- This file adds 8 new modules (24 lessons) to the existing course.
-- These modules cover the modern AI app infrastructure stack.
-- Do NOT re-run earlier seeds — these are additive inserts only.

-- ============================================================
-- Module 21: Modern Web Development with Next.js
-- ============================================================
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0021-0000-0000-0000-000000000021',
  '11111111-1111-1111-1111-111111111111',
  'Modern Web Development with Next.js',
  'modern-web-development-nextjs',
  'Learn why Next.js is the framework of choice for AI applications and how to build with it effectively.',
  21
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0021-0000-0000-0000-000000000021', 'Why Next.js for AI Applications', 'why-nextjs-for-ai-applications', 'text',
'# Why Next.js for AI Applications

Next.js has become the dominant framework for building AI-powered web applications, and for good reason. It solves the specific problems that AI apps face — streaming responses, server-side processing, API route management, and fast user interfaces — out of the box.

## What is Next.js?

Next.js is a React framework built by Vercel. While React gives you the tools to build user interfaces, Next.js gives you the architecture to build full applications. It handles routing, server-side rendering, API endpoints, and deployment in a unified package. Think of React as the engine and Next.js as the entire car.

## The App Router

Next.js 13+ introduced the App Router, which is the modern way to build Next.js applications. The App Router uses a file-system based approach where your folder structure determines your routes. A file at `app/dashboard/page.tsx` automatically becomes available at `/dashboard`. This is simpler and more intuitive than configuring routes manually.

The App Router also introduces **layouts** — shared UI that wraps multiple pages. Your main navigation bar, sidebar, and footer can live in a layout file and automatically wrap every page beneath it. This eliminates the boilerplate of wrapping every page in the same components.

## Server Components vs Client Components

This is the most important concept in modern Next.js. By default, every component in the App Router is a **Server Component**. Server Components run on the server, not in the browser. This means they can:

- Directly access your database without an API layer
- Keep sensitive data (API keys, tokens) on the server
- Reduce the JavaScript sent to the browser, making pages faster
- Fetch data without client-side loading states

When you need interactivity — click handlers, form inputs, state management — you add `"use client"` at the top of the file to make it a **Client Component**. The key insight is that most of your app does not need interactivity. Data display, layouts, and static content should all be Server Components.

## API Routes

Next.js lets you create API endpoints right inside your project. A file at `app/api/chat/route.ts` becomes an API endpoint at `/api/chat`. This is where your AI orchestration logic lives — receiving user messages, calling AI APIs, processing responses, and streaming results back to the client.

For AI applications, this is transformative. You do not need a separate backend server. Your AI API calls, database queries, and business logic all live in the same project, deployed to the same infrastructure.

## Server-Side Rendering (SSR) vs Client-Side Rendering (CSR)

SSR means the server generates the HTML before sending it to the browser. The user sees content immediately instead of a blank page that fills in later. CSR means the browser downloads JavaScript and renders the page itself. For AI applications, SSR is valuable because you can pre-fetch data and render initial states on the server, giving users a faster perceived experience.

## Why This Matters for AI Orchestrators

As an AI Orchestrator, Next.js gives you a single framework to build the entire user-facing layer of your AI applications. You can build chat interfaces that stream AI responses, dashboards that display analytics, admin panels for managing prompts, and landing pages for your products — all in one codebase. The combination of Server Components for data-heavy pages and Client Components for interactive elements is perfectly suited to AI applications where you are constantly fetching, processing, and displaying AI-generated content.', 1),

('aaaa0021-0000-0000-0000-000000000021', 'Project Structure & Routing', 'project-structure-routing', 'text',
'# Project Structure & Routing

A well-organized Next.js project makes the difference between a codebase you can maintain for years and one that becomes unmaintainable in months. Understanding the file structure and routing system is essential before you write a single line of application code.

## The Standard Project Structure

A typical Next.js AI application looks like this:

```
my-ai-app/
├── app/
│   ├── layout.tsx          # Root layout (nav, providers)
│   ├── page.tsx            # Home page (/)
│   ├── loading.tsx         # Loading state for home
│   ├── error.tsx           # Error boundary for home
│   ├── dashboard/
│   │   ├── layout.tsx      # Dashboard layout (sidebar)
│   │   ├── page.tsx        # /dashboard
│   │   └── settings/
│   │       └── page.tsx    # /dashboard/settings
│   └── api/
│       └── chat/
│           └── route.ts    # API: /api/chat
├── components/
│   ├── ui/                 # Reusable UI components
│   └── chat/               # Chat-specific components
├── lib/
│   ├── supabase.ts         # Database client
│   └── ai.ts               # AI API utilities
├── public/                 # Static assets
└── package.json
```

## File-Based Routing

Every `page.tsx` file inside the `app/` directory becomes a route. The folder path determines the URL:

- `app/page.tsx` → `/`
- `app/about/page.tsx` → `/about`
- `app/dashboard/analytics/page.tsx` → `/dashboard/analytics`

Dynamic routes use square brackets. A file at `app/chat/[id]/page.tsx` matches any URL like `/chat/abc123`. The `id` parameter is available inside your component as a prop.

## Layouts

Layouts are components that wrap pages and persist across navigation. The root layout at `app/layout.tsx` wraps your entire application — this is where you put your HTML structure, global styles, and providers (like authentication context).

Nested layouts are powerful. A layout at `app/dashboard/layout.tsx` only wraps pages inside `/dashboard/*`. This is perfect for adding a sidebar or navigation that only appears on dashboard pages.

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

## Loading and Error States

Next.js has built-in conventions for handling loading and error states. Create a `loading.tsx` file in any route folder, and Next.js automatically shows it while the page is loading. Create an `error.tsx` file, and Next.js catches any errors in that route and displays your error UI instead of crashing.

This is especially important for AI applications where API calls can be slow or fail. A `loading.tsx` in your chat route can show a skeleton UI while the conversation history loads. An `error.tsx` can gracefully handle cases where the AI API is down.

## Middleware

Middleware runs before every request and is defined in a `middleware.ts` file at the root of your project. Common uses include:

- **Authentication checks** — redirect unauthenticated users to the login page
- **Geolocation-based routing** — serve different content based on user location
- **Rate limiting** — block excessive requests before they reach your AI API routes
- **Logging** — track every request for debugging and analytics

```ts
// middleware.ts
export function middleware(request: NextRequest) {
  const session = request.cookies.get("session");
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
```

## Practical Advice

Keep your `app/` directory focused on routes. Business logic belongs in `lib/`, reusable UI in `components/`, and type definitions in `types/`. This separation keeps routes thin and logic testable. When your AI app grows to dozens of pages, this structure will save you hours of searching for code.', 2),

('aaaa0021-0000-0000-0000-000000000021', 'Server Actions & Data Fetching', 'server-actions-data-fetching', 'text',
'# Server Actions & Data Fetching

Data fetching in Next.js has evolved significantly. The modern approach uses Server Components and Server Actions to handle data in ways that are simpler, more secure, and more performant than traditional client-side fetching.

## Data Fetching in Server Components

Since Server Components run on the server, you can fetch data directly — no useEffect, no loading states, no API routes needed for simple data reads:

```tsx
// app/dashboard/page.tsx (Server Component by default)
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1>Your Conversations</h1>
      {conversations?.map((conv) => (
        <ConversationCard key={conv.id} conversation={conv} />
      ))}
    </div>
  );
}
```

This code runs entirely on the server. The database query never touches the browser. The user receives fully rendered HTML with their data already populated.

## Server Actions

Server Actions are functions that run on the server but can be called from the client. They replace traditional API routes for mutations (creating, updating, deleting data). Define them with the `"use server"` directive:

```tsx
// app/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createConversation(title: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .insert({ title })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  return data;
}
```

You call this function from a Client Component like any other function, but it executes on the server. No API route, no fetch call, no CORS issues.

## Caching and Revalidation

Next.js caches aggressively by default. When a Server Component fetches data, that result can be cached and reused across requests. You control this with revalidation strategies:

- **Time-based**: `revalidate = 60` refetches data every 60 seconds
- **On-demand**: `revalidatePath("/dashboard")` invalidates a specific page when data changes
- **Tag-based**: `revalidateTag("conversations")` invalidates all data fetched with a specific tag

For AI applications, caching is nuanced. You probably do not want to cache chat responses (they should be real-time), but you might cache user settings, prompt templates, or analytics data that does not change frequently.

## Streaming

One of the most powerful features for AI apps is streaming. When an AI generates a response token by token, you can stream those tokens to the user interface in real time. Next.js supports this natively with React Suspense and streaming Server Components.

For chat applications, you typically use an API route that returns a `ReadableStream`:

```ts
// app/api/chat/route.ts
export async function POST(request: Request) {
  const { message } = await request.json();

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: message }],
  });

  return new Response(stream.toReadableStream());
}
```

The client reads this stream and updates the UI character by character, giving users the experience of watching the AI "think" in real time.

## React Server Components (RSC) Mental Model

The key mental model is this: think of your Server Components as the "data layer" and your Client Components as the "interaction layer." Server Components fetch, process, and prepare data. Client Components receive that data as props and handle clicks, inputs, and state changes. This separation makes your code cleaner and your applications faster.

When building AI applications, this model works perfectly. Your Server Components fetch conversation history, user settings, and prompt templates. Your Client Components handle the chat input, message display with streaming, and UI interactions.', 3);

-- ============================================================
-- Module 22: Supabase — Your AI Backend
-- ============================================================
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0022-0000-0000-0000-000000000022',
  '11111111-1111-1111-1111-111111111111',
  'Supabase — Your AI Backend',
  'supabase-your-ai-backend',
  'Master Supabase as the all-in-one backend for your AI applications — database, auth, storage, and more.',
  22
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0022-0000-0000-0000-000000000022', 'Supabase Overview', 'supabase-overview', 'text',
'# Supabase Overview

Supabase is an open-source Firebase alternative that gives you a complete backend in minutes. For AI Orchestrators, it is the fastest way to go from idea to production-ready application without managing infrastructure.

## What Supabase Gives You

Supabase is not just a database. It is an entire backend platform with six core components:

**1. PostgreSQL Database** — A full, production-grade PostgreSQL database. Not a simplified version or a proprietary query language — real PostgreSQL with all its power. You get SQL, joins, indexes, triggers, stored procedures, and extensions like pgvector for AI embeddings.

**2. Authentication** — User sign-up, login, password reset, and session management. Supports email/password, magic links, OAuth providers (Google, GitHub, Apple, etc.), and phone/SMS authentication. Supabase Auth handles JWT tokens, refresh tokens, and session persistence so you do not have to.

**3. Storage** — File storage for images, documents, audio, and any other files your application needs. Built on S3-compatible object storage with automatic CDN delivery. Perfect for storing user uploads, AI-generated images, or voice recordings.

**4. Edge Functions** — Serverless functions written in TypeScript that run on Deno at the edge. Use them for webhooks, background processing, scheduled tasks, or any server-side logic that does not belong in your Next.js API routes.

**5. Realtime** — WebSocket-based real-time subscriptions. When data changes in your database, connected clients are notified instantly. This powers live chat, collaborative editing, real-time dashboards, and notification systems.

**6. Vector Search** — Through the pgvector extension, Supabase supports vector embeddings natively. Store embeddings alongside your regular data and perform similarity searches using SQL. This is the foundation of RAG (Retrieval-Augmented Generation) systems.

## Why Supabase for AI Applications

AI applications have unique backend requirements that Supabase handles elegantly:

- **Conversation storage**: Store chat histories in PostgreSQL with full-text search and JSONB columns for flexible message metadata.
- **User management**: Every AI app needs user accounts. Supabase Auth gives you this in minutes, not weeks.
- **File handling**: Users upload documents for AI processing. Supabase Storage handles uploads, generates signed URLs, and serves files through a CDN.
- **Real-time updates**: When an AI finishes processing in the background, Realtime can push the result to the user''s browser instantly.
- **Row Level Security**: Ensure users can only access their own conversations, documents, and data — without writing authorization logic in every query.

## The Supabase Client

You interact with Supabase through its JavaScript client library. The client provides a clean API for every Supabase feature:

```ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Query data
const { data, error } = await supabase
  .from("conversations")
  .select("*")
  .eq("user_id", userId);
```

The client handles authentication headers, request formatting, and error responses automatically. You write simple, readable queries instead of raw HTTP requests.

## Getting Started

To start using Supabase, create a free project at supabase.com. You get a PostgreSQL database, authentication, storage, and edge functions — all on the free tier. The dashboard gives you a visual interface for managing your database, viewing logs, and testing queries. For AI Orchestrators, this means you can have a production-ready backend running in under 10 minutes.', 1),

('aaaa0022-0000-0000-0000-000000000022', 'Database Design for AI Apps', 'database-design-ai-apps', 'text',
'# Database Design for AI Apps

Designing the right database schema is one of the most impactful decisions you will make when building an AI application. A well-designed schema makes features easy to build. A poorly designed one creates friction at every step.

## Core Tables for AI Applications

Most AI applications share a common set of tables. Here is a practical starting schema:

```sql
-- Users are managed by Supabase Auth, but you often need a profiles table
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  avatar_url text,
  plan text default ''free'',
  created_at timestamptz default now()
);

-- Conversations (or sessions, chats, threads)
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  title text,
  metadata jsonb default ''{}''::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages within conversations
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) not null,
  role text not null check (role in (''user'', ''assistant'', ''system'')),
  content text not null,
  metadata jsonb default ''{}''::jsonb,
  created_at timestamptz default now()
);
```

## JSONB: Your Flexibility Superpower

PostgreSQL''s JSONB data type is one of the most powerful features for AI applications. It lets you store structured JSON data in a column while still being able to query it efficiently.

Why is this important? AI responses and configurations change constantly. One model returns usage tokens as `prompt_tokens` and `completion_tokens`. Another uses `input_tokens` and `output_tokens`. Instead of adding new columns every time a format changes, store this variable data in a JSONB `metadata` column:

```sql
-- Store variable metadata without schema changes
insert into messages (conversation_id, role, content, metadata)
values (
  ''abc-123'',
  ''assistant'',
  ''Here is your answer...'',
  ''{"model": "claude-sonnet-4-20250514", "tokens_used": 450, "latency_ms": 1200}''::jsonb
);

-- Query JSONB fields
select * from messages
where metadata->>''model'' = ''claude-sonnet-4-20250514''
and (metadata->>''tokens_used'')::int > 100;
```

JSONB gives you the best of both worlds: the reliability of a relational database for your core data, and the flexibility of a document store for variable metadata.

## Relationships and Foreign Keys

Use foreign keys to enforce data integrity. Every message must belong to a conversation. Every conversation must belong to a user. If you try to insert a message with a nonexistent conversation_id, PostgreSQL will reject it. This prevents orphaned data and bugs that are difficult to track down.

## Row Level Security (RLS)

RLS is how Supabase ensures that users can only access their own data. Instead of checking permissions in your application code (which is error-prone), you define security policies directly on the database:

```sql
-- Enable RLS on the conversations table
alter table conversations enable row level security;

-- Users can only see their own conversations
create policy "Users can view own conversations"
  on conversations for select
  using (auth.uid() = user_id);

-- Users can only insert conversations as themselves
create policy "Users can create own conversations"
  on conversations for insert
  with check (auth.uid() = user_id);
```

With RLS enabled, even if your application code has a bug that forgets to filter by user_id, the database itself will prevent data leaks. This is defense in depth, and it is especially important for AI applications where conversations may contain sensitive information.

## Indexes for Performance

As your application grows, add indexes on columns you query frequently:

```sql
create index idx_conversations_user_id on conversations(user_id);
create index idx_messages_conversation_id on messages(conversation_id);
create index idx_messages_created_at on messages(created_at);
```

For JSONB columns, use GIN indexes if you query the JSON content often:

```sql
create index idx_messages_metadata on messages using gin(metadata);
```

## Practical Tip

Start simple. You do not need to design the perfect schema upfront. Begin with the core tables above, build your first features, and add tables and columns as your application''s needs become clear. PostgreSQL migrations make schema changes safe and reversible.', 2),

('aaaa0022-0000-0000-0000-000000000022', 'Supabase Auth & Edge Functions', 'supabase-auth-edge-functions', 'text',
'# Supabase Auth & Edge Functions

Authentication and serverless functions are two pillars of any production AI application. Supabase provides both, tightly integrated with your database, so you can build secure, scalable features without managing separate services.

## Supabase Auth: How It Works

Supabase Auth is built on GoTrue, an open-source authentication server. When a user signs up or logs in, Supabase issues a JWT (JSON Web Token) that contains their user ID and metadata. This token is sent with every subsequent request and is automatically validated by Supabase.

### Setting Up Auth Providers

Supabase supports multiple authentication methods. The most common for AI applications:

**Email/Password**: The simplest approach. Users sign up with an email and password. Supabase handles password hashing, email confirmation, and password reset flows.

**OAuth Providers**: Let users sign in with Google, GitHub, Apple, or other providers. This reduces friction — users do not need to create another password. Configure OAuth in the Supabase dashboard by adding your provider''s client ID and secret.

**Magic Links**: Send a one-time login link to the user''s email. No password needed. This is increasingly popular for AI tools where you want minimal friction.

### Auth in Next.js

Supabase provides a dedicated Next.js package (`@supabase/ssr`) that handles authentication across Server Components, Client Components, and middleware:

```ts
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

In your Server Components, you can then get the current user:

```tsx
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

### JWT and Row Level Security

This is where the magic happens. The JWT issued by Supabase Auth contains the user''s ID as `auth.uid()`. Your RLS policies reference this function to restrict data access. When a user queries the database through the Supabase client, the JWT is automatically attached, and RLS policies are automatically enforced. No manual authorization checks needed.

## Edge Functions

Edge Functions are serverless TypeScript functions that run on Deno Deploy at the edge — close to your users for low latency. They are ideal for tasks that do not fit in a Next.js API route:

- **Webhook handlers**: Receive events from Stripe, SendGrid, or other services
- **Scheduled tasks**: Run cleanup jobs, send daily digests, or refresh cached data
- **Background processing**: Process uploaded documents, generate embeddings, or run long AI tasks
- **Third-party integrations**: Connect to services that require server-side authentication

### Creating an Edge Function

```bash
supabase functions new process-document
```

This creates a function at `supabase/functions/process-document/index.ts`:

```ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  const { document_id } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Fetch document, process with AI, store results
  const { data: doc } = await supabase
    .from("documents")
    .select("*")
    .eq("id", document_id)
    .single();

  // ... AI processing logic ...

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

### Webhooks: A Critical Pattern

Webhooks are HTTP callbacks — external services send data to your Edge Function when something happens. Stripe sends a webhook when a payment succeeds. A form service sends a webhook when someone submits a contact form. Your Edge Function receives this data, validates it, and takes action (update the database, trigger an AI workflow, send a notification). Understanding webhooks is essential for building production AI applications that integrate with the real world.', 3);

-- ============================================================
-- Module 23: Deploying with Vercel
-- ============================================================
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0023-0000-0000-0000-000000000023',
  '11111111-1111-1111-1111-111111111111',
  'Deploying with Vercel',
  'deploying-with-vercel',
  'Learn how to deploy your AI applications to production using Vercel''s platform.',
  23
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0023-0000-0000-0000-000000000023', 'Vercel Platform Overview', 'vercel-platform-overview', 'text',
'# Vercel Platform Overview

Vercel is the company behind Next.js, and their hosting platform is purpose-built for deploying Next.js applications. For AI Orchestrators, Vercel eliminates the entire category of deployment complexity so you can focus on building your AI features.

## What Vercel Handles

When you deploy to Vercel, the platform automatically handles:

- **Build process**: Vercel detects your framework, installs dependencies, and builds your application
- **CDN distribution**: Static assets are served from edge locations worldwide for fast loading
- **Serverless functions**: Your API routes become serverless functions that scale automatically
- **SSL certificates**: HTTPS is enabled by default with automatic certificate management
- **Domain management**: Connect custom domains with automatic DNS configuration

## Git Integration

Vercel''s most powerful feature is its Git integration. Connect your GitHub (or GitLab, Bitbucket) repository, and every push triggers an automatic deployment:

- **Push to main** → Production deployment at your custom domain
- **Push to any other branch** → Preview deployment at a unique URL
- **Open a pull request** → Automatic preview deployment with a comment on the PR

This means your team can review changes on a live URL before merging to production. For AI applications, this is invaluable — you can test new prompts, UI changes, or API integrations on a real deployment without affecting your live users.

## Preview Deployments

Preview deployments deserve special attention because they change how you work. Every pull request gets its own deployment with its own URL. This URL is fully functional — it connects to your APIs, loads your data, and behaves exactly like production (or can be configured to use a staging environment).

For AI applications, preview deployments let you:

- Test a new AI model integration before going live
- Share a working prototype with stakeholders for feedback
- Run QA on a complete environment, not just local development
- A/B test different prompt strategies by deploying both and comparing

## Serverless Functions

Your Next.js API routes (`app/api/*/route.ts`) become serverless functions on Vercel. Each function runs independently, scales to zero when idle, and scales up automatically under load. You pay only for the compute time you actually use.

Key characteristics of serverless functions:

- **Cold starts**: The first request after idle may take slightly longer (usually 100-500ms)
- **Execution limits**: Free tier allows 10-second execution; Pro allows 60 seconds; Enterprise allows 300 seconds
- **Memory**: Default 1024MB, configurable up to 3008MB
- **Concurrency**: Functions scale automatically — Vercel handles thousands of concurrent requests

For AI applications, the 10-second limit on the free tier can be restrictive since AI API calls often take longer. The Pro plan''s 60-second limit handles most AI use cases comfortably.

## Edge Network

Vercel''s Edge Network serves your application from data centers worldwide. Static pages, images, and assets load from the nearest edge location. Dynamic requests are routed to the serverless function region closest to your data source (usually the region where your Supabase database lives).

You can also use Edge Functions (different from serverless functions) for lightweight logic that needs to run at the edge — like authentication checks, redirects, or A/B testing. Edge Functions have near-zero cold starts but more limited capabilities than serverless functions.

## Getting Started

Deploying your first project takes about two minutes:

1. Push your Next.js project to GitHub
2. Go to vercel.com and sign in with GitHub
3. Import your repository
4. Vercel detects Next.js automatically and configures the build
5. Click Deploy

Your application is now live with a `.vercel.app` URL. Every subsequent push to your repository triggers an automatic redeployment.', 1),

('aaaa0023-0000-0000-0000-000000000023', 'Environment Variables & Secrets', 'environment-variables-secrets', 'text',
'# Environment Variables & Secrets

Managing API keys, database credentials, and other secrets is one of the most critical skills for deploying AI applications. A leaked API key can result in thousands of dollars in unauthorized charges. A misconfigured environment variable can cause your entire application to break silently.

## What Are Environment Variables?

Environment variables are key-value pairs that configure your application without hardcoding values in your source code. Instead of writing `const apiKey = "sk-abc123"` in your code, you write `const apiKey = process.env.ANTHROPIC_API_KEY` and set the value outside your codebase.

This serves three purposes:

1. **Security**: Secrets never appear in your Git repository
2. **Flexibility**: Different environments (development, staging, production) use different values
3. **Collaboration**: Team members use their own API keys without modifying shared code

## Environment Variables in Next.js

Next.js has specific conventions for environment variables:

**Server-only variables**: Any variable without a prefix is only available on the server (in API routes, Server Components, Server Actions). This is where your sensitive keys belong:

```
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_live_...
```

**Public variables**: Variables prefixed with `NEXT_PUBLIC_` are available in both server and client code. Only use this for non-sensitive values:

```
NEXT_PUBLIC_SUPABASE_URL=https://abc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=https://myapp.com
```

The Supabase anon key is safe to expose publicly because Row Level Security protects your data. But never expose your service role key, API secret keys, or database passwords with the `NEXT_PUBLIC_` prefix.

## Local Development: .env Files

For local development, create a `.env.local` file in your project root:

```
# .env.local — NEVER commit this file
ANTHROPIC_API_KEY=sk-ant-your-dev-key
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Add `.env.local` to your `.gitignore` file (Next.js does this by default). Create a `.env.example` file that shows the required variables without actual values — this helps other developers (and your future self) know what needs to be configured.

## Environment Variables on Vercel

In the Vercel dashboard, go to your project''s Settings → Environment Variables. You can set variables for three environments:

- **Production**: Used on your live site (main branch deployments)
- **Preview**: Used on preview deployments (pull request branches)
- **Development**: Used when running `vercel dev` locally

This separation is powerful. You can use test API keys for preview deployments and production keys for your live site. If a preview deployment has a bug that makes excessive API calls, it uses your test keys — protecting your production budget.

## Common Mistakes to Avoid

**Committing secrets to Git**: Even if you delete the file later, the secret remains in Git history. If this happens, rotate the key immediately — do not just delete the commit.

**Using production keys in development**: Always use separate keys for development and production. Most services (Stripe, Supabase, AI providers) let you create multiple keys or have separate test/live modes.

**Forgetting to add variables to Vercel**: Your app works locally but crashes in production because an environment variable is missing. Always verify that every variable in `.env.local` has a corresponding entry in Vercel.

**Logging secrets**: Never log environment variables in your application code, even for debugging. Logs are often stored in third-party services and may be visible to your team.

## Security Checklist

Before deploying any AI application, verify: all API keys are in environment variables (not hardcoded), `.env.local` is in `.gitignore`, no secrets use the `NEXT_PUBLIC_` prefix, production and development use different keys, and your `.env.example` file is up to date with all required variable names.', 2),

('aaaa0023-0000-0000-0000-000000000023', 'Production Best Practices', 'production-best-practices', 'text',
'# Production Best Practices

Getting your AI application deployed is just the beginning. Running it reliably in production requires attention to domains, monitoring, performance, and cost management. These practices separate hobby projects from professional applications.

## Custom Domains

Your application starts on a `.vercel.app` subdomain, but a custom domain is essential for credibility and branding. Setting up a custom domain on Vercel is straightforward:

1. Purchase a domain from any registrar (Namecheap, Cloudflare, Google Domains)
2. In Vercel, go to your project''s Settings → Domains
3. Add your domain and follow the DNS configuration instructions
4. Vercel automatically provisions an SSL certificate

Vercel also handles `www` vs non-`www` redirects. Choose one as your canonical domain and Vercel redirects the other automatically. For AI applications, a clean domain like `chat.yourbrand.com` or `app.yourbrand.com` builds trust with users.

## Monitoring and Error Tracking

Production applications need monitoring. Without it, you are flying blind — users encounter errors and you never know.

**Vercel Analytics**: Built-in analytics that track page views, Web Vitals (loading speed, interactivity, visual stability), and audience data. Enable it in one click from your Vercel dashboard.

**Error tracking**: Integrate a service like Sentry to capture and alert you about errors in production. Sentry shows you the exact error, the stack trace, which user was affected, and how often it occurs. For AI applications, this catches issues like API timeouts, malformed responses, and authentication failures.

**Logging**: Use Vercel''s built-in log viewer for quick debugging. For more robust logging, integrate with services like Axiom or Datadog. Log important events: AI API calls (model, latency, token count), authentication events, payment events, and any errors.

## Performance Optimization

AI applications have unique performance challenges because AI API calls are inherently slow (1-10 seconds for most models). Focus on:

**Streaming**: Always stream AI responses. Users perceive a 5-second streaming response as much faster than a 5-second loading spinner followed by a complete response. Next.js and Vercel support streaming natively.

**Caching**: Cache data that does not change frequently. User settings, prompt templates, and static content should be cached. Conversation data and AI responses should not. Use Next.js''s built-in caching with appropriate revalidation periods.

**Image optimization**: Use Next.js''s `<Image>` component, which automatically optimizes images, serves them in modern formats (WebP/AVIF), and lazy-loads images below the fold.

**Bundle size**: Keep your client-side JavaScript small. Use Server Components for data-heavy pages. Import only the components you need from libraries (tree-shaking). Vercel''s build output shows the size of each route.

## Scaling

Vercel''s serverless architecture handles scaling automatically. When your application gets more traffic, more serverless function instances spin up. When traffic drops, they scale back down. You do not manage servers, containers, or load balancers.

However, your backend services need to scale too:

- **Supabase**: The free tier supports up to 500MB database and 50,000 monthly active users. Upgrade to Pro when you approach these limits.
- **AI APIs**: Set spending limits and monitor usage. An unexpected viral moment can generate thousands of AI API calls in hours.
- **Vercel**: The free tier is generous for side projects. The Pro plan ($20/month) removes most limits and adds team features.

## Cost Management

AI applications can become expensive quickly because every user interaction potentially triggers an AI API call. Practical cost management strategies:

- **Set spending alerts**: Every AI provider lets you set budget limits. Configure them before launching.
- **Cache repeated queries**: If multiple users ask similar questions, cache the response instead of calling the AI API again.
- **Choose models strategically**: Use smaller, cheaper models for simple tasks and larger models only when quality demands it.
- **Rate limit users**: Implement per-user rate limits (e.g., 50 messages per day on the free tier) to prevent abuse and control costs.
- **Monitor daily**: Check your AI API dashboard daily during the first weeks after launch. Catch cost anomalies early.

## Launch Checklist

Before announcing your application: custom domain is configured, SSL is working, environment variables are set for production, error tracking is enabled, analytics are enabled, spending limits are set on all API providers, rate limiting is implemented, and you have tested the complete user flow on the production deployment.', 3);

-- ============================================================
-- Module 24: Tailwind CSS & UI Design Systems
-- ============================================================
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0024-0000-0000-0000-000000000024',
  '11111111-1111-1111-1111-111111111111',
  'Tailwind CSS & UI Design Systems',
  'tailwind-css-ui-design-systems',
  'Build professional, responsive user interfaces quickly using Tailwind CSS and modern component libraries.',
  24
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0024-0000-0000-0000-000000000024', 'Utility-First CSS with Tailwind', 'utility-first-css-tailwind', 'text',
'# Utility-First CSS with Tailwind

Tailwind CSS has fundamentally changed how developers build user interfaces. Instead of writing custom CSS for every element, you compose designs using small, single-purpose utility classes directly in your HTML. This approach is faster, more consistent, and easier to maintain than traditional CSS.

## What is Utility-First CSS?

Traditional CSS works by creating custom class names and writing styles for them:

```css
/* Traditional CSS */
.card-container {
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

```html
<div class="card-container">...</div>
```

Utility-first CSS skips the custom class names entirely. You apply styles directly using pre-built utility classes:

```html
<div class="p-6 bg-white rounded-lg shadow-sm">...</div>
```

Each class does one thing: `p-6` sets padding, `bg-white` sets the background color, `rounded-lg` sets border radius, and `shadow-sm` adds a subtle shadow. You compose these utilities to build any design.

## Why Tailwind Works

The initial reaction to utility-first CSS is often skepticism — it looks messy having all those classes. But in practice, Tailwind solves real problems:

**No naming fatigue**: You never waste time deciding whether to call something `.card-wrapper`, `.card-container`, or `.card-box`. The utilities describe what they do, not what they are applied to.

**No dead CSS**: Traditional projects accumulate CSS that nobody dares delete because they are unsure what it affects. With Tailwind, styles live in the component. Delete the component, and the styles are gone.

**Consistency by default**: Tailwind uses a design system with predefined spacing, colors, and typography scales. `p-4` is always `1rem`. `text-gray-700` is always the same shade. This enforces visual consistency without a separate design document.

**Responsive design is simple**: Prefix any utility with a breakpoint to apply it at that screen size:

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- 1 column on mobile, 2 on tablet, 3 on desktop -->
</div>
```

## Dark Mode

Tailwind makes dark mode trivial. Prefix utilities with `dark:` to apply them when dark mode is active:

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <h1 class="text-xl font-bold">Welcome</h1>
  <p class="text-gray-600 dark:text-gray-400">Your AI dashboard</p>
</div>
```

Configure dark mode detection in your `tailwind.config.ts` — either based on the user''s system preference (`media`) or a manual toggle (`class`). Most AI applications should support dark mode since many developers and power users prefer it.

## Custom Themes

While Tailwind''s defaults are excellent, you will want to customize colors, fonts, and spacing to match your brand. Extend the theme in your `tailwind.config.ts`:

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          500: "#3b82f6",
          900: "#1e3a5f",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
```

Now you can use `bg-brand-500` and `font-sans` throughout your application. When you rebrand or update your design, change the config file and every component updates automatically.

## Practical Tips for AI Interfaces

AI chat interfaces have specific design needs that Tailwind handles well. Use `flex flex-col` for vertical message layouts. Use `overflow-y-auto` for scrollable chat windows. Use `animate-pulse` for loading indicators while AI responses stream. Use `prose` (from the typography plugin) to style AI-generated markdown content beautifully. Tailwind gives you the building blocks — you compose them into the exact interface your users need.', 1),

('aaaa0024-0000-0000-0000-000000000024', 'Component Libraries — shadcn/ui', 'component-libraries-shadcn-ui', 'text',
'# Component Libraries — shadcn/ui

Building every UI component from scratch is slow and error-prone. Component libraries give you pre-built, accessible, well-tested components that you can customize to match your brand. shadcn/ui has emerged as the leading component library for Next.js and Tailwind CSS applications.

## What is shadcn/ui?

shadcn/ui is not a traditional component library that you install as a dependency. Instead, it is a collection of reusable components that you copy directly into your project. This means you own the code — you can read it, modify it, and customize it without fighting against a library''s API.

The components are built on top of Radix UI primitives, which handle accessibility (keyboard navigation, screen readers, focus management) and complex interactions (dropdowns, modals, tooltips) correctly. Tailwind CSS handles the styling.

## Installing Components

You add components individually using the CLI:

```bash
npx shadcn@latest init    # Initial setup
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add dropdown-menu
```

Each command copies the component source code into your `components/ui/` directory. After installation, you have a file like `components/ui/button.tsx` that you can read and modify freely.

## Using Components

shadcn/ui components work like any React component:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function NewChatDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Conversation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new conversation</DialogTitle>
        </DialogHeader>
        <Input placeholder="What would you like to discuss?" />
        <Button className="w-full">Start</Button>
      </DialogContent>
    </Dialog>
  );
}
```

The component handles focus trapping (Tab stays inside the dialog), escape-to-close, click-outside-to-close, and screen reader announcements automatically. You did not write any of that logic.

## Customization and Theming

shadcn/ui uses CSS variables for theming, defined in your global CSS file. You can change your entire application''s look by modifying these variables:

```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 84% 5%;
    --primary: 222 47% 11%;
    --primary-foreground: 210 40% 98%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222 84% 5%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222 47% 11%;
  }
}
```

Change `--primary` and every Button, Link, and highlighted element in your application updates. This is powerful for maintaining a consistent brand identity across dozens of components.

## Accessibility

Every shadcn/ui component follows WAI-ARIA guidelines. Buttons are focusable. Dialogs trap focus. Dropdown menus support arrow key navigation. Tooltips appear on hover and focus. This is not optional polish — it is a legal requirement in many jurisdictions and a moral obligation to your users.

Building accessible components from scratch is extremely difficult and time-consuming. Using shadcn/ui means you get accessibility right by default, so you can focus your energy on your AI features instead of reimplementing keyboard navigation for the tenth time.

## Essential Components for AI Apps

For AI applications, start with these components: **Button** (actions), **Input** and **Textarea** (user messages), **Dialog** (confirmations, settings), **Dropdown Menu** (model selection, options), **Tabs** (switching between conversations or views), **Avatar** (user and AI avatars in chat), **Skeleton** (loading states while AI responds), **Toast** (notifications and error messages), and **ScrollArea** (scrollable chat containers). These ten components cover 90% of what a typical AI application needs.', 2),

('aaaa0024-0000-0000-0000-000000000024', 'Building Professional UIs Fast', 'building-professional-uis-fast', 'text',
'# Building Professional UIs Fast

Knowing Tailwind classes and having a component library is necessary but not sufficient. Building professional UIs fast requires understanding layout patterns, design principles, and practical techniques that make your applications look polished without spending weeks on design.

## Layout Patterns That Work

Most AI applications use one of a few proven layout patterns. Do not reinvent the wheel — pick a pattern and execute it well.

**Sidebar + Main Content**: The most common layout for AI chat applications. A fixed sidebar on the left shows conversation history, settings, or navigation. The main area on the right shows the active conversation or content.

```html
<div class="flex h-screen">
  <aside class="w-64 border-r bg-gray-50 dark:bg-gray-900 overflow-y-auto">
    <!-- Sidebar content -->
  </aside>
  <main class="flex-1 flex flex-col">
    <!-- Main content -->
  </main>
</div>
```

**Stacked Layout**: Header on top, content below, optional footer. Good for simpler applications, landing pages, and settings pages.

**Dashboard Grid**: A grid of cards showing different data points. Useful for analytics, monitoring, and admin panels.

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
  <Card title="Total Conversations" value="1,234" />
  <Card title="Messages Today" value="567" />
  <Card title="Active Users" value="89" />
  <Card title="API Cost" value="$12.34" />
</div>
```

## Design Tokens: Consistency Without Thinking

Design tokens are the atomic values that define your visual system — colors, spacing, font sizes, border radii, and shadows. Tailwind''s default scale serves as excellent design tokens:

- **Spacing**: Use multiples of 4 (`p-1` = 4px, `p-2` = 8px, `p-4` = 16px, `p-6` = 24px). Never use arbitrary values like `p-[13px]` unless absolutely necessary.
- **Font sizes**: Stick to the scale (`text-sm`, `text-base`, `text-lg`, `text-xl`). Do not jump from `text-sm` to `text-2xl` — the visual jump is jarring.
- **Colors**: Pick a primary color, a gray scale, and one or two accent colors. Use them consistently. Do not introduce a new shade for every element.
- **Border radius**: Choose one radius and use it everywhere (`rounded-lg` is a good default). Mixing `rounded`, `rounded-lg`, and `rounded-xl` on different elements looks inconsistent.

## Typography

Good typography instantly makes an application look professional:

- **Headings**: Use `font-semibold` or `font-bold`, not both in the same view. Set clear hierarchy with `text-2xl` for page titles, `text-lg` for section titles, `text-base` for content.
- **Body text**: `text-gray-700 dark:text-gray-300` for primary text. `text-gray-500 dark:text-gray-400` for secondary text. The contrast between primary and secondary text creates visual hierarchy.
- **Line height**: Tailwind''s defaults are good. For long-form content (like AI responses), `leading-relaxed` improves readability.
- **Font**: Inter is the de facto standard for modern web applications. It is designed for screens and looks professional at every size.

## Spacing and Whitespace

The number one difference between amateur and professional UIs is whitespace. Amateur interfaces cram elements together. Professional interfaces give elements room to breathe.

Rules of thumb:

- Between sections: `py-8` or `py-12`
- Between related elements (like a label and its input): `space-y-2`
- Between cards in a grid: `gap-4` or `gap-6`
- Page padding: `px-4` on mobile, `px-6` or `px-8` on desktop
- Inside cards: `p-4` or `p-6`

## Practical Speed Tips

1. **Start with a template**: shadcn/ui provides page templates. Start from one rather than a blank file.
2. **Build mobile-first**: Start with the mobile layout and add responsive breakpoints. This is faster than designing for desktop and then trying to make it fit on mobile.
3. **Copy proven designs**: Look at successful AI applications (ChatGPT, Claude, Perplexity) and study their layout choices. You do not need to copy their brand, but their layout patterns are battle-tested.
4. **Use consistent component variants**: Decide upfront that primary actions use `<Button>`, secondary actions use `<Button variant="outline">`, and destructive actions use `<Button variant="destructive">`. Apply this consistently.
5. **Ship and iterate**: A clean, simple design shipped today beats a perfect design shipped never. Get the basics right (spacing, typography, hierarchy) and refine based on user feedback.', 3);

-- ============================================================
-- Module 25: TypeScript for AI Orchestrators
-- ============================================================
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0025-0000-0000-0000-000000000025',
  '11111111-1111-1111-1111-111111111111',
  'TypeScript for AI Orchestrators',
  'typescript-for-ai-orchestrators',
  'Learn the TypeScript skills you need to build type-safe, reliable AI applications.',
  25
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0025-0000-0000-0000-000000000025', 'TypeScript Essentials', 'typescript-essentials', 'text',
'# TypeScript Essentials

TypeScript is JavaScript with types. It catches errors before your code runs, gives you better autocomplete in your editor, and makes your codebase easier to understand and maintain. For AI applications where you are handling complex data structures from multiple APIs, TypeScript is not optional — it is essential.

## Why TypeScript Matters for AI Development

AI APIs return complex, nested data structures. A single response from an AI model might include the generated text, token counts, model metadata, stop reasons, and usage information. Without types, you are guessing about the shape of this data. With types, your editor tells you exactly what fields are available and what types they are.

Consider this JavaScript code:

```js
// JavaScript — no type safety
const response = await callAI(prompt);
console.log(response.content[0].txt); // Typo! Should be .text — fails silently
```

And the same code in TypeScript:

```ts
// TypeScript — catches the error immediately
const response: AIResponse = await callAI(prompt);
console.log(response.content[0].txt); // Error: Property ''txt'' does not exist. Did you mean ''text''?
```

TypeScript catches the typo at development time, not in production when a user is waiting for a response.

## Basic Types

The types you will use most often:

```ts
// Primitive types
const name: string = "Claude";
const temperature: number = 0.7;
const isStreaming: boolean = true;

// Arrays
const models: string[] = ["claude-sonnet-4-20250514", "gpt-4", "gemini-pro"];
const scores: number[] = [0.95, 0.87, 0.92];

// Objects with interfaces
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const message: Message = {
  role: "user",
  content: "Hello, Claude!",
};
```

## Interfaces vs Types

Both `interface` and `type` define the shape of objects. Use `interface` for objects and `type` for everything else:

```ts
// Interface for objects
interface User {
  id: string;
  email: string;
  plan: "free" | "pro" | "enterprise";
}

// Type for unions, intersections, and utilities
type Role = "user" | "assistant" | "system";
type MessageWithUser = Message & { user: User };
type OptionalUser = Partial<User>;
```

## Generics

Generics let you write reusable code that works with multiple types. The Supabase client uses generics extensively:

```ts
// A generic function that wraps any API call with error handling
async function safeApiCall<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error("API call failed:", error);
    return null;
  }
}

// TypeScript knows the return type automatically
const user = await safeApiCall(() => fetchUser("123")); // Type: User | null
const messages = await safeApiCall(() => fetchMessages("conv-1")); // Type: Message[] | null
```

The `<T>` is a placeholder that TypeScript fills in based on how you call the function. You write the logic once and it works with any type.

## Union Types

Union types are critical for AI applications where data can be in multiple states:

```ts
type AIResponse =
  | { status: "loading" }
  | { status: "streaming"; partial: string }
  | { status: "complete"; content: string; tokens: number }
  | { status: "error"; message: string };

function handleResponse(response: AIResponse) {
  switch (response.status) {
    case "loading":
      showSpinner();
      break;
    case "streaming":
      updateChat(response.partial); // TypeScript knows .partial exists here
      break;
    case "complete":
      finalizeChat(response.content); // TypeScript knows .content exists here
      break;
    case "error":
      showError(response.message); // TypeScript knows .message exists here
      break;
  }
}
```

This pattern — called discriminated unions — is one of TypeScript''s most powerful features. It forces you to handle every possible state, preventing bugs where you forget to handle the error case or the loading state.

## Getting Started

If you are new to TypeScript, start by renaming your `.js` files to `.ts` (or `.jsx` to `.tsx` for React components). TypeScript will immediately start catching errors in your existing code. Add types gradually — you do not need to type everything on day one. Focus on function parameters, API responses, and component props first.', 1),

('aaaa0025-0000-0000-0000-000000000025', 'Typing AI Responses', 'typing-ai-responses', 'text',
'# Typing AI Responses

AI APIs return some of the most complex data structures you will encounter in web development. Properly typing these responses prevents bugs, improves developer experience, and makes your code self-documenting.

## The Challenge of AI Response Types

AI API responses are complex and vary by provider. Here is a simplified Anthropic API response:

```json
{
  "id": "msg_01234",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Here is the answer to your question..."
    }
  ],
  "model": "claude-sonnet-4-20250514",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 25,
    "output_tokens": 150
  }
}
```

Without types, you might access `response.content.text` instead of `response.content[0].text` (it is an array). Or forget to check `stop_reason` and miss that the response was truncated. Types prevent these mistakes.

## Defining Response Types

Most AI providers offer TypeScript SDKs with built-in types. Use them:

```ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const response = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});

// TypeScript knows: response.content is ContentBlock[]
// TypeScript knows: response.usage.input_tokens is number
// TypeScript knows: response.stop_reason is "end_turn" | "max_tokens" | "stop_sequence" | null
```

When an SDK is not available, define your own types based on the API documentation:

```ts
interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: {
    model?: string;
    tokens_used?: number;
    latency_ms?: number;
  };
}

interface Conversation {
  id: string;
  title: string;
  messages: AIMessage[];
  created_at: string;
  updated_at: string;
}
```

## Zod: Runtime Validation

TypeScript types only exist at compile time — they disappear when your code runs. This means data from external sources (API responses, user input, webhook payloads) could have any shape at runtime, even if TypeScript thinks it matches your types.

Zod is a library that validates data at runtime and infers TypeScript types:

```ts
import { z } from "zod";

// Define the schema
const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1),
  metadata: z.object({
    model: z.string().optional(),
    tokens_used: z.number().optional(),
  }).optional(),
});

// Infer the TypeScript type from the schema
type Message = z.infer<typeof MessageSchema>;

// Validate incoming data
function processMessage(rawData: unknown): Message {
  const result = MessageSchema.safeParse(rawData);
  if (!result.success) {
    console.error("Invalid message:", result.error.issues);
    throw new Error("Invalid message format");
  }
  return result.data; // Guaranteed to match the Message type
}
```

Zod is especially valuable for AI applications because AI responses can be unpredictable. A model might return unexpected fields, missing fields, or fields with wrong types. Zod catches these issues at the boundary where external data enters your application.

## Handling Uncertain Data Shapes

AI APIs sometimes return different structures based on the request. The Anthropic API can return text content or tool-use content. Handle this with discriminated unions:

```ts
type ContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> };

function extractText(blocks: ContentBlock[]): string {
  return blocks
    .filter((block): block is Extract<ContentBlock, { type: "text" }> =>
      block.type === "text"
    )
    .map((block) => block.text)
    .join("\n");
}
```

The `filter` with a type predicate (`block is Extract<...>`) tells TypeScript that after filtering, you only have text blocks. This eliminates the need for type assertions (`as`) which can hide bugs.

## Practical Pattern: The API Wrapper

Create a typed wrapper around your AI API calls that normalizes responses into a consistent shape your application expects:

```ts
interface NormalizedResponse {
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  stopReason: "complete" | "truncated" | "error";
}

async function chat(messages: Message[]): Promise<NormalizedResponse> {
  const response = await client.messages.create({ ... });
  return {
    text: extractText(response.content),
    model: response.model,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    stopReason: response.stop_reason === "end_turn" ? "complete" : "truncated",
  };
}
```

This wrapper gives the rest of your application a clean, typed interface regardless of which AI provider you use underneath. If you switch providers, you change the wrapper — not every component that displays AI responses.', 2),

('aaaa0025-0000-0000-0000-000000000025', 'TypeScript in Practice', 'typescript-in-practice', 'text',
'# TypeScript in Practice

Theory is important, but the real value of TypeScript emerges when you apply it to practical patterns in your AI application. This lesson covers the three most impactful uses: type-safe database queries, typed API routes, and error handling patterns.

## Type-Safe Supabase Queries

Supabase can generate TypeScript types from your database schema. Run the type generation command:

```bash
npx supabase gen types typescript --project-id your-project-id > lib/database.types.ts
```

This creates types that match your database tables exactly. Pass them to the Supabase client:

```ts
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";

const supabase = createClient<Database>(url, key);

// Now TypeScript knows your table structures
const { data } = await supabase
  .from("conversations") // Autocomplete shows all table names
  .select("*")
  .eq("user_id", userId); // Autocomplete shows all column names

// data is typed as Conversation[] | null
// TypeScript knows: data[0].title is string
// TypeScript knows: data[0].created_at is string
// TypeScript knows: data[0].nonexistent is an error
```

Without generated types, `data` is `any` and you get no autocomplete or error checking. With generated types, your editor becomes a guide that shows you exactly what fields are available and what types they are. Regenerate types whenever you change your database schema.

## Typed API Routes

Next.js API routes handle requests and send responses. Type both sides for safety:

```ts
// app/api/chat/route.ts
import { z } from "zod";

// Validate the incoming request
const ChatRequestSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string().min(1).max(10000),
  model: z.enum(["claude-sonnet-4-20250514", "claude-haiku"]).default("claude-sonnet-4-20250514"),
});

// Define the response type
interface ChatResponse {
  id: string;
  content: string;
  tokens_used: number;
}

export async function POST(request: Request) {
  const body = await request.json();

  // Validate — returns typed data or errors
  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { conversationId, message, model } = parsed.data;
  // TypeScript knows: conversationId is string, message is string, model is the enum

  // ... call AI API, save to database ...

  const response: ChatResponse = {
    id: "msg_123",
    content: aiResult.text,
    tokens_used: aiResult.outputTokens,
  };

  return Response.json(response);
}
```

This pattern catches invalid requests before they reach your AI API (saving you money) and ensures your response matches the expected shape (preventing client-side errors).

## Error Handling Patterns

AI applications have many failure points: network errors, API rate limits, malformed responses, authentication failures, and database errors. TypeScript helps you handle all of them explicitly.

**The Result Pattern**: Instead of throwing exceptions, return a result object that can be either a success or an error:

```ts
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

async function sendMessage(
  conversationId: string,
  content: string
): Promise<Result<AIMessage>> {
  try {
    const response = await callAI(content);
    const saved = await saveMessage(conversationId, response);
    return { success: true, data: saved };
  } catch (error) {
    if (error instanceof RateLimitError) {
      return { success: false, error: "Too many requests. Please wait.", code: "RATE_LIMIT" };
    }
    if (error instanceof AuthError) {
      return { success: false, error: "Please sign in again.", code: "AUTH_ERROR" };
    }
    return { success: false, error: "Something went wrong.", code: "UNKNOWN" };
  }
}

// Calling code must handle both cases
const result = await sendMessage(convId, userMessage);
if (result.success) {
  displayMessage(result.data); // TypeScript knows .data exists
} else {
  showError(result.error); // TypeScript knows .error exists
}
```

**Custom Error Classes**: Create specific error classes for different failure types:

```ts
class AIError extends Error {
  constructor(message: string, public code: string, public retryable: boolean) {
    super(message);
    this.name = "AIError";
  }
}

class RateLimitError extends AIError {
  constructor(retryAfterMs: number) {
    super(`Rate limited. Retry after ${retryAfterMs}ms`, "RATE_LIMIT", true);
  }
}
```

## The Compound Effect

Each of these patterns — typed database queries, validated API routes, explicit error handling — provides incremental value. But together, they create a codebase where the entire data flow is type-safe from database to API to client. When you change a database column, TypeScript flags every place in your code that needs updating. When you modify an API response, TypeScript shows you which client components need changes. This compound effect is why teams that adopt TypeScript rarely go back to plain JavaScript.', 3);

-- ============================================================
-- Module 26: Git & Version Control
-- ============================================================
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0026-0000-0000-0000-000000000026',
  '11111111-1111-1111-1111-111111111111',
  'Git & Version Control',
  'git-version-control',
  'Master Git and GitHub workflows to manage your AI projects professionally.',
  26
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0026-0000-0000-0000-000000000026', 'Git Fundamentals', 'git-fundamentals', 'text',
'# Git Fundamentals

Git is the version control system that tracks every change to your code. It is the safety net that lets you experiment fearlessly, collaborate with others, and roll back mistakes. Every professional developer uses Git, and as an AI Orchestrator building applications, you need to use it too.

## What Git Does

Imagine writing a document and being able to save snapshots at any point. Each snapshot captures the exact state of every file. You can go back to any snapshot, compare snapshots, or create parallel versions of your document. That is what Git does for code.

Without Git, you end up with folders named `my-project-final`, `my-project-final-v2`, `my-project-ACTUALLY-final`. With Git, you have one folder and a complete history of every change ever made.

## Key Concepts

**Repository (repo)**: A project tracked by Git. Your AI application lives in a repository. The repository contains your code files plus a hidden `.git` folder that stores the complete history.

**Commit**: A snapshot of your project at a specific point in time. Each commit has a unique ID (a hash like `a1b2c3d`), a message describing the change, a timestamp, and the author. Good commit messages are essential — they tell future-you (and your team) what changed and why.

**Branch**: A parallel version of your code. The main branch (usually called `main`) is your production code. When you want to build a new feature or fix a bug, you create a branch, make your changes there, and merge it back to `main` when it is ready. This keeps `main` stable while you experiment.

**Staging area**: The space between your working files and a commit. You choose which changes to include in the next commit by staging them. This lets you make many changes but commit them in logical groups.

## Essential Commands

```bash
# Start a new repository
git init

# Check which files have changed
git status

# Stage specific files for commit
git add app/api/chat/route.ts
git add components/ChatInput.tsx

# Stage all changed files
git add .

# Create a commit with a message
git commit -m "Add chat API route and input component"

# View commit history
git log --oneline

# Create a new branch
git branch feature/voice-mode

# Switch to a branch
git checkout feature/voice-mode
# Or the modern way:
git switch feature/voice-mode

# Create and switch in one command
git checkout -b feature/voice-mode
```

## Writing Good Commit Messages

Your commit messages are documentation. Write them for the person who reads them six months from now (often yourself). Good messages:

- Start with a verb: "Add", "Fix", "Update", "Remove", "Refactor"
- Describe what changed and why: "Fix streaming timeout by increasing max duration to 60s"
- Are concise but specific: Not "Update code" but "Update chat API to support Claude 3.5 Sonnet"

Bad commit messages like "WIP", "fix", "stuff", or "asdf" are technical debt. When something breaks in production and you need to find the commit that caused it, good messages are the difference between a 5-minute fix and a 2-hour investigation.

## Merging

When your feature is complete and tested, merge it into the main branch:

```bash
# Switch to main
git checkout main

# Merge your feature branch
git merge feature/voice-mode

# Delete the branch (optional, keeps things tidy)
git branch -d feature/voice-mode
```

If both branches changed the same lines in the same file, Git reports a **merge conflict**. You manually choose which version to keep (or combine them), then commit the resolution. Merge conflicts are normal — they are not errors, just situations that require a human decision.

## The Safety Net

Git''s greatest value is the ability to undo mistakes:

- **Undo uncommitted changes**: `git checkout -- filename` restores a file to its last committed state
- **Undo a commit**: `git revert abc123` creates a new commit that undoes the changes from commit `abc123`
- **See what changed**: `git diff` shows exactly what lines were modified

This safety net encourages experimentation. Try a new approach to your AI pipeline. If it does not work, revert and try something else. Without Git, experimentation carries the risk of losing working code.', 1),

('aaaa0026-0000-0000-0000-000000000026', 'GitHub Workflows', 'github-workflows', 'text',
'# GitHub Workflows

GitHub is the platform where Git repositories live online. While Git is the tool that tracks changes on your machine, GitHub enables collaboration, code review, project management, and automated workflows. Understanding GitHub workflows is essential for working on any team and for managing your own projects professionally.

## Pushing and Pulling

After making commits locally, you push them to GitHub to share with your team (and to back up your work):

```bash
# Connect your local repo to GitHub (one-time setup)
git remote add origin https://github.com/your-username/your-repo.git

# Push your main branch
git push origin main

# Push a feature branch
git push origin feature/voice-mode

# Pull changes others have pushed
git pull origin main
```

Always pull before you start working to ensure you have the latest changes. Always push after completing a logical unit of work.

## Pull Requests (PRs)

A pull request is a proposal to merge changes from one branch into another. It is the central collaboration mechanism on GitHub. The workflow:

1. Create a branch and make your changes
2. Push the branch to GitHub
3. Open a pull request from your branch to `main`
4. Describe what you changed and why
5. Request review from teammates
6. Address feedback by pushing new commits to the same branch
7. Merge the PR when approved

Pull requests are not just about code review. They create a permanent record of what changed, why it changed, who reviewed it, and any discussion that happened. This history is invaluable when debugging issues months later.

## Writing Good Pull Requests

A good PR includes:

- **Title**: Concise description of what the PR does ("Add streaming support to chat API")
- **Description**: Explain the problem being solved, the approach taken, and any trade-offs
- **Screenshots**: If the PR changes the UI, include before/after screenshots
- **Test plan**: How to verify the changes work correctly

For AI application PRs, also include: which AI model or feature is affected, any prompt changes, and expected impact on cost or latency.

## Code Review

Code review is when teammates read your code and provide feedback before it is merged. Good code review catches bugs, improves code quality, and spreads knowledge across the team.

As a reviewer, focus on:

- **Correctness**: Does the code do what it claims?
- **Security**: Are API keys protected? Is user input validated?
- **Edge cases**: What happens with empty inputs, very long inputs, or unexpected data?
- **Readability**: Will someone understand this code in six months?

As an author, make your PRs easy to review: keep them small (under 400 lines is ideal), include context in the description, and respond to feedback constructively.

## Issues and Project Boards

GitHub Issues track bugs, feature requests, and tasks. Each issue has a title, description, labels (like "bug", "feature", "documentation"), and can be assigned to team members.

Project boards organize issues into columns like "To Do", "In Progress", and "Done". This gives your team visibility into what everyone is working on and what is coming next.

For AI projects, common issue categories include:

- Prompt improvements (labeled "prompt-engineering")
- New model integrations
- Performance issues (latency, token usage)
- User-reported bugs
- Infrastructure updates

## GitHub Actions (CI/CD)

GitHub Actions lets you automate tasks that run when certain events happen in your repository. Common automations:

- **On every push**: Run linting and type checking to catch errors
- **On every PR**: Run tests and deploy a preview environment
- **On merge to main**: Deploy to production

A basic GitHub Actions workflow:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build
```

This runs automatically on every push and PR, catching errors before they reach production. As your AI application matures, add more checks: test suite execution, security scanning, and performance benchmarks.', 2),

('aaaa0026-0000-0000-0000-000000000026', 'Git for AI Projects', 'git-for-ai-projects', 'text',
'# Git for AI Projects

AI projects have unique version control needs that go beyond standard software development. You need to track prompts, manage experiments, protect secrets, and handle large files. This lesson covers Git practices specific to AI Orchestrators.

## Managing Prompts in Version Control

Your system prompts, templates, and instructions are as important as your code. They determine how your AI behaves, and changes to them can dramatically affect output quality. Treat prompts as first-class artifacts in your repository.

**Store prompts in dedicated files**, not embedded in code:

```
prompts/
├── system/
│   ├── chat-assistant.md
│   ├── code-reviewer.md
│   └── summarizer.md
├── templates/
│   ├── email-draft.md
│   └── report-generator.md
└── README.md
```

**Version your prompts with Git** so you can track changes over time:

```bash
git log --oneline prompts/system/chat-assistant.md
# a1b2c3d Update: add instruction to cite sources
# d4e5f6g Fix: reduce verbosity in responses
# h7i8j9k Initial: create chat assistant system prompt
```

When an AI starts giving worse responses, you can `git diff` the prompt file to see what changed. When you find a prompt version that works well, you can tag it for reference.

**Use Git blame** to understand prompt evolution:

```bash
git blame prompts/system/chat-assistant.md
```

This shows who changed each line and when — invaluable when multiple team members are iterating on prompts.

## Experiment Tracking with Branches

When testing different approaches (new models, different prompt strategies, alternative architectures), create a branch for each experiment:

```bash
git checkout -b experiment/claude-35-sonnet
# Make changes, test, evaluate
# If successful: merge to main
# If not: keep the branch for reference, switch back to main
```

Name experiment branches descriptively: `experiment/structured-output-v2`, `experiment/rag-with-reranking`, `experiment/streaming-chat-ui`. Even failed experiments are valuable — they document what you tried and why it did not work.

## .gitignore for AI Projects

A proper `.gitignore` file prevents sensitive and unnecessary files from entering your repository. Here is a comprehensive `.gitignore` for AI projects:

```gitignore
# Environment variables and secrets
.env
.env.local
.env.production
.env.*.local

# API keys and credentials
*.pem
*.key
credentials.json
service-account.json

# Dependencies
node_modules/

# Build output
.next/
out/
dist/

# AI-specific
embeddings/          # Generated embeddings (regenerate, don''t commit)
*.pkl                # Pickle files (models, data)
*.h5                 # Model weights
*.bin                # Binary model files
datasets/            # Training data (often too large for Git)
*.csv                # Data files (use Git LFS for large ones)

# IDE
.vscode/settings.json
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Supabase
supabase/.temp/
```

## Protecting Secrets

The most important Git rule for AI projects: **never commit secrets**. API keys, database passwords, and service account credentials must stay out of your repository. Even if you delete them later, they remain in Git history.

If you accidentally commit a secret:

1. **Rotate the key immediately** — assume it is compromised
2. Remove the file from Git tracking: `git rm --cached .env`
3. Add it to `.gitignore`
4. Commit the removal

For extra protection, use tools like `git-secrets` or `gitleaks` that scan commits for patterns that look like API keys and block them from being committed.

## Branching Strategy for AI Apps

For solo developers and small teams, a simple branching strategy works best:

- `main` — production-ready code, always deployable
- `develop` — integration branch for features in progress (optional)
- `feature/*` — individual features or improvements
- `fix/*` — bug fixes
- `experiment/*` — AI experiments and explorations

Keep branches short-lived. A branch that lives for weeks accumulates merge conflicts and becomes difficult to merge. Aim to merge feature branches within a few days.

## Practical Workflow

A typical day as an AI Orchestrator:

```bash
git pull origin main                          # Get latest changes
git checkout -b feature/improve-summarizer    # Start new work
# ... make changes, test ...
git add prompts/system/summarizer.md
git add app/api/summarize/route.ts
git commit -m "Improve summarizer: add citation requirements and output format"
git push origin feature/improve-summarizer    # Push to GitHub
# Open a pull request on GitHub
# After review: merge and delete branch
```

This workflow gives you safety (you can always go back), collaboration (others can review your changes), and documentation (the Git history tells the story of your project''s evolution).', 3);

-- ============================================================
-- Module 27: Payments & Monetization with Stripe
-- ============================================================
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0027-0000-0000-0000-000000000027',
  '11111111-1111-1111-1111-111111111111',
  'Payments & Monetization with Stripe',
  'payments-monetization-stripe',
  'Learn how to accept payments and build subscription billing for your AI products using Stripe.',
  27
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0027-0000-0000-0000-000000000027', 'Stripe Fundamentals', 'stripe-fundamentals', 'text',
'# Stripe Fundamentals

If you are building an AI product, you need to get paid. Stripe is the payment infrastructure that powers most modern SaaS applications, from startups to Fortune 500 companies. Understanding Stripe is essential for turning your AI orchestration skills into a business.

## Core Stripe Concepts

Stripe has four foundational objects you need to understand:

**Products**: What you are selling. A product represents your offering — "AI Chat Assistant Pro", "Document Analyzer", or "Prompt Template Library". Products are descriptive containers; they do not have prices attached directly.

**Prices**: How much your product costs. A single product can have multiple prices — a monthly price ($29/month), an annual price ($290/year), or a usage-based price ($0.01 per API call). Prices define the billing model: one-time, recurring, or metered.

**Customers**: Who is buying. Each customer in Stripe has an email, name, payment method, and billing history. When a user signs up for your AI product, you create a Stripe customer and link it to their account in your database.

**Subscriptions**: The ongoing billing relationship. A subscription connects a customer to a price and manages the entire lifecycle: initial payment, recurring billing, upgrades, downgrades, cancellations, and reactivation.

## Checkout Sessions

Stripe Checkout is the fastest way to accept payments. Instead of building a custom payment form (which requires PCI compliance), you redirect users to a Stripe-hosted payment page:

```ts
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Create a checkout session
const session = await stripe.checkout.sessions.create({
  customer_email: user.email,
  line_items: [
    {
      price: "price_abc123", // Your price ID from Stripe dashboard
      quantity: 1,
    },
  ],
  mode: "subscription", // or "payment" for one-time
  success_url: "https://yourapp.com/dashboard?success=true",
  cancel_url: "https://yourapp.com/pricing?canceled=true",
});

// Redirect user to session.url
```

Stripe handles the payment form, card validation, 3D Secure authentication, and compliance. You get a clean callback when payment succeeds.

## The Subscription Lifecycle

Understanding the subscription lifecycle prevents billing bugs:

1. **Creation**: Customer checks out and subscribes. Status: `active`.
2. **Renewal**: Stripe automatically charges the customer at each billing period. You do not need to do anything.
3. **Payment failure**: If a charge fails, Stripe retries automatically (configurable). Status: `past_due`.
4. **Cancellation**: Customer cancels. By default, they retain access until the current period ends. Status: `canceled` at period end.
5. **Reactivation**: A canceled subscription can be reactivated before the period ends.

## The Stripe Dashboard

The Stripe dashboard is where you manage your payment business:

- Create products and prices
- View customer information and billing history
- Monitor revenue, refunds, and disputes
- Configure webhook endpoints
- Toggle between test mode and live mode

**Test mode** is critical. Stripe provides a complete test environment with test card numbers (`4242 4242 4242 4242` is a test Visa that always succeeds). Build and test your entire payment flow in test mode before processing real money.

## Stripe in Your Stack

For a typical AI application stack (Next.js + Supabase + Vercel), Stripe integrates like this:

1. **Pricing page** (Next.js): Display your plans and prices
2. **Checkout** (Stripe Checkout): Redirect to Stripe for payment
3. **Webhook handler** (Next.js API route or Supabase Edge Function): Receive events from Stripe
4. **Database** (Supabase): Store subscription status, customer ID, and plan details
5. **Access control** (RLS policies): Gate features based on the user''s plan

This architecture is clean, scalable, and separates concerns. Stripe handles money. Your database handles access. Your application handles the user experience.', 1),

('aaaa0027-0000-0000-0000-000000000027', 'Implementing Subscriptions', 'implementing-subscriptions', 'text',
'# Implementing Subscriptions

The checkout session gets money in the door, but the real work is handling everything that happens after: successful payments, failed payments, upgrades, downgrades, cancellations, and edge cases. This is where webhooks become essential.

## What Are Webhooks?

Webhooks are HTTP callbacks — Stripe sends a POST request to your server whenever something important happens. Instead of your application polling Stripe ("Did payment succeed yet? How about now?"), Stripe tells you proactively.

You configure a webhook endpoint in the Stripe dashboard (or via the API) pointing to a URL on your server, like `https://yourapp.com/api/webhooks/stripe`.

## Essential Webhook Events

These are the events you must handle for a subscription-based AI product:

```ts
// app/api/webhooks/stripe/route.ts
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature")!;

  // Verify the webhook is actually from Stripe
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case "checkout.session.completed":
      // Customer just subscribed! Create their subscription record.
      await handleCheckoutComplete(event.data.object);
      break;

    case "invoice.payment_succeeded":
      // Recurring payment succeeded. Update billing period.
      await handlePaymentSuccess(event.data.object);
      break;

    case "invoice.payment_failed":
      // Payment failed. Notify the user and consider restricting access.
      await handlePaymentFailure(event.data.object);
      break;

    case "customer.subscription.updated":
      // Subscription changed (upgrade, downgrade, or status change).
      await handleSubscriptionUpdate(event.data.object);
      break;

    case "customer.subscription.deleted":
      // Subscription canceled and period ended. Revoke access.
      await handleSubscriptionDeleted(event.data.object);
      break;
  }

  return Response.json({ received: true });
}
```

## Webhook Signature Verification

Always verify webhook signatures. Without verification, anyone could send fake events to your endpoint and grant themselves free access. The `stripe.webhooks.constructEvent()` function verifies that the request genuinely came from Stripe using a shared secret.

## The Billing Portal

Stripe provides a hosted billing portal where customers can manage their own subscription: update payment methods, view invoices, change plans, or cancel. This saves you from building these features yourself:

```ts
const portalSession = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: "https://yourapp.com/dashboard/settings",
});

// Redirect user to portalSession.url
```

One line of code gives your customers a full billing management experience. They can update their credit card when it expires, download invoices for expense reports, and cancel or change plans — all without you building custom UI.

## Handling Payment Failures

Payment failures are inevitable. Credit cards expire, get lost, or hit their limits. Stripe handles this with a process called **dunning**:

1. First payment attempt fails
2. Stripe automatically retries (default: 3 retries over 3 weeks)
3. Stripe emails the customer to update their payment method
4. If all retries fail, the subscription is canceled

Your application should:

- Show a banner in the app when payment is past due: "Your payment failed. Please update your payment method."
- Link to the billing portal so the user can fix the issue
- Decide on a grace period — do you restrict access immediately or give them time?
- Send your own notification emails in addition to Stripe''s automated ones

## Syncing Subscription Status

The most critical piece is keeping your database in sync with Stripe. Your Supabase database should have a subscriptions table:

```sql
create table subscriptions (
  id text primary key, -- Stripe subscription ID
  user_id uuid references profiles(id) not null,
  stripe_customer_id text not null,
  status text not null, -- active, past_due, canceled, etc.
  price_id text not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Every webhook event updates this table. Your RLS policies and application logic read from this table to determine what features a user can access. The source of truth is Stripe, but your database is the working copy that your application queries on every request.

## Testing Webhooks Locally

Use the Stripe CLI to forward webhooks to your local development server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This gives you a webhook signing secret for local development and forwards real Stripe test events to your local server. Test every event type before deploying to production.', 2),

('aaaa0027-0000-0000-0000-000000000027', 'Monetizing AI Products', 'monetizing-ai-products', 'text',
'# Monetizing AI Products

Building a great AI product is only half the challenge. Pricing it correctly and creating a sustainable business model is the other half. AI products have unique cost structures that require thoughtful pricing strategies.

## The AI Cost Challenge

Unlike traditional SaaS where server costs are relatively fixed, AI products have **variable per-request costs**. Every time a user sends a message, you pay for AI API tokens. A power user who sends 500 messages a day costs you dramatically more than a casual user who sends 10. This fundamental difference means traditional flat-rate pricing can lose money.

Understanding your unit economics is essential:

```
Average cost per AI request:
- Claude Sonnet: ~$0.01-0.05 per message (depending on length)
- GPT-4: ~$0.03-0.10 per message
- Embedding generation: ~$0.0001 per chunk

If a user sends 100 messages/day at $0.03 average:
- Daily cost per user: $3.00
- Monthly cost per user: $90.00
- If you charge $29/month: you lose $61/month on that user
```

## Pricing Strategies for AI Products

**Freemium with Usage Limits**: Offer a free tier with strict limits (e.g., 20 messages per day) and paid tiers with higher or unlimited limits. This lets users try your product before paying. Most successful AI products use this model.

```
Free:     20 messages/day, basic model
Pro:      $29/month, 500 messages/day, advanced model
Business: $99/month, unlimited messages, all models, priority support
```

**Usage-Based Pricing**: Charge based on actual usage — per message, per document processed, or per API call. This aligns your revenue with your costs perfectly. Stripe supports metered billing natively:

```ts
// Report usage to Stripe
await stripe.subscriptionItems.createUsageRecord(
  subscriptionItemId,
  {
    quantity: messagesThisPeriod,
    timestamp: Math.floor(Date.now() / 1000),
    action: "set",
  }
);
```

Usage-based pricing is fair but unpredictable for customers. Many prefer knowing their monthly bill in advance.

**Tiered Flat Rate**: The most common model. Fixed monthly price for a bundle of features and usage. Higher tiers get more features and higher usage limits. This is predictable for customers and simple to implement.

**Credits System**: Sell credits that users spend on AI actions. Different actions cost different amounts (a simple chat costs 1 credit, a document analysis costs 10 credits). This gives you granular control over pricing while being transparent to users.

## Implementing Feature Gating

Once you have pricing tiers, gate features based on the user''s plan:

```ts
// lib/plans.ts
const PLAN_LIMITS = {
  free: {
    messagesPerDay: 20,
    models: ["claude-haiku"],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    features: ["basic-chat"],
  },
  pro: {
    messagesPerDay: 500,
    models: ["claude-haiku", "claude-sonnet-4-20250514"],
    maxFileSize: 50 * 1024 * 1024, // 50MB
    features: ["basic-chat", "document-analysis", "export"],
  },
  business: {
    messagesPerDay: Infinity,
    models: ["claude-haiku", "claude-sonnet-4-20250514", "claude-opus"],
    maxFileSize: 200 * 1024 * 1024, // 200MB
    features: ["basic-chat", "document-analysis", "export", "api-access", "team"],
  },
};

export function canUserAccess(plan: string, feature: string): boolean {
  return PLAN_LIMITS[plan]?.features.includes(feature) ?? false;
}
```

Check limits in your API routes before making AI calls. If a free user has hit their daily limit, return a friendly message with an upgrade link instead of making the AI call.

## Pricing Page Best Practices

Your pricing page is one of the most important pages on your site. Best practices:

- **Show three tiers**: Free, Pro, Business. Three options make the decision manageable.
- **Highlight the recommended plan**: Usually the middle tier. Use visual emphasis (border, badge, different background).
- **List features clearly**: Checkmarks for included features, dashes for excluded ones.
- **Show annual savings**: Offer a discount for annual billing (typically 15-20%) to improve retention.
- **Include a FAQ section**: Address common questions about limits, billing, and cancellation.

## Reducing AI Costs

Practical strategies to improve your margins:

- **Use the right model for the task**: Route simple queries to cheaper models and only use expensive models when quality demands it.
- **Cache common responses**: If users frequently ask similar questions, cache the AI response and serve it without a new API call.
- **Implement smart rate limiting**: Prevent abuse and runaway costs. A user sending 1,000 messages in an hour is likely scripting, not chatting.
- **Optimize prompt length**: Shorter system prompts mean fewer input tokens per request. Trim unnecessary instructions.
- **Batch operations**: If processing multiple documents, batch API calls where possible to reduce overhead.

The goal is to build a product where your revenue per user exceeds your cost per user by a healthy margin — typically 3-5x. Monitor this ratio closely, especially in the early days when usage patterns are still emerging.', 3);

-- ============================================================
-- Module 28: Building Full-Stack AI Applications
-- ============================================================
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0028-0000-0000-0000-000000000028',
  '11111111-1111-1111-1111-111111111111',
  'Building Full-Stack AI Applications',
  'building-full-stack-ai-applications',
  'Bring everything together — architecture, stack integration, and the practical roadmap from idea to launched product.',
  28
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0028-0000-0000-0000-000000000028', 'Architecture Patterns', 'architecture-patterns', 'text',
'# Architecture Patterns

Before writing code, you need to decide how your application is structured. The right architecture makes your AI application scalable, maintainable, and cost-effective. The wrong architecture creates technical debt that slows you down as you grow.

## Monolith: Start Here

A monolith is a single application that contains all your code — UI, API routes, business logic, and AI integrations. For most AI applications, a Next.js monolith is the right starting point.

**Why monoliths work for AI apps:**

- Everything is in one repository, easy to understand and deploy
- Shared types between frontend and backend (TypeScript across the stack)
- One deployment process (push to Vercel)
- Simple debugging — all logs in one place
- No network calls between services (API routes are in the same process)

**When to move beyond a monolith:**

- When different parts need to scale independently (e.g., your chat API handles 10x the traffic of your admin dashboard)
- When teams need to work independently on different parts
- When regulatory requirements mandate separation of data processing

For most AI Orchestrators building products, you will never need to move beyond a well-structured monolith. Companies with millions of users run on monoliths. Do not over-engineer.

## Serverless Architecture

Serverless does not mean "no servers" — it means you do not manage servers. Your code runs in functions that are invoked on demand, scale automatically, and cost nothing when idle.

Your Next.js application on Vercel is already serverless:

- **API routes** become serverless functions
- **Server Components** render in serverless environments
- **Edge Functions** run at the edge for low-latency operations
- **Static pages** are served from CDN (no server needed)

The benefit for AI applications is cost efficiency. If your app gets 100 requests per hour during the day and 5 per hour at night, you only pay for the actual compute used. No idle servers burning money.

**Limitations to understand:**

- **Cold starts**: The first request after inactivity takes slightly longer (100-500ms)
- **Execution time limits**: Functions have maximum execution times (60s on Vercel Pro)
- **No persistent connections**: Each function invocation is independent — no WebSocket servers, no in-memory caches that persist between requests
- **Stateless**: Functions do not share state. Use your database or a cache service for shared state.

## Edge Computing

Edge computing runs code in data centers close to the user rather than in a central region. This reduces latency for operations that do not need to access a central database.

Use cases for AI applications:

- **Authentication checks**: Verify JWT tokens at the edge before routing requests
- **A/B testing**: Route users to different AI models at the edge
- **Geolocation**: Serve different content or route to different AI endpoints based on location
- **Rate limiting**: Block excessive requests at the edge before they reach your API

Edge functions have limitations: they cannot access most Node.js APIs, have smaller memory limits, and cannot run long-duration tasks. Use them for lightweight operations and route heavy lifting to serverless functions.

## The Practical Architecture

For a production AI application, the practical architecture looks like this:

```
User Browser
    ↓
Next.js on Vercel (UI + API Routes)
    ↓                    ↓
Supabase               AI APIs
(DB, Auth, Storage)    (Anthropic, OpenAI)
    ↓
Stripe (Payments)
```

This is simple, proven, and scalable. The user''s browser talks to your Next.js application. Your application talks to Supabase for data and auth, AI APIs for intelligence, and Stripe for payments. Each service is managed — you do not operate any infrastructure yourself.

## Separation of Concerns

Regardless of architecture, maintain clear separation:

- **UI layer**: Components that render data and handle user interactions
- **API layer**: Routes that validate requests, call services, and return responses
- **Business logic**: Functions that implement your domain rules (rate limiting, feature gating, prompt construction)
- **Data access**: Functions that read and write to your database
- **External integrations**: Wrappers around third-party APIs (AI providers, Stripe, email services)

Keep each layer focused. Your UI components should not contain database queries. Your API routes should not contain complex business logic. Your business logic should not know about HTTP requests. This separation makes testing easier, refactoring safer, and code more readable.', 1),

('aaaa0028-0000-0000-0000-000000000028', 'The AI App Stack', 'the-ai-app-stack', 'text',
'# The AI App Stack

You have now learned each technology individually — Next.js, Supabase, Vercel, Tailwind, TypeScript, Git, Stripe, and AI APIs. This lesson shows how they fit together into a cohesive stack for building production AI applications.

## The Stack at a Glance

```
┌─────────────────────────────────────────────────────┐
│  Frontend (Next.js + Tailwind + shadcn/ui)          │
│  - Server Components for data display               │
│  - Client Components for interactivity              │
│  - Streaming UI for AI responses                    │
├─────────────────────────────────────────────────────┤
│  API Layer (Next.js API Routes)                     │
│  - Chat endpoints with streaming                    │
│  - Webhook handlers (Stripe, etc.)                  │
│  - Server Actions for mutations                     │
├─────────────────────────────────────────────────────┤
│  Backend Services                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Supabase │  │ AI APIs  │  │  Stripe  │          │
│  │ DB/Auth  │  │ Claude   │  │ Payments │          │
│  │ Storage  │  │ GPT      │  │ Billing  │          │
│  └──────────┘  └──────────┘  └──────────┘          │
├─────────────────────────────────────────────────────┤
│  Infrastructure                                     │
│  Vercel (hosting) + GitHub (source) + TypeScript    │
└─────────────────────────────────────────────────────┘
```

## How a User Request Flows Through the Stack

Let''s trace a complete user interaction — sending a chat message — through every layer:

**1. User types a message** (Client Component with Tailwind styling)

The user types in a `<Textarea>` component from shadcn/ui, styled with Tailwind classes. A Client Component manages the input state and handles the submit event.

**2. Request hits the API route** (Next.js API Route)

The Client Component sends a POST request to `/api/chat`. The API route validates the request body with Zod, checks authentication via Supabase Auth, and verifies the user''s subscription status.

**3. Subscription check** (Supabase + Stripe data)

The API route queries the subscriptions table in Supabase to verify the user has an active plan and has not exceeded their daily message limit. If they are over the limit, it returns a 429 with an upgrade prompt.

**4. AI API call** (Anthropic/OpenAI)

The API route constructs the prompt (system message + conversation history + user message), calls the AI API with streaming enabled, and pipes the stream back to the client.

**5. Save to database** (Supabase)

After the AI response completes, the API route saves both the user''s message and the AI''s response to the messages table in Supabase, including metadata like token usage and latency.

**6. UI updates** (React + Tailwind)

The Client Component reads the stream and renders tokens as they arrive, creating the real-time typing effect. When the stream completes, the message is marked as final and the input is re-enabled.

## Connecting the Services

Each service connects through environment variables and client libraries:

```ts
// lib/supabase/server.ts — Database and Auth
import { createServerClient } from "@supabase/ssr";

// lib/ai.ts — AI API
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic(); // Uses ANTHROPIC_API_KEY env var

// lib/stripe.ts — Payments
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

Each library reads its credentials from environment variables. In development, these come from `.env.local`. In production, they come from Vercel''s environment variable settings. Your code is identical in both environments.

## Type Safety Across the Stack

TypeScript ties everything together. Generate Supabase types from your database schema. Use Zod to validate API requests. Type your AI responses. Define shared interfaces for data that crosses boundaries:

```ts
// types/index.ts — Shared types
interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  metadata: {
    model?: string;
    tokens?: number;
  };
}
```

These types are used by Server Components, Client Components, API routes, and utility functions. Change a type, and TypeScript shows you every place that needs updating.

## The Development Workflow

Your daily workflow ties Git, Vercel, and the stack together:

1. Pull the latest code from GitHub
2. Run `npm run dev` — Next.js starts locally, connecting to your Supabase development project
3. Make changes — edit components, API routes, prompts
4. Test locally — Supabase and AI APIs work in development mode
5. Commit and push to a feature branch
6. Vercel automatically creates a preview deployment
7. Review the preview, get feedback
8. Merge to main — Vercel deploys to production

This cycle takes minutes, not hours. The stack is designed for rapid iteration — the core advantage that AI Orchestrators have over traditional development teams.', 2),

('aaaa0028-0000-0000-0000-000000000028', 'From Idea to Launch', 'from-idea-to-launch', 'text',
'# From Idea to Launch

You have the skills. You have the stack. Now you need the process. This lesson is a practical roadmap for taking an AI application from initial idea to a live, paying product. Follow these phases and you will ship faster than you think.

## Phase 1: Validate the Idea (1-2 days)

Before writing any code, answer three questions:

1. **Who has this problem?** Define your user specifically. "Everyone" is not a user. "Freelance copywriters who need to write 10+ blog posts per week" is a user.

2. **How do they solve it today?** If people are not actively solving this problem (even badly), it might not be a real problem. Look for manual processes, spreadsheets, copy-pasting between tools, or complaints in forums and communities.

3. **Why would they pay for your solution?** Your AI solution needs to be dramatically better than the status quo — faster, cheaper, or higher quality. "Slightly better" is not enough to change behavior.

Write a one-paragraph product description: "X helps [specific user] do [specific task] by [how AI makes it better], saving them [time/money/effort]." If you cannot write this clearly, your idea needs more refining.

## Phase 2: Build the MVP (1-2 weeks)

An MVP (Minimum Viable Product) includes only what is necessary to deliver the core value. For most AI products, that is:

- **Authentication**: User sign-up and login (Supabase Auth)
- **Core AI feature**: The one thing your product does (chat, analysis, generation)
- **Basic UI**: Clean enough to use, not perfect (Tailwind + shadcn/ui)
- **Simple pricing**: One free tier and one paid tier (Stripe)

What the MVP does NOT include: team features, admin dashboards, advanced analytics, multiple AI models, custom branding, API access, or mobile apps. These come later.

### Day 1-2: Setup

```bash
# Create Next.js project
npx create-next-app@latest my-ai-app --typescript --tailwind --app
cd my-ai-app

# Install dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install @anthropic-ai/sdk
npm install stripe
npx shadcn@latest init
npx shadcn@latest add button input textarea dialog toast

# Initialize Git
git init
git add .
git commit -m "Initial project setup"
```

Set up your Supabase project, create your database schema, enable authentication, and configure environment variables.

### Day 3-5: Core Feature

Build the core AI feature. If it is a chat application:

1. Create the chat API route (`app/api/chat/route.ts`)
2. Build the chat UI (message list, input, streaming display)
3. Implement conversation storage (save messages to Supabase)
4. Add authentication (protect routes, associate data with users)

### Day 6-8: Polish and Payments

1. Add a landing page explaining what your product does
2. Create a pricing page with free and paid tiers
3. Implement Stripe checkout and webhooks
4. Add feature gating based on subscription status
5. Handle edge cases (errors, rate limits, empty states)

### Day 9-10: Deploy and Test

1. Push to GitHub and connect to Vercel
2. Configure production environment variables
3. Test the complete flow: sign up → try free tier → upgrade → use paid features
4. Fix any issues found during testing

## Phase 3: Launch (1 day)

Launch does not mean "announce to the world." It means making your product available to real users and starting to learn:

1. **Share with your network**: Post on LinkedIn, Twitter/X, relevant communities, and forums
2. **Offer early access**: Give the first 50 users a discount or extended trial
3. **Set up feedback channels**: A simple feedback form or email address
4. **Monitor closely**: Watch error logs, AI API costs, and user behavior for the first 48 hours

## Phase 4: Iterate (Ongoing)

After launch, your job is to learn and improve:

- **Talk to users**: The five most important conversations you will have are with your first five users. Ask what they love, what frustrates them, and what they wish the product did.
- **Watch usage patterns**: Which features do people actually use? Where do they get stuck? What do they try that does not exist yet?
- **Improve the AI**: Your prompts will improve dramatically in the first weeks. Real user inputs reveal edge cases you never anticipated.
- **Add features gradually**: Based on user feedback, not assumptions. Every feature you add increases complexity and maintenance burden.

## Common Mistakes to Avoid

**Building too much before launching**: Ship the MVP, even if it feels incomplete. Real user feedback is worth more than months of polishing.

**Underpricing**: AI API costs are real. Price your product to be sustainable. A $5/month plan that costs you $8/month per user is not a business.

**Ignoring cost monitoring**: Set up alerts on your AI API spending from day one. A bug that sends infinite requests can generate a four-figure bill overnight.

**Building alone for too long**: Share your progress early and often. Show people your half-finished product. Their reactions will guide you better than your assumptions.

## Your Roadmap

You now have everything you need: the technical skills (Next.js, Supabase, Vercel, Stripe), the AI knowledge (from earlier modules in this course), and the process (validate, build, launch, iterate). The only thing left is to start. Pick an idea, open your terminal, and begin building. The AI Orchestrator who ships a imperfect product today learns more than the one who plans a perfect product for months.', 3);
