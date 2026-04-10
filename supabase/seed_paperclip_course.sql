-- Seed: Multi-Agent Systems with Paperclip (7 modules, 14 lessons, 7 quizzes)
-- Premium course ($29/mo) — Build AI agent organizations with Paperclip

-- ============================================================================
-- COURSE: Multi-Agent Systems with Paperclip
-- ============================================================================

-- Create the course
insert into public.courses (title, slug, description, is_free, price, "order") values
('Multi-Agent Systems with Paperclip', 'multi-agent-paperclip', 'Build and orchestrate autonomous AI agent teams with Paperclip — the open-source framework for zero-human companies. Learn to design org charts, assign goals, manage budgets, and deploy production agent organizations that coordinate through tickets and shared workspaces.', false, 29.00, 6);

-- ============================================================================
-- Module 1: Introduction to Paperclip
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'ffff0001-0000-0000-0000-000000000001',
  (select id from public.courses where slug = 'multi-agent-paperclip'),
  'Introduction to Paperclip',
  'introduction-to-paperclip',
  'Understand what Paperclip is, why it exists, and how it differs from other multi-agent frameworks.',
  1
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('ffff0001-0000-0000-0000-000000000001', 'What Is Paperclip?', 'what-is-paperclip', 'text',
'# What Is Paperclip?

Paperclip is an open-source framework for orchestrating teams of AI agents into structured organizations. It is a Node.js server with a React dashboard that lets you create companies staffed entirely by AI agents — each with defined roles, goals, budgets, and governance.

## The Problem Paperclip Solves

You have used single AI agents. You have probably built multi-agent crews with CrewAI or LangGraph. But there is a gap between a crew of agents completing a task and an organization of agents running a business function autonomously.

Single agents are like freelancers — great for one-off tasks. Multi-agent crews are like project teams — good for defined workflows. Paperclip is like an entire company — agents hire other agents, set their own goals, manage budgets, and coordinate through tickets and shared workspaces.

## How Paperclip Works

At its core, Paperclip wraps multiple Claude Code agents in a structured hierarchy. Each agent runs as an instance of Claude Code, which means it can take a goal, plan steps, and use tools to execute them. Paperclip adds the organizational layer on top:

- **Companies** — Every deployment starts with a company definition: a name and a mission statement. This mission propagates downward so every goal, project, and task traces back to it.
- **Agents** — Each agent brings its own prompts, models, and runtimes. Paperclip manages the organization they work in.
- **Goals** — Context flows from the task up through the project and company goals. Your agent always knows what to do and why.
- **Tickets** — You communicate with agents through tickets. Every instruction, response, tool call, and decision is recorded with full tracing.
- **Budgets** — Every agent gets a monthly budget. When they hit it, they stop automatically. No runaway costs.

## The Orchestrator''s Role

As the orchestrator, you are the architect of the organization. You do not write the code your agents produce. You do not manually coordinate their work. Instead, you:

1. **Define the company mission** — What is this agent organization trying to accomplish?
2. **Design the org chart** — Which agents exist, what are their roles, who reports to whom?
3. **Set goals and budgets** — What should each agent achieve, and how much can they spend?
4. **Monitor and adjust** — Review ticket trails, check outputs, reallocate resources.

This is orchestration at the organizational level — a step beyond task-level coordination.

## Quick Start

Getting Paperclip running locally is straightforward:

```bash
git clone https://github.com/paperclipai/paperclip.git
cd paperclip
npm install
npm run dev
```

This starts the API server at http://localhost:3100. An embedded PostgreSQL database is created automatically — no setup required. On first load, Paperclip shows an Onboarding Wizard that walks you through four steps: create a company, configure your first agent, set a company goal, and assign a task.

## What You Will Build in This Course

By the end of this course, you will have designed and deployed a production Paperclip organization with multiple agents coordinating autonomously. You will understand how to structure agent teams, manage their work through tickets, control costs with budgets, and monitor everything through the dashboard.', 1),

('ffff0001-0000-0000-0000-000000000001', 'Paperclip vs CrewAI vs LangGraph', 'paperclip-vs-crewai-langgraph', 'text',
'# Paperclip vs CrewAI vs LangGraph

If you have taken the CrewAI or LangGraph courses in this academy, you already understand multi-agent systems. Paperclip operates at a different level of abstraction. Understanding where each framework fits will help you choose the right tool for each project.

## CrewAI: Task-Level Coordination

CrewAI organizes agents around tasks. You define agents with roles and backstories, create tasks with descriptions and expected outputs, then assemble them into a crew that executes sequentially or hierarchically.

**Scope:** A crew completes a specific project — a research report, a content pipeline, a code review.
**Lifecycle:** Start crew, agents complete tasks, crew finishes. Done.
**Coordination:** Tasks are linked by context. Output from one task feeds into the next.

CrewAI is excellent when you know the exact workflow ahead of time and need agents to execute it reliably.

## LangGraph: Workflow-Level Coordination

LangGraph models workflows as directed graphs. Nodes are processing steps, edges are transitions, and state flows through the graph. It supports branching, looping, checkpoints, and human-in-the-loop patterns.

**Scope:** A graph processes a workflow — an approval chain, a document pipeline, a customer service flow.
**Lifecycle:** Input enters the graph, flows through nodes based on conditions, exits when complete.
**Coordination:** State machine with explicit transitions and conditional routing.

LangGraph excels at complex workflows with branching logic and long-running processes that need persistence.

## Paperclip: Organization-Level Coordination

Paperclip models entire organizations. Agents have roles in an org chart, communicate through tickets, work toward shared company goals, and operate on scheduled heartbeats.

**Scope:** An organization runs continuously — agents check for work, act, and go dormant until the next cycle.
**Lifecycle:** Agents wake on a schedule (every 5, 30, or 60 minutes), check their work queue, act if there is work, then sleep.
**Coordination:** Tickets, shared workspaces, hierarchical delegation. A CEO agent can hire and coordinate specialized sub-agents.

Paperclip excels at persistent, autonomous operations where agents need to operate like employees rather than function calls.

## Comparison Table

| Feature | CrewAI | LangGraph | Paperclip |
|---------|--------|-----------|-----------|
| **Unit of work** | Task | Graph node | Ticket |
| **Agent lifecycle** | Per-crew run | Per-graph execution | Persistent / scheduled |
| **Coordination** | Sequential or hierarchical tasks | State machine edges | Org chart + tickets |
| **Budget control** | None built-in | None built-in | Per-agent monthly budgets |
| **Execution engine** | Any LLM | Any LLM | Claude Code |
| **Best for** | Project-scoped workflows | Complex branching logic | Autonomous operations |
| **State persistence** | Per-run only | Checkpoint-based | Full database-backed |

## When to Choose Paperclip

Choose Paperclip when:
- You need agents running **autonomously on a schedule**, not just when triggered
- You want **organizational structure** — reporting lines, budgets, governance
- You need **full audit trails** — every tool call, every decision, traceable through tickets
- You are building something that operates **continuously**, not just completing a one-time task
- You want **multi-company isolation** — running multiple agent organizations from one deployment

## When to Choose Something Else

- For a **one-shot project** with a defined workflow, use CrewAI — it is simpler and faster to set up
- For **complex conditional logic** with branching and looping, use LangGraph — its graph model handles this natively
- For a **simple chatbot or single-agent tool**, neither framework is necessary — use a direct API call

## The Orchestrator''s Framework Selection Workflow

As an orchestrator, your framework selection follows this decision tree:

1. Is this a one-time task or an ongoing operation?
   - One-time → CrewAI or LangGraph
   - Ongoing → Paperclip
2. Does it need complex branching logic?
   - Yes → LangGraph
   - No → CrewAI or Paperclip
3. Do I need organizational structure, budgets, and governance?
   - Yes → Paperclip
   - No → CrewAI

The frameworks are not mutually exclusive. Many production systems use CrewAI or LangGraph for specific workflows within a broader Paperclip organization.', 2);

-- Module 1 Quiz
insert into public.module_quizzes (module_id, questions, xp_reward) values
('ffff0001-0000-0000-0000-000000000001', '[
  {"id": "q1", "question": "What is the best description of Paperclip?", "options": ["A single-agent chatbot framework", "An open-source framework for orchestrating AI agent organizations", "A code editor plugin for AI", "A prompt engineering library"], "correct": 1},
  {"id": "q2", "question": "How do agents communicate in Paperclip?", "options": ["Through direct function calls", "Through tickets with full tracing", "Through a shared chat room", "Through email"], "correct": 1},
  {"id": "q3", "question": "What happens when a Paperclip agent hits its monthly budget?", "options": ["It keeps running and ignores the budget", "It stops automatically — no runaway costs", "It sends an email to the admin", "It switches to a cheaper model"], "correct": 1}
]'::jsonb, 25);

-- ============================================================================
-- Module 2: Core Concepts
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'ffff0002-0000-0000-0000-000000000002',
  (select id from public.courses where slug = 'multi-agent-paperclip'),
  'Core Concepts: Companies, Agents & Goals',
  'core-concepts-companies-agents-goals',
  'Learn the fundamental building blocks of Paperclip: companies, agents, org charts, goals, and the ticket system.',
  2
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('ffff0002-0000-0000-0000-000000000002', 'Companies, Org Charts, and Missions', 'companies-org-charts-missions', 'text',
'# Companies, Org Charts, and Missions

Every Paperclip deployment starts with a company. This is the top-level organizational unit that contains everything: agents, goals, projects, tickets, and budgets. Understanding how companies work is the foundation for everything else.

## Creating a Company

When you first launch Paperclip, the Onboarding Wizard walks you through company creation. But understanding what happens under the hood matters for designing effective organizations.

A company in Paperclip has:

- **Name** — The identity of the organization (e.g., "Content Engine" or "Research Division")
- **Mission** — A clear statement of purpose that propagates to every agent and goal

The mission is critical. It is not decorative text — it flows into every agent''s context. When an agent receives a ticket, it sees the company mission alongside the task description. This means a well-written mission keeps every agent aligned, and a vague mission leads to scattered work.

## Writing an Effective Mission

Bad mission: "Do good work with AI."
Good mission: "Produce daily market research reports on the semiconductor industry, covering supply chain developments, earnings analysis, and competitive positioning, published by 8 AM EST."

The good mission tells every agent:
- **What** to produce (market research reports)
- **About what** (semiconductor industry)
- **Covering what** (supply chain, earnings, competition)
- **When** (daily by 8 AM EST)

## Designing the Org Chart

Paperclip''s org chart is not just visualization — it defines reporting lines and delegation paths. Agents can only delegate to agents below them in the hierarchy.

A typical org chart for the research company above:

```
CEO Agent (Research Director)
├── Market Analyst Agent
├── Data Collector Agent
├── Report Writer Agent
└── Quality Reviewer Agent
```

The CEO agent receives high-level goals and breaks them into tasks for subordinate agents. The subordinates execute and report back. This mirrors how human organizations work.

## Multi-Company Deployments

A single Paperclip installation can run unlimited companies with complete data isolation. This is powerful for orchestrators managing multiple clients or business functions:

```
Paperclip Instance
├── Company: Content Engine (blog posts, social media)
├── Company: Research Division (market analysis)
├── Company: Support Ops (customer ticket triage)
└── Company: QA Team (code review, testing)
```

Each company has its own agents, goals, budgets, and tickets. No data leaks between them.

## The Orchestrator''s Company Design Workflow

When you design a Paperclip company, follow this process:

1. **Define the outcome** — What does this company produce? Be specific about deliverables, quality standards, and timelines.
2. **Identify the roles** — What specialized agents are needed? Think in terms of human job titles.
3. **Draw the hierarchy** — Who reports to whom? Who can delegate to whom?
4. **Set the mission** — Write it so clearly that any agent reading it knows exactly what the company does.
5. **Test with one goal** — Before scaling, run a single goal through the organization and review the ticket trail.

This is the orchestrator workflow applied to organizational design: Define spec, build with agent, test, review, push.', 1),

('ffff0002-0000-0000-0000-000000000002', 'Agents, Tickets, and the Work Cycle', 'agents-tickets-work-cycle', 'text',
'# Agents, Tickets, and the Work Cycle

Agents in Paperclip are fundamentally different from agents in CrewAI or LangGraph. They are persistent employees, not ephemeral function calls. Understanding how they operate is essential for designing reliable organizations.

## Agent Configuration

Each Paperclip agent is defined by:

- **Name and Role** — What this agent is called and what it does (e.g., "Senior Analyst — Market Research")
- **Skills** — What the agent is capable of (writing, analysis, code generation, web search)
- **Model** — Which AI model powers this agent (Claude is the default since Paperclip uses Claude Code as its execution engine)
- **Schedule** — How often the agent wakes up to check for work (every 5, 30, or 60 minutes)
- **Budget** — Monthly spending limit for API calls
- **Reporting Line** — Who this agent reports to in the org chart

## The Heartbeat Cycle

Unlike CrewAI crews that run and finish, Paperclip agents operate on heartbeats:

1. **Wake** — The agent activates on its scheduled interval
2. **Check** — It reviews its ticket queue for new assignments or updates
3. **Act** — If there is work, it executes using Claude Code (tool calls, file operations, API requests)
4. **Report** — Results are written back to the ticket with full tracing
5. **Sleep** — The agent goes dormant until the next heartbeat

This heartbeat model is what makes Paperclip suitable for persistent operations. Agents do not need to be manually triggered — they wake, work, and sleep on their own schedule.

## The Ticket System

Tickets are the communication backbone of Paperclip. Every interaction flows through tickets:

- **You → Agent**: Create a ticket assigning work to an agent
- **Agent → Agent**: A manager agent creates tickets for subordinate agents
- **Agent → You**: The agent updates the ticket with results, questions, or status changes

Every ticket captures:
- The full conversation thread
- Every tool call the agent made
- Every decision and its reasoning
- Cost data for the work performed

This audit trail is invaluable. When something goes wrong, you can trace exactly what happened, which agent did what, and where the process broke down.

## Creating and Assigning Tickets

Through the Paperclip dashboard, you create tickets like you would in any project management tool:

```
Title: Analyze Q1 semiconductor earnings for top 5 companies
Assigned to: Market Analyst Agent
Priority: High
Description: Pull Q1 2026 earnings data for TSMC, Samsung, Intel,
Qualcomm, and Broadcom. Summarize revenue, margins, and guidance.
Compare to Q4 2025. Deliver as a structured report.
```

The assigned agent picks this up on its next heartbeat, executes the work, and updates the ticket with results.

## Cross-Team Delegation

When an agent receives a ticket that requires expertise outside its skills, it can delegate to another agent. The CEO agent in a hierarchical setup often does this:

1. CEO receives high-level goal: "Produce weekly industry newsletter"
2. CEO creates sub-tickets:
   - "Research top 3 industry stories this week" → Research Agent
   - "Write newsletter draft from research" → Writer Agent
   - "Review newsletter for accuracy" → QA Agent
3. Each agent completes their ticket, results flow back to CEO
4. CEO assembles final output

This delegation pattern is what makes Paperclip organizational — agents do not just pass data through a pipeline, they manage work through a hierarchy.

## Event-Based Triggers

Beyond scheduled heartbeats, agents can also wake on events:

- **Task assignment** — An agent wakes immediately when a new ticket is assigned
- **@-mention** — An agent wakes when another agent mentions it in a ticket thread
- **External webhook** — An agent wakes when an external system sends a signal

This hybrid scheduling (heartbeat + event) gives you flexibility: routine work runs on schedule, urgent work triggers immediate action.

## Budget Monitoring

Every API call an agent makes has a cost. Paperclip tracks this per-agent and per-company. You set monthly budgets, and when an agent hits its limit, it stops working until the next billing period.

This is a critical governance feature. Without budget controls, a poorly configured agent could burn through thousands of dollars in API calls. Paperclip makes this impossible by design.', 2);

-- Module 2 Quiz
insert into public.module_quizzes (module_id, questions, xp_reward) values
('ffff0002-0000-0000-0000-000000000002', '[
  {"id": "q1", "question": "What does a Paperclip company''s mission statement do?", "options": ["It is decorative text on the dashboard", "It propagates to every agent''s context so they stay aligned", "It is sent to investors", "It generates the company logo"], "correct": 1},
  {"id": "q2", "question": "What is the heartbeat cycle in Paperclip?", "options": ["A health check for the server", "The cycle where agents wake, check for work, act, report, and sleep", "A monitoring dashboard feature", "The interval between database backups"], "correct": 1},
  {"id": "q3", "question": "Why is the ticket system important for orchestrators?", "options": ["It looks professional", "It provides a full audit trail of every agent action and decision", "It replaces email", "It is required by law"], "correct": 1}
]'::jsonb, 25);

-- ============================================================================
-- Module 3: Building Your First Agent Group
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'ffff0003-0000-0000-0000-000000000003',
  (select id from public.courses where slug = 'multi-agent-paperclip'),
  'Building Your First Agent Group',
  'building-first-agent-group',
  'Go from zero to a working Paperclip organization with multiple coordinating agents.',
  3
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('ffff0003-0000-0000-0000-000000000003', 'Setting Up Your First Company', 'setting-up-first-company', 'text',
'# Setting Up Your First Company

Time to get hands-on. In this lesson, you will set up a Paperclip instance and create your first company with a team of agents. By the end, you will have a working agent organization producing real output.

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- An Anthropic API key (for Claude Code agents)
- A terminal and text editor

## Installation

Clone and start Paperclip:

```bash
git clone https://github.com/paperclipai/paperclip.git
cd paperclip
npm install
npm run dev
```

The server starts at http://localhost:3100. The embedded PostgreSQL database initializes automatically on first run — no database setup required.

## The Onboarding Wizard

Open http://localhost:3100 in your browser. Paperclip presents a four-step wizard:

**Step 1: Create a Company**
Enter a name and mission. For this exercise, we will build a content research company:

- **Name**: Content Research Co
- **Mission**: Research trending topics in artificial intelligence and produce structured briefings with key developments, notable papers, and industry implications, delivered daily.

**Step 2: Configure Your First Agent**
The wizard creates a CEO agent. Configure it:

- **Name**: Research Director
- **Role**: CEO — coordinates research tasks and reviews output quality
- **Schedule**: Every 30 minutes
- **Budget**: $50/month

**Step 3: Set a Company Goal**
Goals are the high-level objectives that drive all work:

- **Goal**: Produce a daily AI industry briefing covering the top 3 developments

**Step 4: Assign a Task**
Create your first ticket:

- **Title**: Research today''s top AI developments
- **Description**: Find the 3 most significant AI industry developments from today. For each, provide a summary, the key players involved, and why it matters.

Click finish. Your company is live.

## Adding Specialized Agents

The CEO agent alone is like a one-person company. Let us add specialists. Navigate to the Agents section in the dashboard:

**Agent 2: Research Analyst**
```
Name: Research Analyst
Role: Specialist — searches for and analyzes AI industry news
Skills: Web search, data analysis, summarization
Schedule: Every 30 minutes
Budget: $30/month
Reports to: Research Director
```

**Agent 3: Report Writer**
```
Name: Report Writer
Role: Specialist — transforms research into polished briefings
Skills: Technical writing, formatting, editing
Schedule: Every 30 minutes
Budget: $20/month
Reports to: Research Director
```

## Watching the System Work

With three agents configured, assign a goal to the Research Director. Here is what happens:

1. **Research Director** (CEO) receives the goal and creates two sub-tickets:
   - "Find today''s top 3 AI developments" → Research Analyst
   - "Write a briefing from the research findings" → Report Writer (pending research completion)

2. **Research Analyst** wakes on next heartbeat, picks up the ticket, searches the web, analyzes results, and posts findings to the ticket.

3. **Report Writer** wakes, sees the research is complete, picks up the writing ticket, transforms the research into a structured briefing, and posts the final report.

4. **Research Director** reviews the output and marks the goal as complete.

All of this happens through the ticket system. You can follow every step in the dashboard — which agent did what, when, and at what cost.

## Reviewing the Output

Navigate to the Tickets section. Click on any ticket to see:
- The full conversation thread between agents
- Every tool call (web searches, file writes)
- Token usage and cost per action
- Timestamps for each step

This is your audit trail. As the orchestrator, you review this to understand how your organization performed and where to make adjustments.

## The Orchestrator Workflow Applied

Notice how this follows the orchestrator workflow:
1. **Define spec** — Company mission and goal
2. **Build with agent** — Configure agents and assign work
3. **Test** — Run the first goal and review output
4. **Review** — Check ticket trails for quality and efficiency
5. **Push** — Refine and run in production', 1),

('ffff0003-0000-0000-0000-000000000003', 'Configuring Agent Skills and Schedules', 'configuring-agent-skills-schedules', 'text',
'# Configuring Agent Skills and Schedules

The difference between a mediocre Paperclip organization and a great one comes down to agent configuration. Skills, schedules, and reporting lines determine how effectively your agents collaborate.

## Understanding Agent Skills

Skills in Paperclip define what an agent is capable of. They are not just labels — they inform the agent''s Claude Code instance about what tools and approaches are available:

- **Web search** — Agent can search the internet for information
- **Code generation** — Agent can write and execute code
- **File operations** — Agent can create, read, and modify files in the shared workspace
- **Data analysis** — Agent can process and analyze structured data
- **API integration** — Agent can make HTTP requests to external services
- **Writing** — Agent can produce long-form content, reports, and documentation

When you assign skills, be specific and intentional. An agent with every skill will try to do everything. An agent with focused skills will excel at its role.

## Skill Configuration Best Practices

**Do this:**
```
Research Analyst:
  Skills: [web search, data analysis, summarization]

Report Writer:
  Skills: [writing, formatting, editing]

Code Reviewer:
  Skills: [code generation, file operations, analysis]
```

**Not this:**
```
General Agent:
  Skills: [web search, data analysis, summarization, writing,
           formatting, editing, code generation, file operations,
           API integration]
```

The first approach creates specialists who excel. The second creates a generalist who produces mediocre output across the board.

## Schedule Optimization

Agent schedules determine how responsive your organization is. There are three standard intervals:

- **5 minutes** — For time-sensitive work (customer support triage, urgent alerts)
- **30 minutes** — For standard operational work (research, content production)
- **60 minutes** — For background tasks (monitoring, maintenance, reporting)

**Cost implications**: A 5-minute schedule means your agent checks for work 288 times per day. Even if there is no work, each check costs a small amount of tokens. A 60-minute schedule is 24 checks per day — 12x cheaper for idle agents.

**The rule**: Use the longest interval that still meets your response time requirements. Do not set every agent to 5 minutes unless you need sub-10-minute response times.

## Schedule Coordination

Agents in the same workflow should have aligned schedules. If your Research Analyst runs every 30 minutes but your Report Writer runs every 60 minutes, there will be a gap where research sits waiting to be written up.

**Good coordination:**
```
Research Analyst:  Every 30 minutes (offset: 0)
Report Writer:    Every 30 minutes (offset: 15)
QA Reviewer:      Every 30 minutes (offset: 25)
```

This creates a natural pipeline: research completes, 15 minutes later the writer picks it up, 10 minutes later QA reviews.

## Reporting Lines and Delegation

The org chart is not just hierarchy for its own sake. Reporting lines define delegation paths:

- An agent can only delegate **downward** in the hierarchy
- An agent can only escalate **upward** in the hierarchy
- Cross-team requests route through the nearest common manager

This prevents chaotic agent-to-agent communication. Every interaction has a clear path.

## Shared Workspaces

Agents in the same company share a workspace — a filesystem where outputs from one agent become inputs for another. The CEO agent writes task assignments to a shared directory; subordinate agents read their assignments, complete their work, and write results back.

Organize the workspace intentionally:

```
workspace/
├── research/          ← Research Analyst writes here
│   ├── raw/           ← Unprocessed research findings
│   └── analyzed/      ← Processed analysis
├── reports/           ← Report Writer writes here
│   ├── drafts/        ← Work in progress
│   └── final/         ← Reviewed and approved
├── reviews/           ← QA Reviewer writes here
└── goals/             ← CEO tracks goal progress here
```

A clean workspace structure prevents agents from overwriting each other''s work and makes it easy to trace where data comes from.

## Testing Your Configuration

After configuring agents, run a smoke test:

1. Create a simple goal that exercises the full pipeline
2. Watch the ticket trail as agents pick up work
3. Check timing — are agents picking up work when expected?
4. Check quality — are agents producing output matching their skills?
5. Check costs — are budgets being consumed at the expected rate?

Adjust skills, schedules, and reporting lines based on what you observe. This is iterative — you rarely get the perfect configuration on the first try.', 2);

-- Module 3 Quiz
insert into public.module_quizzes (module_id, questions, xp_reward) values
('ffff0003-0000-0000-0000-000000000003', '[
  {"id": "q1", "question": "What is the first thing the Paperclip Onboarding Wizard asks you to do?", "options": ["Configure an API key", "Create a company with a name and mission", "Install PostgreSQL", "Write a Python script"], "correct": 1},
  {"id": "q2", "question": "Why should you give agents focused skills instead of every skill?", "options": ["To save disk space", "Specialists excel at their role — generalists produce mediocre output", "Paperclip limits you to 3 skills per agent", "It does not matter, skills are just labels"], "correct": 1},
  {"id": "q3", "question": "What is the cost implication of a 5-minute agent schedule vs 60-minute?", "options": ["No difference in cost", "5-minute checks 288 times per day vs 24 — roughly 12x more expensive when idle", "60-minute is more expensive due to longer sessions", "Scheduling does not affect cost"], "correct": 1}
]'::jsonb, 25);

-- ============================================================================
-- Module 4: Advanced Coordination Patterns
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'ffff0004-0000-0000-0000-000000000004',
  (select id from public.courses where slug = 'multi-agent-paperclip'),
  'Advanced Coordination Patterns',
  'advanced-coordination-patterns',
  'Master delegation, consensus, parallel execution, and escalation patterns in Paperclip organizations.',
  4
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('ffff0004-0000-0000-0000-000000000004', 'Delegation, Escalation, and Consensus', 'delegation-escalation-consensus', 'text',
'# Delegation, Escalation, and Consensus

Paperclip organizations become powerful when agents coordinate through well-defined patterns. These three patterns — delegation, escalation, and consensus — cover most real-world coordination needs.

## Delegation: Top-Down Task Assignment

Delegation is the most common pattern. A manager agent breaks a goal into sub-tasks and assigns them to subordinate agents through tickets.

**How it works:**

1. CEO agent receives goal: "Produce a competitive analysis of our top 3 competitors"
2. CEO creates three tickets:
   - "Analyze Competitor A: products, pricing, market position" → Analyst Agent 1
   - "Analyze Competitor B: products, pricing, market position" → Analyst Agent 2
   - "Synthesize findings into executive summary" → Writer Agent (depends on analysts completing first)
3. Analyst agents work in parallel, posting results to their tickets
4. Writer agent picks up the synthesis task once both analyses are complete
5. CEO reviews final output

**Key design decisions for the orchestrator:**
- How granular should sub-tasks be? Too broad and agents flounder. Too narrow and the CEO spends more time managing than agents spend working.
- Which agents get which tasks? Match task requirements to agent skills.
- What are the dependencies? The Writer cannot start before Analysts finish — make this explicit in the ticket description.

## Escalation: Bottom-Up Problem Resolution

When an agent encounters a problem it cannot solve — missing data, ambiguous instructions, conflicting goals — it escalates to its manager.

**How it works:**

1. Research Agent receives ticket: "Find Q1 revenue for Acme Corp"
2. Research Agent searches but finds conflicting numbers from different sources
3. Research Agent updates ticket: "Found conflicting data — Reuters reports $2.1B, company press release says $2.3B. Escalating for guidance."
4. Manager Agent reviews escalation, responds: "Use the company press release as primary source, note the Reuters discrepancy as a footnote."
5. Research Agent proceeds with clarified instructions

**Designing for escalation:**
- Configure agents to escalate rather than guess when facing ambiguity
- Set clear escalation criteria: "If confidence is below 80%, escalate"
- Review escalation tickets regularly — patterns reveal where your instructions need improvement

## Consensus: Multi-Agent Agreement

Consensus is a pattern where multiple agents review the same work and must agree before it proceeds. This is Paperclip''s quality control mechanism.

**How it works:**

1. Writer Agent produces a draft report
2. CEO creates review tickets for three reviewer agents
3. Each reviewer evaluates independently and posts their assessment
4. If all three approve, the report proceeds
5. If any reviewer flags issues, the Writer Agent receives revision feedback

**Implementing consensus in Paperclip:**

The CEO agent manages the consensus process through tickets:

```
Ticket 1: "Review draft report for factual accuracy" → Fact Checker
Ticket 2: "Review draft report for writing quality" → Editor
Ticket 3: "Review draft report for strategic alignment" → Strategy Reviewer

CEO rule: Only publish if all three tickets are marked "Approved"
```

**When to use consensus:**
- High-stakes outputs (client-facing reports, published content)
- Decisions with significant cost implications
- Any output where errors have serious consequences

**When consensus is overkill:**
- Internal working documents
- Routine data collection
- Low-stakes intermediate outputs

## Combining Patterns

Real organizations use all three patterns together:

1. **CEO delegates** competitive analysis to the research team
2. **Analyst escalates** a data ambiguity to the CEO
3. **CEO delegates** the final report to the writer
4. **Three reviewers reach consensus** that the report is ready
5. **CEO approves** publication

This is how human organizations work — delegation, escalation, and review happening simultaneously. Paperclip makes it possible to run this with AI agents autonomously.

## The Orchestrator''s Pattern Selection Guide

As the orchestrator, you choose which patterns to implement based on the stakes:

- **Low stakes** (internal notes, data collection): Delegation only, no consensus
- **Medium stakes** (team reports, analysis): Delegation + escalation rules
- **High stakes** (client deliverables, published content): Full delegation + escalation + consensus', 1),

('ffff0004-0000-0000-0000-000000000004', 'Parallel Execution and Pipeline Design', 'parallel-execution-pipeline-design', 'text',
'# Parallel Execution and Pipeline Design

Speed matters in production agent organizations. A sequential pipeline where each agent waits for the previous one creates unnecessary bottlenecks. Smart pipeline design uses parallel execution to maximize throughput.

## Sequential vs Parallel Execution

**Sequential pipeline:**
```
Research → Analysis → Writing → Review → Publish
Total time: Sum of all steps
```

If research takes 10 minutes, analysis takes 5, writing takes 8, review takes 5, and publishing takes 2 — the total is 30 minutes.

**Parallel pipeline:**
```
Research A ─┐
Research B ─┼→ Analysis → Writing → Review → Publish
Research C ─┘
Total time: Max of parallel steps + sequential steps
```

Three research agents working in parallel take 10 minutes (not 30). The total pipeline drops from 30 to 25 minutes. With more parallelism in the analysis phase, you can cut further.

## Designing Parallel Pipelines in Paperclip

Parallel execution happens naturally in Paperclip when the CEO agent creates multiple independent tickets simultaneously. Agents pick up their tickets on their next heartbeat and work in parallel without any special configuration.

**Example: Daily News Briefing Pipeline**

The CEO creates these tickets simultaneously:

```
Ticket A: "Research AI industry news" → AI Research Agent
Ticket B: "Research semiconductor news" → Chip Research Agent
Ticket C: "Research enterprise software news" → Enterprise Research Agent
```

All three agents work in parallel. When all three complete, the CEO creates the next ticket:

```
Ticket D: "Synthesize research from Tickets A, B, C into a briefing"
  → Writer Agent
```

The Writer waits for all three research tickets before starting. The CEO agent manages this dependency through ticket status monitoring.

## Fan-Out / Fan-In Pattern

The most common parallel pattern is fan-out/fan-in:

1. **Fan-out**: A manager creates multiple parallel tickets from a single goal
2. **Execute**: Multiple agents work independently on their tickets
3. **Fan-in**: A synthesis agent combines all results into a single output

```
            ┌→ Agent A → Result A ─┐
Goal → CEO ─┼→ Agent B → Result B ─┼→ Synthesizer → Final Output
            └→ Agent C → Result C ─┘
```

This pattern is ideal for:
- Research across multiple topics or sources
- Analysis from different perspectives
- Data collection from multiple APIs
- Competitive analysis across multiple competitors

## Pipeline Stages

A well-designed production pipeline has distinct stages:

**Stage 1: Collection** (parallel)
Multiple agents gather raw data, research, or inputs from different sources.

**Stage 2: Processing** (parallel or sequential)
Agents analyze, clean, or transform the collected data.

**Stage 3: Synthesis** (sequential)
A single agent combines processed outputs into a coherent deliverable.

**Stage 4: Review** (parallel — consensus pattern)
Multiple reviewers evaluate the deliverable independently.

**Stage 5: Publication** (sequential)
The final output is published, stored, or delivered.

## Handling Dependencies

Paperclip does not have a built-in dependency graph like LangGraph. Instead, dependencies are managed through ticket descriptions and agent instructions:

**In the CEO agent''s instructions:**
```
When creating pipeline tickets:
1. Create all Stage 1 tickets immediately
2. Monitor Stage 1 tickets — when ALL are marked complete,
   create Stage 2 tickets
3. Repeat for each subsequent stage
```

The CEO agent''s heartbeat cycle naturally handles this: each time it wakes, it checks ticket statuses and creates next-stage tickets when dependencies are met.

## Throughput Optimization

To maximize throughput without increasing costs:

1. **Identify the bottleneck** — Which stage takes the longest? That is where parallelism helps most.
2. **Parallelize the bottleneck** — Add more agents to the slowest stage.
3. **Stagger schedules** — Offset agent heartbeats so work flows smoothly between stages.
4. **Right-size agents** — Not every task needs the most capable model. Use faster, cheaper models for routine collection and processing.

## Monitoring Pipeline Performance

Track these metrics in the Paperclip dashboard:

- **Cycle time** — How long from goal creation to final output?
- **Stage time** — How long does each stage take?
- **Agent utilization** — Are agents busy or mostly idle?
- **Cost per output** — How much does each deliverable cost?

These metrics tell you where to optimize. If Stage 1 takes 80% of the cycle time, that is where you add parallel agents. If an agent is idle 90% of the time, consider combining its role with another agent or reducing its schedule frequency.', 2);

-- Module 4 Quiz
insert into public.module_quizzes (module_id, questions, xp_reward) values
('ffff0004-0000-0000-0000-000000000004', '[
  {"id": "q1", "question": "What is the consensus pattern used for in Paperclip?", "options": ["Making agents agree on a budget", "Multiple agents review the same work and must agree before it proceeds", "Voting on which agent gets the next task", "Reaching agreement on the company mission"], "correct": 1},
  {"id": "q2", "question": "How does parallel execution work in Paperclip?", "options": ["You enable a special parallel mode", "The CEO agent creates multiple independent tickets — agents pick them up simultaneously", "Agents share a thread pool", "You connect agents with parallel edges"], "correct": 1},
  {"id": "q3", "question": "What is the fan-out / fan-in pattern?", "options": ["Agents spread out across multiple servers", "A manager fans work to multiple agents, then a synthesizer combines their results", "A debugging technique for slow agents", "A way to cool down overworked agents"], "correct": 1}
]'::jsonb, 25);

-- ============================================================================
-- Module 5: Integrating with Real Tools and APIs
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'ffff0005-0000-0000-0000-000000000005',
  (select id from public.courses where slug = 'multi-agent-paperclip'),
  'Integrating with Real Tools and APIs',
  'integrating-tools-apis',
  'Connect your Paperclip agents to external services, databases, and APIs for real-world utility.',
  5
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('ffff0005-0000-0000-0000-000000000005', 'Connecting Agents to External Services', 'connecting-agents-external-services', 'text',
'# Connecting Agents to External Services

A Paperclip organization that only talks to itself is a toy. Real value comes when agents interact with external services — pulling data from APIs, writing to databases, sending notifications, and integrating with your existing tech stack.

## How Tool Integration Works in Paperclip

Since Paperclip agents run on Claude Code, they inherit all of Claude Code''s tool capabilities. This means agents can:

- Execute shell commands
- Make HTTP requests to any API
- Read and write files
- Run scripts in any language available on the server
- Interact with databases through CLI tools

The orchestrator''s job is to configure which tools each agent can access and provide the necessary credentials and instructions.

## API Integration Pattern

The most common integration is connecting agents to REST APIs. Here is how to set up an agent that pulls data from an external service:

**Step 1: Store credentials securely**

Create a `.env` file in your Paperclip workspace:

```bash
# External service credentials
NEWS_API_KEY=your-api-key-here
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
DATABASE_URL=postgresql://user:pass@host:5432/db
```

**Step 2: Configure the agent''s instructions**

In the agent''s role description, specify which APIs it should use and how:

```
You are a News Collector agent. Your job is to gather AI industry
news from the following sources:

1. NewsAPI (key in NEWS_API_KEY env var)
   - Endpoint: https://newsapi.org/v2/everything
   - Query: "artificial intelligence" OR "machine learning"
   - Params: sortBy=publishedAt, language=en, pageSize=10

2. When you find relevant articles, save them as JSON to:
   workspace/research/raw/news-{date}.json

3. Post a summary of what you found to the ticket.
```

**Step 3: Test the integration**

Create a ticket that exercises the API integration. Review the ticket trail to verify:
- The agent correctly formed the API request
- The response was parsed properly
- Data was saved to the expected location
- Error handling worked if the API was unavailable

## Database Integration

Agents can interact with databases through command-line tools:

```
You are a Data Analyst agent. You have access to a PostgreSQL
database via the DATABASE_URL environment variable.

To query the database, use:
  psql $DATABASE_URL -c "your SQL query here"

Always use read-only queries. Never run INSERT, UPDATE, or DELETE
without explicit approval in the ticket.
```

This read-only constraint is critical. You do not want an agent accidentally modifying production data. Set clear boundaries in the agent''s instructions.

## Webhook and Notification Integration

Connecting agents to Slack, email, or other notification services lets your organization communicate externally:

**Slack notifications:**
```
When you complete a research report, notify the team:

curl -X POST $SLACK_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d ''{"text": "Daily AI briefing is ready: [link]"}''
```

**Email via Postmark or SendGrid:**
```
When a high-priority finding is identified, send an alert:

curl -X POST https://api.postmarkapp.com/email \
  -H "X-Postmark-Server-Token: $POSTMARK_TOKEN" \
  -H "Content-Type: application/json" \
  -d ''{"From": "agents@yourcompany.com",
       "To": "team@yourcompany.com",
       "Subject": "Urgent: AI Industry Alert",
       "TextBody": "Details here..."}''
```

## File System as Integration Layer

The shared workspace doubles as an integration point. External systems can drop files into the workspace, and agents pick them up:

```
workspace/
├── inbox/        ← External systems drop files here
├── processing/   ← Agents move files here while working
├── outbox/       ← Agents drop finished files here
└── archive/      ← Processed files are archived here
```

A cron job or external script can sync the inbox and outbox with cloud storage (S3, Google Drive), making the workspace a bridge between your agent organization and the rest of your infrastructure.

## Security Best Practices

When connecting agents to external services:

1. **Use environment variables** for all credentials — never hardcode API keys in agent instructions
2. **Principle of least privilege** — give each agent only the permissions it needs
3. **Read-only by default** — agents should read from external systems unless writing is explicitly required
4. **Rate limiting** — configure agents to respect API rate limits (add delays between requests)
5. **Error handling** — instruct agents to report API failures rather than retrying indefinitely', 1),

('ffff0005-0000-0000-0000-000000000005', 'Building a Real-World Data Pipeline', 'building-real-world-data-pipeline', 'text',
'# Building a Real-World Data Pipeline

Theory only gets you so far. In this lesson, you will design and configure a complete data pipeline: a Paperclip organization that monitors competitor pricing, detects changes, and alerts your team.

## The Use Case

You are an orchestrator for an e-commerce company. Your task: build an agent organization that:
1. Monitors competitor product pages daily
2. Extracts pricing data
3. Compares against yesterday''s prices
4. Alerts the team when significant changes are detected

## Organization Design

**Company:** Price Intelligence Unit
**Mission:** Monitor competitor pricing for our top 50 products daily, detect changes greater than 5%, and alert the pricing team within 30 minutes of detection.

**Org Chart:**
```
Pricing Director (CEO)
├── Scraper Agent A (Competitor 1)
├── Scraper Agent B (Competitor 2)
├── Scraper Agent C (Competitor 3)
├── Analyst Agent (price comparison)
└── Alert Agent (notifications)
```

## Agent Configuration

**Pricing Director:**
```
Role: CEO — coordinates daily price monitoring cycle
Schedule: Every 60 minutes
Budget: $10/month
Instructions:
  Every morning at 6 AM, create scraping tickets for each
  competitor agent. When all scraping is complete, create
  an analysis ticket. When analysis is complete and changes
  are detected, create an alert ticket.
```

**Scraper Agent A:**
```
Role: Specialist — extracts pricing from Competitor 1
Schedule: Every 30 minutes
Budget: $15/month
Skills: Web search, file operations
Instructions:
  When you receive a scraping ticket:
  1. Visit each product URL listed in
     workspace/config/competitor-1-urls.json
  2. Extract: product name, current price, availability
  3. Save results to workspace/data/competitor-1/{date}.json
  4. Update ticket with summary of products scraped
```

**Analyst Agent:**
```
Role: Specialist — compares today''s prices against historical data
Schedule: Every 30 minutes
Budget: $20/month
Skills: Data analysis, file operations
Instructions:
  When you receive an analysis ticket:
  1. Load today''s scraping data from workspace/data/
  2. Load yesterday''s data for comparison
  3. Calculate price changes for each product
  4. Flag any changes greater than 5%
  5. Save analysis to workspace/reports/analysis-{date}.json
  6. Update ticket with flagged changes (if any)
```

**Alert Agent:**
```
Role: Specialist — sends notifications when price changes are detected
Schedule: Every 5 minutes (fast response for alerts)
Budget: $5/month
Skills: API integration
Instructions:
  When you receive an alert ticket:
  1. Read the flagged changes from the ticket description
  2. Format a clear alert message with product names,
     old prices, new prices, and percentage changes
  3. Send to Slack via SLACK_WEBHOOK_URL
  4. Send email via POSTMARK_TOKEN to pricing-team@company.com
  5. Update ticket with confirmation of notifications sent
```

## The Configuration Files

Set up the workspace before running:

```bash
# Create the workspace structure
mkdir -p workspace/config workspace/data workspace/reports

# Create competitor URL configs
cat > workspace/config/competitor-1-urls.json << EOF
[
  {"product": "Widget Pro", "url": "https://competitor1.com/widget-pro"},
  {"product": "Widget Lite", "url": "https://competitor1.com/widget-lite"}
]
EOF
```

## Running the Pipeline

1. Assign the daily monitoring goal to the Pricing Director
2. The Director creates scraping tickets for all three competitor agents
3. Scrapers work in parallel (fan-out pattern from Module 4)
4. Director monitors ticket completion, creates analysis ticket when ready
5. Analyst compares data and flags changes
6. If changes detected, Director creates alert ticket
7. Alert Agent sends notifications within 5 minutes

## Monitoring and Iteration

After the first run, review:

- **Accuracy**: Did scrapers extract the correct prices?
- **Timing**: Did the pipeline complete within the target window?
- **Cost**: How much did the full cycle cost?
- **Alerts**: Were notifications delivered correctly?

Common adjustments after the first run:
- Scraper instructions need more specificity about HTML selectors
- Analysis thresholds need tuning (5% might be too sensitive or not sensitive enough)
- Schedule alignment needs adjustment for smoother handoffs

## Scaling the Pipeline

Once the basic pipeline works:
- Add more competitors by adding more Scraper Agents
- Increase product coverage by expanding the URL configs
- Add a Trend Agent that tracks price patterns over weeks and months
- Add a Strategy Agent that recommends pricing responses

This is the power of Paperclip for orchestrators — you scale by adding agents and adjusting the org chart, not by rewriting code. Your role is designing the organization and refining its performance.', 2);

-- Module 5 Quiz
insert into public.module_quizzes (module_id, questions, xp_reward) values
('ffff0005-0000-0000-0000-000000000005', '[
  {"id": "q1", "question": "How do Paperclip agents access external APIs?", "options": ["Through a built-in API marketplace", "Through Claude Code''s tool capabilities — HTTP requests, shell commands, scripts", "By importing npm packages", "Through a GraphQL gateway"], "correct": 1},
  {"id": "q2", "question": "Why should database-connected agents default to read-only queries?", "options": ["Write queries are slower", "To prevent agents from accidentally modifying production data", "Paperclip does not support write queries", "Read-only is cheaper"], "correct": 1},
  {"id": "q3", "question": "In the pricing pipeline, why is the Alert Agent on a 5-minute schedule while others are on 30 minutes?", "options": ["It is more important", "Alerts need fast response times — 30 minutes is too slow for urgent price changes", "5-minute schedules are always better", "The Alert Agent uses less budget"], "correct": 1}
]'::jsonb, 25);

-- ============================================================================
-- Module 6: Production Deployment and Monitoring
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'ffff0006-0000-0000-0000-000000000006',
  (select id from public.courses where slug = 'multi-agent-paperclip'),
  'Production Deployment and Monitoring',
  'production-deployment-monitoring',
  'Deploy your Paperclip organization to production with proper monitoring, alerting, and cost controls.',
  6
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('ffff0006-0000-0000-0000-000000000006', 'Deploying Paperclip to Production', 'deploying-paperclip-production', 'text',
'# Deploying Paperclip to Production

Running Paperclip locally is great for development and testing. Production requires more: persistent storage, reliable hosting, environment management, and proper security.

## Local vs Production Architecture

**Local (development):**
- Single Node.js process
- Embedded PostgreSQL (auto-created)
- Local file storage
- http://localhost:3100

**Production:**
- Node.js process on a dedicated server or container
- External PostgreSQL database (managed service recommended)
- Cloud file storage or persistent volume
- HTTPS with proper domain and SSL

## Choosing a Hosting Strategy

Paperclip is a standard Node.js application, so it runs anywhere Node.js runs:

**Option 1: VPS (DigitalOcean, Hetzner, Linode)**
Best for: Full control, predictable costs, single-company deployments
```bash
# On your VPS
git clone https://github.com/paperclipai/paperclip.git
cd paperclip
npm install
npm run build

# Set environment variables
export DATABASE_URL=postgresql://user:pass@your-pg-host:5432/paperclip
export ANTHROPIC_API_KEY=sk-ant-xxx
export NODE_ENV=production

# Start with process manager
pm2 start npm --name paperclip -- run start
```

**Option 2: Container (Docker)**
Best for: Reproducible deployments, easy scaling, CI/CD pipelines
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3100
CMD ["npm", "run", "start"]
```

**Option 3: Platform as a Service (Railway, Render, Fly.io)**
Best for: Quick deployment, managed infrastructure, auto-scaling
```bash
# Using Railway
railway init
railway add -d postgres
railway up
```

## Database Configuration

For production, use an external PostgreSQL instance:

- **Supabase** — Generous free tier, managed Postgres with built-in auth
- **Neon** — Serverless Postgres with auto-scaling
- **AWS RDS** — Enterprise-grade with automated backups
- **DigitalOcean Managed Database** — Simple, affordable

Set the `DATABASE_URL` environment variable to your external database:

```bash
DATABASE_URL=postgresql://user:password@host:5432/paperclip?sslmode=require
```

Paperclip runs its migrations automatically on startup — no manual schema setup required.

## Environment Variables for Production

Your production environment needs these variables at minimum:

```bash
# Database
DATABASE_URL=postgresql://...

# AI Model
ANTHROPIC_API_KEY=sk-ant-...

# Application
NODE_ENV=production
PORT=3100

# Security
SESSION_SECRET=a-long-random-string

# External integrations (as needed)
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
NEWS_API_KEY=...
```

Store these securely — use your hosting platform''s environment variable management, not a `.env` file on the server.

## HTTPS and Domain Setup

Production must run over HTTPS. Options:

1. **Reverse proxy with nginx + Let''s Encrypt:**
```nginx
server {
    listen 443 ssl;
    server_name agents.yourcompany.com;

    ssl_certificate /etc/letsencrypt/live/agents.yourcompany.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/agents.yourcompany.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3100;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

2. **Cloudflare tunnel** — Zero-config HTTPS without opening ports
3. **Platform SSL** — Railway, Render, and Fly.io handle SSL automatically

## Backup Strategy

Your Paperclip database contains your entire organizational knowledge — agent configurations, ticket histories, goal progress. Losing it means starting over.

**Automated daily backups:**
```bash
# Cron job for daily pg_dump
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/paperclip-$(date +%Y%m%d).sql.gz
```

Most managed database services include automated backups. Verify they are enabled and test restore procedures periodically.

## Security Hardening

Production security checklist:

1. **Restrict dashboard access** — Use authentication (Paperclip supports session-based auth)
2. **Firewall rules** — Only expose port 443 (HTTPS), block direct access to 3100
3. **API key rotation** — Rotate Anthropic API keys periodically
4. **Agent permissions** — Review agent instructions for overly broad access
5. **Network isolation** — Run database on a private network, not publicly accessible
6. **Audit logs** — Paperclip''s ticket system is your audit log — preserve it', 1),

('ffff0006-0000-0000-0000-000000000006', 'Monitoring, Alerting, and Cost Control', 'monitoring-alerting-cost-control', 'text',
'# Monitoring, Alerting, and Cost Control

A production Paperclip organization is only as good as your ability to monitor it. Without visibility into agent performance, costs, and failures, you are flying blind.

## The Paperclip Dashboard

Paperclip''s built-in React dashboard provides real-time visibility:

- **Company overview** — Active agents, open tickets, budget utilization
- **Agent status** — Last heartbeat, current task, budget remaining
- **Ticket timeline** — All tickets with status, assignment, and completion data
- **Cost tracking** — Per-agent and per-company spending over time

This is your primary monitoring tool. Check it daily during the first week of production, then establish a cadence that matches your organization''s rhythm.

## Key Metrics to Track

**Operational metrics:**
- **Ticket throughput** — How many tickets are completed per day?
- **Cycle time** — How long from ticket creation to completion?
- **Agent uptime** — Are agents waking on schedule?
- **Error rate** — How many tickets fail or require escalation?

**Financial metrics:**
- **Cost per ticket** — Average API cost to complete a ticket
- **Cost per output** — What does each deliverable cost?
- **Budget utilization** — What percentage of each agent''s budget is used?
- **Cost trend** — Is spending increasing, decreasing, or stable?

**Quality metrics:**
- **Escalation rate** — How often do agents escalate to managers?
- **Revision rate** — How often does output need revision?
- **Consensus pass rate** — What percentage of reviews pass on first submission?

## Setting Up External Monitoring

The Paperclip dashboard is good for manual checks. For production, you want automated alerting:

**Health check endpoint:**
Monitor that Paperclip is running by hitting its API:
```bash
# Simple uptime check
curl -f https://agents.yourcompany.com/api/health || \
  curl -X POST $SLACK_ALERT_WEBHOOK -d ''{"text":"Paperclip is DOWN"}''
```

**Agent heartbeat monitoring:**
Create a monitoring agent that checks other agents are alive:
```
Monitor Agent:
  Schedule: Every 5 minutes
  Instructions:
    Check the status of all agents in the company.
    If any agent has not had a heartbeat in the last
    2x their scheduled interval, send an alert to Slack.
```

This is a beautiful pattern — use Paperclip to monitor Paperclip.

## Cost Control Strategies

AI agent costs can grow quickly. These strategies keep spending predictable:

**1. Budget tiers by role:**
```
CEO / Manager agents:    $10-25/month (coordination overhead)
Specialist agents:       $15-50/month (actual work)
Alert / Monitor agents:  $5-10/month (lightweight tasks)
```

**2. Model selection by task:**
Not every agent needs the most powerful model. For routine tasks like data formatting or notification sending, a faster and cheaper model reduces costs without affecting quality.

**3. Schedule optimization:**
Review agent utilization monthly. If an agent is idle 80% of the time, lengthen its schedule interval. Every unnecessary heartbeat check costs tokens.

**4. Output caching:**
For agents that repeatedly generate similar outputs (weekly reports with the same structure), instruct them to check if a similar output already exists before generating from scratch.

**5. Hard budget limits:**
Paperclip''s per-agent budgets are your safety net. Set them conservatively at first, then adjust upward as you understand actual costs. It is always easier to increase a budget than to explain an unexpected overage.

## Incident Response

When something goes wrong — and it will — follow this process:

1. **Detect** — Dashboard alert or monitoring notification
2. **Assess** — What broke? Check the ticket trail for the failing agent
3. **Contain** — If an agent is misbehaving, reduce its budget to $0 to stop it immediately
4. **Fix** — Update the agent''s instructions, skills, or configuration
5. **Verify** — Run a test ticket to confirm the fix
6. **Review** — What caused the issue? Update your monitoring to catch it earlier next time

Setting an agent''s budget to zero is the emergency stop button. The agent will stop working on its next heartbeat when it sees no budget remaining.

## Monthly Review Checklist

Every month, review your Paperclip organization:

- [ ] Total spend vs budget — any surprises?
- [ ] Agent utilization — any agents consistently idle or overloaded?
- [ ] Ticket quality — review a sample of completed tickets for quality
- [ ] Escalation patterns — are the same issues escalating repeatedly?
- [ ] Schedule efficiency — can any intervals be lengthened?
- [ ] Security — review agent permissions and API key usage
- [ ] Backups — verify backup integrity by testing a restore

This monthly review is the orchestrator''s equivalent of a team retrospective. It keeps your agent organization healthy and efficient.', 2);

-- Module 6 Quiz
insert into public.module_quizzes (module_id, questions, xp_reward) values
('ffff0006-0000-0000-0000-000000000006', '[
  {"id": "q1", "question": "What is the recommended way to stop a misbehaving agent immediately?", "options": ["Delete the agent", "Set its budget to $0 — it stops on the next heartbeat", "Restart the Paperclip server", "Send it a stop ticket"], "correct": 1},
  {"id": "q2", "question": "Which of these is NOT a key production metric for a Paperclip organization?", "options": ["Ticket throughput", "Cost per output", "Number of lines of code written", "Agent uptime"], "correct": 2},
  {"id": "q3", "question": "Why is external PostgreSQL recommended for production instead of the embedded database?", "options": ["It is faster", "For persistence, backups, reliability, and ability to scale independently", "Embedded Postgres has a row limit", "External databases are free"], "correct": 1}
]'::jsonb, 25);

-- ============================================================================
-- Module 7: Capstone Project
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'ffff0007-0000-0000-0000-000000000007',
  (select id from public.courses where slug = 'multi-agent-paperclip'),
  'Capstone: Build an Autonomous Content Agency',
  'capstone-autonomous-content-agency',
  'Apply everything you have learned to build a complete autonomous content agency with Paperclip.',
  7
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('ffff0007-0000-0000-0000-000000000007', 'Designing the Content Agency', 'designing-content-agency', 'text',
'# Designing the Content Agency

For your capstone project, you will design and build a complete autonomous content agency using Paperclip. This agency will research topics, write articles, review them for quality, and publish them — all without human intervention after initial setup.

## The Brief

**Company:** Autonomous Content Agency
**Mission:** Produce 3 high-quality, well-researched articles per week on AI industry topics, each reviewed for factual accuracy and writing quality before publication.

**Deliverables:**
- 3 articles per week (Monday, Wednesday, Friday)
- Each article: 800-1200 words, well-structured, factually accurate
- Published to a shared output folder
- Team notified via Slack when each article is published

## Organization Design

This is where everything from the course comes together. Let us design the complete org chart:

```
Content Director (CEO)
├── Trend Researcher
│   └── Finds trending AI topics and creates topic briefs
├── Deep Researcher
│   └── Researches a specific topic in depth
├── Staff Writer
│   └── Writes articles from research briefs
├── Fact Checker
│   └── Verifies claims and sources in articles
├── Copy Editor
│   └── Reviews writing quality and style
└── Publisher
    └── Formats and publishes approved articles
```

Six specialized agents plus a CEO. Seven total.

## Agent Specifications

**Content Director (CEO):**
```
Schedule: Every 60 minutes
Budget: $15/month
Role: Coordinate the content pipeline. On Monday, Wednesday, and
Friday mornings, kick off the article production cycle. Monitor
progress and resolve escalations.

Pipeline:
1. Create ticket for Trend Researcher: "Find top 3 trending
   AI topics today"
2. Select the best topic from the research
3. Create ticket for Deep Researcher: "Research [topic] in depth"
4. When research is complete, create ticket for Staff Writer:
   "Write 800-1200 word article on [topic] using this research"
5. When draft is complete, create parallel review tickets:
   - Fact Checker: "Verify all claims in this article"
   - Copy Editor: "Review writing quality and suggest edits"
6. When both reviews pass, create ticket for Publisher:
   "Publish final article"
7. If either review flags issues, create revision ticket
   for Staff Writer with feedback
```

**Trend Researcher:**
```
Schedule: Every 30 minutes
Budget: $20/month
Skills: Web search, data analysis
Instructions:
  Search for trending AI industry topics. Look at:
  - Tech news sites (TechCrunch, The Verge, Ars Technica)
  - AI research aggregators (Papers With Code, arXiv highlights)
  - Social media discussions (X/Twitter AI community)

  For each topic found, provide:
  - Topic title
  - Why it is trending (news hook)
  - Potential angle for an article
  - 3-5 source URLs

  Save to workspace/topics/{date}-topics.json
```

**Deep Researcher:**
```
Schedule: Every 30 minutes
Budget: $25/month
Skills: Web search, data analysis, file operations
Instructions:
  When assigned a topic, research it thoroughly:
  1. Read all source URLs from the topic brief
  2. Search for additional sources and perspectives
  3. Identify key facts, quotes, and statistics
  4. Note any controversies or counterpoints
  5. Compile into a research brief at
     workspace/research/{topic-slug}-brief.md

  The research brief should have:
  - Executive summary (2-3 sentences)
  - Key facts and statistics (with sources)
  - Notable quotes
  - Different perspectives on the topic
  - Suggested article structure
```

**Staff Writer:**
```
Schedule: Every 30 minutes
Budget: $25/month
Skills: Writing, file operations
Instructions:
  Write articles based on research briefs.
  Style guidelines:
  - Clear, engaging, accessible to a business audience
  - Lead with the most important or surprising finding
  - Use short paragraphs and subheadings
  - Include specific data points and examples
  - No jargon without explanation
  - 800-1200 words

  Save drafts to workspace/articles/drafts/{topic-slug}.md
  Save final versions to workspace/articles/final/{topic-slug}.md
```

## Budget Planning

Total monthly budget for the agency:

```
Content Director:    $15
Trend Researcher:    $20
Deep Researcher:     $25
Staff Writer:        $25
Fact Checker:        $15
Copy Editor:         $15
Publisher:            $5
─────────────────────────
Total:              $120/month
```

At 12 articles per month (3 per week), that is $10 per article. Compare that to freelance writing rates of $200-500 per article, and the value proposition is clear.

## Implementation Steps

Follow the orchestrator workflow:

1. **Define spec** — Done. The company mission, org chart, and agent specs above are your specification.
2. **Build with agent** — Set up Paperclip, create the company, configure all seven agents.
3. **Test** — Run one article through the full pipeline. Do not scale until the first article is good.
4. **Review** — Check every ticket in the pipeline. Was the research thorough? Was the writing quality acceptable? Did reviews catch issues?
5. **Push** — Once the pipeline produces a good article, set the Content Director to run the Monday/Wednesday/Friday schedule.

The next lesson walks through the implementation and troubleshooting process.', 1),

('ffff0007-0000-0000-0000-000000000007', 'Implementing and Iterating', 'implementing-and-iterating', 'text',
'# Implementing and Iterating

You have the design. Now it is time to build, test, and refine your autonomous content agency. This lesson covers the implementation process and the iteration cycles that turn a working prototype into a reliable production system.

## Step 1: Set Up the Infrastructure

Start your Paperclip instance (local for testing, production for the real thing):

```bash
cd paperclip
npm run dev
```

Create the workspace structure:

```bash
mkdir -p workspace/topics workspace/research workspace/articles/drafts workspace/articles/final workspace/published
```

Set up environment variables for external integrations:

```bash
# In your Paperclip .env file
ANTHROPIC_API_KEY=sk-ant-your-key
SLACK_WEBHOOK_URL=https://hooks.slack.com/your-webhook
```

## Step 2: Create the Company

Through the Paperclip dashboard:
- **Name**: Autonomous Content Agency
- **Mission**: Produce 3 high-quality, well-researched articles per week on AI industry topics, reviewed for accuracy and quality before publication.

## Step 3: Configure Agents

Create all seven agents from the specifications in the previous lesson. Pay attention to:

- **Reporting lines** — Every specialist reports to the Content Director
- **Schedules** — Align heartbeats so the pipeline flows smoothly
- **Budgets** — Start conservative; you can always increase

**Recommended schedule alignment for a smooth pipeline:**
```
Content Director:  :00 past each hour
Trend Researcher:  :05, :35
Deep Researcher:   :10, :40
Staff Writer:      :15, :45
Fact Checker:      :20, :50
Copy Editor:       :25, :55
Publisher:         :30 (every 30 minutes)
```

This staggering means that work flows naturally through the pipeline with minimal waiting.

## Step 4: Run the First Article

Create a goal for the Content Director:
"Produce one test article. Start by having the Trend Researcher find today''s top AI topic, then run the full pipeline."

Then watch. Check the dashboard every 15 minutes to see how the pipeline progresses. Do not intervene unless an agent is clearly stuck.

## Step 5: Review the First Run

After the first article is complete (expect 2-4 hours for a full pipeline run), do a thorough review:

**Ticket trail review:**
- How many heartbeat cycles did each step take?
- Were there any escalations?
- Did any agent wait unnecessarily long for its input?

**Quality review:**
- Was the topic selection relevant and timely?
- Was the research thorough with good sources?
- Was the writing quality acceptable?
- Did the Fact Checker catch anything? (If yes, good. If no, test with a deliberately incorrect claim to verify it works.)
- Did the Copy Editor improve the writing?

**Cost review:**
- What was the total cost for this one article?
- Which agent was most expensive? Is that expected?
- Are any agents over-spending relative to their contribution?

## Common Issues and Fixes

**Issue: Agent does not pick up tickets**
- Check the agent''s schedule — is the heartbeat running?
- Check the ticket assignment — is it assigned to the correct agent?
- Check the budget — has the agent hit its limit?

**Issue: Research is too shallow**
- Add more specific instructions to the Deep Researcher
- Increase the number of required sources (e.g., "Find at least 8 sources")
- Add instruction to look for counterpoints and alternative perspectives

**Issue: Writing is generic or flat**
- Add style examples to the Staff Writer''s instructions
- Include "do not" rules (e.g., "Do not use passive voice. Do not start paragraphs with ''In today''s world''")
- Provide a sample article as a reference

**Issue: Reviews always pass without finding issues**
- Make review criteria more specific
- Add instruction: "You must find at least one improvement suggestion, even if minor"
- Test by introducing a deliberate error and verifying the reviewer catches it

**Issue: Pipeline takes too long**
- Check schedule alignment — is there unnecessary waiting between steps?
- Identify the bottleneck stage and add parallelism if possible
- Consider tighter heartbeat intervals for the bottleneck agent

## Iteration Cycles

Plan for at least three iteration cycles before going to production:

**Cycle 1: Basic functionality**
Goal: Does the pipeline produce an article from start to finish?
Fix: Broken handoffs, missing instructions, configuration errors.

**Cycle 2: Quality tuning**
Goal: Is the output good enough to publish?
Fix: Agent instructions, style guidelines, review criteria.

**Cycle 3: Reliability and cost**
Goal: Does it run consistently without intervention? Is the cost acceptable?
Fix: Schedule optimization, budget adjustments, error handling.

## Going to Production

Once three test articles have passed your quality bar:

1. Deploy Paperclip to production (see Module 6)
2. Set the Content Director''s schedule to trigger on Monday, Wednesday, and Friday mornings
3. Monitor the first week closely — check every article before it reaches end users
4. After a clean first week, reduce monitoring to daily checks
5. After a clean first month, reduce to weekly reviews

## What You Have Built

You now have an autonomous content agency that:
- Researches trending topics without human input
- Writes original articles based on thorough research
- Reviews articles for factual accuracy and writing quality
- Publishes approved content on a set schedule
- Tracks every action, decision, and cost

This is AI orchestration at the organizational level. You did not write the articles. You did not review them. You designed the organization, configured the agents, and refined the process. The agents do the work. You are the orchestrator.

## Next Steps

From here, you can:
- Add more content types (newsletters, social media posts, video scripts)
- Expand to multiple topics or industries
- Add a Trend Analyzer that identifies which articles perform best and adjusts future topic selection
- Build a second Paperclip company for a different business function

The skills you have built in this course — organizational design, agent configuration, pipeline design, coordination patterns, production deployment, and iterative refinement — apply to any Paperclip use case. The content agency is just the beginning.', 2);

-- Module 7 Quiz
insert into public.module_quizzes (module_id, questions, xp_reward) values
('ffff0007-0000-0000-0000-000000000007', '[
  {"id": "q1", "question": "How many iteration cycles should you plan for before going to production?", "options": ["Zero — deploy immediately", "At least three: basic functionality, quality tuning, reliability and cost", "Exactly one", "Ten or more"], "correct": 1},
  {"id": "q2", "question": "What is the estimated cost per article in the capstone content agency?", "options": ["$200-500 like a freelance writer", "About $10 per article at $120/month for 12 articles", "Free — AI does not cost anything", "About $1000 per article"], "correct": 1},
  {"id": "q3", "question": "What should you do if the Fact Checker agent always approves without finding issues?", "options": ["That means everything is perfect", "Test with a deliberate error and make review criteria more specific", "Remove the Fact Checker agent", "Increase its budget"], "correct": 1}
]'::jsonb, 25);
