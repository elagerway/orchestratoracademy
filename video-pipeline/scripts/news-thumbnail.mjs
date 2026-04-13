#!/usr/bin/env node
/**
 * Generate YouTube thumbnails for Daily Dose of AI news videos.
 *
 * Design: Leo (left) + bold headline text with green highlight (right)
 * on dark background. 1280x720 (YouTube standard).
 *
 * Usage: node video-pipeline/scripts/news-thumbnail.mjs
 *        node video-pipeline/scripts/news-thumbnail.mjs --only gpt-54-computer-use
 */

import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, "../output/News");
const LEO_FRAME = path.resolve(__dirname, "../output/leo_frame_closed.jpg");

const VIDEOS = [
  {
    slug: "gpt-54-computer-use",
    headline: "GPT-5.4\nUSES YOUR\nCOMPUTER",
    highlight: "GPT-5.4",
  },
  {
    slug: "amazon-16k-layoffs-ai",
    headline: "AMAZON\nCUTS 16,000\nJOBS",
    highlight: "16,000",
  },
  {
    slug: "mcp-97-million-installs",
    headline: "MCP HITS\n97 MILLION\nINSTALLS",
    highlight: "97 MILLION",
  },
  {
    slug: "owasp-agentic-top-10",
    headline: "OWASP'S\nTOP 10 AI\nRISKS",
    highlight: "TOP 10",
  },
  {
    slug: "openai-852-billion-valuation",
    headline: "OPENAI\nWORTH\n$852B",
    highlight: "$852B",
  },
  {
    slug: "perplexity-450m-arr",
    headline: "PERPLEXITY\n$450M ARR\n100M USERS",
    highlight: "$450M ARR",
  },
  {
    slug: "242-billion-ai-investment-q1",
    headline: "$242B\nINVESTED\nIN AI",
    highlight: "$242B",
  },
  {
    slug: "meta-muse-spark",
    headline: "META\nREBUILDS\nITS AI",
    highlight: "REBUILDS",
  },
  {
    slug: "vibe-coding-92-percent",
    headline: "92% OF\nDEVS USE\nAI CODE",
    highlight: "92%",
  },
  {
    slug: "chatgpt-super-app",
    headline: "CHATGPT\nIS A\nSUPER APP",
    highlight: "SUPER APP",
  },
];

function buildHtml(video, leoBase64) {
  const lines = video.headline.split("\n");
  const htmlLines = lines.map(line => {
    if (line.includes(video.highlight)) {
      return line.replace(video.highlight, `<span style="color: #00C853">${video.highlight}</span>`);
    }
    return line;
  }).join("<br>");

  return `<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1280px;
    height: 720px;
    background: #0a0a0a;
    font-family: 'Sora', sans-serif;
    display: flex;
    overflow: hidden;
    position: relative;
  }
  .leo-side {
    width: 420px;
    height: 720px;
    position: relative;
    flex-shrink: 0;
  }
  .leo-side img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
  }
  .leo-side::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 160px; height: 100%;
    background: linear-gradient(to right, transparent, #0a0a0a);
  }
  .content-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 60px 40px 20px;
  }
  .oa-badge {
    font-size: 16px;
    font-weight: 700;
    color: rgba(255,255,255,0.3);
    letter-spacing: 3px;
    margin-bottom: 20px;
  }
  .headline {
    font-size: 72px;
    font-weight: 900;
    color: #ffffff;
    line-height: 1.05;
    letter-spacing: -1px;
  }
  .watermark {
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 14px;
    font-weight: 700;
    color: rgba(255,255,255,0.2);
    letter-spacing: 2px;
    font-family: 'Sora', sans-serif;
  }
</style>
</head>
<body>
  <div class="leo-side">
    <img src="data:image/jpeg;base64,${leoBase64}" />
  </div>
  <div class="content-side">
    <div class="oa-badge">OA</div>
    <div class="headline">${htmlLines}</div>
  </div>
  <div class="watermark">OA</div>
</body>
</html>`;
}

async function main() {
  const onlySlug = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
  const targets = onlySlug ? VIDEOS.filter(v => v.slug === onlySlug) : VIDEOS;

  if (!fs.existsSync(LEO_FRAME)) {
    console.error(`Missing Leo frame: ${LEO_FRAME}`);
    process.exit(1);
  }
  const leoBase64 = fs.readFileSync(LEO_FRAME).toString("base64");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
    defaultViewport: { width: 1280, height: 720, deviceScaleFactor: 1 },
  });

  for (const video of targets) {
    const outPath = path.join(OUTPUT_DIR, video.slug, "thumbnail.png");
    const html = buildHtml(video, leoBase64);

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await new Promise(r => setTimeout(r, 1500)); // wait for Sora font
    await page.screenshot({ path: outPath, type: "png", fullPage: false });
    await page.close();

    console.log(`✓ ${video.slug} → thumbnail.png`);
  }

  await browser.close();
  console.log(`\nDone! ${targets.length} thumbnails generated.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
