// Publish the "All courses are now free" announcement to the Announcements forum category.
// Run: npx tsx video-pipeline/scripts/publish-courses-free-announcement.ts
import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const ADMIN = "386c403d-cf7e-4e99-8b91-56da3d72a860";
const ANNOUNCEMENTS_CATEGORY_ID = "771a903d-9f65-4aeb-acb2-7b9309469513";

const title = "All courses are now free";

const body = `All courses on the Academy are now free. No paywall, no trial, no credit card.

If you find value here, please [buy us a coffee](https://buymeacoffee.com/orchestratoracademy) — every tip keeps the next course moving.

Need hands-on help with your project? You can [book a 1:1 session](/book) with one of our coaches — one hour, $220, focused on your specific challenge. You leave with an actionable plan.

**Interested in becoming a coach yourself?** Complete the course certifications first, and we'll have an application open for you.`;

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
