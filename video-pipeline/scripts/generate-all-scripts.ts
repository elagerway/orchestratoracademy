/**
 * Generate scripts (only) for all Claude Code Superpowers modules.
 * Skips HeyGen/Remotion/ffmpeg — just produces the JSON script files + voiceover audio.
 *
 * Usage: npx tsx video-pipeline/scripts/generate-all-scripts.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

const envPath = path.resolve(__dirname, "../../.env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

import { createClient } from "@supabase/supabase-js";
import {
  generateModuleScripts,
  generatePlaceholderScripts,
  type ModuleScripts,
  type LessonInfo,
} from "./generate-scripts";

const COURSE_ID = "11110000-0000-0000-0000-000000000001";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

async function generateElevenLabsAudio(script: string, outputPath: string): Promise<string> {
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "WQcQveC0hbQNvI69FWyU";
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("Missing ELEVENLABS_API_KEY");

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
  return outputPath;
}

async function main() {
  const supabase = getSupabase();
  const outputDir = path.resolve(__dirname, "../output");

  // Fetch all modules for the Superpowers course
  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", COURSE_ID)
    .order("order");

  if (!modules?.length) {
    console.error("No modules found for course", COURSE_ID);
    process.exit(1);
  }

  // Skip module 1 (superpower-stack) since it's already being processed
  const remaining = modules.filter((m: any) => m.slug !== "superpower-stack");

  console.log(`\n=== Generating scripts for ${remaining.length} modules ===\n`);

  for (const mod of remaining) {
    const slug = mod.slug;
    const scriptsPath = path.join(outputDir, `${slug}-scripts.json`);

    // Skip if already generated
    if (fs.existsSync(scriptsPath)) {
      console.log(`[${slug}] Scripts already exist, skipping.`);
      continue;
    }

    console.log(`[${slug}] Fetching lessons...`);
    const { data: lessons } = await supabase
      .from("lessons")
      .select("*")
      .eq("module_id", mod.id)
      .order("order");

    const lessonInfos: LessonInfo[] = (lessons || []).map((l: any) => ({
      title: l.title,
      slug: l.slug,
      content: l.content || "",
    }));

    console.log(`[${slug}] Generating scripts (${lessonInfos.length} lessons)...`);
    let scripts: ModuleScripts;
    try {
      scripts = await generateModuleScripts(slug, mod.title, lessonInfos);
    } catch (e: any) {
      console.warn(`  Warning: Claude failed (${e.message}). Using placeholders.`);
      scripts = generatePlaceholderScripts(slug, mod.title, lessonInfos);
    }

    fs.writeFileSync(scriptsPath, JSON.stringify(scripts, null, 2));
    console.log(`[${slug}] Scripts saved.`);

    // Generate voiceover audio for code segments
    const audioDir = path.join(outputDir, `${slug}-audio`);
    if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

    // Talking head audio
    for (let i = 0; i < scripts.talkingHeadSegments.length; i++) {
      const seg = scripts.talkingHeadSegments[i];
      const audioPath = path.join(audioDir, `${seg.purpose}-${i}.mp3`);
      if (fs.existsSync(audioPath)) continue;
      try {
        console.log(`  [${slug}] Audio: ${seg.purpose} (${seg.script.length} chars)...`);
        await generateElevenLabsAudio(seg.script, audioPath);
      } catch (e: any) {
        console.warn(`  Warning: ElevenLabs failed for ${seg.purpose}: ${e.message}`);
      }
    }

    // Code screen voiceover audio
    for (let i = 0; i < scripts.codeSegments.length; i++) {
      const seg = scripts.codeSegments[i];
      if (!seg.voiceoverScript) continue;
      const audioPath = path.join(audioDir, `voiceover-code${i}.mp3`);
      if (fs.existsSync(audioPath)) continue;
      try {
        console.log(`  [${slug}] Voiceover: code ${i} (${seg.voiceoverScript.length} chars)...`);
        await generateElevenLabsAudio(seg.voiceoverScript, audioPath);
      } catch (e: any) {
        console.warn(`  Warning: ElevenLabs failed for voiceover ${i}: ${e.message}`);
      }
    }

    // Check voiceover lengths
    for (let i = 0; i < scripts.codeSegments.length; i++) {
      const seg = scripts.codeSegments[i];
      const words = (seg.voiceoverScript || "").split(/\s+/).length;
      const estSeconds = words * 0.4;
      console.log(`  [${slug}] Code ${i} voiceover: ${words} words, ~${estSeconds.toFixed(0)}s (target: ${seg.estimatedDurationSeconds}s)`);
      if (estSeconds < seg.estimatedDurationSeconds * 0.6) {
        console.warn(`    ⚠ Voiceover too short! May have silence gaps.`);
      }
    }

    console.log(`[${slug}] Done.\n`);
  }

  console.log("=== All scripts generated ===");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
