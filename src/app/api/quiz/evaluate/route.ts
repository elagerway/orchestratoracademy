import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const { step_title, context, question, ideal_answer, student_answer } =
    await request.json();

  if (!question || !student_answer) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `You are grading a student's answer in an AI Orchestration course quiz.

Step: ${step_title}
Context: ${context}
Question: ${question}
Ideal answer covers: ${ideal_answer}
Student's answer: "${student_answer}"

Evaluate whether the student demonstrates understanding of the concept. They don't need to match the ideal answer exactly — they need to show they grasp the key idea. Be generous with reasonable answers but firm on fundamental misunderstandings.

Respond with exactly this JSON format, no other text:
{"correct": true/false, "feedback": "One sentence explaining why they're right or what they missed"}`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(text);

    return NextResponse.json({
      correct: parsed.correct,
      feedback: parsed.feedback,
    });
  } catch (error) {
    console.error("Quiz evaluation error:", error);
    return NextResponse.json(
      { correct: false, feedback: "Could not evaluate — try again." },
      { status: 500 }
    );
  }
}
