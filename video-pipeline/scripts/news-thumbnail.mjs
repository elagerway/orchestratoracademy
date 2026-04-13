#!/usr/bin/env node
/**
 * Add bold text overlays to composite thumbnail bases (thumb-base.png).
 * Each base already has AI background + Leo blended in.
 * This step adds outlined text, badges, and accents.
 *
 * 1280x720 (YouTube standard).
 */

import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, "../output/News");

function txt(text, size, color, stroke = 10, glow = null) {
  const glowStyle = glow ? `filter:drop-shadow(0 0 20px ${glow}) drop-shadow(0 0 40px ${glow});` : "";
  return `<span style="font-size:${size}px;font-weight:900;color:${color};-webkit-text-stroke:${stroke}px #000;paint-order:stroke fill;line-height:0.88;letter-spacing:-3px;${glowStyle}">${text}</span>`;
}

// Hero text — the big number that needs to POP over any background
function hero(text, size, color, glow) {
  return `<div style="position:relative;display:inline-block;">
    <div style="position:absolute;inset:-14px -20px;background:rgba(0,0,0,0.55);border-radius:12px;border:3px solid rgba(255,255,255,0.12);"></div>
    <span style="position:relative;font-size:${size}px;font-weight:900;color:${color};-webkit-text-stroke:14px #000;paint-order:stroke fill;line-height:0.88;letter-spacing:-4px;filter:drop-shadow(0 0 24px ${glow}) drop-shadow(0 0 48px ${glow}) drop-shadow(0 4px 8px rgba(0,0,0,0.8));">${text}</span>
  </div>`;
}

function sub(text, size, color, stroke = 6) {
  return `<span style="font-size:${size}px;font-weight:900;color:${color};-webkit-text-stroke:${stroke}px #000;paint-order:stroke fill;line-height:0.92;letter-spacing:-1px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.9));">${text}</span>`;
}

function label(text, color = "rgba(255,255,255,0.6)") {
  return `<div style="font-size:20px;font-weight:700;color:${color};letter-spacing:2px;-webkit-text-stroke:2px #000;paint-order:stroke fill;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.9));">${text}</div>`;
}

function badge(text, color) {
  return `<div style="display:inline-block;background:${color};color:#fff;font-size:14px;font-weight:800;padding:7px 18px;border-radius:5px;letter-spacing:2px;text-transform:uppercase;box-shadow:0 4px 12px rgba(0,0,0,0.5);">${text}</div>`;
}

const VIDEOS = [
  {
    slug: "gpt-54-computer-use",
    // Leo right, text left
    textSide: "left",
    html: () => `
      <div style="padding:50px 0 0 60px;">
        ${badge("BREAKING", "#ef4444")}
        <div style="margin-top:14px;">${hero("75%", 170, "#38bdf8", "#38bdf8")}</div>
        <div style="margin-top:10px;">${sub("BEATS", 58, "#fff")}</div>
        <div>${sub("HUMANS", 58, "#fff")}</div>
        ${label("GPT-5.4 COMPUTER USE")}
      </div>`,
  },
  {
    slug: "amazon-16k-layoffs-ai",
    textSide: "right",
    html: () => `
      <div style="padding:60px 60px 0 0;text-align:right;">
        ${badge("LAYOFFS", "#ef4444")}
        <div style="margin-top:14px;">${hero("16,000", 150, "#ef4444", "#ef4444")}</div>
        <div style="margin-top:10px;">${sub("JOBS CUT", 60, "#fff")}</div>
        ${label("AMAZON · AI TAKES OVER")}
      </div>`,
  },
  {
    slug: "mcp-97-million-installs",
    textSide: "left",
    html: () => `
      <div style="padding:60px 0 0 60px;">
        ${badge("MILESTONE", "#8b5cf6")}
        <div style="margin-top:14px;">${hero("97M", 180, "#a78bfa", "#a78bfa")}</div>
        <div style="margin-top:8px;">${sub("INSTALLS", 54, "#fff")}</div>
        ${label("MODEL CONTEXT PROTOCOL")}
      </div>`,
  },
  {
    slug: "owasp-agentic-top-10",
    textSide: "full",
    html: () => `
      <div style="display:flex;width:100%;padding:50px 70px;justify-content:space-between;align-items:center;">
        <div>
          ${badge("OWASP 2026", "#f59e0b")}
          <div style="margin-top:14px;">${hero("TOP 10", 140, "#fbbf24", "#fbbf24")}</div>
          <div style="margin-top:8px;">${sub("AI RISKS", 50, "#fff")}</div>
        </div>
        <div style="background:rgba(0,0,0,0.5);border-radius:12px;border:2px solid rgba(255,255,255,0.1);padding:20px 28px;">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
            <div style="width:40px;height:40px;border-radius:50%;background:#fbbf24;color:#000;font-size:20px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;">1</div>
            <div style="font-size:24px;font-weight:800;color:#fff;-webkit-text-stroke:3px #000;paint-order:stroke fill;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.8));">Prompt Injection</div>
          </div>
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
            <div style="width:40px;height:40px;border-radius:50%;background:rgba(251,191,36,0.6);color:#000;font-size:20px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;">2</div>
            <div style="font-size:24px;font-weight:800;color:rgba(255,255,255,0.85);-webkit-text-stroke:3px #000;paint-order:stroke fill;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.8));">Malicious MCP</div>
          </div>
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
            <div style="width:40px;height:40px;border-radius:50%;background:rgba(251,191,36,0.35);color:#fff;font-size:20px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;">3</div>
            <div style="font-size:24px;font-weight:800;color:rgba(255,255,255,0.7);-webkit-text-stroke:3px #000;paint-order:stroke fill;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.8));">Code Execution</div>
          </div>
          <div style="font-size:18px;font-weight:800;color:#ef4444;letter-spacing:2px;-webkit-text-stroke:2px #000;paint-order:stroke fill;filter:drop-shadow(0 0 8px rgba(239,68,68,0.5));">ATTACKS UP 340%</div>
        </div>
      </div>`,
  },
  {
    slug: "openai-852-billion-valuation",
    textSide: "right",
    html: () => `
      <div style="padding:50px 60px 0 0;text-align:right;">
        ${badge("RECORD", "#10b981")}
        <div style="margin-top:14px;">${hero("$852B", 170, "#34d399", "#34d399")}</div>
        <div style="margin-top:10px;">${sub("OPENAI", 54, "#fff")}</div>
        ${label("MOST VALUABLE PRIVATE")}
        ${label("COMPANY IN HISTORY")}
      </div>`,
  },
  {
    slug: "perplexity-450m-arr",
    textSide: "full",
    html: () => `
      <div style="padding:50px 80px;width:100%;">
        <div>
          ${badge("FASTEST EVER", "#14b8a6")}
          <div style="margin-top:14px;">${hero("$450M", 160, "#2dd4bf", "#2dd4bf")}</div>
          ${label("ANNUAL REVENUE", "rgba(255,255,255,0.55)")}
        </div>
        <div style="display:flex;gap:50px;margin-top:36px;">
          <div style="background:rgba(0,0,0,0.5);border-radius:10px;border:2px solid rgba(255,255,255,0.1);padding:14px 24px;">
            <div>${sub("100M", 72, "#fff", 7)}</div>
            <div style="font-size:14px;font-weight:700;color:rgba(255,255,255,0.45);letter-spacing:2px;margin-top:4px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.9));">MONTHLY USERS</div>
          </div>
          <div style="background:rgba(0,0,0,0.5);border-radius:10px;border:2px solid rgba(255,255,255,0.1);padding:14px 24px;">
            <div>${sub("+50%", 72, "#2dd4bf", 7)}</div>
            <div style="font-size:14px;font-weight:700;color:rgba(255,255,255,0.45);letter-spacing:2px;margin-top:4px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.9));">IN ONE MONTH</div>
          </div>
        </div>
      </div>`,
  },
  {
    slug: "242-billion-ai-investment-q1",
    textSide: "left",
    html: () => `
      <div style="padding:50px 0 0 60px;">
        ${badge("Q1 2026", "#d97706")}
        <div style="margin-top:14px;">${hero("$242B", 170, "#fbbf24", "#fbbf24")}</div>
        <div style="margin-top:10px;">${sub("AI", 58, "#fff")}</div>
        <div>${sub("INVESTED", 58, "#fff")}</div>
        ${label("4× YEAR OVER YEAR")}
      </div>`,
  },
  {
    slug: "meta-muse-spark",
    textSide: "full",
    html: () => `
      <div style="display:flex;width:100%;height:100%;align-items:center;justify-content:space-between;padding:0 70px;">
        <div>
          ${badge("PIVOT", "#2563eb")}
          <div style="margin-top:14px;">${sub("META", 56, "#60a5fa")}</div>
          <div style="margin-top:4px;">${hero("REBUILDS", 88, "#fff", "#3b82f6")}</div>
          <div>${sub("ITS AI", 88, "#fff", 8)}</div>
        </div>
        <div style="text-align:right;background:rgba(0,0,0,0.5);border-radius:12px;border:2px solid rgba(255,255,255,0.1);padding:20px 28px;">
          <div>${hero("$14B", 110, "#60a5fa", "#3b82f6")}</div>
          <div style="margin-top:10px;">${label("MUSE SPARK", "rgba(255,255,255,0.55)")}</div>
          <div>${label("ALL-NEW STACK", "rgba(255,255,255,0.4)")}</div>
        </div>
      </div>`,
  },
  {
    slug: "vibe-coding-92-percent",
    textSide: "right",
    html: () => `
      <div style="padding:50px 50px 0 0;text-align:right;">
        ${label("DEVELOPERS", "#34d399")}
        <div style="margin-top:6px;">${hero("92%", 160, "#34d399", "#34d399")}</div>
        <div style="margin-top:6px;">${sub("USE AI", 46, "#fff")}</div>
        <div style="width:100%;height:3px;background:rgba(255,255,255,0.25);margin:22px 0;"></div>
        ${label("BUT", "#ef4444")}
        <div style="margin-top:4px;">${hero("45%", 90, "#ef4444", "#ef4444")}</div>
        <div style="margin-top:4px;">${sub("HAS VULNERABILITIES", 20, "rgba(255,255,255,0.7)", 3)}</div>
      </div>`,
  },
  {
    slug: "chatgpt-super-app",
    textSide: "left",
    html: () => `
      <div style="padding:50px 0 0 60px;">
        ${badge("CHATGPT", "#9333ea")}
        <div style="margin-top:14px;">${hero("400M", 170, "#c084fc", "#c084fc")}</div>
        ${label("WEEKLY USERS")}
        <div style="margin-top:14px;">${sub("SUPER", 72, "#fff", 7)}</div>
        <div>${sub("APP", 72, "#c084fc", 7)}</div>
      </div>`,
  },
];

async function main() {
  const onlySlug = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
  const targets = onlySlug ? VIDEOS.filter(v => v.slug === onlySlug) : VIDEOS;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
    defaultViewport: { width: 1280, height: 720, deviceScaleFactor: 1 },
  });

  for (const video of targets) {
    const basePath = path.join(OUTPUT_DIR, video.slug, "thumb-base.png");
    const outPath = path.join(OUTPUT_DIR, video.slug, "thumbnail.png");

    if (!fs.existsSync(basePath)) {
      console.log(`⚠ ${video.slug}: missing thumb-base.png`);
      continue;
    }

    const baseBase64 = fs.readFileSync(basePath).toString("base64");

    // Position text based on side
    let textPosition = "";
    if (video.textSide === "left") {
      textPosition = "left:0;top:0;width:60%;height:100%;display:flex;align-items:center;";
    } else if (video.textSide === "right") {
      textPosition = "right:0;top:0;width:60%;height:100%;display:flex;align-items:center;justify-content:flex-end;";
    } else {
      textPosition = "left:0;top:0;width:100%;height:100%;display:flex;align-items:center;";
    }

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:1280px; height:720px; overflow:hidden; font-family:'Sora',sans-serif; }
</style>
</head>
<body>
  <div style="position:relative;width:1280px;height:720px;">
    <img src="data:image/png;base64,${baseBase64}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />
    <div style="position:absolute;${textPosition}z-index:10;">
      ${video.html()}
    </div>
    <div style="position:absolute;bottom:18px;${video.textSide === "right" ? "left" : "right"}:26px;font-size:13px;font-weight:700;color:rgba(255,255,255,0.2);letter-spacing:3px;z-index:10;">OA</div>
  </div>
</body>
</html>`;

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: outPath, type: "png", fullPage: false });
    await page.close();

    console.log(`✓ ${video.slug}`);
  }

  await browser.close();
  console.log(`\nDone! ${targets.length} thumbnails generated.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
