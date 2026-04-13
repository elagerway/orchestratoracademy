#!/usr/bin/env node
/**
 * Batch upload news videos + Shorts to YouTube (unlisted).
 * Uploads regular video, then Short, then sets thumbnail for the regular video.
 *
 * Usage: node video-pipeline/scripts/batch-upload.mjs
 */

import { google } from "googleapis";
import { createReadStream, readFileSync, writeFileSync, existsSync } from "fs";
import { createServer } from "http";
import { URL } from "url";
import path from "path";

// Load .env.local
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq > 0) process.env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
}

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const TOKEN_PATH = "video-pipeline/scripts/.youtube-token.json";
const REDIRECT_URI = "http://localhost:3333/callback";
const NEWS_DIR = "video-pipeline/output/News";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const VIDEOS = [
  {
    slug: "gpt-54-computer-use",
    title: "GPT-5.4 Can Use Your Computer Better Than You | Daily Dose of AI",
    shortTitle: "GPT-5.4 Uses Your Computer Better Than You #shorts",
    description: "OpenAI just shipped GPT-5.4 — the first model that scores higher than humans on computer use tasks. It handles coding, computer use, and knowledge work at frontier level.\n\nDaily Dose of AI from AI Orchestrator Academy.\n\n🔔 Subscribe for your daily dose of AI news.\n👉 https://orchestratoracademy.com",
    tags: "GPT-5.4,OpenAI,computer use,AI agents,agentic AI,AI news",
  },
  {
    slug: "amazon-16k-layoffs-ai",
    title: "Amazon Cuts 16,000 Jobs as AI Takes Over | Daily Dose of AI",
    shortTitle: "Amazon Cuts 16,000 Jobs — AI Takes Over #shorts",
    description: "Amazon just cut 16,000 jobs. Middle management and admin roles are becoming redundant as AI systems get more sophisticated. CEO Andy Jassy says it's about efficiency.\n\nDaily Dose of AI from AI Orchestrator Academy.\n\n🔔 Subscribe for your daily dose of AI news.\n👉 https://orchestratoracademy.com",
    tags: "Amazon,layoffs,AI jobs,automation,AI news,workforce",
  },
  {
    slug: "mcp-97-million-installs",
    title: "MCP Just Hit 97 Million Installs | Daily Dose of AI",
    shortTitle: "MCP Hits 97 Million Installs #shorts",
    description: "Model Context Protocol crossed 97 million installs — it's now the default way AI agents connect to databases, APIs, and external tools. Every major AI provider ships MCP-compatible tooling.\n\nDaily Dose of AI from AI Orchestrator Academy.\n\n🔔 Subscribe for your daily dose of AI news.\n👉 https://orchestratoracademy.com",
    tags: "MCP,Model Context Protocol,AI agents,agentic AI,API,AI tools",
  },
  {
    slug: "owasp-agentic-top-10",
    title: "OWASP's Top 10 Risks for AI Agents | Daily Dose of AI",
    shortTitle: "OWASP Top 10 Risks for AI Agents #shorts",
    description: "OWASP just published their top 10 risks for agentic AI applications. Prompt injection is still #1 — attacks up 340% in 2026. Malicious MCP servers and unexpected code execution round out the threats.\n\nDaily Dose of AI from AI Orchestrator Academy.\n\n🔔 Subscribe for your daily dose of AI news.\n👉 https://orchestratoracademy.com",
    tags: "OWASP,AI security,prompt injection,AI agents,cybersecurity,AI risks",
  },
  {
    slug: "openai-852-billion-valuation",
    title: "OpenAI Is Now Worth $852 Billion | Daily Dose of AI",
    shortTitle: "OpenAI Worth $852 Billion #shorts",
    description: "OpenAI just became the most valuable private company in history at $852 billion. They're making $25B/year and may go public by the end of 2026.\n\nDaily Dose of AI from AI Orchestrator Academy.\n\n🔔 Subscribe for your daily dose of AI news.\n👉 https://orchestratoracademy.com",
    tags: "OpenAI,valuation,IPO,AI funding,AI business,startup",
  },
  {
    slug: "perplexity-450m-arr",
    title: "Perplexity Hits $450M ARR with 100M Users | Daily Dose of AI",
    shortTitle: "Perplexity $450M ARR — 100M Users #shorts",
    description: "Perplexity just hit $450 million in annual revenue with 100 million monthly users. Revenue jumped 50% in a single month — the fastest-growing SaaS company in history.\n\nDaily Dose of AI from AI Orchestrator Academy.\n\n🔔 Subscribe for your daily dose of AI news.\n👉 https://orchestratoracademy.com",
    tags: "Perplexity,AI search,SaaS,ARR,AI business,growth",
  },
  {
    slug: "242-billion-ai-investment-q1",
    title: "$242 Billion Invested in AI in Q1 2026 | Daily Dose of AI",
    shortTitle: "$242 Billion Invested in AI — Q1 2026 #shorts",
    description: "$242 billion invested in AI in just Q1 2026 — 4x what was invested in the same period last year. AI has moved from experimental infrastructure to a core operating layer for global industry.\n\nDaily Dose of AI from AI Orchestrator Academy.\n\n🔔 Subscribe for your daily dose of AI news.\n👉 https://orchestratoracademy.com",
    tags: "AI investment,AI funding,venture capital,AI industry,Q1 2026,AI growth",
  },
  {
    slug: "meta-muse-spark",
    title: "Meta Rebuilds Its Entire AI Stack | Daily Dose of AI",
    shortTitle: "Meta Rebuilds Its Entire AI Stack #shorts",
    description: "Meta just rebuilt its AI stack from the ground up and released Muse Spark. They spent $14 billion and hired Alexandr Wang's team to catch up with OpenAI and Google.\n\nDaily Dose of AI from AI Orchestrator Academy.\n\n🔔 Subscribe for your daily dose of AI news.\n👉 https://orchestratoracademy.com",
    tags: "Meta,Muse Spark,AI model,AI competition,Alexandr Wang,AI stack",
  },
  {
    slug: "vibe-coding-92-percent",
    title: "92% of Developers Now Use AI Coding Tools | Daily Dose of AI",
    shortTitle: "92% of Devs Use AI Coding Tools #shorts",
    description: "92% of US developers now use AI coding tools. 40% of new SaaS products are built primarily through vibe coding. But 45% of that code has security vulnerabilities.\n\nDaily Dose of AI from AI Orchestrator Academy.\n\n🔔 Subscribe for your daily dose of AI news.\n👉 https://orchestratoracademy.com",
    tags: "vibe coding,AI coding,developers,AI tools,code security,GitHub Copilot",
  },
  {
    slug: "chatgpt-super-app",
    title: "ChatGPT Becomes a Super App | Daily Dose of AI",
    shortTitle: "ChatGPT Is Now a Super App #shorts",
    description: "ChatGPT is no longer a chatbot — it's a super app. 400 million weekly users can now research, code, browse, create presentations, analyze spreadsheets, and deploy software from one interface.\n\nDaily Dose of AI from AI Orchestrator Academy.\n\n🔔 Subscribe for your daily dose of AI news.\n👉 https://orchestratoracademy.com",
    tags: "ChatGPT,super app,OpenAI,GPT-5.4,AI assistant,AI tools",
  },
];

async function getToken() {
  if (existsSync(TOKEN_PATH)) {
    const token = JSON.parse(readFileSync(TOKEN_PATH, "utf-8"));
    oauth2Client.setCredentials(token);
    if (token.expiry_date && token.expiry_date < Date.now()) {
      console.log("Refreshing token...");
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
      writeFileSync(TOKEN_PATH, JSON.stringify(credentials));
    }
    return;
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube", "https://www.googleapis.com/auth/youtube.upload"],
  });
  console.log("Opening browser for authorization...");
  console.log(authUrl);
  const code = await new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:3333`);
      const c = url.searchParams.get("code");
      if (c) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Authorized! You can close this tab.</h1>");
        server.close();
        resolve(c);
      }
    });
    server.listen(3333, () => {
      import("open").then((m) => m.default(authUrl));
    });
  });
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
}

async function uploadVideo(youtube, filePath, title, description, tags, isShort = false) {
  console.log(`  Uploading: ${path.basename(filePath)} — "${title}"`);

  const res = await youtube.videos.insert({
    part: "snippet,status",
    requestBody: {
      snippet: {
        title,
        description,
        tags: tags.split(",").map(t => t.trim()),
        categoryId: "28",
      },
      status: {
        privacyStatus: "unlisted",
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: createReadStream(filePath),
    },
  });

  console.log(`  ✓ Uploaded — ID: ${res.data.id}`);
  return res.data.id;
}

async function setThumbnail(youtube, videoId, thumbPath) {
  try {
    await youtube.thumbnails.set({
      videoId,
      media: {
        mimeType: "image/png",
        body: createReadStream(thumbPath),
      },
    });
    console.log(`  ✓ Thumbnail set for ${videoId}`);
  } catch (err) {
    console.warn(`  ⚠ Thumbnail failed for ${videoId}: ${err.message} (set manually in YouTube Studio)`);
  }
}

async function main() {
  await getToken();
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  const results = [];

  for (let i = 0; i < VIDEOS.length; i++) {
    const v = VIDEOS[i];
    console.log(`\n[${i + 1}/${VIDEOS.length}] ${v.slug}`);

    const finalPath = `${NEWS_DIR}/${v.slug}/final.mp4`;
    const shortPath = `${NEWS_DIR}/${v.slug}/short.mp4`;
    const thumbPath = `${NEWS_DIR}/${v.slug}/thumbnail.png`;

    // Upload regular video
    const videoId = await uploadVideo(youtube, finalPath, v.title, v.description, v.tags);

    // Upload Short
    const shortId = await uploadVideo(youtube, shortPath, v.shortTitle, v.description + "\n\n#shorts", v.tags, true);

    // Set thumbnail on regular video
    if (existsSync(thumbPath)) {
      await setThumbnail(youtube, videoId, thumbPath);
    }

    results.push({ slug: v.slug, videoId, shortId });

    // Small delay to avoid rate limits
    if (i < VIDEOS.length - 1) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log("\n\n=== UPLOAD RESULTS ===");
  console.log("slug | video_id | short_id");
  console.log("-".repeat(60));
  for (const r of results) {
    console.log(`${r.slug} | ${r.videoId} | ${r.shortId}`);
  }

  // Save results to JSON
  const outPath = `${NEWS_DIR}/batch2-upload-results.json`;
  writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to ${outPath}`);
}

main().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
