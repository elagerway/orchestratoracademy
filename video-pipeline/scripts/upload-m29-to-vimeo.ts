import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const VIMEO_TOKEN = process.env.VIMEO_ACCESS_TOKEN!;
const VIMEO_OA_PROJECT = "/users/234512081/projects/28795456";
const OUTPUT = path.resolve(__dirname, "../output");

const VIDEO_FILE = path.join(OUTPUT, "openrouter-universal-ai-gateway.mp4");
const VIDEO_TITLE = "M29 OpenRouter — Universal AI Gateway";
const LESSON_SLUGS = ["what-is-openrouter", "model-routing-fallbacks-openrouter", "openrouter-in-practice"];

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

async function tusUpload(uploadLink: string, filePath: string) {
  const size = fs.statSync(filePath).size;
  const CHUNK = 64 * 1024 * 1024;
  const fd = fs.openSync(filePath, "r");
  try {
    let offset = 0;
    while (offset < size) {
      const len = Math.min(CHUNK, size - offset);
      const buf = Buffer.alloc(len);
      fs.readSync(fd, buf, 0, len, offset);
      const res = await fetch(uploadLink, {
        method: "PATCH",
        headers: {
          "Tus-Resumable": "1.0.0",
          "Upload-Offset": String(offset),
          "Content-Type": "application/offset+octet-stream",
        },
        body: buf,
      });
      if (!res.ok) throw new Error(`tus PATCH ${res.status}: ${await res.text()}`);
      offset += len;
      process.stdout.write(`    tus: ${Math.round((offset / size) * 100)}%\r`);
    }
    process.stdout.write("    tus: 100% done\n");
  } finally {
    fs.closeSync(fd);
  }
}

async function run() {
  if (!fs.existsSync(VIDEO_FILE)) throw new Error(`Missing: ${VIDEO_FILE}`);
  const size = fs.statSync(VIDEO_FILE).size;
  console.log(`Uploading ${VIDEO_TITLE} (${(size / 1048576).toFixed(1)} MB)`);

  // 1. Create video
  const created = await vimeo<any>("/me/videos", {
    method: "POST",
    body: JSON.stringify({
      upload: { approach: "tus", size },
      name: VIDEO_TITLE,
      privacy: { view: "disable", embed: "whitelist" },
    }),
  });
  const uploadLink = created.upload.upload_link;
  const videoId = created.uri.split("/").pop() as string;
  console.log(`  [1] created: ${videoId}`);

  // 2. tus upload
  await tusUpload(uploadLink, VIDEO_FILE);
  console.log(`  [2] uploaded`);

  // 3. Wait transcode
  const deadline = Date.now() + 20 * 60_000;
  while (Date.now() < deadline) {
    const v = await vimeo<any>(`/videos/${videoId}`);
    const ts = v.transcode?.status;
    console.log(`    transcode: ${ts}`);
    if (ts === "complete") break;
    if (ts === "error") throw new Error("Vimeo transcode error");
    await new Promise((r) => setTimeout(r, 15_000));
  }
  console.log(`  [3] transcoded`);

  // 4. Embed/privacy settings
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
  console.log(`  [4] embed settings set`);

  // 5. Whitelist domains
  for (const d of ["orchestratoracademy.com", "www.orchestratoracademy.com", "localhost"]) {
    try {
      await vimeo(`/videos/${videoId}/privacy/domains/${d}`, { method: "PUT" });
    } catch (e: any) {
      console.log(`    warn: whitelist ${d} — ${e.message}`);
    }
  }

  // 6. Add to OA folder
  await vimeo(`${VIMEO_OA_PROJECT}/videos/${videoId}`, { method: "PUT" });
  console.log(`  [6] added to OA folder`);

  // 7. Update DB for all 3 lessons
  const sb = supabase();
  const newUrl = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0`;
  for (const slug of LESSON_SLUGS) {
    const { data, error } = await sb
      .from("lessons")
      .update({ video_url: newUrl })
      .eq("slug", slug)
      .select("id,slug,video_url")
      .single();
    if (error) throw new Error(`DB update failed for ${slug}: ${error.message}`);
    console.log(`    DB updated: ${data.slug}`);
  }

  console.log(`\nDONE: https://player.vimeo.com/video/${videoId}`);
}

run().catch((e) => { console.error(e); process.exit(1); });
