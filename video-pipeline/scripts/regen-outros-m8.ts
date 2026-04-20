import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const REPO = path.resolve(__dirname, "../..");
const OUTPUT = path.join(REPO, "video-pipeline/output");

const LESSONS = [
  {
    module: 8,
    lesson: 1,
    script: "Request in, response out, four verbs — get, post, put, delete. That's the whole game. Next up, how you prove you're allowed to make those calls in the first place.",
  },
  {
    module: 8,
    lesson: 2,
    script: "Your key is your badge. Your environment file is your safe. Never commit them. Next up, we actually call the Claude API for the first time.",
  },
  {
    module: 8,
    lesson: 3,
    script: "One command, and you talked to Claude. That's the whole trick. Next module, we take the same pattern to OpenAI's API — the one behind ChatGPT, and the baseline for almost every other AI API out there.",
  },
];

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "WQcQveC0hbQNvI69FWyU";
const AVATAR_ID = process.env.HEYGEN_AVATAR_ID || "Silas_expressive_2024120201";
const BG_URL = process.env.HEYGEN_BACKGROUND_URL || "";

function supabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

async function elevenlabs(script: string, out: string) {
  if (fs.existsSync(out)) { console.log(`  [el] cached: ${path.basename(out)}`); return; }
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY!, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({
      text: script,
      model_id: "eleven_turbo_v2_5",
      voice_settings: { stability: 0.6, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log(`  [el] saved: ${path.basename(out)}`);
}

async function uploadAudio(file: string, key: string): Promise<string> {
  const sb = supabase();
  const buf = fs.readFileSync(file);
  const { error } = await sb.storage.from("assets").upload(key, buf, { contentType: "audio/mpeg", upsert: true });
  if (error) throw new Error(`Supabase upload failed for ${key}: ${error.message}`);
  return sb.storage.from("assets").getPublicUrl(key).data.publicUrl;
}

async function heygenCreate(audioUrl: string, title: string): Promise<string> {
  const res = await fetch("https://api.heygen.com/v2/video/generate", {
    method: "POST",
    headers: { "X-Api-Key": process.env.HEYGEN_API_KEY!, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      title,
      video_inputs: [{
        character: { type: "avatar", avatar_id: AVATAR_ID, avatar_style: "normal", avatar_version: 4 },
        voice: { type: "audio", audio_url: audioUrl },
        background: { type: "image", url: BG_URL },
      }],
      dimension: { width: 1920, height: 1080 },
    }),
  });
  const j = await res.json();
  if (j.error) throw new Error(`HeyGen: ${JSON.stringify(j.error)}`);
  return j.data?.video_id;
}

async function heygenPoll(id: string): Promise<string> {
  const deadline = Date.now() + 25 * 60_000;
  while (Date.now() < deadline) {
    const res = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${id}`, {
      headers: { "X-Api-Key": process.env.HEYGEN_API_KEY!, Accept: "application/json" },
    });
    const j = await res.json();
    const status = j.data?.status;
    console.log(`  [hg] ${id}: ${status}`);
    if (status === "completed") return j.data.video_url;
    if (status === "failed") throw new Error(`HeyGen failed: ${id}`);
    await new Promise((r) => setTimeout(r, 15_000));
  }
  throw new Error(`HeyGen timeout: ${id}`);
}

async function downloadTo(url: string, dest: string) {
  const res = await fetch(url);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

function sh(cmd: string) {
  execSync(cmd, { stdio: "inherit" });
}

function probeDuration(file: string): number {
  return parseFloat(execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${file}"`).toString().trim());
}

async function run() {
  for (const L of LESSONS) {
    const dir = path.join(OUTPUT, `Module ${L.module}`, `Lesson ${L.lesson}`);
    const assets = path.join(dir, "assets");
    if (!fs.existsSync(dir)) throw new Error(`Missing: ${dir}`);

    console.log(`\n=== M${L.module}L${L.lesson} ===`);

    // 1. Script
    fs.writeFileSync(path.join(assets, "outro_script_v2.txt"), L.script);
    console.log(`  [1] script saved`);

    // 2. ElevenLabs mp3
    const mp3 = path.join(assets, "outro_v2.mp3");
    await elevenlabs(L.script, mp3);

    // 3. Upload mp3 to Supabase
    const publicUrl = await uploadAudio(mp3, `heygen-audio/m${L.module}l${L.lesson}/outro_v2.mp3`);
    console.log(`  [3] audio URL: ${publicUrl}`);

    // 4. HeyGen create
    const vidIdFile = path.join(assets, "outro_v2_video_id.txt");
    let videoId = fs.existsSync(vidIdFile) ? fs.readFileSync(vidIdFile, "utf-8").trim() : "";
    if (!videoId) {
      videoId = await heygenCreate(publicUrl, `M${L.module}L${L.lesson} outro v2`);
      fs.writeFileSync(vidIdFile, videoId);
      console.log(`  [4] HeyGen id: ${videoId}`);
    } else {
      console.log(`  [4] cached HeyGen id: ${videoId}`);
    }

    // 5. Poll + download
    const outroV2 = path.join(dir, "outro_v2.mp4");
    if (!fs.existsSync(outroV2)) {
      const dlUrl = await heygenPoll(videoId);
      await downloadTo(dlUrl, outroV2);
      console.log(`  [5] downloaded: ${path.basename(outroV2)}`);
    } else {
      console.log(`  [5] cached outro_v2.mp4`);
    }

    // 6. Normalize outro to match pre_outro's stream params (44.1kHz stereo, 25fps, 1920x1080)
    const outroNorm = path.join(dir, "outro_v2_norm.mp4");
    if (!fs.existsSync(outroNorm)) {
      sh(`ffmpeg -y -i "${outroV2}" -vf "scale=1920:1080,fps=25" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -ar 44100 -ac 2 -c:a aac -b:a 192k "${outroNorm}"`);
      console.log(`  [6] normalized (44.1kHz stereo, 25fps)`);
    }

    // 7. Build pre_outro.mp4 = final.mp4 minus outro_new.mp4 tail
    const finalMp4 = path.join(dir, "final.mp4");
    const outroNew = path.join(dir, "outro_new.mp4");
    const preOutro = path.join(dir, "pre_outro.mp4");
    if (!fs.existsSync(preOutro)) {
      const finalDur = probeDuration(finalMp4);
      const tailDur = probeDuration(outroNew);
      const keepDur = (finalDur - tailDur).toFixed(3);
      sh(`ffmpeg -y -i "${finalMp4}" -t ${keepDur} -vf "scale=1920:1080,fps=25" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -ar 44100 -ac 2 -c:a aac -b:a 192k "${preOutro}"`);
      console.log(`  [7] pre_outro built (${keepDur}s)`);
    }

    // 8. Concat via filter_complex (safe with any input param mismatch; auto-resamples)
    const finalV2 = path.join(dir, "final_v2.mp4");
    if (!fs.existsSync(finalV2)) {
      sh(`ffmpeg -y -i "${preOutro}" -i "${outroNorm}" -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k "${finalV2}"`);
    }
    console.log(`  [8] final_v2: ${finalV2} (${probeDuration(finalV2).toFixed(1)}s, ${(fs.statSync(finalV2).size / 1024 / 1024).toFixed(1)} MB)`);
  }
  console.log("\n=== All 3 regenerations complete ===");
  console.log("Next: review final_v2.mp4 files, then upload to Vimeo + update DB.");
}

run().catch((e) => { console.error(e); process.exit(1); });
