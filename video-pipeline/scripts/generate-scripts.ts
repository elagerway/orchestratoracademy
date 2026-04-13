/**
 * generate-scripts.ts
 *
 * Takes module content (with lesson details) and generates structured script data for:
 * - Talking head segments (intro per lesson, transitions, outro) — interweaved with code previews
 * - Code screen segments (terminal animations showing real examples)
 *
 * The intro covers ALL lessons in the module with code previews between each.
 * Format: talking head → code preview → talking head → code preview → ... → talking head outro
 */

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

const envPath = path.resolve(__dirname, "../../.env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

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
  purpose: "intro" | "lesson-preview" | "transition" | "outro";
  lessonTitle?: string;
  script: string;
  estimatedDurationSeconds: number;
}

export interface CodeSegmentScript {
  title: string;
  lessonTitle?: string;
  lines: CodeLine[];
  estimatedDurationSeconds: number;
  voiceoverScript?: string;
}

export interface ModuleScripts {
  moduleSlug: string;
  moduleTitle: string;
  lessonTitles: string[];
  talkingHeadSegments: TalkingHeadScript[];
  codeSegments: CodeSegmentScript[];
  sequence: Array<{ type: "talking-head" | "code-screen"; index: number }>;
}

export interface LessonInfo {
  title: string;
  slug: string;
  content: string;
}

const SYSTEM_PROMPT = `You are a script writer for AI Orchestrator Academy, an online course that teaches people how to become AI Orchestrators — professionals who design, connect, and manage AI systems.

The course instructor is Leo, a knowledgeable but approachable tech educator. He speaks in a calm, confident, conversational tone. Not hype-y, not boring. Think senior engineer explaining things to a smart colleague.

You generate two types of content:
1. **Talking head scripts**: Conversational, spoken by Leo on camera. Natural pacing with pauses. Uses "you" to address the learner. Each word takes ~0.4 seconds. Leo addresses students as "you", never "I did the orchestrating". The orchestrator is the human instructing agents, not writing code.
2. **Code segments**: Terminal commands and output shown on a dark screen (like Claude Code / VS Code terminal). These are animated as typing, so keep commands reasonable length.

Guidelines:
- The module intro should be substantial (60-90 seconds) — Leo welcomes learners, explains what the module covers, and previews each lesson
- Between lesson previews, show a quick 15-30 second code snippet that gives a taste of what that lesson teaches
- Transition scripts bridge from one lesson preview to the next (10-15 seconds each)
- The outro summarizes key takeaways and teases the next module (30-45 seconds). Every outro must be unique, no repeating the same sign-off.
- Use **commas** between phrases, NOT dashes or periods — dashes and periods cause ElevenLabs to insert long awkward pauses. Commas keep the flow natural.
- **No filler phrases** — never use "watch this", "check this out", "look at this". Jump straight into the content.
- Code should be practical, real-world, and directly tied to the lesson content
- Use Python as primary language unless content specifically requires JavaScript/TypeScript/bash
- Include terminal prompts ($ for bash, >>> for Python REPL, claude> for Claude Code)`;

const GENERATION_PROMPT = `Generate a complete module intro video script. This video introduces the module and previews each lesson with interweaved code snippets.

**Module Title**: {title}

**Lessons in this module**:
{lessonList}

**Lesson content summaries**:
{lessonSummaries}

Generate a JSON response with this structure. The video should flow like this:
1. Leo introduces the module (what it's about, why it matters) — 60-90 seconds
2. For each lesson: Leo previews what the lesson covers (15-20 sec) → quick code snippet showing a taste of that concept (15-30 sec)
3. Leo wraps up with key takeaways and what's next (30-45 sec)

The sequence should alternate: talking-head, code-screen, talking-head, code-screen, ..., talking-head (outro)

JSON structure:
{
  "talkingHeadSegments": [
    {
      "purpose": "intro",
      "script": "Opening script — welcome, module overview, why this matters (60-90 sec, ~150-225 words)",
      "estimatedDurationSeconds": 75
    },
    {
      "purpose": "lesson-preview",
      "lessonTitle": "Lesson 1 title",
      "script": "Preview of what lesson 1 covers and why it's important (15-20 sec, ~40-50 words)",
      "estimatedDurationSeconds": 18
    },
    {
      "purpose": "lesson-preview",
      "lessonTitle": "Lesson 2 title",
      "script": "Preview of lesson 2 (15-20 sec, ~40-50 words)",
      "estimatedDurationSeconds": 18
    },
    ... one per lesson ...
    {
      "purpose": "outro",
      "script": "Wrap up — key takeaways, what you'll be able to do, tease next module (30-45 sec, ~75-110 words)",
      "estimatedDurationSeconds": 35
    }
  ],
  "codeSegments": [
    {
      "title": "Preview: Lesson 1 concept",
      "lessonTitle": "Lesson 1 title",
      "lines": [
        { "type": "comment", "text": "# Quick preview of the concept" },
        { "type": "command", "text": "actual code example" },
        { "type": "output", "text": "expected output" }
      ],
      "estimatedDurationSeconds": 20,
      "voiceoverScript": "Optional brief narration over the code"
    },
    ... one per lesson ...
  ],
  "sequence": [
    { "type": "talking-head", "index": 0 },
    { "type": "code-screen", "index": 0 },
    { "type": "talking-head", "index": 1 },
    { "type": "code-screen", "index": 1 },
    ... alternating ...
    { "type": "talking-head", "index": N }
  ]
}

The sequence MUST start and end with a talking-head segment. Each code segment should have a corresponding talking-head segment before it.

Return ONLY valid JSON, no markdown code fences.`;

export async function generateModuleScripts(
  moduleSlug: string,
  moduleTitle: string,
  lessons: LessonInfo[]
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

  const lessonList = lessons
    .map((l, i) => `${i + 1}. ${l.title}`)
    .join("\n");

  const lessonSummaries = lessons
    .map((l) => {
      // Take first 500 chars of content as summary
      const summary = l.content
        .replace(/#{1,6}\s/g, "")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/`{1,3}[^`]*`{1,3}/g, "")
        .slice(0, 500);
      return `**${l.title}**: ${summary}...`;
    })
    .join("\n\n");

  const prompt = GENERATION_PROMPT
    .replace("{title}", moduleTitle)
    .replace("{lessonList}", lessonList)
    .replace("{lessonSummaries}", lessonSummaries);

  console.log(`[generate-scripts] Generating scripts for: ${moduleTitle} (${lessons.length} lessons)`);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
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
    lessonTitles: lessons.map((l) => l.title),
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
  moduleTitle: string,
  lessons: LessonInfo[] = []
): ModuleScripts {
  const lessonTitles = lessons.length > 0
    ? lessons.map((l) => l.title)
    : ["Lesson 1", "Lesson 2", "Lesson 3"];

  const talkingHeadSegments: TalkingHeadScript[] = [
    {
      purpose: "intro",
      script: `Welcome to ${moduleTitle}. In this module, we are going to cover ${lessonTitles.length} key topics that will build your understanding of this subject. Each lesson builds on the last, so by the end of this module you will have a solid, practical grasp of the concepts. Let me walk you through what we will cover.`,
      estimatedDurationSeconds: 30,
    },
  ];

  const codeSegments: CodeSegmentScript[] = [];
  const sequence: Array<{ type: "talking-head" | "code-screen"; index: number }> = [
    { type: "talking-head", index: 0 },
  ];

  lessonTitles.forEach((title, i) => {
    // Lesson preview talking head
    talkingHeadSegments.push({
      purpose: "lesson-preview",
      lessonTitle: title,
      script: `In ${title}, you will learn the core concepts and see them in action. Here is a quick preview of what that looks like.`,
      estimatedDurationSeconds: 12,
    });

    // Code preview
    codeSegments.push({
      title: `Preview: ${title}`,
      lessonTitle: title,
      lines: [
        { type: "comment", text: `# ${title} — quick preview` },
        { type: "command", text: `$ claude "Show me an example of ${title.toLowerCase()}"` },
        { type: "output", text: `Here's a practical example...` },
        { type: "command", text: `print("Concept demonstrated")` },
        { type: "output", text: `Concept demonstrated` },
      ],
      estimatedDurationSeconds: 20,
    });

    sequence.push({ type: "talking-head", index: i + 1 });
    sequence.push({ type: "code-screen", index: i });
  });

  // Outro
  talkingHeadSegments.push({
    purpose: "outro",
    script: `That is a wrap on the preview for ${moduleTitle}. Now let us dive into the first lesson and start building these skills hands on.`,
    estimatedDurationSeconds: 15,
  });
  sequence.push({ type: "talking-head", index: talkingHeadSegments.length - 1 });

  return {
    moduleSlug,
    moduleTitle,
    lessonTitles,
    talkingHeadSegments,
    codeSegments,
    sequence,
  };
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  const moduleSlug = args.find((a) => !a.startsWith("-")) || "test-module";
  const usePlaceholder = args.includes("--placeholder");

  (async () => {
    const testLessons: LessonInfo[] = [
      { title: "What is AI Orchestration?", slug: "what-is-ai-orchestration", content: "AI Orchestration is the practice of designing..." },
      { title: "The AI Landscape in 2026", slug: "ai-landscape-2026", content: "The AI ecosystem has evolved dramatically..." },
    ];

    let scripts: ModuleScripts;
    if (usePlaceholder) {
      scripts = generatePlaceholderScripts(moduleSlug, "Test Module", testLessons);
    } else {
      scripts = await generateModuleScripts(moduleSlug, "Test Module", testLessons);
    }
    console.log(JSON.stringify(scripts, null, 2));
  })();
}
