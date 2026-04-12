import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const CRON_SECRET = process.env.CRON_SECRET;

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
    .select("id, title, slug");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    published: (due ?? []).length,
    posts: (due ?? []).map((p) => p.slug),
  });
}
