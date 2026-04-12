#!/usr/bin/env node

/**
 * Tweet Card Renderer
 *
 * Renders a full tweet as a styled card with optional highlights.
 * Looks like an actual X/Twitter post — avatar, name, handle, text, stats.
 *
 * Usage:
 *   node tweet-card.mjs --config tweet.json --output screenshot.png
 *
 * Config JSON:
 * {
 *   "name": "Andrej Karpathy",
 *   "handle": "@karpathy",
 *   "avatar": "https://pbs.twimg.com/profile_images/...",
 *   "verified": true,
 *   "date": "10:50 AM · Feb 25, 2026",
 *   "text": "Full tweet text here...",
 *   "highlights": ["80-20 of writing code myself", "20-80", "coding agents basically didn't work before December"],
 *   "likes": "37.1K",
 *   "replies": "1.6K",
 *   "reposts": "8.2K",
 *   "views": "4.1M"
 * }
 */

import puppeteer from "puppeteer";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";

const args = process.argv.slice(2);
let configPath = "";
let outputPath = "tweet-card.png";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--config" && args[i + 1]) configPath = args[++i];
  else if (args[i] === "--output" && args[i + 1]) outputPath = args[++i];
}

if (!configPath) {
  console.error("Usage: node tweet-card.mjs --config tweet.json --output screenshot.png");
  process.exit(1);
}

const dir = dirname(outputPath);
if (dir && !existsSync(dir)) mkdirSync(dir, { recursive: true });

const config = JSON.parse(readFileSync(configPath, "utf-8"));

// Apply highlights to text
let styledText = config.text.replace(/\n/g, "<br>");
if (config.highlights) {
  for (const h of config.highlights) {
    styledText = styledText.replace(
      h,
      `<mark>${h}</mark>`
    );
  }
}

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1080px;
      background: #1a1a1a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .tweet {
      width: 900px;
      background: #ffffff;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 4px 30px rgba(0,0,0,0.4);
    }
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
    }
    .avatar-placeholder {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #1da1f2;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 18px;
    }
    .name-row {
      display: flex;
      flex-direction: column;
    }
    .name {
      font-weight: 700;
      font-size: 22px;
      color: #0f1419;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .verified {
      width: 18px;
      height: 18px;
    }
    .handle {
      font-size: 14px;
      color: #536471;
    }
    .follow-btn {
      font-size: 13px;
      color: #536471;
    }
    .x-logo {
      width: 22px;
      height: 22px;
    }
    .text {
      font-size: 24px;
      line-height: 1.5;
      color: #0f1419;
      margin-bottom: 14px;
      word-wrap: break-word;
    }
    mark {
      background: transparent;
      background: #fef08a; color: #0f1419;
      padding: 1px 4px;
      border-radius: 3px;
      font-style: normal;
    }
    .date {
      font-size: 14px;
      color: #536471;
      margin-bottom: 14px;
      padding-bottom: 14px;
      border-bottom: 1px solid #eff3f4;
    }
    .stats {
      display: flex;
      align-items: center;
      gap: 20px;
      font-size: 13px;
      color: #536471;
    }
    .stat {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .stat-icon {
      width: 16px;
      height: 16px;
      fill: #536471;
    }
    .stat-heart { fill: #f91880; }
    .stat-num { font-weight: 400; }
  </style>
</head>
<body>
  <div class="tweet">
    <div class="header">
      <div class="header-left">
        ${config.avatar
          ? `<img class="avatar" src="${config.avatar}" alt="">`
          : `<div class="avatar-placeholder">${config.name[0]}</div>`
        }
        <div class="name-row">
          <span class="name">
            ${config.name}
            ${config.verified ? `<svg class="verified" viewBox="0 0 22 22" fill="#1d9bf0"><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.568.646-.017 1.272-.214 1.812-.568s.972-.852 1.245-1.438c.608.226 1.267.276 1.9.143.635-.13 1.22-.437 1.69-.883.445-.47.749-1.054.88-1.69.132-.633.08-1.29-.14-1.896.587-.273 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/></svg>` : ""}
          </span>
          <span class="handle">${config.handle} · <span class="follow-btn">Follow</span></span>
        </div>
      </div>
      <svg class="x-logo" viewBox="0 0 24 24" fill="#f0f0f0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    </div>
    <div class="text">${styledText}</div>
    <div class="date">${config.date}</div>
    <div class="stats">
      ${config.replies ? `<span class="stat"><svg class="stat-icon" viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.25-.893 4.306-2.376 5.786l-5.39 5.39c-.195.196-.452.294-.707.294s-.512-.098-.707-.293L7.68 15.786C4.644 14.306 1.751 12.25 1.751 10z"/></svg><span class="stat-num">${config.replies}</span></span>` : ""}
      ${config.reposts ? `<span class="stat"><svg class="stat-icon" viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2h6v2h-6c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM19.5 20.12l-4.432-4.14 1.364-1.46L18.5 16.45V8c0-1.1-.896-2-2-2h-6V4h6c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14z"/></svg><span class="stat-num">${config.reposts}</span></span>` : ""}
      ${config.likes ? `<span class="stat"><svg class="stat-icon stat-heart" viewBox="0 0 24 24"><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.45-4.92-.334-6.9 1.09-1.94 3.177-2.94 5.478-2.94 1.558 0 2.958.55 3.84 1.23.881-.68 2.28-1.23 3.84-1.23 2.3 0 4.387 1 5.478 2.94 1.115 1.98 1.025 4.4-.334 6.9z"/></svg><span class="stat-num">${config.likes}</span></span>` : ""}
      ${config.views ? `<span class="stat"><svg class="stat-icon" viewBox="0 0 24 24"><path d="M8.75 21V3h2v18h-2zM18.75 21V8.5h2V21h-2zM13.75 21v-9h2v9h-2zM3.75 21v-4h2v4h-2z"/></svg><span class="stat-num">${config.views}</span></span>` : ""}
    </div>
  </div>
</body>
</html>`;

async function run() {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "networkidle0", timeout: 10000 });
  await new Promise((r) => setTimeout(r, 1000));

  // Get the actual tweet height
  const tweetHeight = await page.evaluate(() => {
    const tweet = document.querySelector('.tweet');
    return tweet ? tweet.scrollHeight + 80 : 540; // +80 for body padding
  });

  // If tweet is taller than viewport, render multiple pages
  const pageHeight = 1080;
  const pages = Math.ceil(tweetHeight / pageHeight);

  if (pages <= 1) {
    await page.screenshot({ path: outputPath, type: "png", clip: { x: 0, y: 0, width: 1920, height: 1080 } });
    console.log(`Saved: ${outputPath} (1 page)`);
  } else {
    // Resize viewport to fit full tweet
    await page.setViewport({ width: 960, height: Math.ceil(tweetHeight), deviceScaleFactor: 2 });
    // Update body height
    await page.evaluate((h) => {
      document.body.style.height = h + 'px';
      document.body.style.alignItems = 'flex-start';
      document.body.style.paddingTop = '40px';
    }, tweetHeight);
    await new Promise((r) => setTimeout(r, 500));

    // Capture each page
    for (let i = 0; i < pages; i++) {
      const y = i * pageHeight;
      const ext = outputPath.replace('.png', `_p${i + 1}.png`);
      await page.screenshot({
        path: ext,
        type: "png",
        clip: { x: 0, y, width: 960, height: Math.min(pageHeight, tweetHeight - y) },
      });
      console.log(`Saved: ${ext} (page ${i + 1}/${pages})`);
    }
  }
  console.log(`Saved: ${outputPath}`);
  await browser.close();
}

run().catch((err) => { console.error(err.message); process.exit(1); });
