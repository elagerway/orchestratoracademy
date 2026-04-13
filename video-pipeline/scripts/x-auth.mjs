#!/usr/bin/env node
/**
 * One-time OAuth 1.0a flow to get X (Twitter) Access Token + Secret.
 * Opens browser → user authorizes → saves tokens to .env.local.
 *
 * Usage: node video-pipeline/scripts/x-auth.mjs
 *
 * After this runs, X_ACCESS_TOKEN and X_ACCESS_TOKEN_SECRET will be
 * appended to .env.local. You only need to run this once.
 */

import { OAuth } from "oauth";
import { createServer } from "http";
import { URL } from "url";
import { readFileSync, appendFileSync, existsSync } from "fs";

// Load .env.local
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq > 0) process.env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
}

const API_KEY = process.env.X_API_KEY;
const API_SECRET = process.env.X_API_SECRET;
const CALLBACK_URL = "http://localhost:3334/callback";

if (!API_KEY || !API_SECRET) {
  console.error("Missing X_API_KEY or X_API_SECRET in .env.local");
  process.exit(1);
}

const oauth = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  API_KEY,
  API_SECRET,
  "1.0A",
  CALLBACK_URL,
  "HMAC-SHA1"
);

async function main() {
  // Step 1: Get request token
  const { oauthToken, oauthTokenSecret } = await new Promise((resolve, reject) => {
    oauth.getOAuthRequestToken((err, oauthToken, oauthTokenSecret) => {
      if (err) reject(new Error(`Request token failed: ${JSON.stringify(err)}`));
      else resolve({ oauthToken, oauthTokenSecret });
    });
  });

  // Step 2: Open browser for authorization
  const authUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`;
  console.log("\nOpening browser for X authorization...");
  console.log(authUrl);

  // Step 3: Start local server to catch callback
  const { verifier } = await new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, "http://localhost:3334");
      const oauthVerifier = url.searchParams.get("oauth_verifier");
      if (oauthVerifier) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>X authorized! You can close this tab.</h1>");
        server.close();
        resolve({ verifier: oauthVerifier });
      }
    });
    server.listen(3334, () => {
      import("open").then((m) => m.default(authUrl)).catch(() => {
        console.log("\nCouldn't open browser automatically. Visit this URL:");
        console.log(authUrl);
      });
    });
  });

  // Step 4: Exchange for access token
  const { accessToken, accessTokenSecret } = await new Promise((resolve, reject) => {
    oauth.getOAuthAccessToken(
      oauthToken,
      oauthTokenSecret,
      verifier,
      (err, accessToken, accessTokenSecret) => {
        if (err) reject(new Error(`Access token failed: ${JSON.stringify(err)}`));
        else resolve({ accessToken, accessTokenSecret });
      }
    );
  });

  // Step 5: Save to .env.local
  appendFileSync(".env.local", `\nX_ACCESS_TOKEN=${accessToken}\nX_ACCESS_TOKEN_SECRET=${accessTokenSecret}\n`);

  console.log("\n✓ Access Token saved to .env.local");
  console.log(`  X_ACCESS_TOKEN=${accessToken}`);
  console.log(`  X_ACCESS_TOKEN_SECRET=${"*".repeat(accessTokenSecret.length)}`);
  console.log("\nYou're all set to post tweets via the API.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
