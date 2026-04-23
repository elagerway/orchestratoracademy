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

  // Fetch posts + counts. The profile join is done separately below because
  // forum_posts.user_id has no FK to profiles, so the PostgREST embed fails
  // silently and drops every row.
  const { data: rawPosts } = await supabase
    .from("forum_posts")
    .select("*, forum_replies(count), forum_reactions(count)")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  const authorIds = Array.from(new Set((rawPosts ?? []).map((p: { user_id: string }) => p.user_id)));
  const { data: authorProfiles } = authorIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url, username")
        .in("user_id", authorIds)
    : { data: [] as { user_id: string; full_name: string | null; avatar_url: string | null; username: string | null }[] };

  const profileByUserId = new Map<string, { full_name: string | null; avatar_url: string | null; username: string | null }>();
  for (const p of authorProfiles ?? []) {
    profileByUserId.set(p.user_id, { full_name: p.full_name, avatar_url: p.avatar_url, username: p.username });
  }

  // Posts authored by the primary admin (erik@snapsonic.com) render under
  // the brand — they are community-wide, not personal.
  const TEAM_ACCOUNT_USER_ID = "386c403d-cf7e-4e99-8b91-56da3d72a860";
  const TEAM_LABEL = "Orchestrator Academy Team";
  const TEAM_PROFILE = { full_name: TEAM_LABEL, avatar_url: null, username: "orchestratoracademy" };

  const posts = (rawPosts ?? []).map((post: { user_id: string; forum_replies?: { count: number }[]; forum_reactions?: { count: number }[] }) => {
    const profile = post.user_id === TEAM_ACCOUNT_USER_ID
      ? TEAM_PROFILE
      : profileByUserId.get(post.user_id) ?? null;
    return {
      ...post,
      profiles: profile,
      reply_count: post.forum_replies?.[0]?.count ?? 0,
      reaction_count: post.forum_reactions?.[0]?.count ?? 0,
    };
  });

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
