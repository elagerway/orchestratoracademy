/**
 * generate-all.ts
 *
 * Batch script that generates videos for all modules.
 * Fetches all modules from Supabase, then runs the video generation
 * pipeline for each one sequentially.
 *
 * Usage:
 *   npx tsx video-pipeline/scripts/generate-all.ts
 *   npx tsx video-pipeline/scripts/generate-all.ts --skip-heygen
 *   npx tsx video-pipeline/scripts/generate-all.ts --skip-heygen --skip-upload
 */

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";

// Load env from parent project
const envPath = path.resolve(__dirname, "../../.env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

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

interface ProgressEntry {
  slug: string;
  status: "completed" | "failed" | "skipped";
  error?: string;
  outputPath?: string;
  timestamp: string;
}

function loadProgress(progressFile: string): Record<string, ProgressEntry> {
  if (fs.existsSync(progressFile)) {
    try {
      return JSON.parse(fs.readFileSync(progressFile, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
}

function saveProgress(
  progressFile: string,
  progress: Record<string, ProgressEntry>
) {
  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
}

async function main() {
  const args = process.argv.slice(2);
  const passthrough = args.filter((a) => a.startsWith("--")).join(" ");
  const outputDir = path.resolve(__dirname, "../output");
  const progressFile = path.join(outputDir, "progress.json");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("\n=== AI Orchestrator Academy — Batch Video Generation ===\n");

  // Fetch all modules
  const supabase = getSupabase();
  const { data: modules, error } = await supabase
    .from("modules")
    .select("*")
    .order("order_index", { ascending: true });

  if (error || !modules) {
    throw new Error(`Failed to fetch modules: ${error?.message}`);
  }

  console.log(`Found ${modules.length} modules.\n`);

  // Load progress tracker
  const progress = loadProgress(progressFile);

  let completed = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < modules.length; i++) {
    const mod: any = modules[i];
    const slug: string = mod.slug;

    console.log(
      `\n--- [${i + 1}/${modules.length}] ${mod.title} (${slug}) ---`
    );

    // Skip already-completed videos
    if (progress[slug]?.status === "completed") {
      console.log("  Already completed. Skipping.");
      skipped++;
      continue;
    }

    try {
      // Run the single-module generator as a subprocess
      const cmd = `npx tsx ${path.resolve(
        __dirname,
        "generate-module-video.ts"
      )} --module ${slug} --output ${outputDir} ${passthrough}`;

      console.log(`  Running: ${cmd}`);
      execSync(cmd, {
        stdio: "inherit",
        cwd: path.resolve(__dirname, "../.."),
        env: process.env,
      });

      progress[slug] = {
        slug,
        status: "completed",
        outputPath: path.join(outputDir, `${slug}.mp4`),
        timestamp: new Date().toISOString(),
      };
      completed++;
    } catch (e: any) {
      console.error(`  FAILED: ${e.message}`);
      progress[slug] = {
        slug,
        status: "failed",
        error: e.message,
        timestamp: new Date().toISOString(),
      };
      failed++;
    }

    saveProgress(progressFile, progress);
  }

  console.log("\n=== Batch Generation Summary ===");
  console.log(`  Total modules: ${modules.length}`);
  console.log(`  Completed:     ${completed}`);
  console.log(`  Failed:        ${failed}`);
  console.log(`  Skipped:       ${skipped}`);
  console.log(`  Progress file: ${progressFile}`);
  console.log("");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
