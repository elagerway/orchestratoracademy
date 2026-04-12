import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";

const CRON_SECRET = process.env.CRON_SECRET;

async function setYouTubePublic(videoIds: string[]) {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return [];

  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });
  const youtube = google.youtube({ version: "v3", auth });

  const results: string[] = [];
  for (const id of videoIds) {
    if (!id) continue;
    try {
      await youtube.videos.update({
        part: ["status"],
        requestBody: {
          id,
          status: { privacyStatus: "public", selfDeclaredMadeForKids: false },
        },
      });
      results.push(id);
    } catch {
      // Video may already be public or token expired — don't fail the cron
    }
  }
  return results;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date().toISOString();

  // Find scheduled posts that are due
  const { data: due, error } = await supa
    .from("blog_posts")
    .update({
      status: "published",
      published: true,
      published_at: now,
    })
    .eq("status", "scheduled")
    .lte("scheduled_at", now)
    .select("id, title, slug, youtube_video_id, youtube_short_id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Set YouTube videos to public for any posts that just published
  const videoIds = (due ?? []).flatMap((p) => [
    p.youtube_video_id,
    p.youtube_short_id,
  ]).filter(Boolean);

  const publicized = await setYouTubePublic(videoIds);

  return NextResponse.json({
    published: (due ?? []).length,
    posts: (due ?? []).map((p) => p.slug),
    youtube_publicized: publicized,
  });
}
