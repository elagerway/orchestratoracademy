#!/usr/bin/env python3
"""Seed Claude Code Superpowers course — lessons and quizzes."""

import json
import urllib.request
from pathlib import Path

env = {}
for line in Path(".env.local").read_text().splitlines():
    line = line.strip()
    if not line or line.startswith("#"):
        continue
    eq = line.index("=")
    env[line[:eq]] = line[eq + 1:]

SRK = env["SUPABASE_SERVICE_ROLE_KEY"]
URL = env["NEXT_PUBLIC_SUPABASE_URL"]

COURSE_ID = "11110000-0000-0000-0000-000000000001"

def post(table, data):
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        f"{URL}/rest/v1/{table}",
        data=body,
        headers={
            "apikey": SRK,
            "Authorization": f"Bearer {SRK}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
    )
    try:
        return urllib.request.urlopen(req).status
    except urllib.error.HTTPError as e:
        msg = e.read().decode()[:200]
        print(f"  ERROR {e.code}: {msg}")
        return e.code

# Module IDs
M = {i: f"11110{i:03d}-0000-0000-0000-000000000001" for i in range(1, 9)}

# ============================================================
# LESSONS (no duration_minutes column)
# ============================================================
LESSONS = [
    # Module 1
    {"id": "11111001-0000-0000-0000-000000000001", "module_id": M[1], "title": "Why Claude Code Alone Isn't Enough", "slug": "why-claude-code-alone-isnt-enough", "order": 1, "content_type": "text",
     "content": """# Why Claude Code Alone Isn't Enough

Claude Code is the most capable AI coding agent available today. It can read your codebase, write code, run tests, commit, and even push to production. So why would you need anything else?

Because **capability without structure is chaos.**

## The Four Problems

Out of the box, Claude Code has four critical gaps:

### 1. Stale Knowledge
Claude's training data has a cutoff. When you ask it to use the latest Next.js 16 API, it might generate code for Next.js 14. You need **Context7** — real-time documentation injection.

### 2. No Eyes
Claude Code can write frontend code all day, but it can't see what it looks like in the browser. It can't check if a button is misaligned or if a network request failed. You need **Chrome DevTools MCP** — browser automation and debugging.

### 3. No Structure
Without a specification, Claude Code is guessing what you want. You need **OpenSpec** — a spec-first workflow that aligns human and AI before any code is written.

### 4. No Discipline
Claude Code will happily skip tests, write code before understanding the problem, and declare success without verification. You need **Superpowers** — a structured workflow plugin that enforces brainstorming, planning, TDD, code review, and proper finishing.

## The Superpower Stack

| Tool | Superpower | Problem Solved |
|------|-----------|---------------|
| Context7 | Real-time docs | Stale knowledge / hallucinated APIs |
| Chrome DevTools MCP | Browser control | Can't see the UI / no debugging |
| OpenSpec | Spec-first workflow | Building the wrong thing |
| Superpowers | Structured discipline | Skipping steps / no TDD |

These four tools transform Claude Code from a chatbot that writes code into an **autonomous engineering system** that follows a professional software development process.

## What You'll Build

By the end of this course, you'll take a project from a one-sentence idea to a deployed, tested, documented application using all four tools working together."""},

    {"id": "11111002-0000-0000-0000-000000000001", "module_id": M[1], "title": "Installing Your Superpowers", "slug": "installing-your-superpowers", "order": 2, "content_type": "text",
     "content": """# Installing Your Superpowers

Let's get all four tools installed and verified in under 10 minutes.

## 1. Context7

```bash
npx ctx7 setup --claude
```

This runs OAuth authentication, generates an API key, and installs the MCP server. Verify:

```
> How do I create a middleware in Next.js 16? use context7
```

**Optional: Auto-trigger in CLAUDE.md**

```markdown
Always use Context7 to fetch current documentation when working with libraries, frameworks, or APIs.
```

## 2. Chrome DevTools MCP

```bash
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest
```

Verify:

```
> Navigate to https://example.com and take a screenshot
```

## 3. OpenSpec

```bash
npm install -g @fission-ai/openspec
cd your-project
openspec init
```

Verify:

```
> /opsx:propose Add a dark mode toggle to the settings page
```

## 4. Superpowers

```bash
claude plugin install superpowers
```

Verify:

```
> Let's brainstorm a new feature for user authentication
```

Superpowers should activate automatically, asking clarifying questions — not jumping straight to code.

## The Stack is Live

You now have:
- **Context7** → up-to-date docs for any library
- **Chrome DevTools MCP** → browser eyes and hands
- **OpenSpec** → spec-first artifact workflow
- **Superpowers** → structured development discipline"""},

    # Module 2
    {"id": "11111003-0000-0000-0000-000000000001", "module_id": M[2], "title": "Setup & Your First Documentation Query", "slug": "context7-setup-first-query", "order": 1, "content_type": "text",
     "content": """# Context7: Setup & Your First Documentation Query

Context7 solves the single biggest frustration in AI-assisted development: **hallucinated APIs**.

## How It Works

1. **Resolves** the library name to a Context7 ID
2. **Fetches** the relevant documentation pages
3. **Injects** the content into your agent's context

## Two Modes of Operation

### Mode 1: Explicit Trigger
```
Create a Supabase Edge Function that validates a JWT. use context7
```

### Mode 2: Auto-Trigger (Recommended)
Add to your `CLAUDE.md`:
```markdown
Use Context7 to fetch current documentation whenever working with libraries, frameworks, SDKs, APIs, CLI tools, or cloud services.
```

## Specifying Libraries

For ambiguous library names, use the slash syntax:

```
Show me how to use /supabase/supabase-js to create a real-time subscription. use context7
```

## What Context7 Covers

Frameworks (Next.js, React, Vue, Svelte), Databases (Supabase, Prisma, Drizzle), AI (Anthropic SDK, OpenAI, LangChain), Infrastructure (Vercel, AWS, Docker), and thousands more."""},

    {"id": "11111004-0000-0000-0000-000000000001", "module_id": M[2], "title": "Advanced Context7 — Custom Libraries & Auto-Rules", "slug": "context7-advanced", "order": 2, "content_type": "text",
     "content": """# Advanced Context7 — Custom Libraries & Auto-Rules

## CLAUDE.md Auto-Rules

The most powerful Context7 pattern is setting up rules that trigger automatically:

```markdown
# Documentation Rules
Use Context7 to fetch current documentation whenever:
- Working with any library, framework, SDK, or API
- Debugging errors related to third-party packages
- Writing configuration files
- Using CLI tools
Prefer Context7 over web search for library docs.
```

## Combining Context7 with Other Superpowers

### Context7 + OpenSpec
When writing a spec, Context7 ensures references to real APIs:
```
/opsx:propose Add Stripe subscription management. use context7
```

### Context7 + Superpowers
During planning, Context7 grounds every step in reality.

### Context7 + Chrome DevTools MCP
When debugging frontend issues, Context7 provides correct framework docs while Chrome DevTools shows actual browser state."""},

    # Module 3
    {"id": "11111005-0000-0000-0000-000000000001", "module_id": M[3], "title": "Setup & Browser Automation Basics", "slug": "chrome-devtools-setup-basics", "order": 1, "content_type": "text",
     "content": """# Chrome DevTools MCP: Setup & Browser Automation Basics

Claude Code has been writing frontend code blind. Chrome DevTools MCP gives Claude eyes and hands in the browser.

## Installation

```bash
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest
```

## The 29 Tools

### Input Tools
`click`, `fill`, `type`, `press_key`, `hover`, `drag`, `upload_file`

### Navigation Tools
`navigate`, `wait_for`, `list_pages`, `select_page`, `close_page`

### Debugging Tools
`screenshot`, `evaluate`, `console_messages`, `dom_snapshot`, `network_requests`, `get_request`

### Performance Tools
`start_trace`, `stop_trace`, `lighthouse_audit`, `memory_snapshot`

## Practical Example: Testing a Form

```
Navigate to http://localhost:3001/auth/signup, fill in the form
with test data, submit it, and tell me if the signup succeeded.
```

Claude navigates, fills, clicks, waits, screenshots — all autonomously.

## The Feedback Loop

```
The hero section looks wrong on mobile. Check it at 375px width and fix any issues.
```

Claude sets viewport, screenshots, identifies issues, fixes CSS, refreshes, verifies."""},

    {"id": "11111006-0000-0000-0000-000000000001", "module_id": M[3], "title": "Debugging, Performance Traces & Lighthouse Audits", "slug": "chrome-devtools-debugging-performance", "order": 2, "content_type": "text",
     "content": """# Debugging, Performance Traces & Lighthouse Audits

## Network Request Inspection

```
Navigate to the dashboard. Check if any API requests are failing.
```

Claude lists all network requests, filters for failures, inspects response bodies, reports exact errors.

## Console Error Capture

Claude captures console messages with source-mapped stack traces — exactly where errors originate.

## Performance Traces

```
Record a performance trace while navigating from homepage to dashboard.
```

Claude records, analyzes the timeline, reports slowest operations with recommendations.

## Lighthouse Audits

```
Run a Lighthouse audit on the homepage.
```

Returns Performance, Accessibility, Best Practices, SEO scores with specific recommendations.

## Configuration Tips

### Use `--isolated` for clean testing
```bash
claude mcp add chrome-devtools --scope user -- npx chrome-devtools-mcp@latest --isolated
```

### Connect to your running browser
```bash
chrome-devtools-mcp@latest --browserUrl http://localhost:9222
```"""},

    # Module 4
    {"id": "11111007-0000-0000-0000-000000000001", "module_id": M[4], "title": "Propose, Design, and Plan Before You Build", "slug": "openspec-propose-design-plan", "order": 1, "content_type": "text",
     "content": """# OpenSpec: Propose, Design, and Plan Before You Build

The biggest source of wasted time isn't bad code — it's building the wrong thing.

## OpenSpec's Artifact Workflow

Every feature gets four artifacts:

### 1. Proposal (`proposal.md`) — The **why**
### 2. Specs (`specs/`) — The **what**
### 3. Design (`design.md`) — The **how**
### 4. Tasks (`tasks.md`) — The **steps**

## Your First Spec

```
/opsx:propose Add dark mode support with system preference detection and manual toggle
```

Claude creates `changes/dark-mode/` with all four artifacts. You review the spec before any code is written — 5 minutes of review saves hours of rework.

## Philosophy: Fluid Over Rigid

OpenSpec is not waterfall. Update any artifact at any time. The spec is a living document, not a contract."""},

    {"id": "11111008-0000-0000-0000-000000000001", "module_id": M[4], "title": "Apply, Verify, and Archive — The Full Cycle", "slug": "openspec-apply-verify-archive", "order": 2, "content_type": "text",
     "content": """# Apply, Verify, and Archive — The Full Cycle

## Apply: `/opsx:apply`
Claude reads `tasks.md` and implements each task in order using the design decisions already made.

## Verify: `/opsx:verify`
Claude checks each spec requirement against the implementation and reports pass/fail.

## Archive: `/opsx:archive`
Moves completed change to `.archive/`. Workspace stays clean, history preserved.

## Extended Commands

| Command | What It Does |
|---------|-------------|
| `/opsx:continue` | Resume paused work |
| `/opsx:ff` | Fast-forward past manually completed tasks |
| `/opsx:sync` | Update spec to match actual implementation |
| `/opsx:onboard` | Generate project overview for new codebases |
| `/opsx:bulk-archive` | Archive all completed changes |

## When to Use OpenSpec

| Situation | Use OpenSpec? |
|-----------|------|
| New feature with multiple requirements | Yes |
| Bug fix with clear steps | No |
| Refactor with defined scope | Yes |
| Quick one-line change | No |

The rule: **if you'd regret not having a spec halfway through, write the spec.**"""},

    # Module 5
    {"id": "11111009-0000-0000-0000-000000000001", "module_id": M[5], "title": "Brainstorming & Planning with Discipline", "slug": "superpowers-brainstorm-plan", "order": 1, "content_type": "text",
     "content": """# Superpowers: Brainstorming & Planning with Discipline

The Superpowers plugin prevents Claude from jumping straight to code.

## The 7-Stage Workflow

```
1. Brainstorm  →  Explore the problem space
2. Worktree    →  Create an isolated workspace
3. Plan        →  Break work into small, verified tasks
4. Build       →  Implement with TDD (subagent-driven)
5. Review      →  Check work against the plan
6. Test        →  Verify everything passes
7. Finish      →  Merge, PR, or discard
```

## Stage 1: Brainstorming

Superpowers forces Claude to ask clarifying questions, explore alternatives, produce a design document, present it in chunks, and wait for approval.

## Stage 2: Git Worktrees

Creates an isolated workspace: `git worktree add .worktrees/<name> -b feat/<name>`

## Stage 3: Planning

Tasks are: **Small** (2-5 min), **Complete** (exact file paths, full code), **Verified** (each has a verification step), **Ordered** (dependencies respected).

Principles: YAGNI, DRY, Simplicity, Evidence over claims."""},

    {"id": "11111010-0000-0000-0000-000000000001", "module_id": M[5], "title": "Git Worktrees, Code Review & Finishing", "slug": "superpowers-worktrees-review-finish", "order": 2, "content_type": "text",
     "content": """# Git Worktrees, Code Review & Finishing

## Code Review Between Tasks

Two-stage review after each task:
1. **Spec Compliance** — Does it match the plan?
2. **Code Quality** — Bugs, edge cases, maintainability?

Critical issues block progress.

## The Finishing Stage

1. Verify all tests pass
2. Present options: Merge, PR, Keep, Discard
3. Clean up worktree

## Systematic Debugging

4-phase process: Reproduce → Isolate → Fix → Verify. No guessing.

## Writing New Skills

Superpowers includes a meta-skill for creating custom skills:

```
> Create a new skill for database migration reviews
```"""},

    # Module 6
    {"id": "11111011-0000-0000-0000-000000000001", "module_id": M[6], "title": "Test-Driven Development with AI Agents", "slug": "tdd-with-ai-agents", "order": 1, "content_type": "text",
     "content": """# Test-Driven Development with AI Agents

Superpowers enforces strict TDD — and it's not optional.

## The TDD Mandate

### RED: Write a Failing Test
### GREEN: Make It Pass (minimum code)
### REFACTOR: Clean Up (tests still pass)

## The Nuclear Rule

> **Code written before tests gets deleted.**

## Why TDD Matters More with AI

Without tests, Claude says "Done!" and you have no evidence it works. Tests are the proof.

## TDD in Practice

```
Task: Add email validation

1. RED — test: expect(validateEmail("not-an-email")).toBe(false)
   → Fails (function doesn't exist)
2. GREEN — write minimal validateEmail function
   → Passes
3. REFACTOR — add edge cases, types, extract constants
   → All tests still pass
4. COMMIT
```

Each cycle: 2-5 minutes. After 10 cycles: fully tested feature with proof."""},

    {"id": "11111012-0000-0000-0000-000000000001", "module_id": M[6], "title": "Parallel Agents & Multi-Hour Autonomous Sessions", "slug": "parallel-agents-autonomous", "order": 2, "content_type": "text",
     "content": """# Parallel Agents & Multi-Hour Autonomous Sessions

## Subagent-Driven Development

Each task is handled by a **fresh subagent** — no context drift from accumulated old context.

## How It Works

1. Plan produces tasks (2-5 min each)
2. For each task, spawn a fresh subagent with the task spec
3. Subagent implements with TDD
4. Two-stage review: spec compliance, then code quality
5. If review passes, commit and move on
6. If fails, fix and re-review

## Parallel Dispatch

Independent tasks run simultaneously — 2-3x faster builds.

## Multi-Hour Sessions

Start a build, walk away. Superpowers picks up tasks, spawns agents, implements with TDD, reviews, commits, repeats for hours.

## When to Go Autonomous

| Scenario | Autonomous? |
|----------|------|
| Well-planned feature | Yes |
| Exploratory work | No |
| Refactoring with tests | Yes |
| Security-critical code | No |
| UI work | Partially — use Chrome DevTools for verification |"""},

    # Module 7
    {"id": "11111013-0000-0000-0000-000000000001", "module_id": M[7], "title": "From Idea to Deployed App Using All Four Tools", "slug": "full-stack-project", "order": 1, "content_type": "text",
     "content": """# From Idea to Deployed App Using All Four Tools

## The Project: A Team Standup Bot

A web app where team members post daily standups and the app generates AI summaries for managers.

## Phase 1: Spec It (OpenSpec + Context7)
```
/opsx:propose Build a team standup web app with AI summaries. use context7
```

## Phase 2: Plan It (Superpowers)
Superpowers breaks the design into 9 tasks, each 2-5 minutes.

## Phase 3: Build It (Subagents + TDD)
Tasks 1-3 sequential, Tasks 4-5 parallel, Task 6 sequential, Tasks 7-8 parallel, Task 9 sequential. Context7 ensures every API call uses current docs.

## Phase 4: Verify It (Chrome DevTools MCP)
```
Navigate to localhost:3001, create a test account, post a standup,
check the manager dashboard. Screenshot each step.
```

## Phase 5: Ship It (Superpowers Finish)
All tests pass → merge → deploy.

## The Result
Every API call uses current docs (Context7). Every feature has tests (TDD). The UI is verified (Chrome DevTools). The spec is documented (OpenSpec)."""},

    {"id": "11111014-0000-0000-0000-000000000001", "module_id": M[7], "title": "Your Superpower Toolkit — What to Use When", "slug": "superpower-toolkit-reference", "order": 2, "content_type": "text",
     "content": """# Your Superpower Toolkit — What to Use When

## Quick Reference

| Situation | Tool |
|-----------|------|
| Using an unfamiliar library | Context7 |
| Frontend doesn't look right | Chrome DevTools MCP |
| Feature with multiple requirements | OpenSpec |
| Starting non-trivial work | Superpowers |
| Debugging an API error | Chrome DevTools MCP |
| Want autonomous builds | Superpowers + subagents |

## Combination Patterns

### The Gold Standard (All Four)
OpenSpec → Superpowers → Context7 + Chrome DevTools throughout

### The Quick Fix
Context7 for correct API → Fix → Chrome DevTools to verify

### The Autonomous Build
Superpowers plan → Subagent dispatch → Context7 for docs

## Your CLAUDE.md Template

```markdown
# Superpowers
- Always use Context7 for library documentation
- Use Chrome DevTools MCP to verify UI changes
- For features with 3+ requirements, use OpenSpec first
- Follow the Superpowers workflow for all non-trivial work
- TDD is mandatory — write the failing test first
```

The superpower isn't the AI — it's the system around the AI. Go build something."""},

    # Module 8 - Skills Reference
    {"id": "11111015-0000-0000-0000-000000000001", "module_id": M[8], "title": "Superpowers & OpenSpec — Complete Skills Reference", "slug": "skills-ref-superpowers-openspec", "order": 1, "content_type": "text",
     "content": """# Superpowers & OpenSpec — Complete Skills Reference

## Superpowers Plugin — Core Workflow Skills

| # | Skill | What It Does |
|---|-------|------|
| 1 | **Brainstorming** | Asks clarifying questions, explores alternatives, produces design document |
| 2 | **Git Worktree** | Creates isolated workspace on new branch |
| 3 | **Planning** | Breaks design into 2-5 min tasks with exact file paths |
| 4 | **Subagent-Driven Dev** | Spawns fresh agent per task with two-stage review |
| 5 | **TDD** | Enforces RED-GREEN-REFACTOR, deletes code written before tests |
| 6 | **Code Review** | Reviews between tasks, blocks on critical issues |
| 7 | **Finishing** | Merge/PR/Keep/Discard + worktree cleanup |

## Additional Superpowers Skills

| Skill | What It Does |
|-------|------|
| **Systematic Debugging** | 4-phase: Reproduce → Isolate → Fix → Verify |
| **Giving Code Reviews** | Structured review: security, logic, performance, tests, style |
| **Parallel Dispatch** | Multiple subagents for independent tasks |
| **Writing Skills** | Meta-skill for creating custom workflow skills |

## OpenSpec Slash Commands

| Command | What It Does |
|---------|------|
| `/opsx:propose <feature>` | Creates change folder with proposal, specs, design, tasks |
| `/opsx:apply` | Implements tasks from the spec |
| `/opsx:verify` | Checks implementation against spec requirements |
| `/opsx:archive` | Moves completed change to archive |
| `/opsx:continue` | Resumes paused work |
| `/opsx:ff` | Fast-forwards past manually completed tasks |
| `/opsx:sync` | Updates spec to match actual implementation |
| `/opsx:onboard` | Generates project overview for new codebases |
| `/opsx:bulk-archive` | Archives all completed changes |"""},

    {"id": "11111016-0000-0000-0000-000000000001", "module_id": M[8], "title": "Context7 & Chrome DevTools MCP — Complete Tools Reference", "slug": "skills-ref-context7-devtools", "order": 2, "content_type": "text",
     "content": """# Context7 & Chrome DevTools MCP — Complete Tools Reference

## Context7 Tools

| Tool | What It Does |
|------|------|
| `resolve-library-id` | Searches Context7 index, returns library ID |
| `query-docs` | Fetches current documentation for a library + query |

### CLI Commands
| Command | What It Does |
|---------|------|
| `npx ctx7 setup --claude` | One-time setup |
| `npx ctx7 library search <name>` | Search for a library |

## Chrome DevTools MCP — All 29 Tools

### Input (7): `click`, `fill`, `type`, `press_key`, `hover`, `drag`, `upload_file`
### Navigation (5): `navigate`, `wait_for`, `list_pages`, `select_page`, `close_page`
### Emulation (2): `emulate_device`, `resize`
### Debugging (6): `screenshot`, `evaluate`, `console_messages`, `dom_snapshot`, `network_requests`, `get_request`
### Performance (5): `start_trace`, `stop_trace`, `analyze_trace`, `memory_snapshot`, `lighthouse_audit`

### Configuration Flags
| Flag | What It Does |
|------|------|
| `--isolated` | Temporary browser profile, auto-cleaned |
| `--headless` | No visible browser window |
| `--browserUrl` | Attach to running Chrome |
| `--slim` | Only 3 core tools (navigate, screenshot, click) |

## Quick Lookup

| I want to… | Tool |
|------------|------|
| Check if page loads correctly | `navigate` + `screenshot` |
| See why an API call fails | `network_requests` + `get_request` |
| Find JavaScript errors | `console_messages` |
| Test a form end-to-end | `navigate` + `fill` + `click` + `screenshot` |
| Check mobile responsiveness | `emulate_device` + `screenshot` |
| Measure performance | `lighthouse_audit` |
| Get latest API docs | Context7: `resolve-library-id` + `query-docs` |"""},
]

# ============================================================
# QUIZZES (one row per module, questions as JSONB array)
# ============================================================
QUIZZES = [
    {"module_id": M[1], "questions": [
        {"id": "q1", "question": "What problem does Context7 solve?", "options": ["It makes Claude Code run faster", "It provides real-time, up-to-date library documentation to prevent hallucinated APIs", "It adds a graphical interface to Claude Code", "It provides code completion suggestions"], "correct": 1},
        {"id": "q2", "question": "Which tool gives Claude Code the ability to see and interact with a live browser?", "options": ["Context7", "OpenSpec", "Chrome DevTools MCP", "Superpowers"], "correct": 2},
        {"id": "q3", "question": "What is the main benefit of the Superpowers plugin?", "options": ["It adds more AI models", "It enforces a structured development workflow with brainstorming, planning, TDD, and code review", "It speeds up code generation", "It provides a dark mode"], "correct": 1},
    ]},
    {"module_id": M[2], "questions": [
        {"id": "q1", "question": "How do you trigger Context7 in a prompt?", "options": ["Type /context7", "Add 'use context7' to the end of your prompt", "Press Ctrl+7", "Run npx context7 start"], "correct": 1},
        {"id": "q2", "question": "What is the recommended way to make Context7 activate automatically?", "options": ["Install a browser extension", "Add a rule to your project's CLAUDE.md file", "Set an environment variable", "Configure it in package.json"], "correct": 1},
        {"id": "q3", "question": "What does Context7 do when you ask about a library?", "options": ["It searches Stack Overflow", "It resolves the library ID and fetches current documentation from the source", "It generates docs from code", "It opens the library's GitHub page"], "correct": 1},
    ]},
    {"module_id": M[3], "questions": [
        {"id": "q1", "question": "How many MCP tools does Chrome DevTools MCP expose?", "options": ["5", "12", "29", "50"], "correct": 2},
        {"id": "q2", "question": "What does the --isolated flag do?", "options": ["Runs Chrome in incognito mode", "Creates a temporary browser profile cleaned up after session", "Blocks all network requests", "Disables JavaScript"], "correct": 1},
        {"id": "q3", "question": "Which tool checks if API requests are failing?", "options": ["screenshot", "evaluate", "network_requests", "console_messages"], "correct": 2},
    ]},
    {"module_id": M[4], "questions": [
        {"id": "q1", "question": "What are the four artifacts OpenSpec creates for each change?", "options": ["README, CHANGELOG, LICENSE, CONTRIBUTING", "proposal.md, specs/, design.md, tasks.md", "requirements.txt, design.doc, test.py, deploy.sh", "idea.md, plan.md, code.md, review.md"], "correct": 1},
        {"id": "q2", "question": "What does /opsx:apply do?", "options": ["Creates a new proposal", "Implements the tasks defined in the spec", "Archives the current change", "Runs the test suite"], "correct": 1},
        {"id": "q3", "question": "When should you NOT use OpenSpec?", "options": ["Building a new feature with multiple requirements", "Doing a refactor with defined scope", "Fixing a simple one-line bug", "Building something you'll need to explain"], "correct": 2},
    ]},
    {"module_id": M[5], "questions": [
        {"id": "q1", "question": "What is the first stage of the Superpowers workflow?", "options": ["Planning", "Coding", "Brainstorming", "Testing"], "correct": 2},
        {"id": "q2", "question": "Why does Superpowers use git worktrees?", "options": ["To save disk space", "To create an isolated workspace so main is untouched", "To enable parallel git operations", "To track file changes efficiently"], "correct": 1},
        {"id": "q3", "question": "How big should individual tasks be in a Superpowers plan?", "options": ["30 min to 1 hour each", "2-5 minutes each", "1 full day each", "As large as possible"], "correct": 1},
    ]},
    {"module_id": M[6], "questions": [
        {"id": "q1", "question": "What happens to code written before tests in Superpowers TDD?", "options": ["It gets flagged for review", "It gets deleted", "It gets moved to a separate branch", "It gets committed with a warning"], "correct": 1},
        {"id": "q2", "question": "Why does Superpowers spawn a fresh subagent for each task?", "options": ["To save API costs", "To avoid context drift from accumulated context", "To use different models per task", "To run tasks in different languages"], "correct": 1},
        {"id": "q3", "question": "What are the two stages of review after each subagent task?", "options": ["Syntax and formatting", "Spec compliance and code quality", "Unit and integration tests", "Performance and security"], "correct": 1},
    ]},
    {"module_id": M[7], "questions": [
        {"id": "q1", "question": "In the full-stack workflow, what is the correct phase order?", "options": ["Build → Spec → Plan → Verify", "Plan → Build → Spec → Verify", "Spec → Plan → Build → Verify", "Verify → Spec → Build → Plan"], "correct": 2},
        {"id": "q2", "question": "When should you use all four superpowers together?", "options": ["Only for simple bug fixes", "For new features, greenfield projects, and anything important", "Only for backend code", "Only when working in a team"], "correct": 1},
        {"id": "q3", "question": "What is the key mindset shift for an AI orchestrator?", "options": ["Write more code faster", "Your job shifts from writing code to reviewing plans and approving results", "Use as many AI models as possible", "Avoid testing to save time"], "correct": 1},
    ]},
    {"module_id": M[8], "questions": [
        {"id": "q1", "question": "Which Superpowers skill spawns a fresh agent for each task?", "options": ["Brainstorming", "Planning", "Subagent-Driven Development", "Finishing"], "correct": 2},
        {"id": "q2", "question": "What OpenSpec command updates spec artifacts after implementation drift?", "options": ["/opsx:verify", "/opsx:sync", "/opsx:ff", "/opsx:archive"], "correct": 1},
        {"id": "q3", "question": "Which Chrome DevTools MCP flag creates a temporary browser profile?", "options": ["--headless", "--slim", "--isolated", "--proxy"], "correct": 2},
    ]},
]

# ---- SEED ----
print("Seeding lessons...")
for i, lesson in enumerate(LESSONS):
    status = post("lessons", lesson)
    print(f"  [{i+1}/{len(LESSONS)}] {lesson['slug']} → {status}")

print("\nSeeding quizzes...")
for i, quiz in enumerate(QUIZZES):
    data = {"module_id": quiz["module_id"], "questions": quiz["questions"], "xp_reward": 25}
    status = post("module_quizzes", data)
    print(f"  [M{i+1}] → {status}")

print("\nDone!")
