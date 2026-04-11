import { NextResponse } from "next/server";
import { createClientFromRequest } from "@/lib/supabase/server-with-token";

const THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 4600, 5900, 7400, 9200, 11300, 13800, 16800, 20400, 24700, 29800, 35800];

function getLevel(xp: number): number {
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

const ASSESSMENT_XP = 100;

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

  const body = await request.json();
  const { tool_checks, api_checks, repo_analysis, maturity_score, gap_report, raw_results, company_name, company_role } = body;

  if (!tool_checks || !api_checks || !maturity_score || !gap_report) {
    return NextResponse.json({ error: "Missing required fields: tool_checks, api_checks, maturity_score, gap_report" }, { status: 400 });
  }

  if (maturity_score < 1 || maturity_score > 5) {
    return NextResponse.json({ error: "maturity_score must be between 1 and 5" }, { status: 400 });
  }

  // Insert assessment
  const { data: assessment, error: assessError } = await supabase
    .from("team_assessments")
    .insert({
      user_id: user.id,
      tool_checks,
      api_checks,
      repo_analysis: repo_analysis || {},
      maturity_score,
      gap_report,
      raw_results: raw_results || {},
    })
    .select("id")
    .single();

  if (assessError) {
    return NextResponse.json({ error: assessError.message }, { status: 500 });
  }

  // Update profile with assessment results
  const profileUpdate: Record<string, unknown> = {
    assessment_score: maturity_score * 20,
    maturity_level: maturity_score,
  };
  if (company_name) profileUpdate.company_name = company_name;
  if (company_role) profileUpdate.company_role = company_role;

  await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("user_id", user.id);

  // Award XP (check if first assessment)
  const { data: existingLog } = await supabase
    .from("xp_log")
    .select("id")
    .eq("user_id", user.id)
    .eq("source", "assessment")
    .maybeSingle();

  let xpEarned = 0;
  if (!existingLog) {
    xpEarned = ASSESSMENT_XP;
    await supabase.from("xp_log").insert({
      user_id: user.id,
      amount: ASSESSMENT_XP,
      source: "assessment",
      source_id: assessment.id,
    });
  }

  // Update profile XP
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
  const achievementChecks = [
    { slug: "first-assessment", condition: true },
    { slug: "maturity-3", condition: maturity_score >= 3 },
    { slug: "maturity-5", condition: maturity_score >= 5 },
  ];

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
    assessment_id: assessment.id,
    maturity_score,
    xp_earned: xpEarned,
    achievements: unlockedAchievements,
  });
}
