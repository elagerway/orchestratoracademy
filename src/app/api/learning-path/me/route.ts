import { NextResponse } from "next/server";
import { createClientFromRequest } from "@/lib/supabase/server-with-token";

export async function GET(request: Request) {
  const supabase = await createClientFromRequest(request);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user) {
    const message = authError?.message?.includes("expired")
      ? "Token expired. Visit /dashboard/api-token for a fresh token."
      : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  // Fetch latest assessment
  const { data: assessment } = await supabase
    .from("team_assessments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Fetch all courses
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug, is_free, order")
    .eq("active", true)
    .order("order");

  // Fetch user enrollments
  const { data: enrollments } = await supabase
    .from("user_enrollments")
    .select("course_id")
    .eq("user_id", user.id);

  const enrolledIds = new Set((enrollments ?? []).map((e) => e.course_id));

  // Fetch lab verification count
  const { count: labCount } = await supabase
    .from("lab_verifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("verified", true);

  // Build course progress — single query for all modules, then count lessons
  const { data: allModules } = await supabase
    .from("modules")
    .select("id, course_id");

  const modulesByCourse = new Map<string, string[]>();
  for (const m of allModules ?? []) {
    const list = modulesByCourse.get(m.course_id) ?? [];
    list.push(m.id);
    modulesByCourse.set(m.course_id, list);
  }

  const courseProgress = await Promise.all(
    (courses ?? []).map(async (course) => {
      const moduleIds = modulesByCourse.get(course.id) ?? [];
      const { count: totalLessons } = await supabase
        .from("lessons")
        .select("*", { count: "exact", head: true })
        .in("module_id", moduleIds.length > 0 ? moduleIds : ["__none__"]);

      return {
        ...course,
        enrolled: enrolledIds.has(course.id),
        total_lessons: totalLessons ?? 0,
      };
    })
  );

  // Build recommended course sequence based on maturity
  const maturityLevel = assessment?.maturity_score ?? 1;
  let recommended: string[] = [];

  if (maturityLevel <= 2) {
    recommended = (courses ?? [])
      .filter((c) => c.is_free || c.order <= 3)
      .map((c) => c.slug);
  } else if (maturityLevel <= 3) {
    recommended = (courses ?? [])
      .filter((c) => c.order >= 2)
      .map((c) => c.slug);
  } else {
    recommended = (courses ?? [])
      .filter((c) => c.order >= 4)
      .map((c) => c.slug);
  }

  const nextCourse = courseProgress.find(
    (c) => recommended.includes(c.slug) && !c.enrolled
  ) ?? courseProgress.find((c) => !c.enrolled);

  return NextResponse.json({
    user_id: user.id,
    maturity_level: maturityLevel,
    assessment: assessment ? {
      id: assessment.id,
      maturity_score: assessment.maturity_score,
      gap_report: assessment.gap_report,
      tool_checks: assessment.tool_checks,
      api_checks: assessment.api_checks,
      created_at: assessment.created_at,
    } : null,
    recommended_courses: recommended,
    courses: courseProgress,
    next_course: nextCourse?.slug ?? null,
    labs_completed: labCount ?? 0,
  });
}
