"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Confetti } from "./confetti";
import { AchievementToast } from "./achievement-toast";
import type { ModuleQuiz as ModuleQuizType } from "@/lib/types/database";

interface TerminalQuizProps {
  quiz: ModuleQuizType;
  moduleTitle: string;
  courseSlug: string;
}

interface SpecBrief {
  scenario: string;
  guidance: string;
  exampleSpec: string;
  referenceSpec: {
    outcome: string;
    model: string;
    steps: string;
    assignment: string;
    errorHandling: string;
  };
  rubric: Array<{ id: string; label: string; desc: string }>;
  keywords: Record<string, RegExp>;
}

// Briefs per module slug
const SPEC_BRIEFS: Record<string, SpecBrief> = {
  "tools-platforms-landscape": {
    scenario:
      "A mid-size e-commerce company comes to you with three AI projects they want to build. They need you to recommend the right models and platforms for each one. Here are the projects:\n\n1. A customer support chatbot that reads long order histories and handles refund policy questions\n2. A product photo analyzer that checks listings for quality issues\n3. An AI phone system that answers calls, routes customers, and sends SMS follow-ups",
    guidance:
      "For each project, recommend the right AI model and platform. Explain why each one is the best fit based on what you learned about their strengths.",
    exampleSpec: `Project 1 — Customer Support Chatbot:
Model: Claude — it's the best fit here because support tickets can be really long (full order histories, email threads) and refund policies need careful reasoning. Claude handles large context windows and nuanced interpretation better than the alternatives. Safety matters too since this is customer-facing.

Project 2 — Product Photo Analyzer:
Model: Gemini — this is a visual task, and Gemini has native multimodal capabilities. It can analyze images directly without needing a separate vision pipeline. For a simpler/cheaper option, GPT-4o also handles vision well.

Project 3 — AI Phone System:
Platform: Magpipe — this is specifically what it's built for. Voice agents, call routing, SMS workflows. You wouldn't use Claude or CrewAI directly for phone automation — you need a platform that handles the telephony layer, and Magpipe does that with AI agents built in.`,
    referenceSpec: {
      outcome:
        "Matched each project to the right model/platform with clear reasoning based on the task requirements.",
      model:
        "Claude for long-context text reasoning. Gemini for multimodal/vision. Magpipe for voice/SMS.",
      steps:
        "Evaluated each project's core requirement: text reasoning → Claude, image analysis → Gemini, telephony → Magpipe.",
      assignment:
        "Matched model strengths to task needs — not using one model for everything.",
      errorHandling:
        "Acknowledged trade-offs or alternatives (e.g. GPT-4o as a vision alternative).",
    },
    rubric: [
      { id: "support", label: "Support chatbot recommendation", desc: "Recommended a model suited for long context and reasoning (e.g. Claude)" },
      { id: "vision", label: "Photo analyzer recommendation", desc: "Recommended a model with vision/multimodal capabilities (e.g. Gemini)" },
      { id: "voice", label: "Phone system recommendation", desc: "Recommended the right platform for voice/SMS (e.g. Magpipe)" },
      { id: "reasoning", label: "Reasoning for choices", desc: "Explained WHY each tool fits — not just named them" },
      { id: "tradeoffs", label: "Awareness of trade-offs", desc: "Acknowledged alternatives, limitations, or cost considerations" },
    ],
    keywords: {
      support: /claude|anthropic|opus|sonnet/i,
      vision: /gemini|multimodal|vision|gpt-4o|image/i,
      voice: /magpipe|voice|phone|telephon|sms/i,
      reasoning: /because|since|best fit|strength|context|reason|suited|designed for|built for/i,
      tradeoffs: /alternative|also|trade.?off|cost|cheaper|simpler|option|however|could also/i,
    },
  },
  "prompt-engineering-fundamentals": {
    scenario:
      "A B2B SaaS company wants to use AI to analyze their customer churn data and generate actionable insights for the leadership team. The data includes usage logs, support tickets, and billing history.",
    guidance:
      "Write the prompt you'd give Claude to do this analysis. Apply what you learned — the RACE framework (Role, Action, Context, Expectations), chain-of-thought prompting, and output formatting.",
    exampleSpec: `You are a senior data analyst with 10 years of experience in SaaS metrics and customer retention.

Analyze the following customer churn data from our B2B SaaS platform. The data includes monthly usage logs, support ticket history, and billing records for the past 12 months.

Focus on:
- Identifying the top 3 leading indicators of churn based on usage patterns
- Correlating support ticket frequency and sentiment with churn likelihood
- Segmenting customers by risk level (high/medium/low) with clear criteria
- Recommending specific, actionable retention strategies for each segment

Think through this step by step. For each finding, cite the specific data pattern that supports it.

Output format: Executive summary (3 bullets), detailed findings with supporting data, risk segmentation table, and prioritized list of retention recommendations with expected impact.`,
    referenceSpec: {
      outcome:
        "Role: Senior data analyst with SaaS metrics expertise — gives the AI the right perspective for this task.",
      model:
        "Context: B2B SaaS platform, 12 months of usage logs + support tickets + billing. Specific enough for the AI to work with.",
      steps:
        "Action: Identify churn indicators, correlate data sources, segment by risk level, recommend retention strategies.",
      assignment:
        "Technique: Chain-of-thought ('think step by step'), evidence-based ('cite the data pattern'), structured output format.",
      errorHandling:
        "Expectations: Executive summary (3 bullets), findings with data, risk segmentation table, prioritized recommendations with expected impact.",
    },
    rubric: [
      { id: "role", label: "Role/persona", desc: "Set a clear role or persona for the AI with relevant expertise" },
      { id: "context", label: "Context provided", desc: "Gave specific context about the data, company, or situation" },
      { id: "action", label: "Specific action", desc: "Clear, specific instructions on what to analyze and how" },
      { id: "technique", label: "Prompting technique", desc: "Used a technique like chain-of-thought, output formatting, or step-by-step reasoning" },
      { id: "output", label: "Output expectations", desc: "Defined the expected output format, structure, or quality bar" },
    ],
    keywords: {
      role: /you are|act as|senior|analyst|expert|specialist|experience/i,
      context: /saas|churn|usage|support ticket|billing|customer|data|month|log/i,
      action: /analyz|identify|correlat|segment|recommend|focus on|find|detect|pattern/i,
      technique: /step by step|chain.of.thought|think through|for each|format|bullet|table|structured/i,
      output: /format|output|summary|table|list|report|bullet|section|executive/i,
    },
  },
  "building-first-ai-workflow": {
    scenario:
      "A company receives hundreds of support tickets daily. They need an AI-powered workflow that handles incoming tickets end-to-end — from reading the ticket to delivering a draft response to the support agent.",
    guidance:
      "Write the prompt you'd give Claude to build this. Think about what it needs to know — the goal, which models to use, how the workflow flows, and what to do when things break.",
    exampleSpec: `Build me a customer support workflow that takes incoming tickets and produces a draft response for the agent.

Use Claude Opus for the complex reasoning steps since tickets can be 10,000+ words and we need accurate policy interpretation. Use Haiku for the simple classification and extraction steps to keep costs down.

The workflow should:
1. Classify the ticket by type and urgency
2. Extract key details — order number, customer info, issue summary
3. Look up the relevant support policy in our database
4. Draft a response using the ticket context and policy, matching our brand voice
5. Score confidence and route to the agent for review

For model assignment: Steps 1-2 use Haiku (fast, cheap, simple tasks). Step 3 is a direct DB query, no AI needed. Steps 4-5 use Opus (complex reasoning, long context).

Error handling: Validate all AI output against our JSON schema. Add retry with exponential backoff for API rate limits. Cross-check any cited policy against the real database to catch hallucinations. If confidence is below 80% or the ticket mentions legal/safety issues, escalate directly to a senior agent.`,
    referenceSpec: {
      outcome:
        "Each ticket → categorized summary + policy match + draft response with confidence score for agent review.",
      model:
        "Claude (Opus for drafting — long context, strong reasoning, safety-first; Haiku for classification — fast, cheap).",
      steps:
        "1) Classify ticket type & urgency 2) Extract key entities 3) Look up relevant policy in DB 4) Draft response using policy + ticket context 5) Score confidence & route to agent.",
      assignment:
        "Steps 1-2 → Haiku (simple extraction). Step 3 → No AI (database query). Steps 4-5 → Opus (complex reasoning + brand voice).",
      errorHandling:
        "Validate output JSON schema. Retry with exponential backoff on rate limits. Verify cited policies exist in DB. Escalate to human agent if confidence < 80% or ticket contains legal/safety keywords.",
    },
    rubric: [
      { id: "outcome", label: "Desired outcome", desc: "Clear definition of what the workflow produces" },
      { id: "model", label: "Model selection", desc: "Chose appropriate model(s) with reasoning" },
      { id: "steps", label: "Workflow steps", desc: "Multi-step pipeline from ticket intake to response output" },
      { id: "assignment", label: "Model assignment", desc: "Different models for different steps based on complexity" },
      { id: "errors", label: "Error handling", desc: "Addresses failures: validation, retries, escalation" },
    ],
    keywords: {
      outcome: /response|reply|answer|summary|action|draft|resolution|ticket|produce|output/i,
      model: /claude|opus|sonnet|haiku|anthropic/i,
      steps: /(classif|categoriz|triage|extract|draft|step|pipeline|lookup|polic).*\n.*(classif|categoriz|triage|extract|draft|step|pipeline|lookup|polic)/im,
      assignment: /haiku|fast|cheap|simple|different model|right model|no ai|db|database|opus.*draft|draft.*opus/i,
      errors: /error|retry|fallback|validat|human|escalat|fail|check|rate limit|backoff|hallucin/i,
    },
  },
};

type Phase = "bash" | "claude" | "writing" | "evaluating" | "results";

export function TerminalQuiz({
  quiz,
  moduleTitle,
  courseSlug,
}: TerminalQuizProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("bash");
  const [bashValue, setBashValue] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [results, setResults] = useState<
    Array<{ label: string; passed: boolean; feedback: string }> | null
  >(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(5);
  const [overall, setOverall] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(
    []
  );
  const bashInputRef = useRef<HTMLInputElement>(null);
  const specInputRef = useRef<HTMLTextAreaElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Find the right brief
  const moduleSlugKey = Object.keys(SPEC_BRIEFS).find((slug) =>
    moduleTitle.toLowerCase().includes(slug.split("-")[0])
  );
  const brief = SPEC_BRIEFS[moduleSlugKey ?? ""] ?? SPEC_BRIEFS["building-first-ai-workflow"];

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // Focus bash input on mount
  useEffect(() => {
    bashInputRef.current?.focus();
  }, []);

  // Focus spec input when phase changes
  useEffect(() => {
    if (phase === "writing") {
      setTimeout(() => specInputRef.current?.focus(), 100);
    }
  }, [phase]);

  // Ghost text for bash
  const ghostText =
    "claude".startsWith(bashValue.toLowerCase()) && bashValue.length < 6
      ? "claude".substring(bashValue.length)
      : "";

  function handleBashKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      setBashValue("claude");
      return;
    }
    if (e.key === "Enter" && bashValue.trim().toLowerCase() === "claude") {
      e.preventDefault();
      setPhase("claude");
      setTimeout(() => setPhase("writing"), 300);
    }
  }

  function handleSpecKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Tab" && specValue.trim() === "") {
      e.preventDefault();
      setSpecValue(brief.exampleSpec);
    }
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && specValue.length >= 50) {
      e.preventDefault();
      submitSpec();
    }
  }

  async function submitSpec() {
    setPhase("evaluating");

    try {
      const res = await fetch("/api/quiz/evaluate-spec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spec: specValue, rubric: brief.rubric }),
      });

      if (res.ok) {
        const data = await res.json();
        handleResults(data.results, data.score, data.total, data.overall);
      } else {
        fallbackEvaluate();
      }
    } catch {
      fallbackEvaluate();
    }
  }

  function fallbackEvaluate() {
    const evalResults = brief.rubric.map((r) => {
      const pattern = brief.keywords[r.id];
      const passed = pattern ? pattern.test(specValue) : false;
      return {
        label: r.label,
        passed,
        feedback: passed
          ? `Covered in your spec.`
          : `Not addressed — ${r.desc.toLowerCase()}.`,
      };
    });

    const evalScore = evalResults.filter((r) => r.passed).length;
    handleResults(evalResults, evalScore, brief.rubric.length, null);
  }

  function handleResults(
    evalResults: Array<{ label: string; passed: boolean; feedback: string }>,
    evalScore: number,
    evalTotal: number,
    evalOverall: string | null
  ) {
    setResults(evalResults);
    setScore(evalScore);
    setTotal(evalTotal);
    setOverall(evalOverall);
    setPhase("results");

    const passed = evalScore >= Math.ceil(evalTotal * 0.6);
    if (passed) {
      setShowConfetti(true);
      // Submit to quiz API for XP
      fetch("/api/gamification/quiz-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_quiz_id: quiz.id,
          answers: brief.rubric.map((_, i) =>
            evalResults[i]?.passed ? quiz.questions[i]?.correct ?? 0 : -1
          ),
        }),
      }).catch(() => {});
    }
  }

  function handleRetry() {
    setResults(null);
    setScore(0);
    setOverall(null);
    setPhase("writing");
  }

  const passed = score >= Math.ceil(total * 0.6);
  const ref = brief.referenceSpec;

  return (
    <>
      <Confetti show={showConfetti} />
      {unlockedAchievements.map((title, i) => (
        <AchievementToast
          key={title}
          title={title}
          description="New achievement unlocked!"
          icon="trophy"
          xpReward={0}
          onDismiss={() =>
            setUnlockedAchievements((prev) => prev.filter((_, j) => j !== i))
          }
        />
      ))}

      <div className="mx-auto max-w-3xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 rounded-t-xl bg-neutral-800 px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-500/80" />
            <div className="size-3 rounded-full bg-amber-500/80" />
            <div className="size-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 text-xs font-medium text-neutral-400">
            {phase === "bash"
              ? "erik@mac — orchestratoracademy"
              : "✳ Claude Code"}
          </span>
        </div>

        {/* Terminal body */}
        <div
          ref={terminalRef}
          className="rounded-b-xl bg-neutral-950 px-5 py-4 font-mono text-sm leading-relaxed"
        >
          {/* Bash phase */}
          {phase === "bash" && (
            <div
              className="whitespace-nowrap cursor-text"
              onClick={() => bashInputRef.current?.focus()}
            >
              <span className="text-emerald-400">erik@mac</span>{" "}
              <span className="text-blue-400">~/orchestratoracademy</span>{" "}
              <span className="text-neutral-200">%</span>{" "}
              <span className="text-emerald-400">{bashValue}</span>
              <span
                className={`inline-block h-4 w-2 bg-neutral-200 align-middle ${
                  cursorVisible ? "opacity-100" : "opacity-0"
                }`}
              />
              <span className="text-neutral-700">{ghostText}</span>
              <input
                ref={bashInputRef}
                type="text"
                value={bashValue}
                onChange={(e) => setBashValue(e.target.value)}
                onKeyDown={handleBashKeyDown}
                className="absolute -left-[9999px]"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          )}

          {/* Claude startup + spec writing */}
          {(phase === "claude" ||
            phase === "writing" ||
            phase === "evaluating" ||
            phase === "results") && (
            <>
              {/* Logo — rendered as PNG because browsers can't display block element Unicode reliably */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/claude-logo.png"
                alt="Claude Code v4.6"
                className="mb-3 h-auto"
                style={{ width: 400, imageRendering: "auto" }}
              />
              <div className="my-2 border-t border-neutral-800" />

              {/* Prompt */}
              <div className="mb-2 flex items-start gap-2">
                <span className="font-bold text-purple-400">❯</span>
                <span className="text-neutral-200">
                  Write the spec for this project. Include everything Claude
                  needs to build it.
                </span>
              </div>

              {/* Brief */}
              <div className="my-3 rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-purple-400">
                  Brief
                </div>
                <div className="mb-3 text-neutral-200 whitespace-pre-line">{brief.scenario}</div>
                <div className="text-neutral-500">{brief.guidance}</div>
              </div>

              {/* Spec textarea */}
              {(phase === "writing" ||
                phase === "evaluating" ||
                phase === "results") && (
                <>
                  <textarea
                    ref={specInputRef}
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    onKeyDown={handleSpecKeyDown}
                    disabled={phase !== "writing"}
                    placeholder="Tell Claude what to build... (press Tab for an example)"
                    className={`my-3 w-full min-h-[160px] resize-y rounded-lg border bg-neutral-900/80 px-4 py-3 font-mono text-sm leading-relaxed outline-none ${
                      phase === "writing"
                        ? "border-neutral-800 text-neutral-200 caret-emerald-400 placeholder:text-neutral-700 focus:border-purple-500"
                        : "border-neutral-800 text-emerald-400"
                    }`}
                  />
                  <div className="mb-2 text-right text-xs text-neutral-700">
                    {specValue.length} characters
                  </div>

                  {phase === "writing" && (
                    <button
                      onClick={submitSpec}
                      disabled={specValue.length < 50}
                      className="rounded-lg bg-purple-500 px-5 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Submit Spec ↵
                    </button>
                  )}
                </>
              )}

              {/* Evaluating */}
              {phase === "evaluating" && (
                <div className="my-3 text-purple-400">
                  ⟡ Analyzing your spec against rubric...
                </div>
              )}

              {/* Results */}
              {phase === "results" && results && (
                <>
                  <div className="my-2 border-t border-neutral-800" />

                  <div className="mb-3 flex items-start gap-2">
                    <span className="font-bold text-purple-400">❯</span>
                    <span className="font-bold text-neutral-200">
                      Spec Review
                    </span>
                  </div>

                  {/* Rubric items */}
                  <div className="space-y-1.5">
                    {results.map((r, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span
                          className={`mt-0.5 ${
                            r.passed ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {r.passed ? "✓" : "✗"}
                        </span>
                        <div>
                          <span
                            className={`font-bold ${
                              r.passed ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {r.label}
                          </span>
                          <span className="text-neutral-500">
                            {" "}
                            — {r.feedback}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {overall && (
                    <div className="mt-3 ml-5 text-neutral-500">{overall}</div>
                  )}

                  {/* Score box */}
                  <div className="my-4 rounded-lg border border-neutral-800 bg-neutral-900/50 px-5 py-4 text-center">
                    <div
                      className={`text-xl font-bold ${
                        passed ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {score}/{total}
                    </div>
                    <div className="mt-1 text-neutral-500">
                      {passed
                        ? "🚀 Spec approved — workflow ready to build"
                        : "⚠ Spec needs work — review the gaps above"}
                    </div>
                    <div
                      className={`mt-2 text-sm font-semibold ${
                        passed ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {passed
                        ? `PASSED — +${quiz.xp_reward} XP`
                        : "Revise your spec and resubmit"}
                    </div>
                  </div>

                  {/* Reference spec */}
                  <div className="my-4 rounded-lg border border-emerald-900/50 bg-emerald-950/30 px-4 py-3">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
                      Reference spec
                    </div>
                    <div className="space-y-1.5 text-neutral-500">
                      <div>
                        <span className="font-bold text-neutral-200">
                          Outcome:
                        </span>{" "}
                        {ref.outcome}
                      </div>
                      <div>
                        <span className="font-bold text-neutral-200">
                          Model:
                        </span>{" "}
                        {ref.model}
                      </div>
                      <div>
                        <span className="font-bold text-neutral-200">
                          Steps:
                        </span>{" "}
                        {ref.steps}
                      </div>
                      <div>
                        <span className="font-bold text-neutral-200">
                          Assignment:
                        </span>{" "}
                        {ref.assignment}
                      </div>
                      <div>
                        <span className="font-bold text-neutral-200">
                          Error handling:
                        </span>{" "}
                        {ref.errorHandling}
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="mt-4 text-center">
                    {passed ? (
                      <button
                        onClick={() =>
                          router.push(`/courses/${courseSlug}`)
                        }
                        className="rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-emerald-400"
                      >
                        Continue to Course →
                      </button>
                    ) : (
                      <button
                        onClick={handleRetry}
                        className="rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-emerald-400"
                      >
                        Revise & Resubmit
                      </button>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
