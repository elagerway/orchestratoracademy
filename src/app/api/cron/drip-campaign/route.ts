import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email/client";
import { day3Email, day7Email, day14Email, type AnnouncementEntry } from "@/lib/email/templates";
import { displayName } from "@/lib/display-name";

const CRON_SECRET = process.env.CRON_SECRET;
const ANNOUNCEMENTS_CATEGORY_ID = "771a903d-9f65-4aeb-acb2-7b9309469513";

// Strip markdown to a plain excerpt (max ~140 chars). Good enough for email snippets.
function toExcerpt(body: string): string {
  const plain = body
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/[-*]\s+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > 140 ? plain.slice(0, 137) + "…" : plain;
}

export async function GET(request: Request) {
  // Verify cron secret (Vercel cron sends this header)
  const authHeader = request.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date();
  const day3Ago = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const day7Ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const day14Ago = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

  // Get all users with their last XP log activity
  const { data: profiles } = await supa
    .from("profiles")
    .select("user_id, full_name, username, auto_alias, post_as_team, leaderboard_display, last_activity_date, xp, level")
    .order("xp", { ascending: false });

  // Get auth users for emails
  const { data: { users: authUsers } } = await supa.auth.admin.listUsers({ perPage: 1000 });
  const emailMap = new Map(authUsers.map((u) => [u.id, u.email ?? ""]));

  // Get all enrollments with course info
  const { data: enrollments } = await supa
    .from("user_enrollments")
    .select("user_id, course_id, courses(title, slug)");

  // Get completed lessons per user
  const { data: progress } = await supa
    .from("user_progress")
    .select("user_id, lesson_id")
    .eq("completed", true);

  // Get all modules and lessons for lesson counting
  const { data: modules } = await supa.from("modules").select("id, course_id");
  const { data: lessons } = await supa.from("lessons").select("id, title, slug, module_id, order");

  // Get drip log to avoid re-sending
  const { data: dripLogs } = await supa
    .from("drip_log")
    .select("user_id, drip_type");

  // Latest Announcements forum posts — shown in every drip email so dormant
  // users see what they've missed when they come back
  const { data: recentAnnouncements } = await supa
    .from("forum_posts")
    .select("id, title, body, created_at")
    .eq("category_id", ANNOUNCEMENTS_CATEGORY_ID)
    .order("created_at", { ascending: false })
    .limit(3);

  const announcements: AnnouncementEntry[] = (recentAnnouncements ?? []).map((p) => ({
    title: p.title,
    excerpt: toExcerpt(p.body),
    url: `https://orchestratoracademy.com/dashboard/support?post=${p.id}`,
  }));

  const sentSet = new Set(
    (dripLogs ?? []).map((d) => `${d.user_id}:${d.drip_type}`)
  );

  // Build lookup maps
  const modulesByCourse = new Map<string, string[]>();
  for (const m of modules ?? []) {
    const list = modulesByCourse.get(m.course_id) ?? [];
    list.push(m.id);
    modulesByCourse.set(m.course_id, list);
  }

  const lessonsByModule = new Map<string, typeof lessons>();
  for (const l of lessons ?? []) {
    const list = lessonsByModule.get(l.module_id) ?? [];
    list.push(l);
    lessonsByModule.set(l.module_id, list);
  }

  const completedByUser = new Map<string, Set<string>>();
  for (const p of progress ?? []) {
    if (!completedByUser.has(p.user_id)) completedByUser.set(p.user_id, new Set());
    completedByUser.get(p.user_id)!.add(p.lesson_id);
  }

  // Use the shared helper so the drip leaderboard matches every other surface.
  const getDisplayName = displayName;

  // Build leaderboard (profiles already sorted by XP desc)
  const leaderboard = (profiles ?? [])
    .filter((p) => (p.xp ?? 0) > 0)
    .slice(0, 5)
    .map((p) => ({ displayName: getDisplayName(p), xp: p.xp ?? 0 }));

  // Build rank map
  const rankMap = new Map<string, number>();
  const sortedByXp = [...(profiles ?? [])].sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0));
  sortedByXp.forEach((p, i) => rankMap.set(p.user_id, i + 1));

  // Aggregate stats for day 14 email
  const totalStudents = (profiles ?? []).length;
  const allCompletedCounts = Array.from(completedByUser.values()).map((s) => s.size);
  const avgLessonsCompleted =
    allCompletedCounts.length > 0
      ? allCompletedCounts.reduce((a, b) => a + b, 0) / allCompletedCounts.length
      : 0;

  const results = { sent: 0, skipped: 0, errors: 0, details: [] as string[] };

  for (const profile of profiles ?? []) {
    const userId = profile.user_id;
    const email = emailMap.get(userId);
    if (!email) continue;

    // Skip test/demo accounts
    if (email.includes("test") || email.includes("demo")) continue;

    const lastActivity = profile.last_activity_date;
    if (!lastActivity) continue;

    const lastDate = new Date(lastActivity);
    const daysSinceActivity = Math.floor(
      (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Find user's enrolled course
    const userEnrollment = (enrollments ?? []).find((e) => e.user_id === userId);
    if (!userEnrollment) continue;

    const course = userEnrollment.courses as unknown as { title: string; slug: string } | null;
    if (!course) continue;

    const courseModuleIds = modulesByCourse.get(userEnrollment.course_id) ?? [];
    const courseLessons = courseModuleIds.flatMap(
      (mid) => (lessonsByModule.get(mid) ?? []).sort((a, b) => a.order - b.order)
    );
    const totalLessons = courseLessons.length;
    const completedIds = completedByUser.get(userId) ?? new Set();
    const completedCount = courseLessons.filter((l) => completedIds.has(l.id)).length;

    // Find next incomplete lesson
    const nextLesson = courseLessons.find((l) => !completedIds.has(l.id));

    // Determine which drip to send
    let dripType: string | null = null;
    let emailData: { subject: string; html: string } | null = null;

    const userXp = profile.xp ?? 0;
    const userLevel = profile.level ?? 1;
    const userRank = rankMap.get(userId) ?? totalStudents;
    const userDisplayName = getDisplayName(profile);

    // Send in sequence: day3 → day7 → day14
    // Never skip ahead — each drip must be sent before the next
    if (daysSinceActivity >= 3 && !sentSet.has(`${userId}:day3`) && nextLesson) {
      dripType = "day3";
      emailData = day3Email({
        name: profile.full_name || "",
        displayName: userDisplayName,
        lessonTitle: nextLesson.title,
        courseSlug: course.slug,
        lessonSlug: nextLesson.slug,
        completedCount,
        xp: userXp,
        level: userLevel,
        rank: userRank,
        leaderboard,
        announcements,
      });
    } else if (daysSinceActivity >= 7 && sentSet.has(`${userId}:day3`) && !sentSet.has(`${userId}:day7`)) {
      dripType = "day7";
      emailData = day7Email({
        name: profile.full_name || "",
        displayName: userDisplayName,
        courseTitle: course.title,
        courseSlug: course.slug,
        completedCount,
        totalLessons,
        percentComplete: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
        xp: userXp,
        level: userLevel,
        rank: userRank,
        leaderboard,
        announcements,
      });
    } else if (daysSinceActivity >= 14 && sentSet.has(`${userId}:day7`) && !sentSet.has(`${userId}:day14`)) {
      dripType = "day14";
      emailData = day14Email({
        name: profile.full_name || "",
        displayName: userDisplayName,
        courseSlug: course.slug,
        totalStudents,
        avgLessonsCompleted,
        completedCount,
        xp: userXp,
        level: userLevel,
        rank: userRank,
        leaderboard,
        announcements,
      });
    }

    if (!dripType || !emailData) {
      results.skipped++;
      continue;
    }

    try {
      await sendEmail({
        to: email,
        subject: emailData.subject,
        html: emailData.html,
      });

      await supa.from("drip_log").insert({
        user_id: userId,
        drip_type: dripType,
        email_to: email,
        subject: emailData.subject,
      });

      results.sent++;
      results.details.push(`${dripType} → ${email}`);
    } catch (err) {
      results.errors++;
      results.details.push(`FAILED ${dripType} → ${email}: ${err}`);
    }
  }

  return NextResponse.json(results);
}
