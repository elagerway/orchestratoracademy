/**
 * generate-scripts.ts
 *
 * Takes module content and generates structured script data for:
 * - Talking head segments (intro, transitions, outro)
 * - Code screen segments (terminal animations)
 *
 * Uses the Anthropic SDK to generate these from lesson content.
 *
 * NOTE: @anthropic-ai/sdk must be installed:
 *   npm install @anthropic-ai/sdk
 */

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load env from parent project
const envPath = path.resolve(__dirname, "../../.env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Anthropic SDK — needs to be installed separately
// npm install @anthropic-ai/sdk
let Anthropic: any;
try {
  Anthropic = require("@anthropic-ai/sdk").default;
} catch {
  // Will be checked at runtime
}

export interface CodeLine {
  type: "command" | "output" | "comment";
  text: string;
  delay?: number;
}

export interface TalkingHeadScript {
  purpose: "intro" | "transition" | "outro";
  script: string;
  estimatedDurationSeconds: number;
}

export interface CodeSegmentScript {
  title: string;
  lines: CodeLine[];
  estimatedDurationSeconds: number;
  voiceoverScript?: string;
}

export interface ModuleScripts {
  moduleSlug: string;
  moduleTitle: string;
  talkingHeadSegments: TalkingHeadScript[];
  codeSegments: CodeSegmentScript[];
  /** Ordered sequence of segment types for final composition */
  sequence: Array<{ type: "talking-head" | "code-screen"; index: number }>;
}

const SYSTEM_PROMPT = `You are a script writer for AI Orchestrator Academy, an online course that teaches people how to build AI agents and orchestrators using Claude and other AI tools.

You generate two types of content:
1. **Talking head scripts**: Conversational, friendly, spoken by an on-screen avatar. Keep them natural and engaging. Use "you" to address the learner.
2. **Code segments**: Terminal commands and output that demonstrate concepts. These will be animated as a typing terminal (like Claude Code).

Important guidelines:
- Keep talking head scripts SHORT and punchy. Intro: ~30 seconds. Transitions: ~15 seconds. Outro: ~20 seconds.
- Code segments should be practical, real-world examples that students can follow along with.
- Use Python as the primary language unless the content specifically requires JavaScript/bash.
- Include comments in code to explain what's happening.
- Terminal output should be realistic.
- Each spoken word takes roughly 0.4 seconds, so a 30-second script is about 75 words.`;

const GENERATION_PROMPT = `Given the following module content, generate a complete video script structure.

Module Title: {title}
Module Content:
{content}

Generate a JSON response with this exact structure:
{
  "talkingHeadSegments": [
    {
      "purpose": "intro",
      "script": "The spoken script for the intro (conversational, ~30 seconds / ~75 words)",
      "estimatedDurationSeconds": 30
    },
    {
      "purpose": "transition",
      "script": "Bridge between code segments (~15 seconds / ~37 words)",
      "estimatedDurationSeconds": 15
    },
    {
      "purpose": "outro",
      "script": "Summary and next steps (~20 seconds / ~50 words)",
      "estimatedDurationSeconds": 20
    }
  ],
  "codeSegments": [
    {
      "title": "Segment title",
      "lines": [
        { "type": "comment", "text": "# Explanation comment" },
        { "type": "command", "text": "the command to type" },
        { "type": "output", "text": "expected output" }
      ],
      "estimatedDurationSeconds": 90,
      "voiceoverScript": "Optional narration for this code segment"
    },
    {
      "title": "Second segment title",
      "lines": [...],
      "estimatedDurationSeconds": 60
    }
  ],
  "sequence": [
    { "type": "talking-head", "index": 0 },
    { "type": "code-screen", "index": 0 },
    { "type": "talking-head", "index": 1 },
    { "type": "code-screen", "index": 1 },
    { "type": "talking-head", "index": 2 }
  ]
}

Return ONLY valid JSON, no markdown code fences.`;

export async function generateModuleScripts(
  moduleSlug: string,
  moduleTitle: string,
  moduleContent: string
): Promise<ModuleScripts> {
  if (!Anthropic) {
    throw new Error(
      "@anthropic-ai/sdk is not installed. Run: npm install @anthropic-ai/sdk"
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY not found in environment. Add it to .env.local"
    );
  }

  const client = new Anthropic({ apiKey });

  const prompt = GENERATION_PROMPT.replace("{title}", moduleTitle).replace(
    "{content}",
    moduleContent
  );

  console.log(`[generate-scripts] Generating scripts for: ${moduleTitle}`);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const textContent = response.content.find(
    (block: any) => block.type === "text"
  );
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude");
  }

  let parsed: any;
  try {
    parsed = JSON.parse(textContent.text);
  } catch (e) {
    // Try to extract JSON from the response if it has markdown fences
    const jsonMatch = textContent.text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1]);
    } else {
      throw new Error(`Failed to parse Claude response as JSON: ${e}`);
    }
  }

  return {
    moduleSlug,
    moduleTitle,
    talkingHeadSegments: parsed.talkingHeadSegments,
    codeSegments: parsed.codeSegments,
    sequence: parsed.sequence,
  };
}

/**
 * Generate placeholder scripts for testing without the Anthropic API.
 */
export function generatePlaceholderScripts(
  moduleSlug: string,
  moduleTitle: string
): ModuleScripts {
  return {
    moduleSlug,
    moduleTitle,
    talkingHeadSegments: [
      {
        purpose: "intro",
        script: `Welcome to ${moduleTitle}! In this module, you're going to learn some really powerful concepts that will level up your AI orchestration skills. Let's dive right in and see what we can build together.`,
        estimatedDurationSeconds: 30,
      },
      {
        purpose: "transition",
        script:
          "Great, now that you've seen the basics, let's take it a step further and build something more interesting.",
        estimatedDurationSeconds: 15,
      },
      {
        purpose: "outro",
        script: `That's a wrap on ${moduleTitle}! You've learned some key concepts that you'll use throughout the rest of this course. In the next module, we'll build on these foundations.`,
        estimatedDurationSeconds: 20,
      },
    ],
    codeSegments: [
      {
        title: "Getting Started",
        lines: [
          { type: "comment", text: "# Setting up the environment" },
          { type: "command", text: "pip install anthropic" },
          { type: "output", text: "Successfully installed anthropic-0.40.0" },
          { type: "command", text: "python" },
          { type: "command", text: "from anthropic import Anthropic" },
          { type: "command", text: "client = Anthropic()" },
          { type: "comment", text: "# Send your first message" },
          {
            type: "command",
            text: 'response = client.messages.create(\n    model="claude-sonnet-4-20250514",\n    max_tokens=1024,\n    messages=[{"role": "user", "content": "Hello!"}]\n)',
          },
          { type: "command", text: "print(response.content[0].text)" },
          { type: "output", text: "Hello! How can I help you today?" },
        ],
        estimatedDurationSeconds: 90,
      },
      {
        title: "Building the Orchestrator",
        lines: [
          { type: "comment", text: "# Define the orchestrator function" },
          {
            type: "command",
            text: 'def orchestrate(task: str) -> str:\n    """Route tasks to specialized handlers."""\n    if "search" in task.lower():\n        return search_handler(task)\n    elif "code" in task.lower():\n        return code_handler(task)\n    return default_handler(task)',
          },
          { type: "comment", text: "# Test it out" },
          {
            type: "command",
            text: 'result = orchestrate("search for Python tutorials")',
          },
          { type: "output", text: "Routing to search handler..." },
          { type: "output", text: "Found 5 results for: Python tutorials" },
        ],
        estimatedDurationSeconds: 60,
      },
    ],
    sequence: [
      { type: "talking-head", index: 0 },
      { type: "code-screen", index: 0 },
      { type: "talking-head", index: 1 },
      { type: "code-screen", index: 1 },
      { type: "talking-head", index: 2 },
    ],
  };
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  const moduleSlug = args.find((a) => !a.startsWith("-")) || "test-module";
  const usePlaceholder = args.includes("--placeholder");

  (async () => {
    let scripts: ModuleScripts;

    if (usePlaceholder) {
      scripts = generatePlaceholderScripts(moduleSlug, "Test Module");
      console.log(JSON.stringify(scripts, null, 2));
    } else {
      // In a real scenario, you'd fetch module content from Supabase
      scripts = await generateModuleScripts(
        moduleSlug,
        "Test Module",
        "This is placeholder module content for testing."
      );
      console.log(JSON.stringify(scripts, null, 2));
    }
  })();
}
