#!/usr/bin/env npx tsx
/**
 * Generate new thumbnails for all 14 OA lessons and upload to Vimeo.
 *
 * Design: Leo frame (left) + lesson title + small CSS diagram (right)
 * on a dark background matching OA brand (black/white/green).
 *
 * Usage: npx tsx video-pipeline/scripts/generate-thumbnails.ts
 */

import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

const VIMEO_TOKEN = process.env.VIMEO_ACCESS_TOKEN || "8840a45a6c834056fcc04bcebfe8940d";
const OUTPUT_DIR = path.resolve(__dirname, "../output");
// Single master Leo frame (mouth closed, natural expression) — same avatar across all videos
const LEO_FRAME_PATH = path.join(OUTPUT_DIR, "leo_frame_closed.jpg");

// All 14 lessons mapped to their Vimeo video IDs
const LESSONS = [
  { module: 1, lesson: 1, vimeoId: "1179049901", title: "What is AI Orchestration?", diagram: "orchestra" },
  { module: 1, lesson: 2, vimeoId: "1179049937", title: "The AI Landscape in 2026", diagram: "landscape" },
  { module: 2, lesson: 1, vimeoId: "1179049963", title: "Day in the Life of an AI Orchestrator", diagram: "dayloop" },
  { module: 2, lesson: 2, vimeoId: "1179049989", title: "Career Paths & Opportunities", diagram: "paths" },
  { module: 3, lesson: 1, vimeoId: "1179050013", title: "AI Models & Providers", diagram: "models" },
  { module: 3, lesson: 2, vimeoId: "1179050030", title: "Orchestration Frameworks", diagram: "frameworks" },
  { module: 4, lesson: 1, vimeoId: "1179050050", title: "Anatomy of a Great Prompt", diagram: "prompt" },
  { module: 4, lesson: 2, vimeoId: "1179050073", title: "Advanced Prompt Techniques", diagram: "chain" },
  { module: 5, lesson: 1, vimeoId: "1179050097", title: "Workflow Design Principles", diagram: "workflow" },
  { module: 5, lesson: 2, vimeoId: "1179050122", title: "Build a Research Agent", diagram: "agent" },
  { module: 6, lesson: 1, vimeoId: "1179050140", title: "Ethics for AI Orchestrators", diagram: "shield" },
  { module: 6, lesson: 2, vimeoId: "1179050167", title: "Building Responsible AI Systems", diagram: "checklist" },
  { module: 7, lesson: 1, vimeoId: "1179050187", title: "What You've Learned", diagram: "recap" },
  { module: 7, lesson: 2, vimeoId: "1179050217", title: "Advanced Courses & Certification", diagram: "rocket" },
];

/**
 * Returns an SVG-based CSS diagram relevant to the lesson content.
 * Each is a small, simple visual that contextualises the lesson topic.
 */
function getDiagramSvg(type: string): string {
  const green = "#00C853";
  const dimGreen = "rgba(0,200,83,0.25)";
  const white = "#ffffff";
  const dim = "rgba(255,255,255,0.35)";

  switch (type) {
    case "orchestra":
      // Hub-and-spoke: orchestrator in centre, 4 agents around
      return `<svg viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="100" r="24" fill="none" stroke="${green}" stroke-width="2.5"/>
        <text x="100" y="106" text-anchor="middle" fill="${green}" font-size="14" font-family="sans-serif">ORC</text>
        ${[[100, 20], [180, 100], [100, 180], [20, 100]].map(([x, y]) => `
          <line x1="100" y1="100" x2="${x}" y2="${y}" stroke="${dim}" stroke-width="1.5" stroke-dasharray="4 3"/>
          <circle cx="${x}" cy="${y}" r="14" fill="none" stroke="${white}" stroke-width="1.5"/>
          <text x="${x}" y="${(y as number) + 5}" text-anchor="middle" fill="${white}" font-size="10" font-family="sans-serif">AI</text>
        `).join("")}
      </svg>`;

    case "landscape":
      // Layered bars representing different AI domains
      return `<svg viewBox="0 0 200 200" width="200" height="200">
        ${[
          { y: 30, w: 160, label: "LLMs", color: green },
          { y: 65, w: 130, label: "Vision", color: white },
          { y: 100, w: 150, label: "Agents", color: green },
          { y: 135, w: 110, label: "Multi-modal", color: white },
          { y: 170, w: 170, label: "Open Source", color: green },
        ].map(({ y, w, label, color }) => `
          <rect x="${(200 - w) / 2}" y="${y}" width="${w}" height="24" rx="4" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.7"/>
          <text x="100" y="${y + 16}" text-anchor="middle" fill="${color}" font-size="11" font-family="sans-serif">${label}</text>
        `).join("")}
      </svg>`;

    case "dayloop":
      // Circular loop: Plan → Build → Monitor → repeat
      return `<svg viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="100" r="70" fill="none" stroke="${dimGreen}" stroke-width="2" stroke-dasharray="6 4"/>
        ${[
          { angle: -90, label: "Plan" },
          { angle: 30, label: "Build" },
          { angle: 150, label: "Monitor" },
        ].map(({ angle, label }) => {
          const rad = (angle * Math.PI) / 180;
          const x = 100 + 70 * Math.cos(rad);
          const y = 100 + 70 * Math.sin(rad);
          return `
            <circle cx="${x}" cy="${y}" r="18" fill="#0a0a0a" stroke="${green}" stroke-width="2"/>
            <text x="${x}" y="${y + 4}" text-anchor="middle" fill="${white}" font-size="10" font-family="sans-serif">${label}</text>
          `;
        }).join("")}
        <!-- arrows -->
        <path d="M 130 38 L 140 42 L 132 48" fill="none" stroke="${green}" stroke-width="1.5"/>
        <path d="M 128 162 L 120 170 L 118 160" fill="none" stroke="${green}" stroke-width="1.5"/>
        <path d="M 42 72 L 38 62 L 48 64" fill="none" stroke="${green}" stroke-width="1.5"/>
      </svg>`;

    case "paths":
      // Branching tree: one root, three branches
      return `<svg viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="40" r="16" fill="none" stroke="${green}" stroke-width="2"/>
        <text x="100" y="44" text-anchor="middle" fill="${green}" font-size="9" font-family="sans-serif">YOU</text>
        ${[
          { x: 40, label: "Consult" },
          { x: 100, label: "In-House" },
          { x: 160, label: "Architect" },
        ].map(({ x, label }) => `
          <line x1="100" y1="56" x2="${x}" y2="120" stroke="${dim}" stroke-width="1.5"/>
          <rect x="${x - 30}" y="120" width="60" height="28" rx="4" fill="none" stroke="${white}" stroke-width="1.5"/>
          <text x="${x}" y="138" text-anchor="middle" fill="${white}" font-size="9" font-family="sans-serif">${label}</text>
        `).join("")}
        <!-- coaching path from middle -->
        <line x1="100" y1="148" x2="100" y2="174" stroke="${dim}" stroke-width="1.5"/>
        <rect x="70" y="170" width="60" height="24" rx="4" fill="none" stroke="${green}" stroke-width="1.5"/>
        <text x="100" y="186" text-anchor="middle" fill="${green}" font-size="9" font-family="sans-serif">Coach</text>
      </svg>`;

    case "models":
      // Grid of model provider boxes
      return `<svg viewBox="0 0 200 200" width="200" height="200">
        ${[
          { x: 15, y: 20, label: "Claude", color: green },
          { x: 110, y: 20, label: "GPT", color: white },
          { x: 15, y: 85, label: "Gemini", color: white },
          { x: 110, y: 85, label: "Llama", color: green },
          { x: 62, y: 150, label: "Mistral", color: white },
        ].map(({ x, y, label, color }) => `
          <rect x="${x}" y="${y}" width="75" height="50" rx="6" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.8"/>
          <text x="${x + 37}" y="${y + 30}" text-anchor="middle" fill="${color}" font-size="12" font-family="sans-serif">${label}</text>
        `).join("")}
      </svg>`;

    case "frameworks":
      // Horizontal pipeline: boxes connected by arrows
      return `<svg viewBox="0 0 220 200" width="220" height="200">
        ${[
          { x: 10, y: 85, label: "CrewAI", color: green },
          { x: 80, y: 85, label: "LangGraph", color: white },
          { x: 155, y: 85, label: "Magpipe", color: green },
        ].map(({ x, y, label, color }) => `
          <rect x="${x}" y="${y}" width="62" height="32" rx="5" fill="none" stroke="${color}" stroke-width="1.5"/>
          <text x="${x + 31}" y="${y + 20}" text-anchor="middle" fill="${color}" font-size="10" font-family="sans-serif">${label}</text>
        `).join("")}
        <line x1="72" y1="101" x2="80" y2="101" stroke="${dim}" stroke-width="1.5" marker-end="url(#arrowW)"/>
        <line x1="142" y1="101" x2="155" y2="101" stroke="${dim}" stroke-width="1.5" marker-end="url(#arrowW)"/>
        <defs><marker id="arrowW" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="${dim}"/></marker></defs>
        <!-- subtitle -->
        <text x="110" y="150" text-anchor="middle" fill="${dim}" font-size="10" font-family="sans-serif">Choose the right tool for the task</text>
      </svg>`;

    case "prompt":
      // RACE framework boxes stacked
      return `<svg viewBox="0 0 200 200" width="200" height="200">
        ${[
          { y: 10, letter: "R", label: "Role", color: green },
          { y: 55, letter: "A", label: "Action", color: white },
          { y: 100, letter: "C", label: "Context", color: green },
          { y: 145, letter: "E", label: "Expect", color: white },
        ].map(({ y, letter, label, color }) => `
          <circle cx="30" cy="${y + 18}" r="14" fill="none" stroke="${color}" stroke-width="2"/>
          <text x="30" y="${y + 23}" text-anchor="middle" fill="${color}" font-size="14" font-weight="bold" font-family="sans-serif">${letter}</text>
          <line x1="48" y1="${y + 18}" x2="64" y2="${y + 18}" stroke="${dim}" stroke-width="1"/>
          <text x="68" y="${y + 23}" fill="${color}" font-size="13" font-family="sans-serif">${label}</text>
        `).join("")}
      </svg>`;

    case "chain":
      // Chain of thought: linked circles descending
      return `<svg viewBox="0 0 200 200" width="200" height="200">
        ${[
          { x: 40, y: 30, label: "Think" },
          { x: 100, y: 70, label: "Step" },
          { x: 60, y: 120, label: "Reason" },
          { x: 130, y: 160, label: "Answer" },
        ].map(({ x, y, label }, i, arr) => {
          const next = arr[i + 1];
          return `
            <circle cx="${x}" cy="${y}" r="16" fill="none" stroke="${i % 2 === 0 ? green : white}" stroke-width="2"/>
            <text x="${x}" y="${y + 4}" text-anchor="middle" fill="${i % 2 === 0 ? green : white}" font-size="9" font-family="sans-serif">${label}</text>
            ${next ? `<line x1="${x}" y1="${y + 16}" x2="${next.x}" y2="${next.y - 16}" stroke="${dim}" stroke-width="1.5" stroke-dasharray="4 3"/>` : ""}
          `;
        }).join("")}
      </svg>`;

    case "workflow":
      // Vertical flowchart: 4 steps with arrows
      return `<svg viewBox="0 0 200 220" width="200" height="220">
        ${[
          { y: 10, label: "Input" },
          { y: 65, label: "Process" },
          { y: 120, label: "Review" },
          { y: 175, label: "Output" },
        ].map(({ y, label }, i) => `
          <rect x="50" y="${y}" width="100" height="36" rx="6" fill="none" stroke="${i % 2 === 0 ? green : white}" stroke-width="2"/>
          <text x="100" y="${y + 22}" text-anchor="middle" fill="${i % 2 === 0 ? green : white}" font-size="12" font-family="sans-serif">${label}</text>
          ${i < 3 ? `<line x1="100" y1="${y + 36}" x2="100" y2="${y + 55}" stroke="${dim}" stroke-width="1.5" marker-end="url(#arrowD)"/>` : ""}
        `).join("")}
        <defs><marker id="arrowD" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 5 10 L 10 0" fill="none" stroke="${dim}" stroke-width="1.5"/></marker></defs>
      </svg>`;

    case "agent":
      // Agent loop: question → search → analyse → report
      return `<svg viewBox="0 0 200 200" width="200" height="200">
        <rect x="55" y="55" width="90" height="90" rx="10" fill="none" stroke="${dimGreen}" stroke-width="1.5"/>
        ${[
          { x: 100, y: 20, label: "Question" },
          { x: 180, y: 100, label: "Search" },
          { x: 100, y: 180, label: "Analyse" },
          { x: 20, y: 100, label: "Report" },
        ].map(({ x, y, label }, i) => `
          <circle cx="${x}" cy="${y}" r="18" fill="#0a0a0a" stroke="${i % 2 === 0 ? green : white}" stroke-width="2"/>
          <text x="${x}" y="${y + 4}" text-anchor="middle" fill="${i % 2 === 0 ? green : white}" font-size="8" font-family="sans-serif">${label}</text>
        `).join("")}
      </svg>`;

    case "shield":
      // Shield icon with checkmark
      return `<svg viewBox="0 0 200 200" width="200" height="200">
        <path d="M 100 20 L 170 55 L 170 110 C 170 150 140 180 100 195 C 60 180 30 150 30 110 L 30 55 Z"
              fill="none" stroke="${green}" stroke-width="2.5"/>
        <polyline points="65,105 90,130 140,75" fill="none" stroke="${white}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="100" y="170" text-anchor="middle" fill="${dim}" font-size="10" font-family="sans-serif">Ethical AI</text>
      </svg>`;

    case "checklist":
      // Checklist with ticks
      return `<svg viewBox="0 0 200 200" width="200" height="200">
        ${[
          { y: 25, label: "Transparency", done: true },
          { y: 65, label: "Bias checks", done: true },
          { y: 105, label: "Privacy", done: true },
          { y: 145, label: "Audit trails", done: false },
        ].map(({ y, label, done }) => `
          <rect x="20" y="${y}" width="20" height="20" rx="3" fill="none" stroke="${done ? green : dim}" stroke-width="1.5"/>
          ${done ? `<polyline points="24,${y + 10} 28,${y + 15} 36,${y + 5}" fill="none" stroke="${green}" stroke-width="2" stroke-linecap="round"/>` : ""}
          <text x="50" y="${y + 15}" fill="${done ? white : dim}" font-size="13" font-family="sans-serif">${label}</text>
        `).join("")}
      </svg>`;

    case "recap":
      // Star/badge with modules radiating
      return `<svg viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="100" r="35" fill="none" stroke="${green}" stroke-width="2.5"/>
        <text x="100" y="96" text-anchor="middle" fill="${green}" font-size="11" font-family="sans-serif" font-weight="bold">7</text>
        <text x="100" y="112" text-anchor="middle" fill="${white}" font-size="9" font-family="sans-serif">Modules</text>
        ${[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle - 90) * Math.PI / 180;
          const x1 = 100 + 40 * Math.cos(rad);
          const y1 = 100 + 40 * Math.sin(rad);
          const x2 = 100 + 65 * Math.cos(rad);
          const y2 = 100 + 65 * Math.sin(rad);
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${dimGreen}" stroke-width="2"/>
                  <circle cx="${x2}" cy="${y2}" r="5" fill="${green}" opacity="0.6"/>`;
        }).join("")}
      </svg>`;

    case "rocket":
      // Simple rocket / upward arrow representing next level
      return `<svg viewBox="0 0 200 200" width="200" height="200">
        <path d="M 100 20 L 120 80 L 110 80 L 110 150 L 90 150 L 90 80 L 80 80 Z"
              fill="none" stroke="${green}" stroke-width="2.5" stroke-linejoin="round"/>
        <circle cx="100" cy="60" r="6" fill="none" stroke="${white}" stroke-width="1.5"/>
        <!-- exhaust -->
        <line x1="92" y1="150" x2="85" y2="175" stroke="${dim}" stroke-width="1.5"/>
        <line x1="100" y1="150" x2="100" y2="180" stroke="${dim}" stroke-width="1.5"/>
        <line x1="108" y1="150" x2="115" y2="175" stroke="${dim}" stroke-width="1.5"/>
        <!-- stars -->
        <circle cx="40" cy="50" r="2" fill="${white}" opacity="0.5"/>
        <circle cx="160" cy="35" r="2" fill="${white}" opacity="0.5"/>
        <circle cx="150" cy="120" r="1.5" fill="${white}" opacity="0.4"/>
        <circle cx="50" cy="140" r="1.5" fill="${white}" opacity="0.4"/>
      </svg>`;

    default:
      return "";
  }
}

function buildThumbnailHtml(lesson: typeof LESSONS[0], leoFramePath: string): string {
  const leoBase64 = fs.readFileSync(leoFramePath).toString("base64");
  const diagram = getDiagramSvg(lesson.diagram);
  const moduleLabel = `Module ${lesson.module} · Lesson ${lesson.lesson}`;

  return `<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1920px;
    height: 1080px;
    background: #0a0a0a;
    font-family: 'Sora', sans-serif;
    display: flex;
    overflow: hidden;
  }
  .leo-side {
    width: 720px;
    height: 1080px;
    position: relative;
    flex-shrink: 0;
  }
  .leo-side img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  /* gradient fade from Leo into dark bg */
  .leo-side::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 200px; height: 100%;
    background: linear-gradient(to right, transparent, #0a0a0a);
  }
  .content-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 80px 100px 80px 60px;
    position: relative;
  }
  .module-label {
    font-size: 22px;
    font-weight: 400;
    color: #00C853;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .title {
    font-size: 56px;
    font-weight: 700;
    color: #ffffff;
    line-height: 1.15;
    margin-bottom: 50px;
    max-width: 800px;
  }
  .diagram-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 260px;
    height: 260px;
  }
  .diagram-container svg {
    width: 100%;
    height: 100%;
  }
  /* OA watermark top-left */
  .watermark {
    position: absolute;
    top: 30px;
    right: 60px;
    font-size: 14px;
    font-weight: 600;
    color: rgba(255,255,255,0.25);
    letter-spacing: 3px;
    text-transform: uppercase;
  }
  /* subtle green line accent */
  .accent-line {
    width: 60px;
    height: 3px;
    background: #00C853;
    margin-bottom: 24px;
    border-radius: 2px;
  }
</style>
</head>
<body>
  <div class="leo-side">
    <img src="data:image/jpeg;base64,${leoBase64}" alt="Leo"/>
  </div>
  <div class="content-side">
    <span class="watermark">Orchestrator Academy</span>
    <div class="accent-line"></div>
    <div class="module-label">${moduleLabel}</div>
    <div class="title">${lesson.title}</div>
    <div class="diagram-container">${diagram}</div>
  </div>
</body>
</html>`;
}

async function uploadThumbnailToVimeo(videoId: string, thumbnailPath: string): Promise<void> {
  // Step 1: Create a picture resource
  const createRes = await fetch(`https://api.vimeo.com/videos/${videoId}/pictures`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VIMEO_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.vimeo.*+json;version=3.4",
    },
    body: JSON.stringify({ active: true }),
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    throw new Error(`Failed to create picture resource for ${videoId}: ${createRes.status} ${text}`);
  }

  const pictureData = await createRes.json();
  const uploadLink = pictureData.link;
  const pictureUri = pictureData.uri;

  // Step 2: Upload the image file to the upload link
  const imageBuffer = fs.readFileSync(thumbnailPath);
  const uploadRes = await fetch(uploadLink, {
    method: "PUT",
    headers: { "Content-Type": "image/png" },
    body: imageBuffer,
  });

  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    throw new Error(`Failed to upload thumbnail for ${videoId}: ${uploadRes.status} ${text}`);
  }

  // Step 3: Set it as active
  const activateRes = await fetch(`https://api.vimeo.com${pictureUri}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${VIMEO_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.vimeo.*+json;version=3.4",
    },
    body: JSON.stringify({ active: true }),
  });

  if (!activateRes.ok) {
    const text = await activateRes.text();
    console.warn(`  Warning: could not activate thumbnail for ${videoId}: ${activateRes.status} ${text}`);
  }
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  console.log("Generating thumbnails for 14 lessons...\n");

  if (!fs.existsSync(LEO_FRAME_PATH)) {
    console.error(`Missing master Leo frame at ${LEO_FRAME_PATH}`);
    process.exit(1);
  }

  for (const lesson of LESSONS) {
    const dir = path.join(OUTPUT_DIR, `Module ${lesson.module}`, `Lesson ${lesson.lesson}`);
    const thumbnailPath = path.join(dir, "thumbnail.png");

    console.log(`M${lesson.module}L${lesson.lesson}: ${lesson.title}`);

    // Generate HTML — use the single master Leo frame (mouth closed)
    const html = buildThumbnailHtml(lesson, LEO_FRAME_PATH);

    // Render with Playwright
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    // Wait for Sora font to load
    await page.waitForTimeout(1500);
    await page.screenshot({ path: thumbnailPath, type: "png" });
    await page.close();

    console.log(`  ✓ Rendered → ${thumbnailPath}`);

    // Upload to Vimeo
    try {
      await uploadThumbnailToVimeo(lesson.vimeoId, thumbnailPath);
      console.log(`  ✓ Uploaded to Vimeo (${lesson.vimeoId})`);
    } catch (err: any) {
      console.error(`  ✗ Vimeo upload failed: ${err.message}`);
    }

    console.log();
  }

  await browser.close();
  console.log("Done!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
