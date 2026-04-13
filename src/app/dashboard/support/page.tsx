import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ForumView } from "./forum-view";

export default async function SupportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();
  const isAdmin = profile?.role === "admin";

  // Fetch categories with hierarchy
  const { data: categories } = await supabase
    .from("forum_categories")
    .select("*")
    .order("order");

  // Fetch posts with profile + counts in a single query
  const { data: rawPosts } = await supabase
    .from("forum_posts")
    .select("*, profiles:user_id(full_name, avatar_url, username), forum_replies(count), forum_reactions(count)")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  const posts = (rawPosts ?? []).map((post: any) => ({
    ...post,
    profiles: post.profiles,
    reply_count: post.forum_replies?.[0]?.count ?? 0,
    reaction_count: post.forum_reactions?.[0]?.count ?? 0,
  }));

  // Fetch recent active members
  const { data: recentProfiles } = await supabase
    .from("profiles")
    .select("user_id, full_name, avatar_url, username")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <ForumView
      categories={(categories ?? []) as any[]}
      posts={posts}
      members={(recentProfiles ?? []) as any[]}
      currentUserId={user.id}
      isAdmin={isAdmin}
    />
  );
}
