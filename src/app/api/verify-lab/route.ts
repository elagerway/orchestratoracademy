import { NextResponse } from "next/server";
import { createClientFromRequest } from "@/lib/supabase/server-with-token";
import Anthropic from "@anthropic-ai/sdk";

const THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 4600, 5900, 7400, 9200, 11300, 13800, 16800, 20400, 24700, 29800, 35800];

function getLevel(xp: number): number {
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

const LAB_XP = 25;

type LabType = "api_response" | "terminal_output" | "config_content" | "file_hash";

function verifyApiResponse(evidence: string): { verified: boolean; feedback: string } {
  // Check for plausible API response ID patterns
  const patterns = [
    /msg_[a-zA-Z0-9]{20,}/, // Anthropic message ID
    /chatcmpl-[a-zA-Z0-9]{20,}/, // OpenAI completion ID
    /resp_[a-zA-Z0-9]{20,}/, // Generic response ID
  ];

  const matches = patterns.some((p) => p.test(evidence));
  return {
    verified: matches,
    feedback: matches
      ? "Valid API response ID detected."
      : "This does not look like a valid API response ID. Expected a message ID like msg_... or chatcmpl-...",
  };
}

function verifyConfigContent(evidence: string): { verified: boolean; feedback: string } {
  try {
    const parsed = JSON.parse(evidence);
    // Check for MCP config structure
    if (parsed.mcpServers || parsed.mcp_servers) {
      return { verified: true, feedback: "Valid MCP configuration detected." };
    }
    // Check for CLAUDE.md-like structure
    if (typeof parsed === "object" && Object.keys(parsed).length > 0) {
      return { verified: true, feedback: "Valid configuration file detected." };
    }
    return { verified: false, feedback: "Configuration is valid JSON but missing expected keys (mcpServers)." };
  } catch {
    // Might be YAML or markdown — check for common config patterns
    if (evidence.includes("mcpServers") || evidence.includes("mcp_servers") || evidence.includes("CLAUDE.md")) {
      return { verified: true, feedback: "Configuration content detected." };
    }
    return { verified: false, feedback: "Could not parse as valid configuration. Expected JSON with mcpServers key." };
  }
}

async function verifyTerminalOutput(evidence: string, lessonContext: string): Promise<{ verified: boolean; feedback: string }> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    // Fallback: basic keyword check
    if (evidence.length > 20) {
      return { verified: true, feedback: "Terminal output recorded." };
    }
    return { verified: false, feedback: "Output is too short to verify." };
  }

  const client = new Anthropic({ apiKey: anthropicKey });

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    system: "You evaluate whether terminal output demonstrates that a specific command was actually run. Reply with JSON: {\"verified\": true/false, \"feedback\": \"brief explanation\"}",
    messages: [
      {
        role: "user",
        content: `Does this terminal output demonstrate that the user actually ran the required command?\n\nLesson context: ${lessonContext}\n\nSubmitted output:\n${evidence.slice(0, 2000)}`,
      },
    ],
  });

  try {
    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const result = JSON.parse(text);
    return { verified: !!result.verified, feedback: result.feedback || "Evaluated by AI." };
  } catch {
    return { verified: evidence.length > 30, feedback: "Terminal output recorded." };
  }
}

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

  const { lesson_id, lab_type, evidence } = await request.json();

  if (!lesson_id || !lab_type || !evidence) {
    return NextResponse.json({ error: "Missing required fields: lesson_id, lab_type, evidence" }, { status: 400 });
  }

  const validTypes: LabType[] = ["api_response", "terminal_output", "config_content", "file_hash"];
  if (!validTypes.includes(lab_type)) {
    return NextResponse.json({ error: `Invalid lab_type. Must be one of: ${validTypes.join(", ")}` }, { status: 400 });
  }

  // Verify based on type
  let result: { verified: boolean; feedback: string };

  switch (lab_type as LabType) {
    case "api_response":
      result = verifyApiResponse(evidence);
      break;
    case "config_content":
      result = verifyConfigContent(evidence);
      break;
    case "terminal_output":
      result = await verifyTerminalOutput(evidence, `Lesson ${lesson_id}`);
      break;
    case "file_hash":
      result = /^[0-9a-f]{64}$/i.test(evidence)
        ? { verified: true, feedback: "Hash verified." }
        : { verified: false, feedback: "Expected a valid 64-character hex SHA-256 hash." };
      break;
    default:
      result = { verified: false, feedback: "Unknown lab type." };
  }

  // Upsert lab verification
  await supabase.from("lab_verifications").upsert(
    {
      user_id: user.id,
      lesson_id,
      lab_type,
      evidence: evidence.slice(0, 5000),
      verified: result.verified,
      verification_details: { feedback: result.feedback, lab_type },
      xp_earned: result.verified ? LAB_XP : 0,
    },
    { onConflict: "user_id,lesson_id" }
  );

  // Award XP if verified and first time
  let xpActuallyAwarded = 0;
  const unlockedAchievements: string[] = [];

  if (result.verified) {
    const { data: existingLog } = await supabase
      .from("xp_log")
      .select("id")
      .eq("user_id", user.id)
      .eq("source", "lab")
      .eq("source_id", lesson_id)
      .maybeSingle();

    if (!existingLog) {
      xpActuallyAwarded = LAB_XP;
      await supabase.from("xp_log").insert({
        user_id: user.id,
        amount: LAB_XP,
        source: "lab",
        source_id: lesson_id,
      });

      const { data: profile } = await supabase
        .from("profiles")
        .select("xp")
        .eq("user_id", user.id)
        .single();

      let newXp = (profile?.xp ?? 0) + LAB_XP;
      await supabase
        .from("profiles")
        .update({ xp: newXp, level: getLevel(newXp) })
        .eq("user_id", user.id);

      // Check lab achievements
      const { count: labCount } = await supabase
        .from("lab_verifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("verified", true);

      const achievementChecks = [
        { slug: "first-lab", condition: (labCount ?? 0) >= 1 },
        { slug: "five-labs", condition: (labCount ?? 0) >= 5 },
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
    }
  }

  return NextResponse.json({
    verified: result.verified,
    feedback: result.feedback,
    xp_earned: xpActuallyAwarded,
    achievements: unlockedAchievements,
  });
}
