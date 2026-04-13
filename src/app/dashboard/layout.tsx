import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { ImpersonationBanner } from "@/components/layout/impersonation-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  let fullName = "";
  let avatarUrl: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, avatar_url")
      .eq("user_id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
    fullName = profile?.full_name ?? "";
    avatarUrl = profile?.avatar_url ?? null;
  }

  // Fetch latest published blog post for sidebar news card
  const { data: latestPost } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nameParts = (fullName || user?.email || "").split(" ").filter(Boolean);
  const initials =
    nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      : (nameParts[0] || "?").slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        isAdmin={isAdmin}
        user={{
          email: user?.email ?? "",
          fullName,
          avatarUrl,
          initials,
        }}
        latestPost={latestPost ? {
          title: latestPost.title,
          slug: latestPost.slug,
          excerpt: latestPost.excerpt,
          publishedAt: latestPost.published_at,
        } : null}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ImpersonationBanner />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
