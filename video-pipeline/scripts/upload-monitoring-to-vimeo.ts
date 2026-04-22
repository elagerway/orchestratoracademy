import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const VIMEO_TOKEN = process.env.VIMEO_ACCESS_TOKEN!;
const VIMEO_OA_PROJECT = "/users/234512081/projects/28795456";
const OUTPUT = path.resolve(__dirname, "../output");

const LESSONS: { file: string; title: string; slug: string }[] = [
  { file: "why-monitoring-matters-cost-of-silent-failures.mp4", title: "M1L1 The Cost of Silent Failures", slug: "cost-of-silent-failures" },
  { file: "why-monitoring-matters-the-monitoring-pyramid.mp4", title: "M1L2 The Monitoring Pyramid", slug: "the-monitoring-pyramid" },
  { file: "sentry-capture-errors-install-sentry-first-error.mp4", title: "M2L1 Install Sentry & First Error", slug: "install-sentry-first-error" },
  { file: "sentry-capture-errors-source-maps-releases.mp4", title: "M2L2 Source Maps & Releases", slug: "source-maps-releases" },
  { file: "sentry-observability-performance-traces.mp4", title: "M3L1 Performance Traces", slug: "performance-traces" },
  { file: "sentry-observability-custom-context-breadcrumbs.mp4", title: "M3L2 Custom Context & Breadcrumbs", slug: "custom-context-breadcrumbs" },
  { file: "sentry-alerting-alert-rules-that-work.mp4", title: "M4L1 Alert Rules That Work", slug: "alert-rules-that-work" },
  { file: "sentry-alerting-ownership-escalation.mp4", title: "M4L2 Ownership & Escalation", slug: "ownership-escalation" },
  { file: "dependabot-security-dependabot-setup.mp4", title: "M5L1 Dependabot Setup & PR Workflow", slug: "dependabot-setup" },
  { file: "dependabot-security-dependabot-auto-merge.mp4", title: "M5L2 Dependabot Auto-Merge Policies", slug: "dependabot-auto-merge" },
  { file: "self-healing-agents-sentry-to-claude-code-pr.mp4", title: "M6L1 Sentry Issue → Claude Code Auto-PR", slug: "sentry-to-claude-code-pr" },
  { file: "self-healing-agents-dependabot-agent-review.mp4", title: "M6L2 Dependabot PR → Agent Review", slug: "dependabot-agent-review" },
  { file: "ongoing-discipline-weekly-review-ritual.mp4", title: "M7L1 The Weekly Review Ritual", slug: "weekly-review-ritual" },
  { file: "ongoing-discipline-slos-error-budgets.mp4", title: "M7L2 SLOs & Error Budgets", slug: "slos-error-budgets" },
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
  const res = await fetch(uploadLink, { method: "HEAD", headers: { "Tus-Resumable": "1.0.0" } });
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
            headers: { "Tus-Resumable": "1.0.0", "Upload-Offset": String(offset), "Content-Type": "application/offset+octet-stream" },
            body: buf,
          });
          if (!res.ok) throw new Error(`PATCH ${res.status}: ${(await res.text()).slice(0, 200)}`);
          const serverOffset = parseInt(res.headers.get("upload-offset") || "-1", 10);
          if (serverOffset !== offset + len) throw new Error(`offset mismatch: client=${offset + len}, server=${serverOffset}`);
          offset = serverOffset;
          success = true;
        } catch (e: any) {
          if (attempt >= MAX_RETRIES) throw e;
          const backoff = Math.min(2000 * attempt, 15000);
          console.log(`\n    tus retry ${attempt}/${MAX_RETRIES}: ${e.message}`);
          await new Promise((r) => setTimeout(r, backoff));
          try {
            const serverOffset = await tusGetOffset(uploadLink);
            if (serverOffset !== offset) { offset = serverOffset; break; }
          } catch {}
        }
      }
      process.stdout.write(`    tus: ${Math.round((offset / size) * 100)}%\r`);
    }
    process.stdout.write("    tus: 100% done\n");
    const final = await tusGetOffset(uploadLink);
    if (final !== size) throw new Error(`tus final offset ${final} != ${size}`);
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

async function runOne(L: typeof LESSONS[number]) {
  const filePath = path.join(OUTPUT, L.file);
  if (!fs.existsSync(filePath)) throw new Error(`Missing: ${filePath}`);
  const size = fs.statSync(filePath).size;
  console.log(`\n=== ${L.title} (${(size / 1048576).toFixed(1)} MB) ===`);

  const created = await vimeo<any>("/me/videos", {
    method: "POST",
    body: JSON.stringify({
      upload: { approach: "tus", size },
      name: L.title,
      privacy: { view: "disable", embed: "whitelist" },
    }),
  });
  const videoId = created.uri.split("/").pop() as string;
  console.log(`  [1] created: ${videoId}`);

  await tusUpload(created.upload.upload_link, filePath);
  console.log(`  [2] uploaded`);

  await waitForTranscode(videoId);
  console.log(`  [3] transcoded`);

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

  for (const d of ["orchestratoracademy.com", "www.orchestratoracademy.com", "localhost"]) {
    try { await vimeo(`/videos/${videoId}/privacy/domains/${d}`, { method: "PUT" }); }
    catch (e: any) { console.log(`    warn: ${d} — ${e.message}`); }
  }

  await vimeo(`${VIMEO_OA_PROJECT}/videos/${videoId}`, { method: "PUT" });
  console.log(`  [6] folder'd`);

  const sb = supabase();
  const newUrl = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0`;
  const { data, error } = await sb.from("lessons").update({ video_url: newUrl, content_type: "video" }).eq("slug", L.slug).select("slug,video_url").single();
  if (error) throw new Error(`DB update ${L.slug}: ${error.message}`);
  console.log(`  [7] ${data.slug} → ${newUrl}`);
}

async function run() {
  const failures: { title: string; error: string }[] = [];
  for (const L of LESSONS) {
    try { await runOne(L); } catch (e: any) { console.error(`  ✗ ${L.title} FAILED: ${e.message}`); failures.push({ title: L.title, error: e.message }); }
  }
  if (failures.length) {
    console.log(`\n=== ${LESSONS.length - failures.length}/${LESSONS.length} succeeded. Failures: ===`);
    for (const f of failures) console.log(`  ${f.title}: ${f.error}`);
    process.exit(1);
  }
  console.log("\n=== All 14 monitoring course lessons uploaded + DB patched ===");
}

run().catch((e) => { console.error(e); process.exit(1); });
