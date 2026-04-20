import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const VIMEO_TOKEN = process.env.VIMEO_ACCESS_TOKEN!;
const VIMEO_OA_PROJECT = "/users/234512081/projects/28795456";
const OUTPUT = path.resolve(__dirname, "../output");

type Lesson = { module: number; lesson: number; slug: string; title: string };

const LESSONS: Lesson[] = [
  // M8L1 already done manually — skip
  { module: 8, lesson: 2, slug: "authentication-api-keys", title: "Authentication & API Keys" },
  { module: 8, lesson: 3, slug: "making-first-api-call", title: "Making Your First API Call" },
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

async function createVideo(name: string, size: number) {
  return vimeo<any>("/me/videos", {
    method: "POST",
    body: JSON.stringify({
      upload: { approach: "tus", size },
      name,
      privacy: { view: "disable", embed: "whitelist" },
    }),
  });
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

async function waitForTranscode(videoId: string) {
  const deadline = Date.now() + 20 * 60_000;
  while (Date.now() < deadline) {
    const v = await vimeo<any>(`/videos/${videoId}`);
    const ts = v.transcode?.status;
    console.log(`    transcode: ${ts}`);
    if (ts === "complete") return v;
    if (ts === "error") throw new Error("Vimeo transcode error");
    await new Promise((r) => setTimeout(r, 15_000));
  }
  throw new Error("Vimeo transcode timeout");
}

async function setEmbedSettings(videoId: string) {
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
}

async function addToFolder(videoId: string) {
  await vimeo(`${VIMEO_OA_PROJECT}/videos/${videoId}`, { method: "PUT" });
}

async function uploadThumbnail(videoId: string, thumbPath: string) {
  const create = await vimeo<any>(`/videos/${videoId}/pictures`, { method: "POST" });
  const uploadLink = create.link;
  const buf = fs.readFileSync(thumbPath);
  const up = await fetch(uploadLink, { method: "PUT", body: buf, headers: { "Content-Type": "image/png" } });
  if (!up.ok) throw new Error(`thumb upload: ${up.status}`);
  await vimeo(create.uri, { method: "PATCH", body: JSON.stringify({ active: true }) });
}

async function whitelistDomain(videoId: string, domain: string) {
  await vimeo(`/videos/${videoId}/privacy/domains/${domain}`, { method: "PUT" });
}

async function updateDb(slug: string, videoId: string) {
  const sb = supabase();
  const newUrl = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0`;
  const { data, error } = await sb
    .from("lessons")
    .update({ video_url: newUrl })
    .eq("slug", slug)
    .select("id,slug,video_url")
    .single();
  if (error) throw error;
  console.log(`    DB updated: ${data.slug} -> ${newUrl}`);
}

async function run() {
  for (const L of LESSONS) {
    const dir = path.join(OUTPUT, `Module ${L.module}`, `Lesson ${L.lesson}`);
    const finalV2 = path.join(dir, "final_v2.mp4");
    const thumb = path.join(dir, "thumbnail.png");
    if (!fs.existsSync(finalV2)) throw new Error(`Missing: ${finalV2}`);
    const size = fs.statSync(finalV2).size;

    console.log(`\n=== Uploading M${L.module}L${L.lesson}: ${L.title} (${(size / 1048576).toFixed(1)} MB) ===`);

    // 1. Create
    const created = await createVideo(`M${L.module}L${L.lesson} ${L.title}`, size);
    const uploadLink = created.upload.upload_link;
    const videoId = created.uri.split("/").pop() as string;
    console.log(`  [1] created: ${videoId}`);

    // 2. tus upload
    await tusUpload(uploadLink, finalV2);
    console.log(`  [2] uploaded`);

    // 3. Wait transcode
    await waitForTranscode(videoId);
    console.log(`  [3] transcoded`);

    // 4. Embed/privacy settings
    await setEmbedSettings(videoId);
    console.log(`  [4] embed settings set`);

    // 5. Whitelist domains for embed
    for (const d of ["orchestratoracademy.com", "www.orchestratoracademy.com", "localhost"]) {
      try {
        await whitelistDomain(videoId, d);
      } catch (e: any) {
        console.log(`    warn: whitelist ${d} — ${e.message}`);
      }
    }

    // 6. Add to OA folder
    await addToFolder(videoId);
    console.log(`  [6] added to OA folder`);

    // 7. Thumbnail (if exists)
    if (fs.existsSync(thumb)) {
      await uploadThumbnail(videoId, thumb);
      console.log(`  [7] thumbnail uploaded`);
    } else {
      console.log(`  [7] no thumbnail.png — skipped`);
    }

    // 8. Update DB
    await updateDb(L.slug, videoId);

    console.log(`  DONE: https://player.vimeo.com/video/${videoId}`);
  }
  console.log("\n=== All M8 lessons uploaded + DB updated ===");
}

run().catch((e) => { console.error(e); process.exit(1); });
