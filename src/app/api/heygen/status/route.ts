import { NextRequest, NextResponse } from "next/server";
import { getVideoStatus } from "@/lib/heygen/client";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("video_id");

  if (!videoId) {
    return NextResponse.json({ error: "Missing video_id" }, { status: 400 });
  }

  const result = await getVideoStatus(videoId);

  // If completed, update our database too
  if (result.data?.status === "completed" && result.data?.video_url) {
    await supabaseAdmin
      .from("lesson_videos")
      .update({
        status: "completed",
        video_url: result.data.video_url,
        thumbnail_url: result.data.thumbnail_url,
        duration_seconds: result.data.duration ? Math.round(result.data.duration) : null,
        updated_at: new Date().toISOString(),
      })
      .eq("heygen_video_id", videoId);

    const { data: lessonVideo } = await supabaseAdmin
      .from("lesson_videos")
      .select("lesson_id")
      .eq("heygen_video_id", videoId)
      .single();

    if (lessonVideo) {
      await supabaseAdmin
        .from("lessons")
        .update({ video_url: result.data.video_url, content_type: "video" })
        .eq("id", lessonVideo.lesson_id);
    }
  }

  return NextResponse.json(result);
}
