import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { postToX } from "@/lib/social/post-to-x";

export async function POST(request: Request) {
  // Verify admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supa = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await supa
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { postId, platform } = await request.json();
  if (!postId || !platform) {
    return NextResponse.json({ error: "Missing postId or platform" }, { status: 400 });
  }

  // Get the blog post
  const { data: post } = await supa
    .from("blog_posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const url = `https://orchestratoracademy.com/blog/${post.slug}`;

  if (platform === "x") {
    const tweetId = await postToX({
      title: post.title,
      excerpt: post.excerpt ?? "",
      url,
      tags: post.tags as string[],
    });

    await supa
      .from("blog_posts")
      .update({ twitter_posted_at: new Date().toISOString() })
      .eq("id", postId);

    return NextResponse.json({ success: true, tweetId });
  }

  if (platform === "linkedin") {
    // LinkedIn integration — placeholder until credentials are provided
    return NextResponse.json({ error: "LinkedIn not configured yet" }, { status: 501 });
  }

  return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
}
