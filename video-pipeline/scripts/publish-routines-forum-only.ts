// Publish just the forum Announcement for the Claude Routines vs n8n vs Make blog post.
// Blog was already inserted; this is the companion announcement.
// Run: npx tsx video-pipeline/scripts/publish-routines-forum-only.ts
import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const ADMIN = "386c403d-cf7e-4e99-8b91-56da3d72a860";
const ANNOUNCEMENTS_CATEGORY_ID = "771a903d-9f65-4aeb-acb2-7b9309469513";

const title = "Claude Routines vs n8n vs Make — when to reach for which";
const body = `Anthropic shipped **Claude Routines** — saved Claude Code configurations that run on a schedule, on API call, or on GitHub events. It is Anthropic infrastructure running the job, not your laptop.

That sounds a lot like n8n or Make. It is not quite the same thing.

**The headline difference:** you describe what you want a Claude Routine to do in **plain English**. With n8n and Make, you wire up API credentials, pick OAuth scopes, configure connector nodes, map fields, set up error branches — a tall stack of knobs before the first run.

**Claude Routines wins for:**
- Code review, release verification, alert triage
- Anything where the work is reading/writing a repo
- Reasoning-heavy steps that would need an LLM node in n8n or Make anyway
- **You can say what you want in natural language instead of building it out of nodes**

**n8n wins for:**
- Self-hosted cross-SaaS glue
- Complex branching, retries, and stateful flows
- Engineers who want code nodes inside the visual flow

**Make.com wins for:**
- Fastest setup with the broadest connector library (1,500+)
- Non-technical users — the visual UX is the friendliest
- Marketing and ecommerce automations

The real pattern: pick the integration surface that fits your team (n8n if you want self-host + power, Make if you want the easiest broad connector set), and embed Claude Routines as the brain step where reasoning matters.

Full breakdown with the decision tree + video: [Claude Routines vs n8n vs Make.com](/blog/claude-routines-vs-n8n-vs-make).`;

async function run() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data, error } = await sb.from("forum_posts").insert({
    category_id: ANNOUNCEMENTS_CATEGORY_ID,
    user_id: ADMIN,
    title,
    body,
  }).select("id").single();

  if (error) throw error;
  console.log("forum:", "https://www.orchestratoracademy.com/dashboard/support?post=" + data.id);
}

run().catch((e) => { console.error(e); process.exit(1); });
