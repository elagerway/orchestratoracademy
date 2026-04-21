import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const OUTPUT = path.resolve(__dirname, "../output");

const FILES = [
  "context7-real-time-docs.mp4",
  "chrome-devtools-mcp.mp4",
  "openspec-spec-first.mp4",
  "superpowers-workflow.mp4",
  "subagent-driven-dev.mp4",
  "full-stack-superpowers.mp4",
  "skills-reference.mp4",
];

async function run() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  for (const f of FILES) {
    const local = path.join(OUTPUT, f);
    if (!fs.existsSync(local)) throw new Error(`Missing: ${local}`);
    const storagePath = `superpowers-videos/${f}`;
    console.log(`Uploading ${f} (${(fs.statSync(local).size / 1048576).toFixed(1)} MB) -> assets/${storagePath}`);
    const { error } = await sb.storage.from("assets").upload(storagePath, fs.readFileSync(local), {
      contentType: "video/mp4",
      upsert: true,
    });
    if (error) throw new Error(`upload ${f}: ${error.message}`);
    const { data: { publicUrl } } = sb.storage.from("assets").getPublicUrl(storagePath);
    console.log(`  -> ${publicUrl}`);
  }
  console.log("\n=== All 7 files uploaded to assets bucket ===");
}

run().catch((e) => { console.error(e); process.exit(1); });
