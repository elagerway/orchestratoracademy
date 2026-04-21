import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const VIMEO_TOKEN = process.env.VIMEO_ACCESS_TOKEN!;
const VIMEO_OA_PROJECT = "/users/234512081/projects/28795456";
const OUTPUT = path.resolve(__dirname, "../output");

// moduleSlug → target L1 lesson slug (video is attached to L1 only; L2 stays text)
// Uses Vimeo tus upload (pull approach requires PRO+ plan)
const MODULES: { moduleSlug: string; videoFile: string; title: string; l1Slug: string }[] = [
  // M1 already done: Vimeo 1184989138
  { moduleSlug: "context7-real-time-docs", videoFile: "context7-real-time-docs.mp4", title: "M2 Context7 — Real-time Docs", l1Slug: "context7-setup-first-query" },
  { moduleSlug: "chrome-devtools-mcp", videoFile: "chrome-devtools-mcp.mp4", title: "M3 Chrome DevTools MCP", l1Slug: "chrome-devtools-setup-basics" },
  { moduleSlug: "openspec-spec-first", videoFile: "openspec-spec-first.mp4", title: "M4 OpenSpec — Spec-First", l1Slug: "openspec-propose-design-plan" },
  { moduleSlug: "superpowers-workflow", videoFile: "superpowers-workflow.mp4", title: "M5 Superpowers Workflow", l1Slug: "superpowers-brainstorm-plan" },
  { moduleSlug: "subagent-driven-dev", videoFile: "subagent-driven-dev.mp4", title: "M6 Subagent-Driven Dev", l1Slug: "tdd-with-ai-agents" },
  { moduleSlug: "full-stack-superpowers", videoFile: "full-stack-superpowers.mp4", title: "M7 Full Stack Superpowers", l1Slug: "full-stack-project" },
  { moduleSlug: "skills-reference", videoFile: "skills-reference.mp4", title: "M8 Skills Reference", l1Slug: "skills-ref-superpowers-openspec" },
];

function supabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

async function vimeo<T = any>(urlPath: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`https://api.vimeo.com${urlPath}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${VIMEO_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.vimeo.*+json;version=3.4",
      ...(init.headers as Record<string, string> | undefined),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Vimeo ${res.status} ${urlPath}: ${text}`);
  return text ? JSON.parse(text) : ({} as T);
}

async function tusGetOffset(uploadLink: string): Promise<number> {
  const res = await fetch(uploadLink, {
    method: "HEAD",
    headers: { "Tus-Resumable": "1.0.0" },
  });
  if (!res.ok) throw new Error(`tus HEAD ${res.status}`);
  return parseInt(res.headers.get("upload-offset") || "0", 10);
}

async function tusUpload(uploadLink: string, filePath: string) {
  const size = fs.statSync(filePath).size;
  const CHUNK = 4 * 1024 * 1024;
  const MAX_RETRIES = 5;
  const fd = fs.openSync(filePath, "r");
  try {
    let offset = await tusGetOffset(uploadLink);
    while (offset < size) {
      const len = Math.min(CHUNK, size - offset);
      const buf = Buffer.alloc(len);
      fs.readSync(fd, buf, 0, len, offset);

      let attempt = 0;
      let success = false;
      while (attempt < MAX_RETRIES && !success) {
        attempt++;
        try {
          const res = await fetch(uploadLink, {
            method: "PATCH",
            headers: {
              "Tus-Resumable": "1.0.0",
              "Upload-Offset": String(offset),
              "Content-Type": "application/offset+octet-stream",
            },
            body: buf,
          });
          if (!res.ok) throw new Error(`PATCH ${res.status}: ${(await res.text()).slice(0, 200)}`);
          const serverOffset = parseInt(res.headers.get("upload-offset") || "-1", 10);
          if (serverOffset !== offset + len) {
            throw new Error(`offset mismatch: client=${offset + len}, server=${serverOffset}`);
          }
          offset = serverOffset;
          success = true;
        } catch (e: any) {
          if (attempt >= MAX_RETRIES) throw e;
          const backoff = Math.min(2000 * attempt, 15000);
          console.log(`\n    tus retry ${attempt}/${MAX_RETRIES} after ${backoff}ms: ${e.message}`);
          await new Promise((r) => setTimeout(r, backoff));
          // Re-sync offset from server; if it advanced, break out so outer loop re-reads buf at new offset
          try {
            const serverOffset = await tusGetOffset(uploadLink);
            if (serverOffset !== offset) {
              offset = serverOffset;
              break; // stale buf for new offset — outer loop will re-read from file
            }
          } catch {}
        }
      }
      process.stdout.write(`    tus: ${Math.round((offset / size) * 100)}%\r`);
    }
    process.stdout.write("    tus: 100% done\n");
    // Final verification
    const finalOffset = await tusGetOffset(uploadLink);
    if (finalOffset !== size) {
      throw new Error(`tus final offset ${finalOffset} != file size ${size}`);
    }
  } finally {
    fs.closeSync(fd);
  }
}

async function waitForTranscode(videoId: string) {
  const deadline = Date.now() + 20 * 60_000;
  while (Date.now() < deadline) {
    const v = await vimeo<any>(`/videos/${videoId}`);
    const ts = v.transcode?.status;
    console.log(`    transcode: ${ts}`);
    if (ts === "complete") return;
    if (ts === "error") throw new Error("Vimeo transcode error");
    await new Promise((r) => setTimeout(r, 15_000));
  }
  throw new Error("Vimeo transcode timeout");
}

async function runOne(M: typeof MODULES[number]) {
  const filePath = path.join(OUTPUT, M.videoFile);
  if (!fs.existsSync(filePath)) throw new Error(`Missing: ${filePath}`);
  const size = fs.statSync(filePath).size;
  console.log(`\n=== ${M.title} (${(size / 1048576).toFixed(1)} MB) ===`);

    // 1. Create with tus approach
    const created = await vimeo<any>("/me/videos", {
      method: "POST",
      body: JSON.stringify({
        upload: { approach: "tus", size },
        name: M.title,
        privacy: { view: "disable", embed: "whitelist" },
      }),
    });
    const videoId = created.uri.split("/").pop() as string;
    console.log(`  [1] created: ${videoId}`);

    // 2. tus upload with retries + verification
    await tusUpload(created.upload.upload_link, filePath);
    console.log(`  [2] uploaded`);

    // 3. Wait for transcode
    await waitForTranscode(videoId);
    console.log(`  [3] transcoded`);

    // 4. Embed settings
    await vimeo(`/videos/${videoId}`, {
      method: "PATCH",
      body: JSON.stringify({
        privacy: { view: "disable", embed: "whitelist" },
        embed: {
          title: { name: "hide", owner: "hide", portrait: "hide" },
          logos: { vimeo: false },
          buttons: { like: false, watchlater: false, share: false, embed: false, fullscreen: true, hd: false, scaling: false },
        },
      }),
    });
    console.log(`  [4] embed set`);

    // 5. Whitelist
    for (const d of ["orchestratoracademy.com", "www.orchestratoracademy.com", "localhost"]) {
      try {
        await vimeo(`/videos/${videoId}/privacy/domains/${d}`, { method: "PUT" });
      } catch (e: any) {
        console.log(`    warn: ${d} — ${e.message}`);
      }
    }

    // 6. OA folder
    await vimeo(`${VIMEO_OA_PROJECT}/videos/${videoId}`, { method: "PUT" });
    console.log(`  [6] folder'd`);

    // 7. DB update: set content_type='video' + video_url on L1
    const sb = supabase();
    const newUrl = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0`;
    const { data, error } = await sb
      .from("lessons")
      .update({ video_url: newUrl, content_type: "video" })
      .eq("slug", M.l1Slug)
      .select("id,slug,video_url,content_type")
      .single();
    if (error) throw new Error(`DB update for ${M.l1Slug}: ${error.message}`);
    console.log(`  [7] ${data.slug} → ${newUrl}`);
}

async function run() {
  const failures: { title: string; error: string }[] = [];
  for (const M of MODULES) {
    try {
      await runOne(M);
    } catch (e: any) {
      console.error(`  ✗ ${M.title} FAILED: ${e.message}`);
      failures.push({ title: M.title, error: e.message });
    }
  }
  if (failures.length) {
    console.log(`\n=== ${MODULES.length - failures.length}/${MODULES.length} succeeded. Failures: ===`);
    for (const f of failures) console.log(`  ${f.title}: ${f.error}`);
    process.exit(1);
  }
  console.log("\n=== All Superpowers modules uploaded + DB patched ===");
}

run().catch((e) => { console.error(e); process.exit(1); });
