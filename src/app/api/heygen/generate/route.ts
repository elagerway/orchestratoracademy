import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createVideo } from "@/lib/heygen/client";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Default avatar and voice — set these after choosing your character
const DEFAULT_AVATAR_ID = process.env.HEYGEN_AVATAR_ID || "Abigail_expressive_2024112501";
const DEFAULT_VOICE_ID = process.env.HEYGEN_VOICE_ID || "f38a635bee7a4d1f9b0a654a31d050d2";

export async function POST(request: NextRequest) {
  // Admin-only: check if user is admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { lesson_id, avatar_id, voice_id } = await request.json();

  if (!lesson_id) {
    return NextResponse.json({ error: "Missing lesson_id" }, { status: 400 });
  }

  // Fetch lesson content for the script
  const { data: lesson } = await supabaseAdmin
    .from("lessons")
    .select("id, title, content, slug")
    .eq("id", lesson_id)
    .single();

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // Strip markdown for the voice script (remove #, *, `, etc.)
  const script = lesson.content
    .replace(/#{1,6}\s/g, "")           // headings
    .replace(/\*\*([^*]+)\*\*/g, "$1")  // bold
    .replace(/\*([^*]+)\*/g, "$1")      // italic
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/^[-*]\s/gm, "")           // list markers
    .replace(/^\d+\.\s/gm, "")         // numbered lists
    .replace(/>\s/gm, "")              // blockquotes
    .replace(/\n{3,}/g, "\n\n")        // excessive newlines
    .trim();

  // Truncate if too long (HeyGen has limits)
  const maxChars = 5000;
  const truncatedScript = script.length > maxChars
    ? script.slice(0, maxChars) + "..."
    : script;

  const selectedAvatar = avatar_id || DEFAULT_AVATAR_ID;
  const selectedVoice = voice_id || DEFAULT_VOICE_ID;

  // Create video via HeyGen
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://orchestratoracademy.vercel.app";
  const result = await createVideo({
    script: truncatedScript,
    avatarId: selectedAvatar,
    voiceId: selectedVoice,
    title: `Lesson: ${lesson.title}`,
    callbackUrl: `${origin}/api/heygen/webhook`,
  });

  if (result.error) {
    return NextResponse.json({ error: result.error.message || "HeyGen API error" }, { status: 500 });
  }

  const videoId = result.data?.video_id;

  if (!videoId) {
    return NextResponse.json({ error: "No video_id returned", details: result }, { status: 500 });
  }

  // Upsert lesson_videos record
  await supabaseAdmin.from("lesson_videos").upsert(
    {
      lesson_id: lesson.id,
      heygen_video_id: videoId,
      status: "processing",
      avatar_id: selectedAvatar,
      voice_id: selectedVoice,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "lesson_id" }
  );

  return NextResponse.json({
    success: true,
    video_id: videoId,
    lesson_id: lesson.id,
    lesson_title: lesson.title,
  });
}
