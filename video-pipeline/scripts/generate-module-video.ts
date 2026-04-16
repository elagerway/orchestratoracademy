/**
 * generate-module-video.ts
 *
 * Follows docs/video-pipeline.md EXACTLY:
 * 1. Generate scripts (5 segments: intro, voiceover1, transition, voiceover2, outro)
 * 2. Generate ALL audio via ElevenLabs (same voice, same params)
 * 3. Copy voiceover mp3s to public/ for Remotion
 * 4. Render code screens with Remotion (voiceover baked in for timing)
 * 5. Send ONLY talking-head audio to HeyGen (intro, transition, outro)
 * 6. Download raw HeyGen mp4s
 * 7. Render brand intro
 * 8. Stitch with ffmpeg filter_complex concat:
 *    - Talking heads: HeyGen VIDEO + HeyGen AUDIO (lip-synced)
 *    - Code screens: Remotion VIDEO + raw ElevenLabs MP3 AUDIO
 *    - Brand intro prepended
 *
 * CRITICAL RULES (from pipeline doc):
 * - NEVER pass HeyGen video through Remotion
 * - Code screen voiceover audio is raw ElevenLabs, NOT HeyGen-processed
 * - ffmpeg stitch uses filter_complex concat with separate audio inputs
 * - All ElevenLabs audio uses identical voice settings
 *
 * Usage:
 *   npx tsx video-pipeline/scripts/generate-module-video.ts --module superpower-stack
 *   npx tsx video-pipeline/scripts/generate-module-video.ts --module superpower-stack --skip-heygen
 */

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";

const envPath = path.resolve(__dirname, "../../.env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

import { createClient } from "@supabase/supabase-js";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import {
  generateModuleScripts,
  generatePlaceholderScripts,
  type ModuleScripts,
  type LessonInfo,
} from "./generate-scripts";

// ── Supabase ────────────────────────────────────────────────────────────────

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

// ── ElevenLabs ──────────────────────────────────────────────────────────────

async function generateAudio(script: string, outputPath: string): Promise<void> {
  if (fs.existsSync(outputPath)) {
    console.log(`    [elevenlabs] Using cached: ${path.basename(outputPath)}`);
    return;
  }
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "WQcQveC0hbQNvI69FWyU";
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("Missing ELEVENLABS_API_KEY");

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({
      text: script,
      model_id: "eleven_turbo_v2_5",
      voice_settings: { stability: 0.6, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs error (${res.status}): ${await res.text()}`);
  fs.writeFileSync(outputPath, Buffer.from(await res.arrayBuffer()));
  console.log(`    [elevenlabs] Saved: ${path.basename(outputPath)}`);
}

function getAudioDuration(filePath: string): number {
  const dur = execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${filePath}"`).toString().trim();
  return parseFloat(dur);
}

// ── HeyGen ──────────────────────────────────────────────────────────────────

const HEYGEN_API = "https://api.heygen.com";

async function heygenFetch(urlPath: string, options: RequestInit = {}) {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) throw new Error("Missing HEYGEN_API_KEY");
  const res = await fetch(`${HEYGEN_API}${urlPath}`, {
    ...options,
    headers: { "X-Api-Key": apiKey, "Content-Type": "application/json", Accept: "application/json", ...options.headers },
  });
  return res.json();
}

async function uploadToSupabase(filePath: string, storagePath: string): Promise<string> {
  const supabase = getSupabase();
  const buffer = fs.readFileSync(filePath);
  await supabase.storage.from("assets").upload(storagePath, buffer, { contentType: "audio/mpeg", upsert: true });
  const { data: { publicUrl } } = supabase.storage.from("assets").getPublicUrl(storagePath);
  return publicUrl;
}

async function createHeyGenVideo(audioUrl: string, title: string): Promise<string> {
  const avatarId = process.env.HEYGEN_AVATAR_ID || "Silas_expressive_2024120201";
  const bgUrl = process.env.HEYGEN_BACKGROUND_URL || "";
  const result = await heygenFetch("/v2/video/generate", {
    method: "POST",
    body: JSON.stringify({
      title,
      video_inputs: [{
        character: { type: "avatar", avatar_id: avatarId, avatar_style: "normal", avatar_version: 4 },
        voice: { type: "audio", audio_url: audioUrl },
        background: { type: "image", url: bgUrl },
      }],
      dimension: { width: 1920, height: 1080 },
    }),
  });
  if (result.error) throw new Error(`HeyGen: ${JSON.stringify(result.error)}`);
  return result.data?.video_id;
}

async function waitForHeyGen(videoId: string): Promise<string> {
  const maxWait = 1_200_000; // 20 minutes
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    const status = await heygenFetch(`/v1/video_status.get?video_id=${videoId}`);
    if (status.data?.status === "completed") return status.data.video_url;
    if (status.data?.status === "failed") throw new Error(`HeyGen failed: ${videoId}`);
    console.log(`    [heygen] ${videoId}: ${status.data?.status || "unknown"}...`);
    await new Promise((r) => setTimeout(r, 10_000));
  }
  throw new Error(`HeyGen timed out: ${videoId}`);
}

async function downloadFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

// ── Args ────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  let moduleSlug = "";
  let skipHeyGen = false;
  let skipUpload = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--module" && args[i + 1]) { moduleSlug = args[++i]; }
    else if (args[i] === "--skip-heygen") { skipHeyGen = true; }
    else if (args[i] === "--skip-upload") { skipUpload = true; }
  }
  if (!moduleSlug) { console.error("Usage: --module <slug>"); process.exit(1); }
  if (!/^[a-z0-9-]+$/.test(moduleSlug)) {
    console.error("Invalid module slug — only lowercase letters, numbers, and hyphens allowed");
    process.exit(1);
  }
  return { moduleSlug, skipHeyGen, skipUpload };
}

// ── Main Pipeline ───────────────────────────────────────────────────────────

async function main() {
  const { moduleSlug, skipHeyGen, skipUpload } = parseArgs();
  const FPS = 25;
  const outputDir = path.resolve(__dirname, "../output");
  const assetsDir = path.join(outputDir, `${moduleSlug}-assets`);
  const publicDir = path.resolve(__dirname, "../public");
  const publicModuleDir = path.join(publicDir, moduleSlug);

  for (const d of [assetsDir, publicModuleDir]) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }

  console.log(`\n=== Video Pipeline: ${moduleSlug} ===\n`);

  // ── Step 1: Fetch module data + generate scripts ────────────────────────

  console.log("[1] Fetching module data + generating scripts...");
  const supabase = getSupabase();
  const { data: mod } = await supabase.from("modules").select("*").eq("slug", moduleSlug).single();
  if (!mod) throw new Error(`Module not found: ${moduleSlug}`);

  const { data: lessons } = await supabase.from("lessons").select("*").eq("module_id", mod.id).order("order");
  const lessonInfos: LessonInfo[] = (lessons || []).map((l: any) => ({ title: l.title, slug: l.slug, content: l.content || "" }));
  console.log(`  Module: ${mod.title} (${lessonInfos.length} lessons)`);

  const scriptsPath = path.join(assetsDir, "scripts.json");
  let scripts: ModuleScripts;
  if (fs.existsSync(scriptsPath)) {
    scripts = JSON.parse(fs.readFileSync(scriptsPath, "utf-8"));
    console.log("  Scripts: using cached");
  } else {
    try {
      scripts = await generateModuleScripts(moduleSlug, mod.title, lessonInfos);
    } catch (e: any) {
      console.warn(`  Warning: Claude failed (${e.message}). Using placeholders.`);
      scripts = generatePlaceholderScripts(moduleSlug, mod.title, lessonInfos);
    }
    fs.writeFileSync(scriptsPath, JSON.stringify(scripts, null, 2));
    console.log("  Scripts: generated");
  }

  // ── Step 2: Generate ALL audio via ElevenLabs ───────────────────────────

  console.log("[2] Generating audio via ElevenLabs (same voice for ALL segments)...");

  // Talking head audio
  const thAudioPaths: string[] = [];
  for (let i = 0; i < scripts.talkingHeadSegments.length; i++) {
    const seg = scripts.talkingHeadSegments[i];
    const audioPath = path.join(assetsDir, `${seg.purpose}-${i}.mp3`);
    await generateAudio(seg.script, audioPath);
    thAudioPaths.push(audioPath);
  }

  // Code screen voiceover audio
  const voiceoverPaths: string[] = [];
  const voiceoverDurations: number[] = [];
  for (let i = 0; i < scripts.codeSegments.length; i++) {
    const seg = scripts.codeSegments[i];
    const audioPath = path.join(assetsDir, `voiceover-code${i}.mp3`);
    if (seg.voiceoverScript) {
      await generateAudio(seg.voiceoverScript, audioPath);
      voiceoverPaths.push(audioPath);
      voiceoverDurations.push(getAudioDuration(audioPath));
    } else {
      voiceoverPaths.push("");
      voiceoverDurations.push(seg.estimatedDurationSeconds);
    }
  }

  // Report durations
  for (let i = 0; i < voiceoverPaths.length; i++) {
    if (voiceoverPaths[i]) {
      console.log(`  voiceover-code${i}: ${voiceoverDurations[i].toFixed(1)}s`);
    }
  }

  // ── Step 3: Copy voiceover audio to public/ for Remotion ────────────────

  console.log("[3] Copying voiceover audio to public/...");
  for (let i = 0; i < voiceoverPaths.length; i++) {
    if (!voiceoverPaths[i]) continue;
    const dest = path.join(publicModuleDir, `voiceover-code${i}.mp3`);
    fs.copyFileSync(voiceoverPaths[i], dest);
  }

  // ── Step 4: Render code screens with Remotion ───────────────────────────
  // Duration = voiceover audio length. Voiceover baked in via staticFile for timing.
  // The audio from Remotion will NOT be used in final video — ffmpeg uses the raw mp3.

  console.log("[4] Rendering code screens with Remotion...");
  const entryPoint = path.resolve(__dirname, "../src/index.tsx");
  const bundled = await bundle({ entryPoint, publicDir, webpackOverride: (c) => c });

  const codeScreenPaths: string[] = [];
  for (let i = 0; i < scripts.codeSegments.length; i++) {
    const seg = scripts.codeSegments[i];
    const duration = voiceoverDurations[i];
    const durationInFrames = Math.round(duration * FPS);
    const outPath = path.join(assetsDir, `code-${i}.mp4`);

    console.log(`  Code screen ${i}: ${duration.toFixed(1)}s (${durationInFrames} frames)...`);

    const inputProps = {
      segments: [{
        type: "code-screen" as const,
        durationInFrames,
        lines: seg.lines,
        voiceoverUrl: voiceoverPaths[i] ? `${moduleSlug}/voiceover-code${i}.mp3` : undefined,
      }],
      transitionDurationInFrames: 10,
    };

    const composition = await selectComposition({ serveUrl: bundled, id: "ModuleVideo", inputProps });
    composition.durationInFrames = durationInFrames;
    composition.fps = FPS;
    composition.width = 1920;
    composition.height = 1080;

    await renderMedia({ composition, serveUrl: bundled, codec: "h264", outputLocation: outPath, inputProps, crf: 18 });
    codeScreenPaths.push(outPath);
    console.log(`    Rendered: ${path.basename(outPath)}`);
  }

  // ── Step 5: Send talking-head audio to HeyGen ───────────────────────────
  // ONLY intro, transition, outro. Voiceovers stay as raw ElevenLabs.

  console.log("[5] Sending talking-head audio to HeyGen...");
  const thVideoPaths: string[] = [];

  if (skipHeyGen) {
    console.log("  Skipping HeyGen (--skip-heygen flag).");
    for (const seg of scripts.talkingHeadSegments) {
      thVideoPaths.push(""); // placeholder
    }
  } else {
    for (let i = 0; i < scripts.talkingHeadSegments.length; i++) {
      const seg = scripts.talkingHeadSegments[i];
      const outPath = path.join(assetsDir, `th-${i}-${seg.purpose}.mp4`);

      // Use cached if exists
      if (fs.existsSync(outPath)) {
        console.log(`  [${i + 1}/${scripts.talkingHeadSegments.length}] ${seg.purpose}: cached`);
        thVideoPaths.push(outPath);
        continue;
      }

      console.log(`  [${i + 1}/${scripts.talkingHeadSegments.length}] ${seg.purpose}...`);
      try {
        // Upload audio to Supabase for public URL
        const publicUrl = await uploadToSupabase(thAudioPaths[i], `heygen-audio/${moduleSlug}/${seg.purpose}-${i}.mp3`);
        console.log(`    Audio URL: ${publicUrl}`);

        const videoId = await createHeyGenVideo(publicUrl, `${moduleSlug} - ${seg.purpose}`);
        console.log(`    Video ID: ${videoId}`);
        const videoUrl = await waitForHeyGen(videoId);

        await downloadFile(videoUrl, outPath);
        thVideoPaths.push(outPath);
        console.log(`    Downloaded: ${path.basename(outPath)} (${(fs.statSync(outPath).size / 1024 / 1024).toFixed(1)} MB)`);
      } catch (e: any) {
        console.warn(`    FAILED: ${e.message}`);
        thVideoPaths.push("");
      }
    }
  }

  // ── Step 6: Render brand intro ──────────────────────────────────────────

  console.log("[6] Rendering brand intro...");
  const brandIntroPath = path.join(assetsDir, "brand-intro.mp4");
  if (!fs.existsSync(brandIntroPath)) {
    const biProps = {};
    const biComp = await selectComposition({ serveUrl: bundled, id: "BrandIntro", inputProps: biProps });
    biComp.fps = FPS;
    await renderMedia({ composition: biComp, serveUrl: bundled, codec: "h264", outputLocation: brandIntroPath, inputProps: biProps, crf: 18 });
  }
  console.log(`  Brand intro: ${brandIntroPath}`);

  // ── Step 7: Stitch with ffmpeg ──────────────────────────────────────────
  // Per pipeline doc: ffmpeg filter_complex concat with separate audio inputs.
  // Talking heads: HeyGen VIDEO + HeyGen AUDIO (lip-synced)
  // Code screens: Remotion VIDEO + raw ElevenLabs MP3 AUDIO (NOT Remotion audio)

  console.log("[7] Stitching with ffmpeg...");

  // Build the ffmpeg command following the pipeline doc's filter_complex approach
  const inputs: string[] = [];
  const filterParts: string[] = [];
  const concatInputs: string[] = [];
  let inputIdx = 0;

  // Brand intro (video + silent audio)
  inputs.push(`-i "${brandIntroPath}"`);
  filterParts.push(`[${inputIdx}:v]setpts=PTS-STARTPTS,scale=1920:1080,fps=${FPS}[v${inputIdx}]`);
  // Generate silent audio for brand intro
  const brandDur = getAudioDuration(brandIntroPath);
  inputs.push(`-f lavfi -t ${brandDur} -i anullsrc=r=48000:cl=stereo`);
  concatInputs.push(`[v${inputIdx}][${inputIdx + 1}:a]`);
  inputIdx += 2;

  // Build sequence per scripts.sequence
  for (const seqItem of scripts.sequence) {
    if (seqItem.type === "talking-head") {
      const thPath = thVideoPaths[seqItem.index];
      if (!thPath) continue; // skip missing

      inputs.push(`-i "${thPath}"`);
      filterParts.push(`[${inputIdx}:v]setpts=PTS-STARTPTS,scale=1920:1080,fps=${FPS}[v${inputIdx}]`);
      concatInputs.push(`[v${inputIdx}][${inputIdx}:a]`);
      inputIdx++;
    } else {
      const csPath = codeScreenPaths[seqItem.index];
      if (!csPath) continue;

      // Code screen VIDEO (from Remotion)
      inputs.push(`-i "${csPath}"`);
      filterParts.push(`[${inputIdx}:v]setpts=PTS-STARTPTS,scale=1920:1080,fps=${FPS}[v${inputIdx}]`);
      const videoIdx = inputIdx;
      inputIdx++;

      // Code screen AUDIO (raw ElevenLabs mp3 — NOT from Remotion render)
      const voPath = voiceoverPaths[seqItem.index];
      if (voPath) {
        inputs.push(`-i "${voPath}"`);
        concatInputs.push(`[v${videoIdx}][${inputIdx}:a]`);
        inputIdx++;
      } else {
        // Silent audio fallback
        const csDur = voiceoverDurations[seqItem.index];
        inputs.push(`-f lavfi -t ${csDur} -i anullsrc=r=48000:cl=stereo`);
        concatInputs.push(`[v${videoIdx}][${inputIdx}:a]`);
        inputIdx++;
      }
    }
  }

  const segCount = concatInputs.length;
  const filterComplex = [
    ...filterParts,
    `${concatInputs.join("")}concat=n=${segCount}:v=1:a=1[vout][aout]`,
  ].join(";\n    ");

  const outputPath = path.join(outputDir, `${moduleSlug}.mp4`);
  const ffmpegCmd = `ffmpeg -y \
  ${inputs.join(" \\\n  ")} \
  -filter_complex "
    ${filterComplex}
  " \
  -map "[vout]" -map "[aout]" \
  -c:v libx264 -preset medium -crf 18 -r ${FPS} -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  "${outputPath}"`;

  console.log("  Running ffmpeg stitch...");
  try {
    execSync(ffmpegCmd, { stdio: "pipe", maxBuffer: 50 * 1024 * 1024 });
  } catch (e: any) {
    console.error("  ffmpeg failed. Command:");
    console.error(ffmpegCmd);
    console.error(e.stderr?.toString()?.slice(-500));
    throw e;
  }

  const finalDur = getAudioDuration(outputPath);
  const finalSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1);
  console.log(`  Final: ${outputPath} (${finalSize} MB, ${finalDur.toFixed(1)}s)`);

  // ── Step 8: Upload (optional) ───────────────────────────────────────────

  if (skipUpload) {
    console.log("[8] Skipping upload.");
  } else {
    console.log("[8] Uploading to Supabase Storage...");
    try {
      const videoBuffer = fs.readFileSync(outputPath);
      const storagePath = `module-videos/${moduleSlug}/${moduleSlug}.mp4`;
      await supabase.storage.from("videos").upload(storagePath, videoBuffer, { contentType: "video/mp4", upsert: true });
      const { data: { publicUrl } } = supabase.storage.from("videos").getPublicUrl(storagePath);
      console.log(`  Uploaded: ${publicUrl}`);
    } catch (e: any) {
      console.warn(`  Upload failed: ${e.message}`);
    }
  }

  console.log(`\n=== Pipeline complete: ${moduleSlug} ===\n`);
}

main().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
