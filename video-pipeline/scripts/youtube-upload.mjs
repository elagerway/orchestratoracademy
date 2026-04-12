#!/usr/bin/env node

/**
 * YouTube Upload Script
 *
 * Usage:
 *   node youtube-upload.mjs --file video.mp4 --title "Title" --description "Desc" --tags "ai,agents"
 *
 * First run will open browser for OAuth. Token is cached for future uploads.
 */

import { google } from "googleapis";
import { createReadStream, readFileSync, writeFileSync, existsSync } from "fs";
import { createServer } from "http";
import { URL } from "url";

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

const args = process.argv.slice(2);
let file = "", title = "", description = "", tags = "", privacy = "unlisted";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--file") file = args[++i];
  else if (args[i] === "--title") title = args[++i];
  else if (args[i] === "--description") description = args[++i];
  else if (args[i] === "--tags") tags = args[++i];
  else if (args[i] === "--privacy") privacy = args[++i];
}

if (!file || !title) {
  console.error("Usage: node youtube-upload.mjs --file video.mp4 --title 'Title' [--description 'Desc'] [--tags 'ai,agents'] [--privacy public|unlisted|private]");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

async function getToken() {
  if (existsSync(TOKEN_PATH)) {
    const token = JSON.parse(readFileSync(TOKEN_PATH, "utf-8"));
    oauth2Client.setCredentials(token);

    // Check if token needs refresh
    if (token.expiry_date && token.expiry_date < Date.now()) {
      console.log("Refreshing token...");
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
      writeFileSync(TOKEN_PATH, JSON.stringify(credentials));
    }
    return;
  }

  // First-time auth — open browser
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube", "https://www.googleapis.com/auth/youtube.upload"],
  });

  console.log("Opening browser for authorization...");
  console.log(authUrl);

  // Start local server to catch the callback
  const code = await new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:3333`);
      const code = url.searchParams.get("code");
      if (code) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Authorized! You can close this tab.</h1>");
        server.close();
        resolve(code);
      }
    });
    server.listen(3333, () => {
      import("open").then((m) => m.default(authUrl));
    });
  });

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log("Token saved.");
}

async function upload() {
  await getToken();

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  console.log(`Uploading: ${file}`);
  console.log(`Title: ${title}`);

  const res = await youtube.videos.insert({
    part: "snippet,status",
    requestBody: {
      snippet: {
        title,
        description: description || "",
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        categoryId: "28", // Science & Technology
      },
      status: {
        privacyStatus: privacy,
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: createReadStream(file),
    },
  });

  console.log(`\nUploaded! Video ID: ${res.data.id}`);
  console.log(`URL: https://www.youtube.com/watch?v=${res.data.id}`);
  return res.data.id;
}

upload().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
