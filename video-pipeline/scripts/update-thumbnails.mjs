#!/usr/bin/env node
/**
 * Re-upload thumbnails for batch 2 videos to YouTube.
 * Reads video IDs from batch2-upload-results.json.
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

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const TOKEN_PATH = "video-pipeline/scripts/.youtube-token.json";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);

async function main() {
  if (!existsSync(TOKEN_PATH)) {
    console.error("No YouTube token found. Run youtube-upload.mjs first.");
    process.exit(1);
  }

  const token = JSON.parse(readFileSync(TOKEN_PATH, "utf-8"));
  oauth2Client.setCredentials(token);
  if (token.expiry_date && token.expiry_date < Date.now()) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    writeFileSync(TOKEN_PATH, JSON.stringify(credentials));
  }

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });
  const results = JSON.parse(readFileSync("video-pipeline/output/News/batch2-upload-results.json", "utf-8"));

  for (const { slug, videoId } of results) {
    const thumbPath = `video-pipeline/output/News/${slug}/thumbnail.png`;
    if (!existsSync(thumbPath)) {
      console.log(`⚠ ${slug}: no thumbnail found`);
      continue;
    }

    try {
      await youtube.thumbnails.set({
        videoId,
        media: {
          mimeType: "image/png",
          body: createReadStream(thumbPath),
        },
      });
      console.log(`✓ ${slug} (${videoId}) — thumbnail updated`);
    } catch (err) {
      console.error(`✗ ${slug} (${videoId}): ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  console.log("\nDone!");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
