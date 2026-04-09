"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Confetti } from "./confetti";
import { AchievementToast } from "./achievement-toast";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ModuleQuiz as ModuleQuizType } from "@/lib/types/database";

interface HybridQuizProps {
  quiz: ModuleQuizType;
  moduleTitle: string;
  courseSlug: string;
  moduleSlug: string;
}

interface MCQuestion {
  type: "mc";
  question: string;
  options: string[];
  correct: number;
}

interface TerminalQuestion {
  type: "terminal";
  scenario: string;
  prompt: string;
  hint: string;
  tabFill: string;
  acceptedKeywords: string[];
  correctFeedback: string;
  wrongFeedback: string;
}

type HybridQuestion = MCQuestion | TerminalQuestion;

interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  xpEarned: number;
  newLevel: number;
  achievements: string[];
}

// Hybrid questions per module slug
const HYBRID_QUESTIONS: Record<string, HybridQuestion[]> = {
  // ── M1: Welcome to AI Orchestration ──
  "welcome-to-ai-orchestration": [
    {
      type: "mc",
      question: "What is the primary role of an AI orchestrator?",
      options: [
        "Writing code line by line",
        "Directing AI agents to build software using natural language",
        "Training machine learning models",
        "Managing server infrastructure",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "You want to check if Claude Code is installed on your machine. What command do you run?",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude --version",
      acceptedKeywords: ["claude", "version"],
      correctFeedback: "That confirms Claude Code is installed and shows the current version.",
      wrongFeedback: "Run: claude --version to check if Claude Code is available.",
    },
    {
      type: "mc",
      question: "Which best describes the orchestrator workflow?",
      options: [
        "Code → Test → Deploy",
        "Define spec → Build with agent → Test → Review → Push",
        "Design → Prototype → Ship",
        "Research → Plan → Code manually",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Start a new Claude Code session in your project directory.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude",
      acceptedKeywords: ["claude"],
      correctFeedback: "That launches Claude Code in interactive mode, ready for instructions.",
      wrongFeedback: "Simply type: claude to start an interactive session.",
    },
    {
      type: "mc",
      question: "What is the orchestrator's most important tool?",
      options: [
        "A fast computer",
        "Clear, structured specifications",
        "Multiple monitors",
        "Advanced programming knowledge",
      ],
      correct: 1,
    },
  ],

  // ── M2: The AI Orchestrator Role ──
  "the-ai-orchestrator-role": [
    {
      type: "mc",
      question: "How does an AI orchestrator differ from a traditional developer?",
      options: [
        "They use a different programming language",
        "They direct agents with specs instead of writing code themselves",
        "They only work on frontend projects",
        "They don't need to understand code at all",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Create a CLAUDE.md file to give your AI agent project-specific instructions.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "touch CLAUDE.md && echo '# Project Instructions\\n\\nThis is a Next.js app using Supabase.' > CLAUDE.md",
      acceptedKeywords: ["claude.md"],
      correctFeedback: "CLAUDE.md is how you give persistent context to your AI agent.",
      wrongFeedback: "Create a CLAUDE.md file — it gives your agent project-level instructions.",
    },
    {
      type: "mc",
      question: "What document does an orchestrator write BEFORE asking an agent to build?",
      options: [
        "A README",
        "A pull request",
        "A specification or PRD",
        "A test suite",
      ],
      correct: 2,
    },
    {
      type: "terminal",
      scenario: "Create a specs directory and a new feature spec file for a login page.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "mkdir -p specs && touch specs/login-page.md",
      acceptedKeywords: ["mkdir", "specs"],
      correctFeedback: "Good structure — specs/ is where orchestrators keep their feature definitions.",
      wrongFeedback: "Use: mkdir -p specs && touch specs/login-page.md",
    },
    {
      type: "mc",
      question: "After an agent builds a feature, the orchestrator should:",
      options: [
        "Ship it immediately",
        "Rewrite the code manually",
        "Review, test, and iterate before pushing",
        "Delete the spec and start over",
      ],
      correct: 2,
    },
  ],

  // ── M3: Tools & Platforms Landscape ──
  "tools-platforms-landscape": [
    {
      type: "mc",
      question: "Which of these is an AI coding agent you can use from the terminal?",
      options: [
        "Figma",
        "Claude Code",
        "Canva",
        "Notion",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Check which version of Node.js is installed — most AI tools require Node 18+.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "node --version",
      acceptedKeywords: ["node", "version"],
      correctFeedback: "Node.js is the runtime that powers most modern AI development tools.",
      wrongFeedback: "Run: node --version to check your Node.js installation.",
    },
    {
      type: "mc",
      question: "What is Supabase?",
      options: [
        "A CSS framework",
        "An open-source Firebase alternative (database, auth, storage)",
        "A deployment platform",
        "A testing library",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Install the Anthropic SDK so you can call Claude's API from your project.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "npm install @anthropic-ai/sdk",
      acceptedKeywords: ["npm", "anthropic"],
      correctFeedback: "The Anthropic SDK is the official way to call Claude from JavaScript/TypeScript.",
      wrongFeedback: "Use: npm install @anthropic-ai/sdk",
    },
    {
      type: "mc",
      question: "Vercel is used for:",
      options: [
        "Database management",
        "Deploying and hosting web applications",
        "Writing AI prompts",
        "Version control",
      ],
      correct: 1,
    },
  ],

  // ── M4: Prompt Engineering Fundamentals (already has TerminalQuiz, keeping for fallback) ──

  // ── M5: Building Your First AI Workflow (already has TerminalQuiz, keeping for fallback) ──

  // ── M6: AI Ethics & Responsible Use ──
  "ai-ethics-responsible-use": [
    {
      type: "mc",
      question: "Why should you review AI-generated code before shipping it?",
      options: [
        "AI always writes buggy code",
        "To check for security issues, hallucinations, and incorrect logic",
        "It's a legal requirement in all countries",
        "The AI needs feedback to improve",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "You want to make sure your .env file with API keys never gets committed. Add it to .gitignore.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "echo '.env' >> .gitignore",
      acceptedKeywords: ["gitignore", ".env"],
      correctFeedback: "Critical — API keys in git history are the #1 security incident in AI projects.",
      wrongFeedback: "Add .env to your .gitignore: echo '.env' >> .gitignore",
    },
    {
      type: "mc",
      question: "What is 'hallucination' in the context of AI?",
      options: [
        "When the AI crashes",
        "When the AI generates confident but incorrect information",
        "When the AI runs out of tokens",
        "When the AI refuses to answer",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Before pushing code the agent wrote, run a security audit on your npm dependencies.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "npm audit",
      acceptedKeywords: ["npm", "audit"],
      correctFeedback: "npm audit checks for known vulnerabilities in your dependency tree.",
      wrongFeedback: "Run: npm audit to check for security vulnerabilities.",
    },
    {
      type: "mc",
      question: "When using AI to process user data, you must consider:",
      options: [
        "Only the speed of processing",
        "Privacy, consent, and data protection regulations",
        "Whether the AI model is the newest version",
        "The color scheme of the UI",
      ],
      correct: 1,
    },
  ],

  // ── M7: Next Steps: Your Orchestration Journey ──
  "next-steps-your-journey": [
    {
      type: "mc",
      question: "What is the best way to improve as an AI orchestrator?",
      options: [
        "Memorize every API endpoint",
        "Build real projects and iterate on your specs",
        "Read documentation without practicing",
        "Use only one AI tool forever",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Initialize a new project to practice your orchestration skills.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "mkdir my-ai-project && cd my-ai-project && git init",
      acceptedKeywords: ["mkdir", "git", "init"],
      correctFeedback: "Every orchestration project starts with a clean repo and a clear spec.",
      wrongFeedback: "Start with: mkdir my-ai-project && cd my-ai-project && git init",
    },
    {
      type: "mc",
      question: "Which skill compounds the most for an orchestrator?",
      options: [
        "Typing speed",
        "Writing clear, unambiguous specifications",
        "Knowing keyboard shortcuts",
        "Using the latest tools",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Create a PRD (Product Requirements Document) for your next project.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "touch docs/prd.md && echo '# Product Requirements\\n\\n## Goal\\n\\n## Features\\n\\n## Acceptance Criteria' > docs/prd.md",
      acceptedKeywords: ["prd", "docs"],
      correctFeedback: "A PRD is the orchestrator's blueprint — define before you build.",
      wrongFeedback: "Create a PRD file in docs/: touch docs/prd.md",
    },
    {
      type: "mc",
      question: "An orchestrator's portfolio should showcase:",
      options: [
        "How many lines of code they wrote",
        "The specs they wrote and the products they shipped",
        "How many AI tools they've tried",
        "Their typing test results",
      ],
      correct: 1,
    },
  ],

  // ── M8: Understanding APIs ──
  "understanding-apis": [
    {
      type: "mc",
      question: "What does API stand for?",
      options: [
        "Automated Programming Interface",
        "Application Programming Interface",
        "AI Processing Input",
        "Advanced Protocol Integration",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "You need to send a message to Claude's API. Write the curl command to hit the messages endpoint.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "curl https://api.anthropic.com/v1/messages \\\n  -H \"x-api-key: $ANTHROPIC_API_KEY\" \\\n  -H \"content-type: application/json\" \\\n  -d '{\"model\": \"claude-sonnet-4-20250514\", \"max_tokens\": 256, \"messages\": [{\"role\": \"user\", \"content\": \"Hello Claude\"}]}'",
      acceptedKeywords: ["curl", "anthropic", "messages"],
      correctFeedback: "Correct — curl to api.anthropic.com/v1/messages is how you talk to Claude.",
      wrongFeedback: "The command starts with: curl https://api.anthropic.com/v1/messages",
    },
    {
      type: "mc",
      question: "Which HTTP method do you use to CREATE something new via an API?",
      options: ["GET", "DELETE", "POST", "PATCH"],
      correct: 2,
    },
    {
      type: "terminal",
      scenario: "You just received your Anthropic API key. Store it safely as an environment variable.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "export ANTHROPIC_API_KEY=\"sk-ant-api03-your-key-here\"",
      acceptedKeywords: ["export", "anthropic_api_key"],
      correctFeedback: "That is the safe way — stored in your environment, never in your code.",
      wrongFeedback: "Use: export ANTHROPIC_API_KEY=\"sk-ant-...\" to store it as an environment variable.",
    },
    {
      type: "mc",
      question: "You make an API call and get back a 401 error. What does that mean?",
      options: [
        "The server crashed",
        "Your API key is wrong or missing",
        "You sent too many requests",
        "The model does not exist",
      ],
      correct: 1,
    },
  ],

  // ── M9: Working with AI APIs ──
  "working-with-ai-apis": [
    {
      type: "mc",
      question: "What is a 'token' in the context of AI APIs?",
      options: [
        "An authentication credential",
        "A unit of text that the model processes (roughly 4 characters)",
        "A payment method",
        "A type of encryption",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Install the Anthropic Python SDK to use Claude in a script.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "pip install anthropic",
      acceptedKeywords: ["pip", "anthropic"],
      correctFeedback: "The anthropic package gives you the official Python client for Claude.",
      wrongFeedback: "Use: pip install anthropic",
    },
    {
      type: "mc",
      question: "What does 'max_tokens' control in an API call?",
      options: [
        "How fast the response comes back",
        "The maximum length of the AI's response",
        "How many API calls you can make",
        "The model's accuracy",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Set the temperature to 0 for a deterministic Claude response in your API call.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "curl https://api.anthropic.com/v1/messages \\\n  -H \"x-api-key: $ANTHROPIC_API_KEY\" \\\n  -H \"content-type: application/json\" \\\n  -d '{\"model\": \"claude-sonnet-4-20250514\", \"max_tokens\": 1024, \"temperature\": 0, \"messages\": [{\"role\": \"user\", \"content\": \"Explain APIs\"}]}'",
      acceptedKeywords: ["temperature", "0", "messages"],
      correctFeedback: "Temperature 0 gives the most deterministic, consistent responses.",
      wrongFeedback: "Include \"temperature\": 0 in your API request body.",
    },
    {
      type: "mc",
      question: "Which model is best for fast, cost-effective tasks like classification?",
      options: [
        "Claude Opus",
        "Claude Sonnet",
        "Claude Haiku",
        "They all cost the same",
      ],
      correct: 2,
    },
  ],

  // ── M10: Introduction to MCP ──
  "introduction-to-mcp": [
    {
      type: "mc",
      question: "What does MCP stand for?",
      options: [
        "Model Configuration Platform",
        "Model Context Protocol",
        "Machine Code Processor",
        "Multi-Channel Pipeline",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "List the MCP servers currently configured in your Claude Code setup.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude mcp list",
      acceptedKeywords: ["claude", "mcp", "list"],
      correctFeedback: "This shows all MCP servers connected to your Claude Code instance.",
      wrongFeedback: "Run: claude mcp list to see configured servers.",
    },
    {
      type: "mc",
      question: "MCP allows AI agents to:",
      options: [
        "Run faster on GPUs",
        "Connect to external tools, databases, and services",
        "Train on new data",
        "Compress files",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Add the Supabase MCP server to your Claude Code configuration.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude mcp add supabase -- npx -y @supabase/mcp-server",
      acceptedKeywords: ["claude", "mcp", "add", "supabase"],
      correctFeedback: "Now Claude can query your Supabase database directly through MCP.",
      wrongFeedback: "Use: claude mcp add supabase -- npx -y @supabase/mcp-server",
    },
    {
      type: "mc",
      question: "An MCP server provides AI agents with:",
      options: [
        "A graphical user interface",
        "Tools, resources, and prompts that extend the agent's capabilities",
        "A faster internet connection",
        "Additional training data",
      ],
      correct: 1,
    },
  ],

  // ── M11: Building with MCP Servers ──
  "building-with-mcp-servers": [
    {
      type: "mc",
      question: "What format does MCP use for communication between client and server?",
      options: [
        "XML",
        "JSON-RPC",
        "GraphQL",
        "SOAP",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Add a filesystem MCP server so Claude can read and write local files.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude mcp add filesystem -- npx -y @anthropic-ai/mcp-filesystem",
      acceptedKeywords: ["claude", "mcp", "add", "filesystem"],
      correctFeedback: "The filesystem MCP server gives Claude controlled access to your local files.",
      wrongFeedback: "Use: claude mcp add filesystem -- npx -y @anthropic-ai/mcp-filesystem",
    },
    {
      type: "mc",
      question: "When building a custom MCP server, you define:",
      options: [
        "HTML templates",
        "Tools with names, descriptions, and input schemas",
        "CSS stylesheets",
        "Database tables",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Remove an MCP server you no longer need from your Claude Code setup.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude mcp remove old-server",
      acceptedKeywords: ["claude", "mcp", "remove"],
      correctFeedback: "Clean up unused MCP servers to keep your agent environment tidy.",
      wrongFeedback: "Use: claude mcp remove <server-name>",
    },
    {
      type: "mc",
      question: "MCP servers can run as:",
      options: [
        "Only cloud services",
        "Local processes (stdio) or remote services (HTTP/SSE)",
        "Only Docker containers",
        "Only npm packages",
      ],
      correct: 1,
    },
  ],

  // ── M12: Claude Code Fundamentals ──
  "claude-code-fundamentals": [
    {
      type: "mc",
      question: "Claude Code runs in:",
      options: [
        "A web browser only",
        "Your terminal / command line",
        "A mobile app",
        "Microsoft Word",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Ask Claude Code to create a new React component for a navigation bar.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude \"Create a responsive navigation bar component in src/components/Navbar.tsx with logo, links, and mobile hamburger menu\"",
      acceptedKeywords: ["claude", "component", "nav"],
      correctFeedback: "Give Claude specific instructions about what to build and where to put it.",
      wrongFeedback: "Use: claude \"<your instruction>\" to give Claude a task.",
    },
    {
      type: "mc",
      question: "What file gives Claude Code persistent project context?",
      options: [
        "package.json",
        "CLAUDE.md",
        ".gitignore",
        "tsconfig.json",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Run Claude Code in headless mode to fix all TypeScript errors in your project.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude -p \"Find and fix all TypeScript errors in this project. Run tsc --noEmit to verify.\"",
      acceptedKeywords: ["claude", "-p"],
      correctFeedback: "The -p flag runs Claude in headless/print mode — great for CI and scripting.",
      wrongFeedback: "Use: claude -p \"<instruction>\" for non-interactive (headless) mode.",
    },
    {
      type: "mc",
      question: "When Claude Code makes changes you don't want, you should:",
      options: [
        "Restart your computer",
        "Use git to revert the changes and refine your instructions",
        "Delete the project",
        "Ignore it and keep going",
      ],
      correct: 1,
    },
  ],

  // ── M13: Advanced Claude Code ──
  "advanced-claude-code": [
    {
      type: "mc",
      question: "What are Claude Code 'hooks'?",
      options: [
        "Git commit hooks",
        "Shell commands that run automatically in response to Claude Code events",
        "CSS animations",
        "API rate limiters",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Create a custom slash command that runs your test suite.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "mkdir -p .claude/commands && echo 'Run the full test suite with npm test and report results.' > .claude/commands/test.md",
      acceptedKeywords: [".claude/commands", "test"],
      correctFeedback: "Custom slash commands in .claude/commands/ let you create reusable workflows.",
      wrongFeedback: "Create a file in .claude/commands/ — each .md file becomes a /command.",
    },
    {
      type: "mc",
      question: "Claude Code's /plan mode is used to:",
      options: [
        "Delete files",
        "Think through an approach before writing code",
        "Deploy to production",
        "Run tests",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Use Claude Code to review a git diff before committing.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude \"Review the current git diff. Check for bugs, security issues, and code quality. Suggest fixes.\"",
      acceptedKeywords: ["claude", "review", "diff"],
      correctFeedback: "Using Claude to review changes before committing catches issues early.",
      wrongFeedback: "Ask Claude to review the git diff before you commit.",
    },
    {
      type: "mc",
      question: "What is the benefit of using multiple Claude Code agents in parallel?",
      options: [
        "It uses less memory",
        "You can work on independent tasks simultaneously across worktrees",
        "It makes the AI smarter",
        "It reduces API costs",
      ],
      correct: 1,
    },
  ],

  // ── M14: Connecting AI to Real Data ──
  "connecting-ai-to-real-data": [
    {
      type: "mc",
      question: "What is RAG (Retrieval-Augmented Generation)?",
      options: [
        "A new programming language",
        "Fetching relevant data to include in the AI's context before generating a response",
        "A type of database",
        "A caching strategy",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Query your Supabase database to fetch all users created in the last 7 days.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "supabase sql \"SELECT * FROM profiles WHERE created_at > now() - interval '7 days'\"",
      acceptedKeywords: ["select", "profiles", "created_at"],
      correctFeedback: "Connecting AI to real data means querying databases, not just generating text.",
      wrongFeedback: "Use a SQL query like: SELECT * FROM profiles WHERE created_at > now() - interval '7 days'",
    },
    {
      type: "mc",
      question: "When connecting AI to a database, you should:",
      options: [
        "Give the AI full admin access",
        "Use read-only access with row-level security",
        "Disable all authentication",
        "Store the database password in your code",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Use the Supabase CLI to check the status of your local development database.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "supabase status",
      acceptedKeywords: ["supabase", "status"],
      correctFeedback: "supabase status shows your local database URL, API keys, and service status.",
      wrongFeedback: "Run: supabase status to check your local Supabase instance.",
    },
    {
      type: "mc",
      question: "Embeddings are used in AI to:",
      options: [
        "Compress images",
        "Convert text into numerical vectors for semantic search",
        "Encrypt data",
        "Format code",
      ],
      correct: 1,
    },
  ],

  // ── M15: AI Tool Use & Function Calling ──
  "ai-tool-use-function-calling": [
    {
      type: "mc",
      question: "What is 'tool use' in AI?",
      options: [
        "The AI learning to use a mouse",
        "Giving the AI defined functions it can call to take actions",
        "Installing new software",
        "A debugging technique",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Define a tool schema for a weather lookup function that Claude can call.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude \"Create a tool definition with name 'get_weather', description 'Get current weather for a city', and input_schema with a required 'city' string parameter.\"",
      acceptedKeywords: ["tool", "get_weather"],
      correctFeedback: "Tool definitions tell the AI what functions are available and how to call them.",
      wrongFeedback: "Define a tool with a name, description, and input_schema for the AI to use.",
    },
    {
      type: "mc",
      question: "When Claude returns a 'tool_use' content block, you should:",
      options: [
        "Ignore it",
        "Execute the function and return the result to Claude",
        "Restart the conversation",
        "Send the same message again",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Create a simple MCP tool that returns the current date and time.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude \"Create an MCP server tool called 'current_time' that returns the current date and time in ISO format. Use the @anthropic-ai/sdk MCP server package.\"",
      acceptedKeywords: ["mcp", "tool", "time"],
      correctFeedback: "Custom MCP tools extend what your AI agent can do in your specific workflow.",
      wrongFeedback: "Create an MCP server tool — it gives Claude new capabilities.",
    },
    {
      type: "mc",
      question: "Function calling enables AI to:",
      options: [
        "Only generate text",
        "Take real actions like querying databases, sending emails, and calling APIs",
        "Run faster",
        "Use less memory",
      ],
      correct: 1,
    },
  ],

  // ── M16: Workflow Automation & Integration ──
  "workflow-automation-integration": [
    {
      type: "mc",
      question: "What is a webhook?",
      options: [
        "A Git command",
        "An HTTP callback that notifies your app when an event happens",
        "A CSS property",
        "A type of database index",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Create a GitHub Actions workflow file that runs your tests on every push.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "mkdir -p .github/workflows && touch .github/workflows/ci.yml",
      acceptedKeywords: [".github", "workflows", "ci"],
      correctFeedback: "CI/CD automation ensures every push gets tested automatically.",
      wrongFeedback: "Create: .github/workflows/ci.yml for your CI pipeline.",
    },
    {
      type: "mc",
      question: "Cron jobs are used to:",
      options: [
        "Deploy applications",
        "Run tasks on a recurring schedule",
        "Manage git branches",
        "Compress files",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Use Claude Code to set up a scheduled agent that checks your deploys every hour.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude \"/schedule create --name 'deploy-check' --cron '0 * * * *' --prompt 'Check the latest Vercel deployment status and report any failures.'\"",
      acceptedKeywords: ["schedule", "cron", "deploy"],
      correctFeedback: "Scheduled agents automate recurring orchestration tasks.",
      wrongFeedback: "Use /schedule to create recurring automated tasks in Claude Code.",
    },
    {
      type: "mc",
      question: "The main benefit of automating orchestration workflows is:",
      options: [
        "Using more API credits",
        "Catching issues faster with less manual effort",
        "Making the code more complex",
        "Replacing the need for specs",
      ],
      correct: 1,
    },
  ],

  // ── M17: AI for Business Communication ──
  "ai-for-business-communication": [
    {
      type: "mc",
      question: "When using AI to draft business emails, you should:",
      options: [
        "Send them without reviewing",
        "Review and personalize before sending — AI gives you a starting point",
        "Always write them manually instead",
        "Use the longest possible prompt",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Use Claude to summarize a long document into key bullet points.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude \"Read docs/meeting-notes.md and create a summary with: 1) Key decisions made, 2) Action items with owners, 3) Open questions. Keep it under 200 words.\"",
      acceptedKeywords: ["claude", "summary", "docs"],
      correctFeedback: "Clear instructions with a specific structure get the best results.",
      wrongFeedback: "Give Claude the file to read and specify the output format you want.",
    },
    {
      type: "mc",
      question: "System prompts in business AI applications should:",
      options: [
        "Be as vague as possible",
        "Define the tone, constraints, and format expected",
        "Include the company's full history",
        "Be written in code",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Create a system prompt file for a customer support AI that stays professional and concise.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "echo 'You are a customer support agent for AI Orchestrator Academy. Be professional, concise, and helpful. Never make promises about features not yet released. Escalate billing issues to the team.' > prompts/support-system.txt",
      acceptedKeywords: ["support", "professional", "prompt"],
      correctFeedback: "System prompts define the guardrails for how AI communicates with users.",
      wrongFeedback: "Create a system prompt that sets tone, constraints, and boundaries.",
    },
    {
      type: "mc",
      question: "The biggest risk of AI-generated business content is:",
      options: [
        "It's too well-written",
        "Hallucinated facts, wrong numbers, or off-brand tone",
        "It uses too many tokens",
        "It's always too short",
      ],
      correct: 1,
    },
  ],

  // ── M18: Evaluating AI Outputs ──
  "evaluating-ai-outputs": [
    {
      type: "mc",
      question: "What is an 'eval' in AI development?",
      options: [
        "A JavaScript function",
        "A systematic test to measure AI output quality",
        "A deployment step",
        "A type of prompt",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Run your project's test suite to verify AI-generated code actually works.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "npm test",
      acceptedKeywords: ["npm", "test"],
      correctFeedback: "Always run tests after AI generates code — passing tests is the ground truth.",
      wrongFeedback: "Run: npm test to verify the code works.",
    },
    {
      type: "mc",
      question: "LLM-as-judge means:",
      options: [
        "An AI model decides court cases",
        "Using one AI model to evaluate the quality of another's output",
        "A model that only gives yes/no answers",
        "A benchmarking framework",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Use TypeScript compiler to check for type errors without building — a fast quality check.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "npx tsc --noEmit",
      acceptedKeywords: ["tsc", "noemit"],
      correctFeedback: "tsc --noEmit catches type errors without generating files — quick feedback loop.",
      wrongFeedback: "Use: npx tsc --noEmit to type-check without building.",
    },
    {
      type: "mc",
      question: "The best way to evaluate AI-generated code is:",
      options: [
        "Read it once quickly",
        "Run automated tests, check types, and manually review logic",
        "Trust the AI completely",
        "Only check if it compiles",
      ],
      correct: 1,
    },
  ],

  // ── M19: AI Security & Compliance ──
  "ai-security-compliance": [
    {
      type: "mc",
      question: "What is prompt injection?",
      options: [
        "Adding more context to a prompt",
        "A malicious input that tricks an AI into ignoring its instructions",
        "A way to speed up API calls",
        "A testing technique",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Check if any secrets or API keys are accidentally in your git history.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "git log --all -p | grep -i \"api_key\\|secret\\|password\" | head -20",
      acceptedKeywords: ["git", "log", "secret"],
      correctFeedback: "Scanning git history for leaked secrets is a critical security practice.",
      wrongFeedback: "Search git history: git log --all -p | grep -i \"api_key\\|secret\"",
    },
    {
      type: "mc",
      question: "Row Level Security (RLS) in Supabase ensures:",
      options: [
        "Faster database queries",
        "Users can only access data they're authorized to see",
        "The database backs up automatically",
        "Tables are encrypted",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Rotate your API key by updating the environment variable with a new one.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "export ANTHROPIC_API_KEY=\"sk-ant-api03-new-rotated-key-here\"",
      acceptedKeywords: ["export", "anthropic_api_key"],
      correctFeedback: "Regular key rotation limits the damage if a key is ever compromised.",
      wrongFeedback: "Update with: export ANTHROPIC_API_KEY=\"<your-new-key>\"",
    },
    {
      type: "mc",
      question: "Before deploying an AI feature that processes user data, you need:",
      options: [
        "A bigger server",
        "Data processing agreements, privacy policies, and user consent",
        "More API credits",
        "A faster model",
      ],
      correct: 1,
    },
  ],

  // ── M20: The AI Orchestrator Portfolio ──
  "the-ai-orchestrator-portfolio": [
    {
      type: "mc",
      question: "An orchestrator portfolio project should include:",
      options: [
        "Only the finished product",
        "The spec, the process, and the shipped result",
        "Just a GitHub link",
        "Only screenshots",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Initialize a new portfolio project with a proper README and spec directory.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "mkdir -p portfolio-project/specs && touch portfolio-project/README.md portfolio-project/specs/feature-spec.md portfolio-project/CLAUDE.md",
      acceptedKeywords: ["mkdir", "portfolio", "specs", "claude.md"],
      correctFeedback: "A well-structured project with specs and CLAUDE.md shows orchestrator thinking.",
      wrongFeedback: "Set up: specs/, README.md, and CLAUDE.md to show your orchestrator workflow.",
    },
    {
      type: "mc",
      question: "What makes an orchestrator stand out to employers?",
      options: [
        "Years of coding experience",
        "Proof they can ship products by directing AI agents effectively",
        "Certifications from every AI company",
        "A large social media following",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Push your portfolio project to GitHub so potential employers can see your work.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "git add -A && git commit -m \"feat: initial portfolio project with specs and CLAUDE.md\" && git push origin main",
      acceptedKeywords: ["git", "push", "origin"],
      correctFeedback: "Your GitHub is your resume — every commit tells the story of how you orchestrate.",
      wrongFeedback: "Use: git add, commit, and push to get your work on GitHub.",
    },
    {
      type: "mc",
      question: "The best portfolio projects demonstrate:",
      options: [
        "Using as many AI tools as possible",
        "A clear problem, a structured spec, and a working solution",
        "The longest possible README",
        "Complex code you wrote manually",
      ],
      correct: 1,
    },
  ],

  // ── M21: Modern Web Development with Next.js ──
  "modern-web-development-nextjs": [
    {
      type: "mc",
      question: "Next.js is a framework built on top of:",
      options: [
        "Angular",
        "React",
        "Vue",
        "Svelte",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Create a new Next.js project with TypeScript and Tailwind CSS.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "npx create-next-app@latest my-app --typescript --tailwind --app --use-npm",
      acceptedKeywords: ["create-next-app", "typescript"],
      correctFeedback: "That scaffolds a Next.js app with TypeScript and Tailwind ready to go.",
      wrongFeedback: "Use: npx create-next-app@latest with --typescript flag.",
    },
    {
      type: "mc",
      question: "In Next.js App Router, server components:",
      options: [
        "Run in the browser",
        "Render on the server and can directly access databases",
        "Require 'use client' at the top",
        "Can't use async/await",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Start the Next.js development server.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "npm run dev",
      acceptedKeywords: ["npm", "run", "dev"],
      correctFeedback: "The dev server starts with hot reload — changes appear instantly.",
      wrongFeedback: "Run: npm run dev to start the development server.",
    },
    {
      type: "mc",
      question: "A file named page.tsx inside app/dashboard/ creates:",
      options: [
        "A React component library",
        "A route at /dashboard",
        "An API endpoint",
        "A database table",
      ],
      correct: 1,
    },
  ],

  // ── M22: Supabase — Your AI Backend ──
  "supabase-your-ai-backend": [
    {
      type: "mc",
      question: "Supabase provides all of the following EXCEPT:",
      options: [
        "PostgreSQL database",
        "Authentication",
        "Frontend framework",
        "Real-time subscriptions",
      ],
      correct: 2,
    },
    {
      type: "terminal",
      scenario: "Initialize Supabase in your local project.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "supabase init",
      acceptedKeywords: ["supabase", "init"],
      correctFeedback: "supabase init creates the supabase/ directory with config and migration files.",
      wrongFeedback: "Run: supabase init to set up Supabase locally.",
    },
    {
      type: "mc",
      question: "Supabase migrations are written in:",
      options: [
        "JavaScript",
        "SQL",
        "YAML",
        "Python",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Create a new database migration for adding a user profiles table.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "supabase migration new add_profiles_table",
      acceptedKeywords: ["supabase", "migration", "new"],
      correctFeedback: "This creates a new .sql file in supabase/migrations/ ready for your DDL.",
      wrongFeedback: "Use: supabase migration new <name> to create a migration file.",
    },
    {
      type: "mc",
      question: "RLS policies in Supabase determine:",
      options: [
        "How fast queries run",
        "Which rows a user can read, insert, update, or delete",
        "The database schema",
        "How data is backed up",
      ],
      correct: 1,
    },
  ],

  // ── M23: Deploying with Vercel ──
  "deploying-with-vercel": [
    {
      type: "mc",
      question: "Vercel's primary use case is:",
      options: [
        "Database hosting",
        "Deploying and hosting frontend/full-stack web applications",
        "Email delivery",
        "File storage",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Deploy your project to Vercel from the command line.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "vercel --prod",
      acceptedKeywords: ["vercel", "prod"],
      correctFeedback: "vercel --prod deploys directly to your production URL.",
      wrongFeedback: "Use: vercel --prod to deploy to production.",
    },
    {
      type: "mc",
      question: "Vercel creates a preview deployment when you:",
      options: [
        "Run npm build locally",
        "Push to a branch or open a pull request",
        "Edit a file in VS Code",
        "Run vercel dev",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Set an environment variable in your Vercel project for your API key.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "vercel env add ANTHROPIC_API_KEY production",
      acceptedKeywords: ["vercel", "env", "add"],
      correctFeedback: "Environment variables in Vercel keep secrets out of your code.",
      wrongFeedback: "Use: vercel env add <name> <environment> to set secrets.",
    },
    {
      type: "mc",
      question: "Vercel serverless functions are stored in:",
      options: [
        "The public/ directory",
        "The app/api/ directory (App Router) or pages/api/ (Pages Router)",
        "The node_modules/ directory",
        "The .vercel/ directory",
      ],
      correct: 1,
    },
  ],

  // ── M24: Tailwind CSS & UI Design Systems ──
  "tailwind-css-ui-design-systems": [
    {
      type: "mc",
      question: "Tailwind CSS is a:",
      options: [
        "JavaScript framework",
        "Utility-first CSS framework",
        "Database ORM",
        "Testing library",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Install shadcn/ui's button component into your project.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "npx shadcn@latest add button",
      acceptedKeywords: ["shadcn", "add", "button"],
      correctFeedback: "shadcn/ui copies component source into your project — you own the code.",
      wrongFeedback: "Use: npx shadcn@latest add button",
    },
    {
      type: "mc",
      question: "The class 'flex items-center gap-4' creates:",
      options: [
        "A grid layout",
        "A flexbox row with centered items and 1rem gaps",
        "A fixed position element",
        "An animated container",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Add a dark mode class to your Tailwind config.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude \"Update tailwind.config.ts to use class-based dark mode with darkMode: 'class'\"",
      acceptedKeywords: ["dark", "mode", "class"],
      correctFeedback: "Class-based dark mode lets you toggle themes with a CSS class on <html>.",
      wrongFeedback: "Set darkMode: 'class' in your Tailwind config.",
    },
    {
      type: "mc",
      question: "shadcn/ui differs from traditional component libraries because:",
      options: [
        "It's faster",
        "You copy the source code into your project and customize it directly",
        "It only works with Vue",
        "It doesn't use CSS",
      ],
      correct: 1,
    },
  ],

  // ── M25: TypeScript for AI Orchestrators ──
  "typescript-for-ai-orchestrators": [
    {
      type: "mc",
      question: "TypeScript adds to JavaScript:",
      options: [
        "A new runtime",
        "Static type checking at compile time",
        "A different syntax entirely",
        "Database support",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Check your project for TypeScript errors without producing output files.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "npx tsc --noEmit",
      acceptedKeywords: ["tsc", "noemit"],
      correctFeedback: "Type checking catches bugs before runtime — essential for AI-generated code.",
      wrongFeedback: "Use: npx tsc --noEmit for type checking only.",
    },
    {
      type: "mc",
      question: "Why is TypeScript valuable when working with AI agents?",
      options: [
        "AI can only write TypeScript",
        "Type errors catch AI hallucinations before they reach production",
        "It makes the AI faster",
        "It's required by Claude Code",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Define a TypeScript interface for an API response from Claude.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "claude \"Create a TypeScript interface in src/lib/types.ts for a Claude API message response with id: string, content: array of text blocks, model: string, and usage: { input_tokens: number, output_tokens: number }\"",
      acceptedKeywords: ["interface", "types"],
      correctFeedback: "Typed API responses prevent runtime errors when the response shape changes.",
      wrongFeedback: "Define interfaces for your API responses to catch shape mismatches early.",
    },
    {
      type: "mc",
      question: "The 'as' keyword in TypeScript is used for:",
      options: [
        "Creating aliases",
        "Type assertions — telling the compiler you know the type",
        "Importing modules",
        "Defining variables",
      ],
      correct: 1,
    },
  ],

  // ── M26: Git & Version Control ──
  "git-version-control": [
    {
      type: "mc",
      question: "Why is git essential for AI orchestration?",
      options: [
        "AI can't work without git",
        "You can revert AI changes that don't work and track what the agent modified",
        "Git makes the AI write better code",
        "It's only needed for team projects",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Create a new branch for a feature the AI agent will build.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "git checkout -b feat/add-user-dashboard",
      acceptedKeywords: ["git", "checkout", "-b"],
      correctFeedback: "Feature branches keep AI-generated changes isolated until reviewed.",
      wrongFeedback: "Use: git checkout -b <branch-name> to create a feature branch.",
    },
    {
      type: "mc",
      question: "Before asking an AI agent to make changes, you should:",
      options: [
        "Delete the .git directory",
        "Commit or stash your current work so you can revert if needed",
        "Turn off your computer",
        "Close all other applications",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "View the diff of what the AI agent just changed before committing.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "git diff",
      acceptedKeywords: ["git", "diff"],
      correctFeedback: "Always review the diff — never blindly commit AI-generated changes.",
      wrongFeedback: "Run: git diff to see exactly what changed.",
    },
    {
      type: "mc",
      question: "A .gitignore file is important because:",
      options: [
        "It speeds up git",
        "It prevents secrets, node_modules, and build artifacts from being committed",
        "Git won't work without it",
        "It stores your commit history",
      ],
      correct: 1,
    },
  ],

  // ── M27: Payments & Monetization with Stripe ──
  "payments-monetization-stripe": [
    {
      type: "mc",
      question: "Stripe Checkout is:",
      options: [
        "A database",
        "A pre-built, hosted payment page that handles card collection securely",
        "A CSS framework",
        "A testing tool",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Install the Stripe SDK for your Node.js project.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "npm install stripe",
      acceptedKeywords: ["npm", "install", "stripe"],
      correctFeedback: "The stripe package gives you server-side access to the Stripe API.",
      wrongFeedback: "Use: npm install stripe",
    },
    {
      type: "mc",
      question: "Stripe webhooks are used to:",
      options: [
        "Send marketing emails",
        "Notify your app about payment events (successful charges, subscription changes)",
        "Store customer data",
        "Generate invoices in PDF format",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Listen for Stripe webhooks locally during development.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "stripe listen --forward-to localhost:3001/api/stripe/webhook",
      acceptedKeywords: ["stripe", "listen", "forward"],
      correctFeedback: "stripe listen tunnels webhook events to your local dev server for testing.",
      wrongFeedback: "Use: stripe listen --forward-to localhost:3001/api/stripe/webhook",
    },
    {
      type: "mc",
      question: "For recurring payments, you use Stripe:",
      options: [
        "Charges",
        "Subscriptions",
        "Transfers",
        "Payouts",
      ],
      correct: 1,
    },
  ],

  // ── M28: Building Full-Stack AI Applications ──
  "building-full-stack-ai-applications": [
    {
      type: "mc",
      question: "A full-stack AI application typically includes:",
      options: [
        "Only a frontend",
        "Frontend, backend API, database, and AI integration",
        "Only a database",
        "Only an AI model",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Create an API route in Next.js that calls Claude to generate a response.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "mkdir -p src/app/api/chat && touch src/app/api/chat/route.ts",
      acceptedKeywords: ["api", "chat", "route"],
      correctFeedback: "API routes in app/api/ keep your AI calls server-side where secrets are safe.",
      wrongFeedback: "Create: src/app/api/chat/route.ts for your AI endpoint.",
    },
    {
      type: "mc",
      question: "Why should AI API calls happen on the server, not the client?",
      options: [
        "They're faster on the server",
        "API keys would be exposed in browser JavaScript",
        "Browsers can't make HTTP requests",
        "AI models only accept server requests",
      ],
      correct: 1,
    },
    {
      type: "terminal",
      scenario: "Run the full application stack locally — database, backend, and frontend.",
      prompt: "$ ",
      hint: "Press Tab to start with a template",
      tabFill: "supabase start && npm run dev",
      acceptedKeywords: ["supabase", "start", "npm", "dev"],
      correctFeedback: "Local Supabase + Next.js dev server gives you the full stack for development.",
      wrongFeedback: "Run: supabase start && npm run dev to launch everything locally.",
    },
    {
      type: "mc",
      question: "The orchestrator's role in a full-stack project is to:",
      options: [
        "Write every line of code",
        "Define specs, direct agents to build each layer, and verify the integration",
        "Only design the UI",
        "Only manage the database",
      ],
      correct: 1,
    },
  ],
};

export function HybridQuiz({ quiz, moduleTitle, courseSlug, moduleSlug }: HybridQuizProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "active" | "feedback" | "results">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedMC, setSelectedMC] = useState<number | null>(null);
  const [terminalInput, setTerminalInput] = useState("");
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const terminalRef = useRef<HTMLTextAreaElement>(null);
  const [cursorVisible, setCursorVisible] = useState(true);

  // P3 fix: use moduleSlug directly instead of fragile title matching
  const questions = HYBRID_QUESTIONS[moduleSlug] ?? HYBRID_QUESTIONS["understanding-apis"];
  const currentQ = questions[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === "active" && currentQ?.type === "terminal" && terminalRef.current) {
      terminalRef.current.focus();
    }
  }, [phase, currentIndex, currentQ?.type]);

  // P1 fix: score locally, only call API for XP/achievements
  const submitQuiz = useCallback(async (finalScore: number) => {
    if (submitting) return; // P2 fix: prevent double submission
    setSubmitting(true);
    setPhase("results");

    const total = questions.length;
    const passed = finalScore >= Math.ceil(total * 2 / 3);

    try {
      const res = await fetch("/api/gamification/quiz-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_quiz_id: quiz.id,
          // Map our score to the DB quiz format — send correct answers for passed questions
          answers: quiz.questions.map((q, i) => (i < finalScore ? q.correct : -1)),
        }),
      });

      if (res.ok) {
        const data: QuizResult = await res.json();
        setResult({ ...data, score: finalScore, total });
        if (data.passed) setShowConfetti(true);
        if (data.achievements.length > 0) setUnlockedAchievements(data.achievements);
      } else {
        setResult({ score: finalScore, total, passed, xpEarned: 0, newLevel: 0, achievements: [] });
        if (passed) setShowConfetti(true);
      }
    } catch {
      setResult({ score: finalScore, total, passed, xpEarned: 0, newLevel: 0, achievements: [] });
      if (passed) setShowConfetti(true);
    } finally {
      setSubmitting(false);
    }
  }, [submitting, questions.length, quiz.id, quiz.questions]);

  // P2 fix: proper dependency array for auto-advance
  const advanceOrSubmit = useCallback((newCorrectCount: number) => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedMC(null);
      setTerminalInput("");
      setPhase("active");
    } else {
      submitQuiz(newCorrectCount);
    }
  }, [currentIndex, questions.length, submitQuiz]);

  // Auto-advance after feedback
  useEffect(() => {
    if (phase !== "feedback") return;
    const timer = setTimeout(() => {
      advanceOrSubmit(correctCount);
    }, 2000);
    return () => clearTimeout(timer);
  }, [phase, advanceOrSubmit, correctCount]);

  function handleMCSelect(optionIndex: number) {
    if (phase !== "active" || currentQ.type !== "mc" || submitting) return;
    setSelectedMC(optionIndex);
    const isCorrect = optionIndex === currentQ.correct;
    const newCount = isCorrect ? correctCount + 1 : correctCount;
    setCorrectCount(newCount);
    setFeedbackCorrect(isCorrect);
    setFeedbackText(isCorrect ? "Correct!" : `Not quite — the answer is ${currentQ.options[currentQ.correct]}`);
    setPhase("feedback");
  }

  function handleTerminalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phase !== "active" || currentQ.type !== "terminal" || !terminalInput.trim() || submitting) return;

    // P2 fix: case-insensitive keyword matching
    const normalized = terminalInput.toLowerCase();
    const isCorrect = currentQ.acceptedKeywords.every((kw) =>
      normalized.includes(kw.toLowerCase())
    );
    const newCount = isCorrect ? correctCount + 1 : correctCount;
    setCorrectCount(newCount);
    setFeedbackCorrect(isCorrect);
    setFeedbackText(isCorrect ? currentQ.correctFeedback : currentQ.wrongFeedback);
    setPhase("feedback");
  }

  function handleRestart() {
    setCurrentIndex(0);
    setCorrectCount(0);
    setSelectedMC(null);
    setTerminalInput("");
    setResult(null);
    setSubmitting(false);
    setPhase("intro");
  }

  // ── Intro ──
  if (phase === "intro") {
    return (
      <Card className="mx-auto max-w-3xl overflow-hidden">
        <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-accent/10">
            <span className="text-2xl">⌨</span>
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold">Module Quiz: {moduleTitle}</h3>
            <p className="mt-2 text-muted-foreground">
              {questions.length} questions — multiple choice and hands-on terminal commands
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-accent/10 px-4 py-2 text-sm font-medium text-emerald-accent">
            <Sparkles className="size-4" />
            Earn up to {quiz.xp_reward} XP
          </div>
          <button
            onClick={() => setPhase("active")}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Start Quiz
            <ArrowRight className="size-4" />
          </button>
        </CardContent>
      </Card>
    );
  }

  // ── Results ──
  if (phase === "results" && result) {
    const passed = result.passed;
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
        <Card className="mx-auto max-w-3xl overflow-hidden">
          <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
            <span className="text-6xl">{passed ? "🚀" : "💪"}</span>
            <div>
              <h3 className="font-heading text-2xl font-bold">
                {passed ? "Quiz Passed!" : "Keep Going!"}
              </h3>
              <p className="mt-1 text-muted-foreground">
                {passed ? "Well done — you nailed it." : "Review the lessons and try again."}
              </p>
            </div>
            <div className="text-4xl font-bold">
              {result.score} / {result.total}
            </div>
            {result.xpEarned > 0 && (
              <div className="text-lg font-bold text-emerald-accent">
                +{result.xpEarned} XP earned!
              </div>
            )}
            <div className="flex w-full max-w-xs flex-col gap-3">
              {passed ? (
                <button
                  onClick={() => router.push(`/courses/${courseSlug}`)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </button>
              ) : (
                <button
                  onClick={handleRestart}
                  className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
                >
                  Retake Quiz
                </button>
              )}
              <button
                onClick={() => router.push(`/courses/${courseSlug}`)}
                className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-muted-foreground"
              >
                Back to Course
              </button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  // ── Progress dots ──
  const progressDots = (
    <div className="mb-6 flex items-center justify-center gap-2">
      {questions.map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === currentIndex
              ? "w-8 bg-emerald-accent"
              : i < currentIndex
                ? "w-2 bg-emerald-accent/50"
                : "w-2 bg-muted"
          }`}
        />
      ))}
    </div>
  );

  // ── Multiple Choice Question ──
  if (currentQ.type === "mc") {
    return (
      <Card className="mx-auto max-w-3xl overflow-hidden">
        <CardContent className="py-10">
          {progressDots}
          <p className="mb-2 text-center text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <h3 className="mb-6 text-center font-heading text-lg font-semibold">
            {currentQ.question}
          </h3>
          <div className="space-y-3">
            {currentQ.options.map((option, i) => {
              let classes = "w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all duration-200";
              if (phase === "feedback") {
                if (i === currentQ.correct) {
                  classes += " border-emerald-accent bg-emerald-accent/10 text-emerald-accent";
                } else if (i === selectedMC && i !== currentQ.correct) {
                  classes += " border-destructive bg-destructive/10 text-destructive";
                } else {
                  classes += " border-border bg-background opacity-50";
                }
              } else {
                classes += " border-border bg-background hover:border-emerald-accent hover:bg-emerald-accent/5 cursor-pointer";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleMCSelect(i)}
                  disabled={phase === "feedback" || submitting}
                  className={classes}
                >
                  <span className="mr-3 inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
          {phase === "feedback" && (
            <p className={`mt-4 text-center text-sm font-medium ${feedbackCorrect ? "text-emerald-accent" : "text-destructive"}`}>
              {feedbackText}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // ── Terminal Question ──
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">{progressDots}</div>
      <p className="mb-6 text-center text-base text-muted-foreground">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="flex items-center gap-2 bg-neutral-800 px-5 py-3">
          <div className="flex gap-1.5">
            <div className="size-3.5 rounded-full bg-red-500/80" />
            <div className="size-3.5 rounded-full bg-amber-500/80" />
            <div className="size-3.5 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 text-sm font-medium text-neutral-400">terminal</span>
        </div>

        <div className="bg-neutral-950 px-6 py-6 font-mono text-base leading-relaxed">
          <div className="mb-6 text-base text-neutral-400">{currentQ.scenario}</div>

          {phase === "active" ? (
            <form onSubmit={handleTerminalSubmit}>
              <div className="flex items-start gap-0">
                <span className="text-emerald-400 font-bold mr-2 text-lg">$</span>
                <textarea
                  ref={terminalRef}
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Tab" && !terminalInput.trim()) {
                      e.preventDefault();
                      setTerminalInput(currentQ.tabFill);
                    }
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleTerminalSubmit(e);
                    }
                  }}
                  placeholder="type your command..."
                  className="flex-1 min-h-[120px] resize-none bg-transparent text-white outline-none caret-emerald-400 font-mono text-base placeholder:text-neutral-700"
                  spellCheck={false}
                  autoComplete="off"
                  disabled={submitting}
                />
              </div>
              <div className="mt-3 text-sm text-neutral-600">{currentQ.hint}</div>
            </form>
          ) : (
            <>
              <div className="flex items-start gap-0 mb-3">
                <span className="text-emerald-400 font-bold mr-2 text-lg">$</span>
                <span className="text-emerald-400 whitespace-pre-wrap text-base">{terminalInput}</span>
              </div>
              <div className={`text-base ${feedbackCorrect ? "text-emerald-400" : "text-red-400"}`}>
                {feedbackCorrect ? "✓" : "✗"} {feedbackText}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between bg-neutral-900 px-5 py-2 text-sm text-neutral-500">
          <span>{phase === "active" ? "Press Enter to submit · Tab for template" : ""}</span>
          <span>{currentIndex + 1}/{questions.length}</span>
        </div>
      </div>
    </div>
  );
}
