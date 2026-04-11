import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return profile?.role === "admin" ? user : null;
}

function getSupa() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { title, slug, excerpt, content, featured_image_url, published, meta_description, tags, author_name, status } = await request.json();

  if (!title || !slug) {
    return NextResponse.json({ error: "Missing title or slug" }, { status: 400 });
  }

  const isPublished = published ?? status === "published";

  const supa = getSupa();
  const { data, error } = await supa
    .from("blog_posts")
    .insert({
      title,
      slug,
      excerpt: excerpt || "",
      content: content || "",
      featured_image_url: featured_image_url || null,
      meta_description: meta_description || "",
      tags: tags || [],
      author_name: author_name || "Orchestrator Academy",
      status: status || (isPublished ? "published" : "draft"),
      author_id: user.id,
      published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })
    .select("id, slug")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, post: data });
}

export async function PATCH(request: Request) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { id, title, slug, excerpt, content, featured_image_url, published, meta_description, tags, author_name, status } = await request.json();

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supa = getSupa();

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (title !== undefined) update.title = title;
  if (slug !== undefined) update.slug = slug;
  if (excerpt !== undefined) update.excerpt = excerpt;
  if (content !== undefined) update.content = content;
  if (featured_image_url !== undefined) update.featured_image_url = featured_image_url;
  if (meta_description !== undefined) update.meta_description = meta_description;
  if (tags !== undefined) update.tags = tags;
  if (author_name !== undefined) update.author_name = author_name;
  if (status !== undefined) update.status = status;
  if (published !== undefined) {
    update.published = published;
    if (published) update.published_at = new Date().toISOString();
  }

  const { error } = await supa
    .from("blog_posts")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supa = getSupa();
  const { error } = await supa.from("blog_posts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
