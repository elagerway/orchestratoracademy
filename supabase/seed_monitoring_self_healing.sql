-- Seed: Application Monitoring & Self-Healing Systems (7 modules, 14 lessons)
-- Free course — Sentry + Dependabot, with self-healing automation via Claude Code

-- ============================================================================
-- COURSE
-- ============================================================================

insert into public.courses (title, slug, description, is_free, price, "order", level)
values (
  'Application Monitoring & Self-Healing Systems',
  'monitoring-self-healing',
  'Most apps fail silently until a user complains. This course shows you how to catch problems the moment they happen with Sentry, close the dependency-security gap with GitHub Dependabot, and wire Claude Code in as an on-call engineer that fixes issues for you. Monitoring is not a one-time setup — it is a discipline, and self-healing is the compounding payoff.',
  true,
  0,
  10,
  'intermediate'
);

-- ============================================================================
-- MODULE 1: Why Monitoring Matters
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order") values
('19190001-0000-0000-0000-000000000001',
 (select id from public.courses where slug = 'monitoring-self-healing'),
 'Why Monitoring Matters',
 'why-monitoring-matters',
 'Silent failures cost more than visible ones. Understand the real economics of monitoring and the four signals every app should emit.',
 1);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('19190001-0000-0000-0000-000000000001',
 'The Cost of Silent Failures',
 'cost-of-silent-failures',
 'text',
'# The Cost of Silent Failures

Most production bugs are never reported. A user hits an error, shrugs, leaves, and you never hear about it. The bug stays in the code, collects more victims, and the first time you find out is when revenue starts dropping and you cannot explain why.

This is the central problem monitoring solves. Not dramatic outages — those you notice. The silent, steady bleed of users hitting a stack trace you have no idea exists.

## The iceberg of issues

For every bug a user reports, there are typically 10 to 100 they did not. Support tickets are the tip. What sits below the waterline:

- Users who hit the error and closed the tab
- Users who tried again later and it worked, so they moved on
- Users who blamed their own device or network
- Users who assumed "it is an AI app, it is flaky, that is normal"

That last one is getting worse, not better. As more products are AI-powered, users have internalized that AI apps are unreliable. They stop reporting issues because they expect them.

## Why "we will add monitoring later" kills products

Teams tell themselves they will bolt monitoring on once the product has traction. By then:

- The codebase has thousands of places errors can occur and no one remembers why each catch block exists
- Old errors accumulate as dead weight in any post-hoc monitoring — it is impossible to tell what is new versus what has been broken for months
- On-call is an ad-hoc scramble rather than a rehearsed discipline

The right time to add monitoring is before a single real user sees the app. Not because you will have bugs on day one — though you will — but because the cost of adding it later is paid in lost users you will never get back.

## What monitoring actually gives you

Three compounding benefits, in order of importance:

1. **Knowing when something breaks, before users tell you.** Not after the support ticket, not after the tweet. Within seconds.
2. **Knowing what to prioritize.** A rare error affecting five users is not the same as a common error hitting every tenth page view. Without monitoring, every bug feels equally urgent.
3. **Feedback on your changes.** Deploy a release, watch error rate. If it spikes, roll back. This is the foundation of safe, fast iteration.

## The orchestrator angle

If you are building AI-powered applications, you have a fourth benefit: monitoring is the eyes your agents use. A self-healing system that can triage its own errors, open fix PRs, and verify the fix worked — that entire loop starts with a monitoring signal. No signal, no self-healing. No self-healing, no leverage.

Rest of the course: how to set up the signal, make it useful, and close the loop.',
 1);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('19190001-0000-0000-0000-000000000001',
 'The Monitoring Pyramid',
 'the-monitoring-pyramid',
 'text',
'# The Monitoring Pyramid

Monitoring is not one thing. It is four different signals, each answering a different question. Most teams bolt on whichever one they heard about first and wonder why coverage is full of holes.

## The four signals

**1. Logs** — what happened. Append-only text streams that record specific events. Best for forensic debugging after you already know something is wrong.

**2. Metrics** — how much, how often, how long. Aggregated numeric data over time. Best for trends and dashboards: requests per second, P95 latency, error rate.

**3. Traces** — how a request flowed through the system. A distributed record of every service and function a single request touched. Best for answering "why was this request slow?"

**4. Errors** — what broke and for whom. Structured exception records with stack traces, user context, and breadcrumbs. Best for fixing bugs.

## Why the order matters

For a small-to-midsize app with one codebase, start from the top of the pyramid:

```
         errors        ← start here (Sentry)
       traces
     metrics
   logs                 ← last
```

Errors give the highest signal-to-noise ratio. One Sentry integration and you already know more about what is breaking in production than 90% of teams. Everything else is about making that signal cheaper or more targeted.

Traces matter when you have multiple services or notice latency without knowing why. Metrics and dashboards matter when you are operating at a scale where eyeballing individual events stops scaling.

Logs are last because they are the most expensive to use well. They require disciplined structured logging, centralized aggregation, and query tooling. A small team getting 80% of the value from Sentry alone should not be wiring up a log pipeline first.

## The three failure modes of monitoring setups

Most teams fall into one of three traps:

**Alert fatigue.** Every warning fires a page. Within a week, on-call ignores everything. Monitoring becomes noise.

**Dashboard theatre.** Beautiful Grafana screens that nobody actually watches. The dashboard existing does not mean anyone sees the spike.

**Logs-only thinking.** "We just grep the logs when something breaks." This scales to zero engineers and one user.

The antidote to all three: treat monitoring as a signal pipeline with a human (or an agent) at the end who actually responds. If no one responds, you do not have monitoring — you have data storage.

## What we will build in the rest of the course

The rest of this course wires up the pyramid top-down:

- **Module 2**: Sentry error capture — the foundation
- **Module 3**: Sentry performance — latency and traces
- **Module 4**: Sentry alerting — signals that reach a human
- **Module 5**: Dependabot — a second signal stream (dependency security)
- **Module 6**: Self-healing — replace the human responder with an agent where you can
- **Module 7**: The weekly ritual that keeps the system honest

By the end, your app will know when it breaks, tell you in Slack, and sometimes fix itself before you even read the message.',
 2);

-- ============================================================================
-- MODULE 2: Sentry — Capture Errors
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order") values
('19190002-0000-0000-0000-000000000001',
 (select id from public.courses where slug = 'monitoring-self-healing'),
 'Sentry — Capture Errors',
 'sentry-capture-errors',
 'Install Sentry, capture your first error, and see how to tie errors to specific releases so regressions are obvious.',
 2);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('19190002-0000-0000-0000-000000000001',
 'Install Sentry and Capture Your First Error',
 'install-sentry-first-error',
 'text',
'# Install Sentry and Capture Your First Error

The fastest way to understand Sentry is to install it and throw an error on purpose. Fifteen minutes, two files touched, and you will see more about a production crash than you ever got from console.log.

## Create the project

Go to [sentry.io](https://sentry.io), sign up, create a new project, and pick your framework (Next.js in this example). Sentry gives you a DSN — a URL-shaped key that identifies which project events belong to. Keep it handy.

## Install the SDK

For a Next.js app:

```bash
npm install --save @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

The wizard drops three config files:

- `sentry.client.config.ts` — browser-side init
- `sentry.server.config.ts` — server-side init
- `sentry.edge.config.ts` — edge runtime init

Each contains roughly this:

```ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
});
```

Set `NEXT_PUBLIC_SENTRY_DSN` in your env and in Vercel.

## Throw your first error

Add a button that throws on click:

```tsx
<button onClick={() => { throw new Error("Sentry test from orchestrator academy"); }}>
  Break something
</button>
```

Click it. Go to your Sentry project. The error is there — with the full stack trace, the browser, the OS, the URL, the user session, and the full component tree up to the boom.

## What just happened

Sentry hooked into the JavaScript runtime, caught the uncaught exception before it died quietly, and phoned home. No `try/catch` in your code. No console.log forwarding. The SDK intercepts unhandled errors at the framework level, enriches them with context, and ships them off.

The same thing works on the server side — a thrown error in an API route or server component lands in Sentry with the server-side stack, the request URL, and the user if you attached one.

## What Sentry is NOT capturing yet

By default, Sentry catches **unhandled** errors. If your code does this:

```ts
try {
  await someFlaky();
} catch (e) {
  console.error("oops");
}
```

The error is eaten. Sentry never sees it. Which brings us to the first discipline: **catch, then log to Sentry deliberately**:

```ts
try {
  await someFlaky();
} catch (e) {
  Sentry.captureException(e);
  // decide what to show the user
}
```

Every `catch` block in your codebase is a decision: swallow the error silently, or emit a signal. Swallowing should be rare and explicit.

## The first trap

Do not set `tracesSampleRate: 1.0` in production. It means every request sends a performance trace. Expensive and noisy. Default to 0.1 or lower in prod, keep 1.0 in dev for debugging. More on sampling in Module 3.',
 1);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('19190002-0000-0000-0000-000000000001',
 'Source Maps and Releases',
 'source-maps-releases',
 'text',
'# Source Maps and Releases

An error in production with no source map looks like this: `TypeError: Cannot read properties of undefined at j7f2.ah3 (layout-a8f92c.js:1:48201)`. Useless.

With a source map, it looks like this: `TypeError: Cannot read properties of undefined at ProfileCard (src/components/ProfileCard.tsx:42:8)`. Actionable.

## Why source maps matter

Production JavaScript is minified. Variable names are mangled to single letters, functions are inlined, line numbers get collapsed. A stack trace against minified code points at noise. Source maps are the reverse index — a file that tells the browser or server "this minified position corresponds to this line in the original source."

You do not want source maps served publicly (they expose your original code). You want Sentry to have them privately so it can un-minify stack traces server-side before showing them to you.

## Upload source maps to Sentry

The Sentry Next.js SDK does this automatically during `next build` if you add a build-time token:

```bash
# In Vercel env
SENTRY_AUTH_TOKEN=sntrys_xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

Get the token from Sentry → Settings → Auth Tokens. Scope it to project:write.

At build time, the Sentry webpack plugin:
1. Builds your app
2. Uploads the source maps to Sentry
3. Deletes them from the final bundle so they are not served to users

Now every error is un-minified in the Sentry UI. You see your actual filenames and line numbers.

## Releases

A **release** is a version of your app. A string you pick. It could be a git commit SHA, a semver version, or a date. Without releases, every error lives in an undifferentiated pile. With releases, you can:

- See which release introduced a new error ("regression")
- See which release resolved it
- Roll back confidently when you see a spike correlating with a deploy

Set the release automatically from the git commit:

```ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  release: process.env.VERCEL_GIT_COMMIT_SHA,
});
```

Now every error is tagged with the SHA. In Sentry you see "first seen in release abc123", and you can click through to the commit.

## The regression workflow

This is the workflow that changes how you deploy:

1. You push a new release. Sentry marks all errors as "seen in release X".
2. If a new error appears with release X as "first seen", you introduced it. Roll back or fix forward.
3. If an error drops to zero in release X, you fixed it. Close the issue and move on.

This loop — deploy, watch, react — is the foundation of safe iteration. It is what lets small teams ship fast without breaking things. The whole rest of the course assumes you have this loop running.

## Common gotchas

- **Public DSN vs. secret auth token**: the DSN is public-safe (it is in client JS). The auth token must never be committed. Only in CI env.
- **Don not ship source maps to users**: make sure `hideSourceMaps: true` in `next.config.js` (the wizard sets this by default).
- **Set release in every environment**: dev, preview, prod — each a different release string so you do not mix up where an error originated.',
 2);

-- ============================================================================
-- MODULE 3: Sentry — Observability
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order") values
('19190003-0000-0000-0000-000000000001',
 (select id from public.courses where slug = 'monitoring-self-healing'),
 'Sentry — Observability',
 'sentry-observability',
 'Beyond errors: trace slow requests through your stack and add the context that makes every issue debuggable.',
 3);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('19190003-0000-0000-0000-000000000001',
 'Performance Traces',
 'performance-traces',
 'text',
'# Performance Traces

Errors tell you what broke. Traces tell you why a request was slow. Sentry does both in the same product.

## What a trace is

A **trace** is a timeline of a single request as it flowed through your system. Each unit of work is a **span**: an HTTP handler, a database query, an API call, a render cycle. Spans nest — a span for "render dashboard" might contain child spans for each query it issued.

When you view a trace in Sentry, you see a waterfall: the full duration of the request at the top, and each span nested below it with its own duration and wall-clock position. The slow piece is obvious because it is the long bar.

## Enable performance in the SDK

```ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,  // sample 10% of requests
  release: process.env.VERCEL_GIT_COMMIT_SHA,
});
```

The Next.js SDK auto-instruments:
- Page loads and navigations (client)
- API routes and server components (server)
- `fetch` calls to third parties
- Database queries (if you use Prisma, Drizzle, or the underlying drivers)

## Sampling

`tracesSampleRate: 0.1` means Sentry records 10 percent of requests as full traces. The other 90 percent still get error capture — just not timing data.

Why sample at all? Full traces are expensive to store and noisy. 10 percent is plenty for statistical pictures of where latency lives. Keep sampling higher in dev and staging, lower in prod.

For more precision, use dynamic sampling:

```ts
tracesSampler: ({ name }) => {
  if (name?.includes("/api/critical")) return 1.0;
  if (name?.includes("/api/admin")) return 0.5;
  return 0.05;
}
```

Critical endpoints get 100%, everything else gets 5%.

## Adding a custom span

When the auto-instrumentation does not cover something you care about, wrap it yourself:

```ts
import * as Sentry from "@sentry/nextjs";

await Sentry.startSpan({ name: "generate_thumbnail", op: "image.process" }, async () => {
  await generateThumbnail(file);
});
```

Now the "generate_thumbnail" span shows up in every trace that touches this code. You can filter Sentry by that span name, see median duration, and get alerts when it regresses.

## The three performance questions

Every time you look at a trace, ask:

1. **Where is the time going?** Usually 80% is in one span. Start there.
2. **Is the slow span waiting on something?** Database, network, LLM API. If yes, look at parallelization or caching.
3. **Is the pattern consistent or occasional?** If P50 is fast but P95 is terrible, it is tail latency — a cache miss, a slow user, a retry. Different fix.

## What this unlocks

Performance data is what makes alerts meaningful later. An alert that says "error rate spiked" is useful. An alert that says "checkout API P95 went from 200ms to 3 seconds after release abc123" is actionable. That requires the trace data to exist.

In Module 4 we will set up those alerts. For now, make sure tracing is on and sampling is reasonable.',
 1);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('19190003-0000-0000-0000-000000000001',
 'Custom Context and Breadcrumbs',
 'custom-context-breadcrumbs',
 'text',
'# Custom Context and Breadcrumbs

A stack trace tells you *where* the error happened. Context tells you *who, what, and with which data* — and that is what makes a bug fixable in minutes instead of hours.

## The three layers of context

**1. User context**: who hit the error. Attach once per session after login.

```ts
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.username,
});
```

Every subsequent error on that session is tagged with that user. In Sentry you can filter "show errors for user X" and see their entire trail.

Clear on logout:

```ts
Sentry.setUser(null);
```

**2. Tags**: short, queryable values.

```ts
Sentry.setTag("subscription_tier", "pro");
Sentry.setTag("feature_flag.new_editor", "enabled");
```

Tags are indexed. You can group issues by tag in the Sentry UI: "show me only errors where subscription_tier=enterprise". This is how you tell a "rare error affecting power users" from a "common error affecting trial users."

**3. Context**: arbitrary structured data attached to the next error.

```ts
Sentry.setContext("order", {
  id: order.id,
  item_count: order.items.length,
  total_cents: order.total,
});
```

Context is displayed inline on the error page. No querying required.

## Breadcrumbs

A **breadcrumb** is a record of something that happened before the error. Sentry automatically captures:

- Navigation (URL changes)
- Clicks and form submits
- Fetch calls (URL, status, timing)
- Console messages

When an error fires, the previous 100 breadcrumbs are attached. You see what the user did in the seconds leading up to the crash.

Add your own:

```ts
Sentry.addBreadcrumb({
  category: "billing",
  message: "User applied coupon BLACKFRIDAY",
  level: "info",
  data: { coupon: "BLACKFRIDAY", discount: 20 },
});
```

The best breadcrumbs document non-obvious state transitions: "user switched to team workspace", "background job retry #3", "LLM call fell back to Claude from GPT-5".

## The 10-second debug rule

If an engineer opens a Sentry issue and cannot say "I know why this broke" within 10 seconds, context is missing. Add tags, context, and breadcrumbs until that rule holds.

Real-world examples:

- `Sentry.setTag("llm_provider", "anthropic")` — so you can tell an Anthropic outage from an OpenAI one
- `Sentry.setContext("ai_response", { tokens: 1042, model: "claude-opus-4.7", latency_ms: 2341 })` — so LLM issues have provenance
- `Sentry.addBreadcrumb({ category: "agent", message: "tool call: web_search", data: { query } })` — so agent traces are visible

For AI apps in particular, the context that matters is not `Content-Type` headers — it is model, prompt length, tool calls, token counts. Attach that deliberately.

## Privacy

Tags and context ship to Sentry. Do not put raw passwords, full credit cards, or private user content in them. Hash or redact first. Sentry has a `beforeSend` hook for scrubbing, but prefer not sending secrets in the first place.

```ts
Sentry.init({
  beforeSend(event) {
    if (event.request?.cookies) delete event.request.cookies;
    return event;
  },
});
```',
 2);

-- ============================================================================
-- MODULE 4: Sentry — Alerting
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order") values
('19190004-0000-0000-0000-000000000001',
 (select id from public.courses where slug = 'monitoring-self-healing'),
 'Sentry — Alerting',
 'sentry-alerting',
 'An alert that does not reach a human is data, not a signal. Build alerting that wakes the right person at the right time without crying wolf.',
 4);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('19190004-0000-0000-0000-000000000001',
 'Alert Rules That Don''t Cry Wolf',
 'alert-rules-that-work',
 'text',
'# Alert Rules That Don''t Cry Wolf

The most expensive mistake teams make with Sentry: turn on every alert, get 200 Slack pings in a day, mute the channel, never look at it again. Monitoring becomes theatre.

## The alert litmus test

Before adding any alert rule, ask: **if this fires at 3am on a Saturday, is there an action I would take?**

If the honest answer is "I would check it in the morning" — it is not an alert. Make it a digest. Make it a dashboard. Do not put it in Slack with a ping.

Only four types of events deserve real-time alerts:

1. **New error introduced by a release** — regression, someone broke something
2. **Error rate spike** — something about the environment changed (API down, traffic pattern, etc.)
3. **Business-critical endpoint breaking** — checkout, signup, auth
4. **External dependency down** — Stripe webhook failing, Claude API 503s

Everything else is a weekly-review item.

## The Sentry alert model

Sentry has two kinds of alerts:

**Issue alerts** fire when an issue matches criteria. Examples:
- "A new issue is first seen" + "in a production environment"
- "An issue is seen more than 100 times in 5 minutes"
- "An issue is regression" (was resolved, now firing again)

**Metric alerts** fire on aggregate conditions:
- "Error rate across the app > 1% over 5 minutes"
- "P95 latency on /api/checkout > 2 seconds over 10 minutes"
- "Apdex score drops below 0.8"

Issue alerts are for "specific thing broke". Metric alerts are for "app health is degrading". Both matter.

## A starter rule set

This is the minimum viable alert pack for a production app:

```
Rule 1: New Issue in Prod
  WHEN: issue is first seen
  IF: environment = production
  THEN: notify #alerts Slack channel

Rule 2: Spike
  WHEN: issue seen 50+ times in 5 minutes
  IF: environment = production
  THEN: notify #alerts, page on-call

Rule 3: Regression
  WHEN: issue is a regression (resolved → firing again)
  THEN: notify #alerts, assign to whoever resolved it

Rule 4: Critical Path Broken
  WHEN: metric "error rate on /api/checkout" > 5% over 5 min
  THEN: page on-call
```

Start there. Do not add more until you know this is noisy or quiet.

## The 30-day tuning loop

After a month with the starter pack:

- **Too noisy**: which alerts fire without anyone taking action? Delete or demote them to digest.
- **Too quiet**: did any real issues reach users before an alert fired? Figure out what signal would have caught it, add that rule.

Every alert should earn its place by saving more engineer time than it costs in interruptions.

## The on-call anti-pattern

One person gets all alerts for all services. They burn out in three weeks. Avoid this by routing alerts by ownership (next lesson).

## Sentry + Slack + PagerDuty

Slack is fine for awareness. It is not fine for paging. For anything that requires a human to wake up:

- Send to PagerDuty, not Slack
- PagerDuty has escalation policies (if primary doesn''t ack in 5 min, try secondary)
- Slack is a logging destination, not an interrupt mechanism

Tier your alerts: Slack for awareness, PagerDuty for paging, email for digest.',
 1);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('19190004-0000-0000-0000-000000000001',
 'Ownership and Escalation',
 'ownership-escalation',
 'text',
'# Ownership and Escalation

An alert with no owner is an alert that gets ignored. The biggest lift in alert quality is not better rules — it is routing alerts to the person who actually owns the code.

## Sentry ownership rules

Sentry lets you define ownership by file path, URL, or tag. The rule engine matches each new issue against these patterns and assigns suggested owners.

Example (in `sentry.yml` or the UI):

```
# Owner rules
path:src/app/billing/*  @finance-team
path:src/app/agents/*   @ai-team
url:*/api/stripe/*      @finance-team
tag:llm_provider        @ai-team
```

An error in the billing flow is automatically assigned to @finance-team. They see it in their Slack. No one has to triage which team should own this.

## Code-ownership lives with code

Do not maintain ownership rules in the Sentry UI. Put them in the repo as `.sentry/ownership.txt` or similar, and sync them via API on deploy. Why:

- You can review ownership changes in a PR
- You cannot forget to update them when code moves
- The rules are version-controlled alongside the code they describe

## Escalation policies

One rule, one owner, one notification is not enough for anything critical. Escalation policy defines what happens if the first notification is ignored.

A reasonable policy:

```
0 min:  page primary on-call
5 min:  if unacked, page secondary
15 min: if unacked, page team lead
30 min: if unacked, page engineering manager
```

PagerDuty, Opsgenie, and Incident.io all support this. Sentry sends to the router; the router handles escalation.

## The triage rhythm

Every production issue should have, within 5 minutes of firing:

- An owner (assignee in Sentry)
- An acknowledgement (someone clicked "I''ve got this")
- A decision (fix now, ticket for later, or ignore with a reason)

If an issue has been open for 48 hours with no decision, it is a smell. Either it does not matter (close it) or it does matter but is blocked on something (flag it).

## Automatic assignment

Sentry can auto-assign the person who "probably broke it":

- The last committer on the file where the error occurred
- The author of the PR that introduced the release where the error first appeared
- The default owner from the ownership rules

Combine these. A new issue in release abc123 in `src/app/billing/checkout.ts` should land on the last committer of that file from within release abc123''s diff. Seven out of ten times, that person knows why.

## When ownership fails

There is always a class of issues with no obvious owner:
- Cross-cutting infrastructure issues
- Flaky tests or third-party outages
- Bugs introduced by an old commit whose author left the company

Route these to a "triage" queue that a rotating engineer reviews once a day. Do not let them sit in "no one''s problem" forever.

## The self-healing angle

Ownership matters even more when the on-call is sometimes not a human. In Module 6 we wire Claude Code in as an on-call engineer for a subset of issues. That requires the same discipline: route the right kind of issues to the agent, escalate to humans when the agent does not resolve them.

Alert routing is the API between your monitoring and your response — human or machine. Get it right first.',
 2);

-- ============================================================================
-- MODULE 5: Dependabot — Dependency Security
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order") values
('19190005-0000-0000-0000-000000000001',
 (select id from public.courses where slug = 'monitoring-self-healing'),
 'Dependabot — Dependency Security',
 'dependabot-security',
 'Most production security incidents come from unpatched dependencies. Dependabot is GitHub''s free, automated signal stream for this entire class of problem.',
 5);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('19190005-0000-0000-0000-000000000001',
 'Setup and the Dependabot PR Workflow',
 'dependabot-setup',
 'text',
'# Setup and the Dependabot PR Workflow

Sentry watches your code at runtime. Dependabot watches the code you did not write — the hundreds of packages your app depends on, any one of which could have a known vulnerability disclosed tomorrow.

## The scale of the problem

A typical Next.js app has 1,200+ transitive dependencies. Every week, security researchers disclose dozens of new CVEs across the npm ecosystem. Without automation, you will not keep up. Without signal, you will not even know.

Dependabot is GitHub''s built-in service for this. Free, native, no external account needed.

## Enable it in one file

Create `.github/dependabot.yml` in your repo:

```yaml
version: 2
updates:
  # npm dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    labels: ["dependencies"]
    groups:
      minor-and-patch:
        update-types: ["minor", "patch"]

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

Commit, push. Dependabot runs on the next schedule and starts opening PRs.

## What gets opened

Three categories of PRs, each with different urgency:

**1. Security updates**. Fired immediately when a CVE is disclosed that affects a package you depend on. Labeled `dependencies` and usually prefixed `[Security]`. These are the ones you actually react to.

**2. Version updates**. Fired on schedule (weekly above). These are routine: "lodash 4.17.20 → 4.17.21". Often grouped (minor-and-patch).

**3. Major version bumps**. Separate PRs per package because they usually contain breaking changes.

The grouping config matters. Without grouping, you get 30 PRs on Monday morning and ignore them all. With grouping, patch and minor updates arrive as one "here is this week''s pile" PR, and you can squash-merge after glancing at the changelog.

## The triage playbook

For each incoming Dependabot PR:

**Step 1 — CI check.** Do the tests pass? If no, triage why. If yes, continue.

**Step 2 — Changelog scan.** Is there anything breaking? Dependabot includes release notes in the PR body for public repos.

**Step 3 — Release age.** Has this version been out for at least a week? Brand new releases sometimes have regressions. For security patches, skip this gate — merge anyway.

**Step 4 — Merge.**

This takes about 30 seconds per PR once you have CI running. The part that does not scale is doing it manually every week for five years. That is where auto-merge comes in, covered in the next lesson.

## Security alerts vs. version updates

Keep them in separate mental buckets.

Security alerts are emergencies. Subscribe to them in Slack via the GitHub Slack app and treat them like Sentry alerts: someone is on the hook to look within an hour.

Version updates are maintenance. Handle them weekly.

## What Dependabot does not cover

- **Runtime vulnerabilities in your own code** — that is what Sentry and static analysis are for.
- **Supply-chain attacks on packages you do not depend on** — that is what tools like Socket.dev or Snyk catch.
- **Missing security headers, CSP, HTTPS config** — that is a separate audit.

Dependabot covers dependency version security, which is maybe 70% of the "how you will get hacked if you are not careful" problem. It is not the whole picture but it is the cheapest 70% you will ever buy.',
 1);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('19190005-0000-0000-0000-000000000001',
 'Auto-Merge Policies',
 'dependabot-auto-merge',
 'text',
'# Auto-Merge Policies

Dependabot at small scale is manageable manually. Past a certain point you either automate merging or the PRs pile up and defeat the purpose.

## The auto-merge decision

Auto-merge is safe when:

1. **CI is trustworthy.** Your tests actually catch regressions. If CI is a rubber stamp, auto-merge is a loaded gun.
2. **The update is low-risk.** Patch versions (x.y.Z → x.y.Z+1) almost always are. Minor sometimes. Major never should be auto-merged.
3. **You have fast rollback.** If auto-merge ships a regression, how quickly can you revert? For Vercel, reverts are one click. For containerized deploys, make sure you have a single-command rollback.

## Configure auto-merge

GitHub supports branch-protection-integrated auto-merge. Enable it on the repo (Settings → General → Pull Requests → Allow auto-merge).

Then use a GitHub Action that enables auto-merge on qualifying Dependabot PRs:

```yaml
# .github/workflows/dependabot-auto-merge.yml
name: Dependabot auto-merge

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: write
  pull-requests: write

jobs:
  auto-merge:
    if: github.actor == ''dependabot[bot]''
    runs-on: ubuntu-latest
    steps:
      - name: Fetch metadata
        id: metadata
        uses: dependabot/fetch-metadata@v2

      - name: Auto-merge patch + minor
        if: steps.metadata.outputs.update-type == ''version-update:semver-patch''
          || steps.metadata.outputs.update-type == ''version-update:semver-minor''
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Patch and minor: auto-merge. Major: no — let a human decide.

## Safety rails

**1. Require CI to pass.** Branch protection rule: no merge without green CI. This is the single most important control. Without it, auto-merge is chaos.

**2. Require at least one review.** You can exempt Dependabot from this with a CODEOWNERS bypass, or use a "review-by-bot" action. The point: if your human review requirement is strict, Dependabot should still have to pass something.

**3. Rollback playbook.** Document the exact command to revert a merged Dependabot commit. Link it in the team wiki. When something breaks, speed matters.

**4. Canary or staging deploys.** If you have a staging environment, push Dependabot merges there first, wait an hour, then promote. If you do not have staging, you are rolling the dice on prod.

## What to never auto-merge

- **Major versions** — breaking changes by definition
- **Security updates to your auth / payment / crypto stack** — even a "patch" to jose or stripe deserves eyeballs
- **Pinned-for-a-reason dependencies** — if there is a comment in package.json saying "do not upgrade past 4.1", Dependabot should respect that (use `ignore` in dependabot.yml)

## Feed Dependabot into the self-healing loop

This is the setup for Module 6. Dependabot opens a PR. A GitHub Action triggers Claude Code to:

1. Read the PR diff
2. Check the changelog
3. Run the test suite locally
4. If tests fail, try to apply a fix (update callsites for renamed APIs, etc.)
5. Post the findings as a PR comment

Now a weekly Dependabot batch is not a chore — it is a pipeline where the agent does the reading, triaging, and low-risk fixing, and a human only sees the ones that genuinely need a decision.',
 2);

-- ============================================================================
-- MODULE 6: Self-Healing Agents
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order") values
('19190006-0000-0000-0000-000000000001',
 (select id from public.courses where slug = 'monitoring-self-healing'),
 'Self-Healing Agents',
 'self-healing-agents',
 'Close the loop. A Sentry issue or Dependabot PR triggers Claude Code to investigate and, when safe, produce the fix automatically.',
 6);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('19190006-0000-0000-0000-000000000001',
 'Sentry Issue → Claude Code Auto-PR',
 'sentry-to-claude-code-pr',
 'text',
'# Sentry Issue → Claude Code Auto-PR

The compounding win of monitoring is that every signal becomes an input to an agent. Sentry captures an error. A webhook fires. Claude Code reads the error, reproduces it locally, writes a fix, runs the tests, and opens a PR. You wake up to a PR instead of a fire.

This is the self-healing loop. Here is how to build a starter version.

## The architecture

```
Sentry issue (first seen)
    ↓ webhook
GitHub Action
    ↓ runs Claude Code in CI
Claude Code: read issue, find root cause, write fix
    ↓
Open PR → human reviews → merge
```

Three moving pieces: Sentry webhook, a CI workflow, and Claude Code invoked with the right context.

## Step 1: Sentry webhook → GitHub

In Sentry, create an internal integration. Set the webhook URL to a GitHub repository_dispatch endpoint:

```
POST https://api.github.com/repos/your-org/your-repo/dispatches
Headers: Authorization: Bearer <github-token>
Body: { "event_type": "sentry-issue-new", "client_payload": <sentry event> }
```

This fires a GitHub Action every time Sentry creates a new issue.

## Step 2: The GitHub Action

```yaml
# .github/workflows/self-heal.yml
name: Self-heal from Sentry

on:
  repository_dispatch:
    types: [sentry-issue-new]

jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run self-heal agent
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          SENTRY_PAYLOAD: ${{ toJson(github.event.client_payload) }}
        run: |
          echo "$SENTRY_PAYLOAD" > /tmp/sentry.json
          claude -p "Read /tmp/sentry.json — a Sentry issue. Find the root cause in this codebase, write a fix, add a test that would have caught it, run the test suite, and if it passes, open a PR with gh pr create. If you cannot fix it with high confidence, write a comment on a new issue describing what you found."
```

This gives Claude Code the Sentry payload, unrestricted access to the repo, and the test suite as ground truth.

## Step 3: Guardrails

Letting an agent open PRs unsupervised requires guardrails. The ones that matter most:

**1. Never auto-merge agent PRs.** Human eyes on every one. The PR is a draft; the human approves.

**2. Scope which issues trigger the agent.** You do not want the agent reacting to every stack trace. Filter by severity or tag:
- `environment == production`
- `level == error` (not warning)
- Count > 10 (not a one-off fluke)

**3. Budget and timeout.** Claude Code can rack up token cost if it wanders. Set a max turns and a wall-clock timeout in the workflow.

**4. Read-only first.** Before granting write access, run the agent in a dry-run mode that only posts comments. Confirm the analysis is sound before letting it push code.

## What works well

- **Off-by-one errors, null checks, type mismatches** — the agent is good here
- **"Missing field X on object Y"** — usually a tiny fix
- **Regressions in a specific release** — the agent can diff the release and identify the breaking commit

## What does not work well (yet)

- Race conditions
- Complex architectural bugs
- Issues with poor context (no repro, no user data)
- Anything requiring cross-service coordination

For those, the agent should say "I cannot fix this with confidence" and route to a human. That is still useful — the analysis saves the human 30 minutes of orientation.

## The compounding payoff

Day one, the agent fixes 10% of new issues. You review and merge. The rest stay on your queue.

Month three, the agent fixes 40%. The codebase has better tests (the agent adds them) and better error context (the agent asks you to add Sentry tags when it hits one). The team spends more time on hard bugs and new features, less on "oh, another null check".

Year one, the 60% that do not auto-fix are the ones that genuinely need a human. You finally have an on-call experience that does not burn people out.

This is the thesis of the whole course. Monitoring is just plumbing. The payoff is leverage.',
 1);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('19190006-0000-0000-0000-000000000001',
 'Dependabot PR → Agent Review and Merge',
 'dependabot-agent-review',
 'text',
'# Dependabot PR → Agent Review and Merge

Dependabot opens ten PRs a week. Most are safe patch bumps. A few have subtle breaking changes that you only catch by reading the changelog and testing. Asking a human to triage all of them is the reason most teams ignore Dependabot. Let an agent do the reading.

## What the agent actually does

For each new Dependabot PR, Claude Code:

1. Reads the diff
2. Fetches the full changelog for the version range
3. Greps the codebase for usage of the changed package
4. If any API changed, checks whether the callsites need updating
5. Runs the test suite
6. Writes a PR comment summarizing: risk level, what changed, whether tests pass, and a recommendation (auto-merge / needs-review / blocked)
7. Adds a label matching the recommendation

You open Slack in the morning, filter the notifications by label, and see `auto-merge: safe` (merge if not already), `needs-review: 3 PRs` (spend 2 minutes each), `blocked: 1 PR` (actual work).

## The workflow

```yaml
# .github/workflows/dependabot-triage.yml
name: Dependabot agent triage

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  triage:
    if: github.actor == ''dependabot[bot]''
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      issues: write
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}

      - uses: actions/setup-node@v4
        with: { node-version: "22" }

      - run: npm ci

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Agent review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
        run: |
          claude -p "Review PR #$PR_NUMBER. Read the diff with gh pr diff. Identify which package changed and to what version. Fetch the changelog. Grep for usage in the codebase. Run npm test. Post a comment with: risk level (low/medium/high), summary of changes, test result, recommendation (auto-merge / needs-review / blocked). Apply a label matching the recommendation."
```

## The prompt discipline

Prompts for self-healing agents should be specific about the artifact:

- **What to read** (the diff, the changelog, the tests)
- **What to produce** (a comment with a specific structure)
- **What to decide** (a risk level + recommendation)
- **What NOT to do** (don''t merge, don''t push to main)

Vague prompts like "check the PR and fix anything wrong" make the agent wander. Specific prompts with output contracts keep it disciplined.

## Combining agents and human review

Tier the review:

- **Risk: low + tests pass → auto-merge** (via the workflow from Module 5)
- **Risk: medium → human reviews, usually takes 2 minutes because the agent summary is already there**
- **Risk: high or blocked → human digs in**

This is what 40-60% fewer Dependabot hours looks like. The agent does not replace the reviewer; it writes the first pass so the reviewer starts from a summary instead of a raw diff.

## The same pattern for other signals

Once you have this running for Dependabot, the same pattern plugs into:

- **Failing CI runs** — agent investigates, reports whether it is a flake or real
- **New Sentry issues** — covered in the previous lesson
- **Slow requests flagged by Sentry** — agent profiles the slow span, suggests a fix
- **Security alerts from GitHub Advisory Database** — agent identifies vulnerable callsite

The self-healing architecture is not a one-off integration. It is a pattern: any monitoring signal → agent triage → human or machine decision → outcome measured.

## Costs and limits

A Claude Code run reviewing a Dependabot PR costs roughly 10-50 cents depending on codebase size. For 30 PRs a week, that is $10-50/month. Compared to an hour of senior-engineer time, it pays for itself almost immediately.

Keep a hard budget cap per run (via `--max-turns` and a wall-clock timeout). Without it, a runaway agent on a complex codebase can spend $5-10 on a single PR.

## What you should build first

Do not start with the agent. Start with the signal. Make sure Dependabot is running, PRs are green, CI is trustworthy. Then add the agent on top — it amplifies a working system. If the underlying plumbing is broken, the agent just makes the mess faster.',
 2);

-- ============================================================================
-- MODULE 7: Ongoing Discipline
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order") values
('19190007-0000-0000-0000-000000000001',
 (select id from public.courses where slug = 'monitoring-self-healing'),
 'Ongoing Discipline',
 'ongoing-discipline',
 'Monitoring is a system only if you maintain it. The weekly rituals and SLO practices that separate teams who monitor from teams who react.',
 7);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('19190007-0000-0000-0000-000000000001',
 'The Weekly Review Ritual',
 'weekly-review-ritual',
 'text',
'# The Weekly Review Ritual

Monitoring tools decay. Alert rules get stale. Dashboards gather dust. An error that fired 200 times last week and 200 times this week stops feeling urgent — even though it is still hitting 200 users. The weekly review is the ritual that keeps the system honest.

## The 30-minute agenda

Once a week, same day, same time. On-call lead runs it. Everyone who owns a slice of the app attends for the 5 minutes that covers their slice.

**0-5 min — Top issues by impact.** Not frequency — impact. Sort Sentry by "users affected" over the last 7 days. Top 10. For each:
- Is it still open?
- Should it be closed, fixed, or ignored with a reason?

**5-10 min — New regressions.** Issues with "first seen in release X" where X was a release this week. These are things you broke and may not know about. Assign an owner.

**10-15 min — Alert noise audit.** Which alerts fired this week? How many had action taken? If an alert fired 50 times with zero action, it is noise. Delete or demote.

**15-20 min — Dependabot queue.** How many PRs are open and over a week old? Why?

**20-25 min — SLO burn.** (Next lesson covers this.) Are we ahead or behind our error budget?

**25-30 min — Wildcard.** Anything the team noticed — a performance regression, a customer complaint that was not in Sentry, a new type of error.

30 minutes. Same agenda every week. Boring. Necessary.

## Why ritual beats heroics

Most teams do not have a weekly review. They have a "we should fix that" in Slack. Things in Slack die. Things with a standing calendar slot live.

The ritual works because:

1. **It is recurring.** No "we will get to it eventually." Wednesday at 10am, you look at the pile.
2. **It has an agenda.** No freewheeling. Known items, known order.
3. **It produces decisions.** Every issue reviewed gets a status: fix / ignore / close / assign.
4. **It has an owner.** One person runs it. They chase stragglers.

## The "ignored with a reason" discipline

Not every error deserves to be fixed. Some errors are:
- Caused by bots or crawlers
- From legacy code about to be deleted
- Browser quirks in < 1% of users

These should be closed with a reason in the Sentry issue notes. "Closing — known Safari 14 bug, affects 0.3% of users, not worth a polyfill" is better than leaving the issue open forever pretending you will fix it.

Sentry also has a "Resolve → in next release" option. If you believe a fix is shipping soon, resolve it there. If it comes back, Sentry marks it a regression and alerts you.

## Metrics the review should surface

Track these over time (Sentry has these as trend graphs):

- **Total issues open** — should trend flat or down, not up
- **Issues unassigned** — should approach zero
- **Mean time to resolve** — should decrease
- **New issues per release** — a leading indicator of code quality

If "total issues open" has tripled in 3 months, you are accumulating debt faster than you are paying it off. The review is where you catch that.

## What fails without the review

The failure mode is slow and invisible. Errors accumulate. Alerts go stale. New regressions hide in the noise of old regressions. After 6 months, your Sentry dashboard has 1,400 open issues, most are garbage, nobody can tell real signals from noise, and monitoring has become a graveyard.

30 minutes a week keeps that from happening. Do not skip it.',
 1);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('19190007-0000-0000-0000-000000000001',
 'SLOs and Error Budgets',
 'slos-error-budgets',
 'text',
'# SLOs and Error Budgets

SLOs sound like an enterprise concept. They are not. They are the single best tool for telling the difference between "we have a problem" and "things are fine". Every app above hobby-project scale should have at least two.

## Definitions

**SLI (Service Level Indicator)**: a measurable thing. "Percentage of requests that return 2xx." "P95 response time."

**SLO (Service Level Objective)**: a target for the SLI. "99.9% of requests return 2xx over a 30-day window."

**Error budget**: the allowed violations. At 99.9% SLO, you can break on 0.1% of requests in the window. For 1M requests, that is 1,000 errors worth of budget.

## The power of the error budget

Without an error budget, every error feels urgent. With one, you know how urgent.

Scenario: Sentry alerts you to 200 errors in the last hour.

Without SLO: "200 errors! Emergency!"
With SLO: "200 errors out of 50,000 requests this hour = 0.4%. Budget is 0.1%. We are burning budget 4x faster than normal. This is an incident."

Or:

Without SLO: "200 errors! Emergency!"
With SLO: "200 errors out of 2M requests = 0.01%. Way under budget. Not an incident."

Same event, different meaning depending on traffic.

## A starter SLO set

Two SLOs cover most apps:

**1. Availability.** "99.9% of requests to /api/* return a 2xx or expected 4xx over 30 days." (A 400 to a bad input is not a violation.)

**2. Latency.** "95% of requests to /api/checkout complete in < 500ms over 30 days."

Pick those as your floors, write them down. Review them monthly — are they too loose, too strict?

## How to track

Sentry has built-in SLO tracking (in the Performance section). You define the SLO, Sentry computes the burn rate. Dashboards, alerts, the works.

If you are not using Sentry for SLOs, you can compute them from logs or metrics. The math is simple:

```
error_budget = (1 - SLO) * total_requests_in_window
errors_actual = count of errors in window
budget_remaining = error_budget - errors_actual
burn_rate = errors_actual / (elapsed_time / window_length * error_budget)
```

A burn rate of 1.0 means you are exactly on pace to exhaust the budget in the window. Above 1.0, you will blow it. Above 10, you are on fire.

## What SLOs change about your behavior

**Before SLOs**: every alert is a priority. Team is in a constant firefight. The loudest bug gets attention, not the most impactful.

**After SLOs**: alerts are triaged against the budget. A loud bug with low user impact can wait. A quiet bug eating 0.05% of requests on your revenue-critical endpoint is urgent even though nobody has noticed yet.

You also get a natural answer to "should we ship this risky feature?". If budget is healthy, you have margin to experiment. If budget is 80% burned, freeze risky changes until it recovers.

## Error budgets as a release gate

The best teams use error budget as a gate on deploys:

- Budget > 50% remaining: ship freely
- 10-50% remaining: ship with review
- < 10% remaining: freeze, fix reliability first

This is not about shipping less. It is about shipping smart — you do not stack risk on top of an already-unstable system.

## The orchestrator angle

If you are running self-healing agents (Module 6), budget is how they know when to be conservative:

- High budget = agent merges low-risk fixes aggressively
- Low budget = agent blocks anything that is not strictly necessary

The same signal that tells a human to slow down tells the agent to slow down. Consistent system, consistent behavior.

## The end of the course

You now have a monitoring stack that: catches errors with Sentry, tracks performance, alerts on what matters, patches dependencies with Dependabot, automates triage and sometimes fixes with Claude Code, reviews itself weekly, and measures itself against SLOs.

The rest of the work is just practice. Keep the review, tune the alerts, update the budgets as the product grows. The compounding benefit of monitoring is that every month, your system knows a little more about itself — and the humans have a little more time to build new things.',
 2);

-- ============================================================================
-- MODULE QUIZZES — 7 modules × 3 questions each
-- ============================================================================

insert into public.module_quizzes (module_id, questions, xp_reward) values
('19190001-0000-0000-0000-000000000001', '[
  {"id": "q1", "question": "What is the biggest hidden cost of a silent failure?", "options": ["Storage costs for extra logs", "Users who hit the error, close the tab, and never come back", "Slower deploys while you investigate", "The engineer who has to read the stack trace"], "correct": 1},
  {"id": "q2", "question": "Where should you start when bootstrapping monitoring on a small-to-midsize app?", "options": ["Centralized logs pipeline", "Error capture (top of the pyramid)", "Custom Grafana dashboards", "Synthetic uptime monitoring"], "correct": 1},
  {"id": "q3", "question": "An alert that fires 50 times a week with no one taking action is:", "options": ["A good sign of thorough coverage", "Noise that should be deleted or demoted to a digest", "Evidence that you need more engineers", "Proof that monitoring is working"], "correct": 1}
]'::jsonb, 25);

insert into public.module_quizzes (module_id, questions, xp_reward) values
('19190002-0000-0000-0000-000000000001', '[
  {"id": "q1", "question": "By default, Sentry captures which kind of errors?", "options": ["Every error, including caught ones in try/catch", "Only unhandled errors; caught errors are silent unless you call captureException", "Only server-side errors", "Only errors that happen during build"], "correct": 1},
  {"id": "q2", "question": "Why do source maps matter in production?", "options": ["They make the app run faster", "They translate minified stack traces back to your original filenames and line numbers", "They are required for Sentry to work at all", "They reduce bundle size"], "correct": 1},
  {"id": "q3", "question": "What problem does tagging every error with the release SHA solve?", "options": ["Makes the Sentry UI prettier", "Lets you see which release introduced a regression and which release resolved it", "Reduces storage costs", "Speeds up stack trace capture"], "correct": 1}
]'::jsonb, 25);

insert into public.module_quizzes (module_id, questions, xp_reward) values
('19190003-0000-0000-0000-000000000001', '[
  {"id": "q1", "question": "What is a span inside a Sentry trace?", "options": ["A single line of log output", "A unit of work — an HTTP handler, DB query, or API call — with a start and end time", "A full user session", "A group of errors that share a stack trace"], "correct": 1},
  {"id": "q2", "question": "Why would you set tracesSampleRate below 1.0 in production?", "options": ["Because full tracing every request is expensive and noisy at scale", "Because Sentry charges per trace regardless of volume", "To avoid capturing errors", "To make the SDK load faster"], "correct": 1},
  {"id": "q3", "question": "The 10-second debug rule says:", "options": ["Every Sentry issue should be fixed within 10 seconds", "An engineer opening a Sentry issue should know why it broke within 10 seconds — if not, context is missing", "Errors should be captured within 10 seconds of occurring", "Alerts should page on-call within 10 seconds"], "correct": 1}
]'::jsonb, 25);

insert into public.module_quizzes (module_id, questions, xp_reward) values
('19190004-0000-0000-0000-000000000001', '[
  {"id": "q1", "question": "What is the litmus test for whether something deserves a real-time alert?", "options": ["Whether it happens more than once", "Whether, if it fires at 3am, there is an action you would take", "Whether Sentry recommends it", "Whether the team has discussed it in standup"], "correct": 1},
  {"id": "q2", "question": "Why should Sentry ownership rules live in the repo, not just in the UI?", "options": ["Because the UI is slow", "So ownership can be reviewed in a PR and cannot drift when code moves", "To avoid Sentry storage costs", "Sentry does not support UI-based ownership"], "correct": 1},
  {"id": "q3", "question": "What is the role of an escalation policy?", "options": ["To increase Sentry''s billing tier", "To define what happens when the primary on-call does not acknowledge an alert", "To determine which issues deserve alerts", "To assign ownership based on file path"], "correct": 1}
]'::jsonb, 25);

insert into public.module_quizzes (module_id, questions, xp_reward) values
('19190005-0000-0000-0000-000000000001', '[
  {"id": "q1", "question": "What class of problem does Dependabot primarily solve?", "options": ["Runtime errors in your own code", "Known security vulnerabilities and outdated versions in packages you depend on", "Slow deploys", "Missing unit tests"], "correct": 1},
  {"id": "q2", "question": "Why group Dependabot minor and patch updates in dependabot.yml?", "options": ["It is required by GitHub", "To avoid 30 PRs on Monday morning that get ignored — one grouped PR per category is reviewable", "Grouping is faster for Dependabot to run", "It reduces Sentry alerts"], "correct": 1},
  {"id": "q3", "question": "What is the single most important prerequisite for safe auto-merge of Dependabot PRs?", "options": ["A large team", "A CI suite you trust to catch regressions", "A paid GitHub plan", "A separate staging environment"], "correct": 1}
]'::jsonb, 25);

insert into public.module_quizzes (module_id, questions, xp_reward) values
('19190006-0000-0000-0000-000000000001', '[
  {"id": "q1", "question": "What is the minimum set of guardrails for a Sentry → Claude Code self-healing loop?", "options": ["None — the agent figures it out", "Never auto-merge agent PRs, scope which issues trigger the agent, set a token and wall-clock budget, start read-only", "Only run during business hours", "Require three human reviewers"], "correct": 1},
  {"id": "q2", "question": "Which types of bugs are self-healing agents best at fixing today?", "options": ["Cross-service race conditions", "Off-by-one errors, null checks, type mismatches, regressions in a specific release", "Architectural redesigns", "Performance tuning for databases"], "correct": 1},
  {"id": "q3", "question": "Why does a specific prompt with an output contract beat a vague one like ''fix the bug''?", "options": ["The specific prompt is shorter", "It keeps the agent disciplined — reads the right artifacts, produces a structured result, and avoids wandering", "Anthropic charges less for specific prompts", "Vague prompts do not work with Claude Code"], "correct": 1}
]'::jsonb, 25);

insert into public.module_quizzes (module_id, questions, xp_reward) values
('19190007-0000-0000-0000-000000000001', '[
  {"id": "q1", "question": "What keeps a weekly monitoring review effective?", "options": ["Ad-hoc discussion when someone notices a problem", "A recurring slot with a fixed agenda that produces decisions", "Writing a post-mortem after every incident", "Rotating who attends each week"], "correct": 1},
  {"id": "q2", "question": "What does an error budget tell you that raw error count cannot?", "options": ["How many users signed up", "Whether the error volume is normal for current traffic, and how fast you are consuming the allowed failure rate", "Which release introduced the error", "Which engineer wrote the code"], "correct": 1},
  {"id": "q3", "question": "How should the error budget affect release behavior?", "options": ["Ignore it — ship as fast as possible always", "Use it as a release gate: high budget → ship freely, low budget → freeze risky changes until reliability recovers", "Only look at it during outages", "Report it to the CFO monthly"], "correct": 1}
]'::jsonb, 25);
