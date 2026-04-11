import { NextResponse } from "next/server";
import { createClientFromRequest } from "@/lib/supabase/server-with-token";

const THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 4600, 5900, 7400, 9200, 11300, 13800, 16800, 20400, 24700, 29800, 35800];

function getLevel(xp: number): number {
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

const DEPLOY_XP = 200;

export async function POST(request: Request) {
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

  const { project_name, use_case, scaffold_type, technologies, assessment_id, completed_courses } = await request.json();

  if (!project_name || !use_case) {
    return NextResponse.json({ error: "Missing required fields: project_name, use_case" }, { status: 400 });
  }

  // Insert deploy completion
  const { data: deploy, error: deployError } = await supabase
    .from("deploy_completions")
    .insert({
      user_id: user.id,
      project_name,
      use_case,
      scaffold_type: scaffold_type || "nextjs-supabase",
      technologies: technologies || [],
      assessment_id: assessment_id || null,
      completed_courses: completed_courses || [],
    })
    .select("id")
    .single();

  if (deployError) {
    return NextResponse.json({ error: deployError.message }, { status: 500 });
  }

  // Award XP (first deploy only)
  const { data: existingLog } = await supabase
    .from("xp_log")
    .select("id")
    .eq("user_id", user.id)
    .eq("source", "deploy")
    .maybeSingle();

  let xpEarned = 0;
  if (!existingLog) {
    xpEarned = DEPLOY_XP;
    await supabase.from("xp_log").insert({
      user_id: user.id,
      amount: DEPLOY_XP,
      source: "deploy",
      source_id: deploy.id,
    });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp")
    .eq("user_id", user.id)
    .single();

  let newXp = (profile?.xp ?? 0) + xpEarned;

  if (xpEarned > 0) {
    await supabase
      .from("profiles")
      .update({ xp: newXp, level: getLevel(newXp) })
      .eq("user_id", user.id);
  }

  // Check achievements
  const unlockedAchievements: string[] = [];

  // First deploy achievement
  const achievementChecks = [{ slug: "first-deploy", condition: true }];

  // Full pipeline: has assessment + lab + deploy
  const { count: assessCount } = await supabase
    .from("team_assessments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: labCount } = await supabase
    .from("lab_verifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("verified", true);

  if ((assessCount ?? 0) >= 1 && (labCount ?? 0) >= 1) {
    achievementChecks.push({ slug: "full-pipeline", condition: true });
  }

  for (const check of achievementChecks) {
    if (!check.condition) continue;

    const { data: achievement } = await supabase
      .from("achievements")
      .select("*")
      .eq("slug", check.slug)
      .single();

    if (!achievement) continue;

    const { data: existing } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", user.id)
      .eq("achievement_id", achievement.id)
      .maybeSingle();

    if (existing) continue;

    await supabase.from("user_achievements").insert({
      user_id: user.id,
      achievement_id: achievement.id,
      unlocked_at: new Date().toISOString(),
    });

    if (achievement.xp_reward > 0) {
      await supabase.from("xp_log").insert({
        user_id: user.id,
        amount: achievement.xp_reward,
        source: "achievement",
        source_id: achievement.id,
      });
      newXp += achievement.xp_reward;
      await supabase
        .from("profiles")
        .update({ xp: newXp, level: getLevel(newXp) })
        .eq("user_id", user.id);
    }

    unlockedAchievements.push(achievement.title);
  }

  return NextResponse.json({
    success: true,
    deploy_id: deploy.id,
    xp_earned: xpEarned,
    achievements: unlockedAchievements,
  });
}
