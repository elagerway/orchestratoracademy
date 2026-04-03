import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

interface RubricItem {
  id: string;
  label: string;
  desc: string;
}

export async function POST(request: Request) {
  const { spec, rubric } = (await request.json()) as {
    spec: string;
    rubric: RubricItem[];
  };

  if (!spec || !rubric) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const rubricText = rubric
      .map((r) => `- ${r.label}: ${r.desc}`)
      .join("\n");

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are grading a student's AI workflow spec in an AI Orchestration course.

The student was asked to write a complete spec for a customer support AI system that handles incoming tickets end-to-end.

RUBRIC (evaluate each criterion):
${rubricText}

STUDENT'S SPEC:
"""
${spec}
"""

Evaluate each rubric item. Be generous with reasonable answers but firm on missing concepts. A student doesn't need perfect wording — they need to demonstrate they understand the concept.

Respond with exactly this JSON format, no other text:
{
  "results": [
    {"label": "Desired outcome", "passed": true/false, "feedback": "brief explanation"},
    {"label": "Model selection", "passed": true/false, "feedback": "brief explanation"},
    {"label": "Workflow steps", "passed": true/false, "feedback": "brief explanation"},
    {"label": "Model assignment", "passed": true/false, "feedback": "brief explanation"},
    {"label": "Error handling", "passed": true/false, "feedback": "brief explanation"}
  ],
  "overall": "1-2 sentence summary of spec quality and what to improve"
}`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(text);
    const score = parsed.results.filter(
      (r: { passed: boolean }) => r.passed
    ).length;

    return NextResponse.json({
      results: parsed.results,
      score,
      total: rubric.length,
      overall: parsed.overall,
    });
  } catch (error) {
    console.error("Spec evaluation error:", error);
    return NextResponse.json(
      { error: "Evaluation failed" },
      { status: 500 }
    );
  }
}
