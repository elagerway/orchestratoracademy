#!/usr/bin/env node

/**
 * Tweet Screenshot Tool
 *
 * Takes a tweet URL and produces a clean 1920x1080 screenshot
 * ready for video production. No login required — uses Twitter's
 * public oembed API + widget JS.
 *
 * Usage:
 *   node video-pipeline/scripts/tweet-screenshot.mjs <tweet-url> [output-path]
 *
 * Examples:
 *   node video-pipeline/scripts/tweet-screenshot.mjs https://x.com/karpathy/status/123
 *   node video-pipeline/scripts/tweet-screenshot.mjs https://x.com/karpathy/status/123 screenshots/karpathy.png
 */

import puppeteer from "puppeteer";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

const tweetUrl = process.argv[2];
const outputPath = process.argv[3] || "tweet-screenshot.png";

if (!tweetUrl) {
  console.error("Usage: node tweet-screenshot.mjs <tweet-url> [output-path]");
  process.exit(1);
}

// Ensure output directory exists
const dir = dirname(outputPath);
if (dir && !existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

async function getOembedHtml(url) {
  const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&theme=light&dnt=true`;
  const res = await fetch(oembedUrl);
  if (!res.ok) {
    throw new Error(`oembed failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.html;
}

async function run() {
  console.log(`Fetching oembed for: ${tweetUrl}`);
  const embedHtml = await getOembedHtml(tweetUrl);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 960px;
      height: 540px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .container {
      max-width: 550px;
      width: 100%;
    }
    /* Override Twitter widget styles for clean look */
    .twitter-tweet {
      margin: 0 auto !important;
    }
  </style>
</head>
<body>
  <div class="container">
    ${embedHtml}
  </div>
  <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</body>
</html>`;

  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 960, height: 540, deviceScaleFactor: 2 });

  // Load the HTML with the tweet embed
  await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 10000 });

  // Wait for Twitter widget to render the iframe
  console.log("Waiting for tweet to render...");
  try {
    await page.waitForSelector("iframe.twitter-tweet-rendered, .twitter-tweet-rendered", {
      timeout: 10000,
    });
    // Give it a moment to fully paint
    await new Promise((r) => setTimeout(r, 2000));
  } catch {
    console.warn("Tweet iframe not detected — widget may not have loaded. Capturing anyway.");
    await new Promise((r) => setTimeout(r, 3000));
  }

  // Screenshot
  await page.screenshot({
    path: outputPath,
    type: "png",
    clip: { x: 0, y: 0, width: 960, height: 540 },
  });

  console.log(`Screenshot saved: ${outputPath}`);
  await browser.close();
}

run().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
