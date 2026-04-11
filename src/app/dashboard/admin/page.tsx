import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { AdminDashboard } from "./admin-dashboard";

async function getAdminData() {
  const supa = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [
    { data: profiles },
    { data: assessments },
    { data: labs },
    { data: deploys },
    { count: totalUsers },
    { data: xpLogs },
    { data: { users: authUsers } },
    { data: courses },
    { data: enrollments },
    { data: blogPosts },
  ] = await Promise.all([
    supa
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false }),
    supa
      .from("team_assessments")
      .select("*, profiles!team_assessments_user_id_fkey(full_name, avatar_url, company_name, company_role)")
      .order("created_at", { ascending: false }),
    supa
      .from("lab_verifications")
      .select("*, profiles!lab_verifications_user_id_fkey(full_name), lessons!lab_verifications_lesson_id_fkey(title, slug)")
      .order("created_at", { ascending: false }),
    supa
      .from("deploy_completions")
      .select("*, profiles!deploy_completions_user_id_fkey(full_name, company_name)")
      .order("created_at", { ascending: false }),
    supa
      .from("profiles")
      .select("*", { count: "exact", head: true }),
    supa
      .from("xp_log")
      .select("user_id, amount, source, source_id, created_at")
      .order("created_at", { ascending: false }),
    supa.auth.admin.listUsers({ perPage: 1000 }),
    supa
      .from("courses")
      .select("*")
      .order("order"),
    supa
      .from("user_enrollments")
      .select("course_id, user_id"),
    supa
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  // Build last activity map from XP logs (most recent per user)
  const lastActivityMap: Record<string, string> = {};
  for (const log of xpLogs ?? []) {
    if (!lastActivityMap[log.user_id]) {
      lastActivityMap[log.user_id] = log.created_at;
    }
  }

  // Build auth info map (email, last_sign_in_at)
  const authMap: Record<string, { email: string; last_sign_in_at: string | null }> = {};
  for (const u of authUsers ?? []) {
    authMap[u.id] = {
      email: u.email ?? "",
      last_sign_in_at: u.last_sign_in_at ?? null,
    };
  }

  // Build XP logs grouped by user
  const xpLogsByUser: Record<string, Record<string, unknown>[]> = {};
  for (const log of xpLogs ?? []) {
    const uid = log.user_id as string;
    if (!xpLogsByUser[uid]) xpLogsByUser[uid] = [];
    xpLogsByUser[uid].push(log);
  }

  // Build enrollment counts per course
  const enrollmentCounts: Record<string, number> = {};
  for (const e of enrollments ?? []) {
    const cid = e.course_id as string;
    enrollmentCounts[cid] = (enrollmentCounts[cid] ?? 0) + 1;
  }

  return {
    profiles: profiles ?? [],
    assessments: assessments ?? [],
    labs: labs ?? [],
    deploys: deploys ?? [],
    totalUsers: totalUsers ?? 0,
    lastActivityMap,
    authMap,
    xpLogsByUser,
    courses: courses ?? [],
    enrollmentCounts,
    blogPosts: blogPosts ?? [],
  };
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const data = await getAdminData();

  return <AdminDashboard data={data} />;
}
