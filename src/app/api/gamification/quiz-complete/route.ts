import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 4600, 5900, 7400, 9200, 11300, 13800, 16800, 20400, 24700, 29800, 35800];

function getLevel(xp: number): number {
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { module_quiz_id, answers, hybrid_score } = body;

  if (!module_quiz_id) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Fetch quiz
  const { data: quiz, error: quizError } = await supabase
    .from("module_quizzes")
    .select("*")
    .eq("id", module_quiz_id)
    .single();

  if (quizError || !quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  let score: number;
  let total: number;
  let passed: boolean;

  if (hybrid_score && typeof hybrid_score.score === "number" && typeof hybrid_score.total === "number") {
    // Hybrid quiz — client-scored (MC + terminal keyword matching)
    total = hybrid_score.total;
    if (total <= 0 || !Number.isInteger(hybrid_score.score) || !Number.isInteger(total)) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }
    score = Math.max(0, Math.min(hybrid_score.score, total));
    passed = score >= Math.ceil(total * 2 / 3); // always re-derive, never trust client
  } else if (Array.isArray(answers)) {
    // Standard MC quiz — server-scored against DB questions
    const questions = quiz.questions as Array<{ id: string; question: string; options: string[]; correct: number }>;
    total = questions.length;
    score = 0;
    for (let i = 0; i < total; i++) {
      if (answers[i] === questions[i].correct) {
        score++;
      }
    }
    passed = score >= Math.ceil(total * 2 / 3);
  } else {
    return NextResponse.json({ error: "Invalid request — provide answers or hybrid_score" }, { status: 400 });
  }

  // Check existing best result
  const { data: existingResult } = await supabase
    .from("module_quiz_results")
    .select("*")
    .eq("user_id", user.id)
    .eq("module_quiz_id", module_quiz_id)
    .single();

  const previouslyPassed = existingResult?.passed === true;
  const xpEarned = passed && !previouslyPassed ? quiz.xp_reward : 0;

  // Upsert quiz result — keep best score
  if (!existingResult || score > existingResult.score) {
    await supabase.from("module_quiz_results").upsert(
      {
        user_id: user.id,
        module_quiz_id: module_quiz_id,
        score,
        total,
        passed,
        xp_earned: existingResult ? Math.max(existingResult.xp_earned, xpEarned) : xpEarned,
        answers,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,module_quiz_id" }
    );
  }

  // Award XP if first time passing
  let newXp = 0;
  if (xpEarned > 0) {
    // Log XP
    await supabase.from("xp_log").insert({
      user_id: user.id,
      amount: xpEarned,
      source: "quiz",
      source_id: module_quiz_id,
    });

    // Update profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    newXp = (profile?.xp ?? 0) + xpEarned;
    const newLevel = getLevel(newXp);

    await supabase
      .from("profiles")
      .update({ xp: newXp, level: newLevel })
      .eq("user_id", user.id);
  } else {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    newXp = profile?.xp ?? 0;
  }

  // Check for achievements
  const unlockedAchievements: string[] = [];

  // Count total quizzes passed by this user
  const { count: quizCount } = await supabase
    .from("module_quiz_results")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("passed", true);

  // Achievement checks
  const achievementChecks = [
    { slug: "first-quiz", condition: (quizCount ?? 0) >= 1 },
    { slug: "five-quizzes", condition: (quizCount ?? 0) >= 5 },
    { slug: "quiz-ace", condition: score === total },
  ];

  for (const check of achievementChecks) {
    if (!check.condition) continue;

    // Get achievement
    const { data: achievement } = await supabase
      .from("achievements")
      .select("*")
      .eq("slug", check.slug)
      .single();

    if (!achievement) continue;

    // Check if already unlocked
    const { data: existing } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", user.id)
      .eq("achievement_id", achievement.id)
      .single();

    if (existing) continue;

    // Unlock achievement
    await supabase.from("user_achievements").insert({
      user_id: user.id,
      achievement_id: achievement.id,
      unlocked_at: new Date().toISOString(),
    });

    // Award achievement XP
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
    score,
    total,
    passed,
    xpEarned,
    newLevel: getLevel(newXp),
    achievements: unlockedAchievements,
  });
}
