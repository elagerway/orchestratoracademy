#!/usr/bin/env node

/**
 * Text Card Screenshot Tool
 *
 * Creates a styled text card at 1920x1080 for video slides.
 * Dark background with clean typography.
 *
 * Usage:
 *   node video-pipeline/scripts/text-card.mjs "text content" output.png [--author "Name"] [--source "Source"]
 */

import puppeteer from "puppeteer";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

const args = process.argv.slice(2);
let text = "";
let outputPath = "text-card.png";
let author = "";
let source = "";

// Parse args
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--author" && args[i + 1]) {
    author = args[++i];
  } else if (args[i] === "--source" && args[i + 1]) {
    source = args[++i];
  } else if (!text) {
    text = args[i];
  } else if (outputPath === "text-card.png") {
    outputPath = args[i];
  }
}

if (!text) {
  console.error('Usage: node text-card.mjs "text" output.png [--author "Name"] [--source "Source"]');
  process.exit(1);
}

const dir = dirname(outputPath);
if (dir && !existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1080px;
      background: #1a1a1a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .card {
      max-width: 1200px;
      padding: 60px 80px;
      background: #242424;
      border: 1px solid #333333;
      border-radius: 24px;
    }
    .quote {
      font-size: 32px;
      line-height: 1.5;
      color: #f0f0f0;
      font-weight: 400;
    }
    .quote em {
      color: #34d399;
      font-style: normal;
      font-weight: 600;
    }
    .attribution {
      margin-top: 32px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 18px;
      color: #888888;
    }
    .attribution .name {
      color: #f0f0f0;
      font-weight: 600;
    }
    .attribution .dot {
      color: #555555;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="quote">${text}</div>
    ${author || source ? `
    <div class="attribution">
      ${author ? `<span class="name">${author}</span>` : ""}
      ${author && source ? `<span class="dot">·</span>` : ""}
      ${source ? `<span>${source}</span>` : ""}
    </div>` : ""}
  </div>
</body>
</html>`;

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setContent(html, { waitUntil: "networkidle0", timeout: 10000 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: outputPath, type: "png", clip: { x: 0, y: 0, width: 1920, height: 1080 } });
  console.log(`Saved: ${outputPath}`);
  await browser.close();
}

run().catch((err) => { console.error(err.message); process.exit(1); });
