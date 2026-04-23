// Rewrite the routines-vs-n8n-vs-make blog post in the HTML format
// used by recent posts (openclaw, anthropic-orchestration-core). Updates in place.
import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const slug = "claude-routines-vs-n8n-vs-make";

// Placeholder iframe URL — swap in real YouTube ID once the video is published.
const content = `<iframe width="100%" height="400" src="https://www.youtube.com/embed/TBD" frameborder="0" allowfullscreen></iframe>

<h2>What Happened</h2>

<p>Anthropic shipped <strong>Claude Routines</strong> — saved Claude Code configurations that run on a schedule, on an API call, or when a GitHub event fires. Anthropic infrastructure runs the job; your laptop does not have to be online.</p>

<p>If you already use <strong>n8n</strong> or <strong>Make.com</strong> for automation, the obvious question is which one you use now. The short answer: three different problems.</p>

<h2>The Headline Difference: Natural Language vs Knobs</h2>

<p>With Claude Routines, you describe what you want in plain English:</p>

<p><em>"Every morning at 7am, read the main branch of this repo, check if any dependencies have known CVEs, and if so, open a PR that bumps them safely and runs the tests."</em></p>

<p>That sentence is the configuration. You save it, Anthropic runs it.</p>

<p>With n8n or Make, the same job is a wiring exercise:</p>

<ul>
<li><strong>Auth:</strong> OAuth into GitHub, configure scopes, store the token</li>
<li><strong>Connectors:</strong> add a GitHub node for "list dependencies", another for "create PR", another to trigger workflows</li>
<li><strong>Field mapping:</strong> connect step 1's output to step 2's input, JSON-stringify here, base64 there</li>
<li><strong>Branching:</strong> add an If node for "any CVEs?" — true and false paths</li>
<li><strong>Error handling:</strong> error branches, retries, the Slack node that fires on failure</li>
<li><strong>Scheduling:</strong> set the cron expression</li>
</ul>

<p>Nothing is hard. Collectively, it's an hour of setup before the flow does anything useful.</p>

<h2>Where Claude Routines Wins</h2>

<ul>
<li><strong>Automated code review.</strong> Trigger on every PR. Claude reads the diff, the surrounding code, and the tests, then comments with specific issues.</li>
<li><strong>Release verification.</strong> Trigger on deploy. Claude hits the production URL, runs a smoke test, opens an issue if anything looks off.</li>
<li><strong>Alert triage.</strong> Sentry webhook → Routine reads the stack trace, checks git history, posts a root-cause summary.</li>
<li><strong>Dependency maintenance.</strong> Weekly schedule. Claude checks the lockfile, runs tests against bumped versions, opens a safe-upgrade PR.</li>
</ul>

<p>In every case the signal is: <em>something happened to a repo, do a thing with the repo</em>. Routines are the shortest path.</p>

<h2>Where n8n Wins</h2>

<ul>
<li><strong>Self-hosted, unlimited runs.</strong> Automation living entirely inside your infrastructure with no per-operation metering.</li>
<li><strong>Complex branching and custom code.</strong> First-class code nodes (JavaScript or Python) inside a visual flow.</li>
<li><strong>Engineer ownership.</strong> The mental model maps to how engineers already think about pipelines.</li>
<li><strong>Workflows the business depends on long-term.</strong> You own the data, uptime, and upgrade path.</li>
</ul>

<h2>Where Make.com Wins</h2>

<ul>
<li><strong>Fastest setup.</strong> The friendliest onboarding of the three. A sales ops person or marketer can own a flow end-to-end.</li>
<li><strong>Breadth of connectors.</strong> 1,500+ apps, catalog skews toward marketing, ecommerce, and CRM tools.</li>
<li><strong>Marketing and ecommerce workflows.</strong> Lead capture → CRM enrich → email sequence → Slack alert. Make's sweet spot.</li>
<li><strong>No infrastructure to maintain.</strong> Fully hosted. You pay per operation and Make handles everything else.</li>
</ul>

<h2>Use All Three Together</h2>

<p>The real answer for most teams at scale is <strong>all three, with different jobs</strong>.</p>

<ul>
<li><strong>n8n or Make</strong> is the durable surface that listens to the world — webhooks, schedules, SaaS triggers — and glues systems together. Pick n8n if you want self-host plus power. Pick Make if you want fastest setup plus broadest connectors.</li>
<li><strong>Claude Routines</strong> lives inside the engineering-minded steps (PR reviewer, release checker, dependency bumper) and inside the "needs reasoning" nodes of your visual flows.</li>
</ul>

<p>A concrete hybrid: Make receives a Shopify order webhook → calls a Claude Routine via API to analyze the order against fraud heuristics in your codebase → writes the verdict back to Make, which routes the order to fulfillment or review.</p>

<h2>The Decision Rule</h2>

<p>When you need to automate something, ask in order:</p>

<ul>
<li><strong>Is this primarily reading or writing a codebase?</strong> Claude Routines.</li>
<li><strong>Do engineers own this, and do you need self-host or complex branching?</strong> n8n.</li>
<li><strong>Does a non-engineer own this, and is it primarily SaaS glue?</strong> Make.com.</li>
<li><strong>Does it need reasoning somewhere in the middle?</strong> Claude Routine as a step inside the n8n or Make flow.</li>
</ul>

<h2>What This Means for You</h2>

<p>The overlap between these tools is smaller than it first looks — they're complementary, not competing. The orchestrator's job is knowing which interface fits which work, and wiring them together where reasoning matters.</p>

<p><a href="/courses/claude-code-superpowers">Claude Code Superpowers</a> and <a href="/courses/monitoring-self-healing">Application Monitoring &amp; Self-Healing</a> both walk through this pattern end-to-end.</p>`;

async function run() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data, error } = await sb
    .from("blog_posts")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select("slug")
    .single();

  if (error) throw error;
  console.log("updated:", "http://localhost:3001/blog/" + data.slug);
  console.log("prod:", "https://www.orchestratoracademy.com/blog/" + data.slug);
}

run().catch((e) => { console.error(e); process.exit(1); });
