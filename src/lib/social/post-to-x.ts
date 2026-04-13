import { OAuth } from "oauth";

const API_KEY = process.env.X_API_KEY!;
const API_SECRET = process.env.X_API_SECRET!;
const ACCESS_TOKEN = process.env.X_ACCESS_TOKEN!;
const ACCESS_TOKEN_SECRET = process.env.X_ACCESS_TOKEN_SECRET!;

interface PostToXOptions {
  title: string;
  excerpt: string;
  url: string;
  tags?: string[];
}

export async function postToX({ title, excerpt, url, tags }: PostToXOptions): Promise<string> {
  // Build tweet text — keep under 280 chars
  const hashtags = (tags ?? [])
    .slice(0, 3)
    .map((t) => `#${t.replace(/[\s-]/g, "")}`)
    .join(" ");

  let text = `${title}\n\n${excerpt}\n\n${url}`;
  if (hashtags && text.length + 1 + hashtags.length <= 280) {
    text += `\n\n${hashtags}`;
  }

  // Truncate excerpt if still too long
  if (text.length > 280) {
    const maxExcerpt = 280 - title.length - url.length - (hashtags ? hashtags.length + 4 : 2) - 10;
    const shortExcerpt = excerpt.slice(0, maxExcerpt).replace(/\s+\S*$/, "") + "…";
    text = `${title}\n\n${shortExcerpt}\n\n${url}`;
    if (hashtags && text.length + 1 + hashtags.length <= 280) {
      text += `\n\n${hashtags}`;
    }
  }

  const oauth = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    API_KEY,
    API_SECRET,
    "1.0A",
    null,
    "HMAC-SHA1"
  );

  return new Promise((resolve, reject) => {
    oauth.post(
      "https://api.twitter.com/2/tweets",
      ACCESS_TOKEN,
      ACCESS_TOKEN_SECRET,
      JSON.stringify({ text }),
      "application/json",
      (err, data) => {
        if (err) {
          reject(new Error(`X post failed: ${JSON.stringify(err)}`));
          return;
        }
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        resolve(parsed.data?.id ?? "unknown");
      }
    );
  });
}
