import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.json();

  const eventType = body.event_type;
  const videoId = body.video_id || body.data?.video_id;

  if (!videoId) {
    return NextResponse.json({ error: "Missing video_id" }, { status: 400 });
  }

  switch (eventType) {
    case "avatar_video.success": {
      const videoUrl = body.data?.url || body.video_url;
      const thumbnailUrl = body.data?.thumbnail_url;
      const duration = body.data?.duration;

      await supabaseAdmin
        .from("lesson_videos")
        .update({
          status: "completed",
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          duration_seconds: duration ? Math.round(duration) : null,
          updated_at: new Date().toISOString(),
        })
        .eq("heygen_video_id", videoId);

      // Also update the lesson's video_url field for the player
      const { data: lessonVideo } = await supabaseAdmin
        .from("lesson_videos")
        .select("lesson_id")
        .eq("heygen_video_id", videoId)
        .single();

      if (lessonVideo && videoUrl) {
        await supabaseAdmin
          .from("lessons")
          .update({ video_url: videoUrl, content_type: "video" })
          .eq("id", lessonVideo.lesson_id);
      }

      break;
    }

    case "avatar_video.fail":
    case "avatar_video.error": {
      await supabaseAdmin
        .from("lesson_videos")
        .update({
          status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("heygen_video_id", videoId);
      break;
    }

    default:
      // Unknown event type, ignore
      break;
  }

  return NextResponse.json({ received: true });
}
