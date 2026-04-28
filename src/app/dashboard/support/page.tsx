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
  type AuthorRow = {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
    auto_alias: string | null;
    post_as_team: boolean;
    leaderboard_display: string | null;
  };
  const { data: authorProfiles } = authorIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url, username, auto_alias, post_as_team, leaderboard_display")
        .in("user_id", authorIds)
    : { data: [] as AuthorRow[] };

  type AuthorProfile = Omit<AuthorRow, "user_id">;
  const profileByUserId = new Map<string, AuthorProfile>();
  for (const p of (authorProfiles ?? []) as AuthorRow[]) {
    profileByUserId.set(p.user_id, {
      full_name: p.full_name,
      avatar_url: p.avatar_url,
      username: p.username,
      auto_alias: p.auto_alias,
      post_as_team: p.post_as_team,
      leaderboard_display: p.leaderboard_display,
    });
  }

  const posts = (rawPosts ?? []).map((post: { user_id: string; forum_replies?: { count: number }[]; forum_reactions?: { count: number }[] }) => ({
    ...post,
    profiles: profileByUserId.get(post.user_id) ?? null,
    reply_count: post.forum_replies?.[0]?.count ?? 0,
    reaction_count: post.forum_reactions?.[0]?.count ?? 0,
  }));

  // Fetch recent active members — leaderboard_display drives privacy in the UI
  const { data: recentProfiles } = await supabase
    .from("profiles")
    .select("user_id, full_name, avatar_url, username, auto_alias, post_as_team, leaderboard_display")
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
