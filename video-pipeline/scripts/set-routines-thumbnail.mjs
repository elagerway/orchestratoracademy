#!/usr/bin/env node
/**
 * Upload the routines-vs-n8n-vs-make thumbnail to the YouTube video.
 * Usage: node video-pipeline/scripts/set-routines-thumbnail.mjs <videoId>
 */
import { google } from "googleapis";
import { createReadStream, readFileSync, writeFileSync, existsSync } from "fs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq > 0) process.env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
}

const videoId = process.argv[2];
if (!videoId) {
  console.error("Usage: node set-routines-thumbnail.mjs <videoId>");
  process.exit(1);
}

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const TOKEN_PATH = "video-pipeline/scripts/.youtube-token.json";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
const token = JSON.parse(readFileSync(TOKEN_PATH, "utf-8"));
oauth2Client.setCredentials(token);
if (token.expiry_date && token.expiry_date < Date.now()) {
  const { credentials } = await oauth2Client.refreshAccessToken();
  oauth2Client.setCredentials(credentials);
  writeFileSync(TOKEN_PATH, JSON.stringify(credentials));
}

const youtube = google.youtube({ version: "v3", auth: oauth2Client });
const thumbPath = "video-pipeline/output/claude-routines-vs-n8n-vs-make-assets/thumbnail.png";

await youtube.thumbnails.set({
  videoId,
  media: { mimeType: "image/png", body: createReadStream(thumbPath) },
});
console.log(`✓ thumbnail set for ${videoId}`);
