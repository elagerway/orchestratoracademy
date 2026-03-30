/**
 * generate-module-video.ts
 *
 * Orchestrates the full video generation pipeline for a single module:
 * 1. Fetches module data from Supabase
 * 2. Generates scripts (talking head + code segments) via Claude
 * 3. Sends talking head scripts to HeyGen, waits for completion
 * 4. Renders the final video using Remotion's renderMedia
 * 5. Uploads to Supabase Storage
 * 6. Updates lesson_videos table
 *
 * Usage:
 *   npx tsx video-pipeline/scripts/generate-module-video.ts --module welcome-to-ai-orchestration
 *   npx tsx video-pipeline/scripts/generate-module-video.ts --module welcome-to-ai-orchestration --skip-heygen
 */

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load env from parent project
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

// --- Supabase client (server-side, using service role or anon key) ---
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase env vars");
  }
  return createClient(url, key);
}

// --- HeyGen helpers (inline to avoid SSR import issues) ---
const HEYGEN_API_BASE = "https://api.heygen.com";

async function heygenFetch(path: string, options: RequestInit = {}) {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) throw new Error("Missing HEYGEN_API_KEY");

  const res = await fetch(`${HEYGEN_API_BASE}${path}`, {
    ...options,
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });
  return res.json();
}

// --- ElevenLabs helpers ---
async function generateElevenLabsAudio(script: string, outputPath: string): Promise<string> {
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "WQcQveC0hbQNvI69FWyU";
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("Missing ELEVENLABS_API_KEY");

  console.log(`    [elevenlabs] Generating audio (${script.length} chars)...`);

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: script,
      model_id: "eleven_turbo_v2_5",
      voice_settings: {
        stability: 0.6,
        similarity_boost: 0.8,
        style: 0.3,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`ElevenLabs error (${res.status}): ${error}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
  console.log(`    [elevenlabs] Audio saved: ${outputPath}`);
  return outputPath;
}

async function uploadAudioToHeyGen(audioPath: string): Promise<string> {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) throw new Error("Missing HEYGEN_API_KEY");

  const audioBuffer = fs.readFileSync(audioPath);
  const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
  const formData = new FormData();
  formData.append("file", blob, "voiceover.mp3");

  const res = await fetch("https://upload.heygen.com/v1/asset", {
    method: "POST",
    headers: { "X-Api-Key": apiKey },
    body: formData,
  });

  const data = await res.json();
  if (data.error) throw new Error(`HeyGen upload error: ${JSON.stringify(data.error)}`);
  return data.data?.url || data.data?.asset_id || data.url;
}

async function createHeyGenVideo(script: string, title?: string, audioUrl?: string): Promise<string> {
  const avatarId = process.env.HEYGEN_AVATAR_ID || "Silas_expressive_2024120201";
  const backgroundUrl = process.env.HEYGEN_BACKGROUND_URL || "https://resource2.heygen.ai/image/f73ae32125844bf3a1958140eac17409/original.png";

  // Voice config: use uploaded ElevenLabs audio if available, otherwise fall back to HeyGen TTS
  const voiceConfig = audioUrl
    ? { type: "audio", audio_url: audioUrl }
    : { type: "text", input_text: script, voice_id: process.env.HEYGEN_VOICE_ID || "f6e122316c2543bd891dd5e50044ff60", speed: 0.95 };

  const result = await heygenFetch("/v2/video/generate", {
    method: "POST",
    body: JSON.stringify({
      title: title || "Module Video Segment",
      video_inputs: [
        {
          character: {
            type: "avatar",
            avatar_id: avatarId,
            avatar_style: "normal",
            avatar_version: 4,
          },
          voice: voiceConfig,
          background: {
            type: "image",
            url: backgroundUrl,
          },
        },
      ],
      dimension: { width: 1920, height: 1080 },
      avatar_motion: "v4",
    }),
  });

  if (result.error) {
    throw new Error(`HeyGen error: ${JSON.stringify(result.error)}`);
  }

  return result.data?.video_id;
}

async function waitForHeyGenVideo(
  videoId: string,
  maxWaitMs = 600_000
): Promise<string> {
  const startTime = Date.now();
  const pollInterval = 10_000; // 10 seconds

  while (Date.now() - startTime < maxWaitMs) {
    const status = await heygenFetch(
      `/v1/video_status.get?video_id=${videoId}`
    );

    if (status.data?.status === "completed") {
      return status.data.video_url;
    }

    if (status.data?.status === "failed") {
      throw new Error(`HeyGen video generation failed: ${videoId}`);
    }

    console.log(
      `  [heygen] Video ${videoId} status: ${status.data?.status || "unknown"}. Waiting...`
    );
    await new Promise((r) => setTimeout(r, pollInterval));
  }

  throw new Error(`HeyGen video generation timed out after ${maxWaitMs}ms`);
}

// --- Args parsing ---
function parseArgs() {
  const args = process.argv.slice(2);
  let moduleSlug = "";
  let skipHeyGen = false;
  let skipUpload = false;
  let outputDir = path.resolve(__dirname, "../output");

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--module" && args[i + 1]) {
      moduleSlug = args[i + 1];
      i++;
    } else if (args[i] === "--skip-heygen") {
      skipHeyGen = true;
    } else if (args[i] === "--skip-upload") {
      skipUpload = true;
    } else if (args[i] === "--output" && args[i + 1]) {
      outputDir = path.resolve(args[i + 1]);
      i++;
    }
  }

  if (!moduleSlug) {
    console.error("Usage: npx tsx generate-module-video.ts --module <slug>");
    process.exit(1);
  }

  return { moduleSlug, skipHeyGen, skipUpload, outputDir };
}

// --- Main pipeline ---
async function main() {
  const { moduleSlug, skipHeyGen, skipUpload, outputDir } = parseArgs();

  console.log(`\n=== Generating video for module: ${moduleSlug} ===\n`);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Fetch module data from Supabase
  console.log("[1/6] Fetching module data from Supabase...");
  const supabase = getSupabase();
  const { data: moduleData, error: moduleError } = await supabase
    .from("modules")
    .select("*")
    .eq("slug", moduleSlug)
    .single();

  if (moduleError || !moduleData) {
    throw new Error(
      `Module not found: ${moduleSlug}. Error: ${moduleError?.message}`
    );
  }

  // Fetch lessons for this module
  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", moduleData.id)
    .order("order", { ascending: true });

  const lessonInfos: LessonInfo[] = (lessons || []).map((l: any) => ({
    title: l.title,
    slug: l.slug,
    content: l.content || "",
  }));

  console.log(
    `  Found module: ${moduleData.title} with ${lessonInfos.length} lessons`
  );

  // 2. Generate scripts
  console.log("[2/6] Generating scripts via Claude...");
  let scripts: ModuleScripts;
  try {
    scripts = await generateModuleScripts(
      moduleSlug,
      moduleData.title,
      lessonInfos
    );
  } catch (e: any) {
    console.warn(
      `  Warning: Could not generate scripts via Claude (${e.message}). Using placeholders.`
    );
    scripts = generatePlaceholderScripts(moduleSlug, moduleData.title, lessonInfos);
  }

  // Save scripts to disk for debugging
  const scriptsPath = path.join(outputDir, `${moduleSlug}-scripts.json`);
  fs.writeFileSync(scriptsPath, JSON.stringify(scripts, null, 2));
  console.log(`  Scripts saved to: ${scriptsPath}`);

  // 3. Generate ElevenLabs audio + HeyGen talking head videos
  console.log("[3/6] Generating audio (ElevenLabs) + talking head videos (HeyGen)...");
  const talkingHeadUrls: string[] = [];
  const audioDir = path.join(outputDir, `${moduleSlug}-audio`);
  if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

  if (skipHeyGen) {
    console.log("  Skipping HeyGen (--skip-heygen flag). Using placeholders.");
    for (const segment of scripts.talkingHeadSegments) {
      talkingHeadUrls.push(
        `https://placeholder.heygen.com/${segment.purpose}.mp4`
      );
    }
  } else {
    for (let i = 0; i < scripts.talkingHeadSegments.length; i++) {
      const segment = scripts.talkingHeadSegments[i];
      console.log(`  [${i + 1}/${scripts.talkingHeadSegments.length}] ${segment.purpose}...`);
      try {
        // Step 1: Generate ElevenLabs audio
        const audioPath = path.join(audioDir, `${segment.purpose}-${i}.mp3`);
        await generateElevenLabsAudio(segment.script, audioPath);

        // Step 2: Upload audio to HeyGen
        console.log(`    [heygen] Uploading audio...`);
        const audioUrl = await uploadAudioToHeyGen(audioPath);
        console.log(`    [heygen] Audio uploaded: ${audioUrl}`);

        // Step 3: Create HeyGen video with ElevenLabs audio
        const videoId = await createHeyGenVideo(segment.script, `${moduleSlug} - ${segment.purpose}`, audioUrl);
        console.log(`    [heygen] Video ID: ${videoId}. Waiting...`);
        const videoUrl = await waitForHeyGenVideo(videoId);
        talkingHeadUrls.push(videoUrl);
        console.log(`    Done: ${videoUrl}`);
      } catch (e: any) {
        console.warn(
          `  Warning: Failed for ${segment.purpose}: ${e.message}. Using placeholder.`
        );
        talkingHeadUrls.push(
          `https://placeholder.heygen.com/${segment.purpose}.mp4`
        );
      }
    }
  }

  // 4. Build Remotion composition props
  console.log("[4/6] Building composition...");
  const FPS = 30;

  type VideoSegment =
    | {
        type: "talking-head";
        durationInFrames: number;
        src: string;
      }
    | {
        type: "code-screen";
        durationInFrames: number;
        lines: Array<{ type: string; text: string; delay?: number }>;
        voiceoverUrl?: string;
      };

  const segments: VideoSegment[] = [];

  for (const seqItem of scripts.sequence) {
    if (seqItem.type === "talking-head") {
      const thSegment = scripts.talkingHeadSegments[seqItem.index];
      if (!thSegment) continue;
      segments.push({
        type: "talking-head",
        durationInFrames: Math.round(
          thSegment.estimatedDurationSeconds * FPS
        ),
        src: talkingHeadUrls[seqItem.index] || "https://placeholder.heygen.com/default.mp4",
      });
    } else {
      const codeSegment = scripts.codeSegments[seqItem.index];
      if (!codeSegment) continue;
      segments.push({
        type: "code-screen",
        durationInFrames: Math.round(
          codeSegment.estimatedDurationSeconds * FPS
        ),
        lines: codeSegment.lines,
        voiceoverUrl: undefined,
      });
    }
  }

  const totalDuration = segments.reduce(
    (sum, s) => sum + s.durationInFrames,
    0
  );

  const inputProps = {
    segments,
    transitionDurationInFrames: 15,
  };

  console.log(
    `  Total duration: ${totalDuration} frames (${(totalDuration / FPS).toFixed(1)} seconds)`
  );

  // 5. Render with Remotion
  console.log("[5/6] Rendering video with Remotion...");

  const entryPoint = path.resolve(__dirname, "../src/index.tsx");
  const bundled = await bundle({
    entryPoint,
    // Use the remotion.config.ts from the video-pipeline directory
    webpackOverride: (config) => config,
  });

  const composition = await selectComposition({
    serveUrl: bundled,
    id: "ModuleVideo",
    inputProps,
  });

  // Override duration with our calculated total
  composition.durationInFrames = totalDuration;
  composition.fps = FPS;
  composition.width = 1920;
  composition.height = 1080;

  const outputPath = path.join(outputDir, `${moduleSlug}.mp4`);

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: outputPath,
    inputProps,
  });

  console.log(`  Video rendered: ${outputPath}`);

  // 6. Upload to Supabase Storage
  if (skipUpload) {
    console.log("[6/6] Skipping upload (--skip-upload flag).");
  } else {
    console.log("[6/6] Uploading to Supabase Storage...");

    try {
      const videoBuffer = fs.readFileSync(outputPath);
      const storagePath = `module-videos/${moduleSlug}/${moduleSlug}.mp4`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(storagePath, videoBuffer, {
          contentType: "video/mp4",
          upsert: true,
        });

      if (uploadError) {
        console.warn(`  Upload warning: ${uploadError.message}`);
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from("videos").getPublicUrl(storagePath);

        console.log(`  Uploaded to: ${publicUrl}`);

        // Update lesson_videos table
        const { error: dbError } = await supabase
          .from("lesson_videos")
          .upsert(
            {
              module_id: moduleData.id,
              module_slug: moduleSlug,
              video_url: publicUrl,
              storage_path: storagePath,
              status: "completed",
              duration_seconds: Math.round(totalDuration / FPS),
              generated_at: new Date().toISOString(),
            },
            { onConflict: "module_slug" }
          );

        if (dbError) {
          console.warn(
            `  DB update warning: ${dbError.message}`
          );
        } else {
          console.log("  Database updated.");
        }
      }
    } catch (e: any) {
      console.warn(`  Upload failed: ${e.message}`);
    }
  }

  console.log(`\n=== Video generation complete for: ${moduleSlug} ===\n`);
  return outputPath;
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
