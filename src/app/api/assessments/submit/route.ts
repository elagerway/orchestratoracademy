import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { AssessmentQuestion } from "@/lib/types/database";

export async function POST(request: Request) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { assessment_id, answers } = body as {
    assessment_id: string;
    answers: number[];
  };

  if (!assessment_id || !Array.isArray(answers)) {
    return NextResponse.json(
      { error: "Missing assessment_id or answers" },
      { status: 400 }
    );
  }

  // Fetch the assessment
  const { data: assessment, error: assessmentError } = await supabase
    .from("assessments")
    .select("*")
    .eq("id", assessment_id)
    .single();

  if (assessmentError || !assessment) {
    return NextResponse.json(
      { error: "Assessment not found" },
      { status: 404 }
    );
  }

  const questions = assessment.questions as AssessmentQuestion[];

  if (answers.length !== questions.length) {
    return NextResponse.json(
      { error: "Answer count does not match question count" },
      { status: 400 }
    );
  }

  // Calculate score
  let correctCount = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].correct) {
      correctCount++;
    }
  }

  const score = Math.round((correctCount / questions.length) * 100);
  const passed = score >= assessment.passing_score;

  // Insert attempt
  const { error: attemptError } = await supabase
    .from("assessment_attempts")
    .insert({
      user_id: user.id,
      assessment_id,
      answers,
      score,
      passed,
    });

  if (attemptError) {
    return NextResponse.json(
      { error: "Failed to save attempt" },
      { status: 500 }
    );
  }

  if (passed) {
    // Fetch course slug for certificate number
    const { data: course } = await supabase
      .from("courses")
      .select("*")
      .eq("id", assessment.course_id)
      .single();

    const slugShort = course
      ? course.slug
          .split("-")
          .map((w: string) => w[0]?.toUpperCase() ?? "")
          .join("")
          .slice(0, 4)
      : "GEN";

    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certificateNumber = `OA-${slugShort}-${year}-${random}`;

    // Upsert certificate (prevent duplicates on user_id+course_id)
    const { data: cert, error: certError } = await supabase
      .from("certificates")
      .upsert(
        {
          user_id: user.id,
          course_id: assessment.course_id,
          certificate_number: certificateNumber,
          assessment_score: score,
        },
        { onConflict: "user_id,course_id" }
      )
      .select("certificate_number")
      .single();

    if (certError) {
      // Certificate creation failed but attempt was saved — still report pass
      return NextResponse.json({ passed: true, score });
    }

    return NextResponse.json({
      passed: true,
      score,
      certificateNumber: cert.certificate_number,
    });
  }

  return NextResponse.json({
    passed: false,
    score,
    passingScore: assessment.passing_score,
  });
}
