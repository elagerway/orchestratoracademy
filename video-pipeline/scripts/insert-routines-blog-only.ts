// One-off: insert just the "Claude Routines vs n8n vs Make" blog post
// (skipping the forum announcement, which is in publish-routines-vs-n8n.ts).
// Run: npx tsx video-pipeline/scripts/insert-routines-blog-only.ts
import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const ADMIN = "386c403d-cf7e-4e99-8b91-56da3d72a860";

const blogTitle = "Claude Routines vs n8n vs Make.com: when to reach for which";
const blogSlug = "claude-routines-vs-n8n-vs-make";
const blogExcerpt = "Three automation platforms, three different jobs. Here's when Claude Routines, n8n, and Make.com each earn their place — and when to use them together.";
const blogContent = `# Claude Routines vs n8n vs Make.com: when to reach for which

Anthropic recently launched **Claude Routines** — saved Claude Code configurations that run automatically on a schedule, on an API call, or when a GitHub event fires. They run on Anthropic infrastructure, so your laptop does not have to be online.

If you already use **n8n** or **Make.com** for workflow automation, the obvious question is: which one do I use now?

Short answer: **three different problems**. Longer answer below.

## The headline difference: natural language vs knobs

Before the features, start with how each one feels to build in.

With **Claude Routines**, you describe what you want in plain English. "Every morning at 7 a.m., read the main branch of this repo, check if any dependencies have known CVEs, and if so, open a PR that bumps them safely and runs the tests." That sentence is the configuration. You save it, Anthropic runs it.

With **n8n** or **Make**, the same job is an exercise in knobs:

- Auth: OAuth into GitHub, configure scopes, store the token
- Connectors: add a GitHub node for "list dependencies", another for "create PR", another for "trigger workflow"
- Field mapping: connect the output of step 1 to the input of step 2, remember to JSON-stringify here and base64-encode there
- Branching: add an If node for "any CVEs?" — true path and false path
- Error handling: add error branches, set retries, configure the Slack node that fires on failure
- Scheduling: set the cron expression

Nothing in that list is hard. Collectively, it is an hour of wiring before the flow does anything useful. And every new integration adds more of the same.

That is the first thing to notice about Routines: **the configuration is a sentence, not a diagram**. For engineering-minded work against a codebase, that is a different category of product — not just a cheaper n8n with a brain bolted on.

n8n and Make still win where the work is fundamentally "talk to this SaaS API with these credentials". A prompt cannot wire OAuth into Shopify; you need a connector for that. But within the category of codebase automations, the interface gap matters more than any feature list.

## What each one actually is

**Claude Routines** is repository-centric and natural-language-first. You save a Claude Code configuration — a prompt, one or more repos, and any connectors you need — and schedule it. Anthropic runs it. It has full access to Claude's reasoning, tool use, and codebase understanding. Its natural unit of work is "do a thing with a codebase", described in English.

**n8n** is connector-centric and engineer-friendly. You build a visual workflow of nodes — HTTP requests, database queries, Slack messages, transforms, code nodes when you need them — and trigger it by cron, webhook, or app event. 400+ integrations, self-hostable or cloud. Every integration requires its own API credentials, scopes, and field mapping. Its natural unit of work is "move data and actions between systems, with code when you need it".

**Make.com** (formerly Integromat) is also connector-centric but leans further toward non-technical users. A visual scenario builder with one of the broadest connector libraries out there (1,500+ apps), strong on ecommerce and marketing use cases. Cloud-only, priced per operation. Like n8n, every connector needs its API key or OAuth token and a field-mapping step. Its natural unit of work is "wire apps together without writing code".

## Side by side

| Dimension | Claude Routines | n8n | Make.com |
|---|---|---|---|
| **How you configure it** | Natural language prompt | Visual nodes + API credentials + field mapping | Visual scenario + API credentials + field mapping |
| Core unit | Saved Claude Code config (prompt + repos + connectors) | Visual workflow with code nodes | Visual scenario |
| Triggers | Schedule, API, GitHub events | Schedule, webhook, 400+ app triggers | Schedule, webhook, 1,500+ app triggers |
| Where it runs | Anthropic infrastructure | Self-hosted or n8n Cloud | Make Cloud only |
| Reasoning | Claude baked in | Bring your own LLM node | Bring your own LLM node |
| Integrations | GitHub-native, codebase-first | 400+ SaaS connectors (each needs its own auth + mapping) | 1,500+ SaaS connectors (each needs its own auth + mapping) |
| Best at | Code review, release checks, alert triage, repo maintenance | Cross-SaaS glue with complex branching, self-hosted control | Fast SaaS automation, marketing/ecommerce flows, non-technical owners |
| Worst at | Generic SaaS orchestration | Simplest ownership-by-marketing flows | Power-user branching / custom code |
| Pricing | Bundled with Claude Code subscription | Free OSS (self-host) or tiered cloud | Per-operation pricing, free tier, tiered paid |
| Learning curve | Write a good prompt | Technical but visual; credentials per integration | Friendliest visual UX; credentials per integration |
| Availability | Research preview; rate-limited per plan | GA, unlimited self-host | GA |

## Where Claude Routines wins

**1. Automated code review.** Trigger on every PR. Claude reads the diff, the surrounding code, and the relevant tests, then comments with specific issues. This is hard to do well in either n8n or Make — you would end up with an HTTP node to the Anthropic API plus a lot of plumbing to fetch diffs and post comments. In Routines, this plumbing is already there.

**2. Release verification.** Trigger on deploy. Claude hits the production URL, runs a smoke-test script, compares output against expected, opens an issue if anything looks off.

**3. Alert triage.** Sentry webhook → Routine reads the stack trace, finds the file, checks recent git history, posts a PR comment or Slack summary with root cause.

**4. Dependency maintenance.** Weekly schedule. Claude reads the lockfile, checks changelogs, runs tests against bumped versions, opens a PR with the safe upgrades.

In every case, the signal is "something happened to a repo, do a thing with the repo". Routines are the shortest path.

## Where n8n wins

**1. Self-hosted, unlimited runs.** If you want automation that lives entirely inside your infrastructure, can run thousands of times a day, and is not metered per-operation, n8n self-hosted is unbeatable.

**2. Complex branching and custom code.** n8n has first-class support for code nodes (JavaScript or Python) inside a visual flow. You can drop into real code when the visual abstraction is not flexible enough, then pop back out. Make's scripting is more constrained.

**3. Engineer ownership.** If the team owning the automation is engineers, n8n's mental model maps closely to how they already think about pipelines — nodes, transforms, explicit error handling.

**4. Workflows the business depends on long-term.** Self-hosted n8n on your own infrastructure is durable in a way that vendor-hosted tools never quite are. You own the data, the uptime, and the upgrade path.

## Where Make.com wins

**1. Speed to first working automation.** Make has the friendliest onboarding of the three. If you need a sales ops person, marketer, or customer success lead to own a flow end-to-end, they will be productive in Make faster than in n8n.

**2. Breadth of connectors.** 1,500+ apps, and the catalog skews toward marketing, ecommerce, and CRM tools that n8n sometimes does not cover natively (or covers more roughly).

**3. Marketing and ecommerce workflows.** Lead capture → CRM enrich → email sequence → Slack alert to sales. This is Make's sweet spot. The UI is built for people who think in "when this happens, do that".

**4. No infrastructure to maintain.** Fully hosted. You pay per operation, and Make handles everything else. For small teams without an ops function, this removes a category of problem.

## Use all three

The real answer for most teams at scale is: **all three, with different jobs.**

- **n8n or Make** is the durable surface that listens to the world (webhooks, schedules, SaaS triggers) and glues systems together. Pick n8n if you want self-host + power, pick Make if you want fastest setup + broadest connectors.
- **Claude Routines** live inside the engineering-minded steps — a PR reviewer, a release checker, a dependency bumper — and inside the "needs reasoning" nodes of your visual flows.

A concrete hybrid: Make receives a Shopify order webhook → runs a Claude Routine via API to analyze the order against fraud heuristics in your codebase → writes the verdict back to Make, which routes the order to fulfillment or review.

You get Make's SaaS breadth, n8n's engineering muscle where you need it, and Claude's reasoning depth — all in the same pipeline.

## Decision rule

When you need to automate something, ask in order:

1. **Is this work primarily reading/writing a codebase?** Claude Routines.
2. **Do engineers own this, and do we need self-host or complex branching?** n8n.
3. **Does a non-engineer own this, and is it primarily SaaS glue?** Make.com.
4. **Does it need reasoning somewhere in the middle?** Claude Routines as a step inside the n8n or Make flow.

The overlap between them is smaller than it first looks. They are complementary, not competing.

## Resources

- Claude Routines docs: [code.claude.com/docs/en/routines](https://code.claude.com/docs/en/routines)
- Claude Routines announcement: [claude.com/blog/introducing-routines-in-claude-code](https://claude.com/blog/introducing-routines-in-claude-code)
- n8n: [n8n.io](https://n8n.io)
- Make.com: [make.com](https://make.com)

Orchestrating these platforms together is exactly the kind of thing our [Claude Code Superpowers](/courses/claude-code-superpowers) and [Application Monitoring](/courses/monitoring-self-healing) courses cover. Work through them to see this pattern applied end-to-end.`;

async function run() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data: b, error: be } = await sb.from("blog_posts").insert({
    title: blogTitle,
    slug: blogSlug,
    excerpt: blogExcerpt,
    content: blogContent,
    meta_description: "When to use Claude Routines, n8n, or Make.com for workflow automation — and when to combine them.",
    tags: ["claude-code", "n8n", "make", "automation", "workflows", "comparison"],
    author_name: "Orchestrator Academy",
    author_id: ADMIN,
    status: "published",
    published: true,
    published_at: new Date().toISOString(),
  }).select("slug").single();
  if (be) throw be;
  console.log("blog:", "http://localhost:3001/blog/" + b.slug);
}

run().catch((e) => { console.error(e); process.exit(1); });
