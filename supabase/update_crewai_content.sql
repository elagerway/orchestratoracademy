-- ==========================================================================
-- UPDATE: Expand CrewAI Mastery course lesson content (800-1200 words each)
-- Matches on module_id + slug for each of the 14 lessons
-- ==========================================================================

-- ===== MODULE 1: Introduction to Multi-Agent Systems =====

-- Lesson 1.1: What Are Multi-Agent Systems?
UPDATE public.lessons
SET content = '# What Are Multi-Agent Systems?

A multi-agent system (MAS) is an architecture where multiple AI agents work together to accomplish tasks that would be difficult or impossible for a single agent. Each agent has its own role, capabilities, and perspective, and they coordinate to produce results greater than the sum of their parts. In this lesson, you will learn exactly what multi-agent systems are, why they exist, and how they compare to the single-agent tools you have likely already used.

## The Single-Agent Problem

If you have used ChatGPT, Claude, or any other AI assistant, you have interacted with a single-agent system. You give it a prompt, it responds. This works well for simple tasks, but breaks down when you need:

- **Multiple perspectives** on a problem (e.g., a researcher and a critic evaluating the same data)
- **Specialized expertise** across different domains within one workflow
- **Parallel processing** where independent subtasks run simultaneously
- **Quality control** where one agent reviews another''s work before it reaches the user

A single agent trying to do everything is like one person trying to run an entire company. It can fake it for a while, but the quality suffers. The model tries to be a researcher, a writer, and an editor all at once, and the output ends up mediocre at everything rather than excellent at anything.

> **Key insight:** Single agents suffer from "role dilution." The more responsibilities you pile onto one agent, the worse it performs at each one. Multi-agent systems solve this by letting each agent focus on what it does best.

## How Multi-Agent Systems Work

In a multi-agent system, you define:

1. **Agents** with distinct roles (e.g., "Senior Research Analyst," "Technical Writer," "Quality Reviewer")
2. **Tasks** that each agent is responsible for completing
3. **Coordination patterns** that determine how agents interact and share information
4. **Tools** that give agents access to external data and services

The orchestrator — that is you — designs the system: which agents exist, what they do, and how they communicate. The agents then execute autonomously within those boundaries. Here is a minimal example to illustrate the concept:

```python
from crewai import Agent, Task, Crew, Process

# Two agents with different specializations
researcher = Agent(
    role="Research Analyst",
    goal="Find accurate, comprehensive data on the given topic",
    backstory="You are a veteran researcher who always cites sources."
)

writer = Agent(
    role="Content Writer",
    goal="Transform research into clear, engaging prose",
    backstory="You write for a general audience with clarity and warmth."
)

# Two tasks that chain together
research_task = Task(
    description="Research the topic: {topic}",
    expected_output="A detailed brief with key findings and sources.",
    agent=researcher
)

writing_task = Task(
    description="Write a 500-word article based on the research.",
    expected_output="A polished article with intro, body, and conclusion.",
    agent=writer,
    context=[research_task]  # writer receives researcher output
)

# The crew coordinates them
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.sequential
)
```

Notice how each agent has a single clear responsibility, and the `context` parameter creates a pipeline where the writer builds on the researcher''s output.

## Real-World Analogies

Think of a multi-agent system like a well-run team:

- A **newspaper editorial team** has reporters, editors, and fact-checkers who each contribute their expertise
- A **software team** has developers, testers, and architects who collaborate on a product
- A **medical team** has surgeons, anesthesiologists, and nurses working in concert

The AI orchestrator designs these teams, but instead of hiring humans, you configure AI agents. Each agent brings a different "lens" to the problem, and the combined result is better than any single agent could produce alone.

## Common Multi-Agent Architectures

There are several patterns you will encounter throughout this course:

### Sequential Pipeline
Tasks execute one after another. Each agent receives the previous agent''s output as context. This is the simplest pattern and the one you will use most often when starting out.

### Hierarchical (Manager-Worker)
A manager agent delegates tasks to worker agents, reviews their output, and can re-assign work if the quality is insufficient. This mirrors a real management structure.

### Peer Collaboration
Agents communicate directly with each other, debating and refining ideas. This is useful for creative tasks where multiple perspectives genuinely improve the result.

### Fan-Out / Fan-In
Multiple agents work on different sub-problems in parallel, then a synthesis agent combines their outputs. This is powerful for research tasks where you want breadth of coverage.

## Common Mistakes to Avoid

When building your first multi-agent systems, watch out for these pitfalls:

1. **Too many agents.** Start with two or three. Each additional agent increases complexity and cost. Add agents only when you have a clear reason.
2. **Vague roles.** "Helper agent" is not a role. Every agent needs a specific, well-defined responsibility.
3. **No quality control.** Always include at least one agent whose job is to review or critique the work of others.
4. **Ignoring cost.** Every agent call uses LLM tokens. A five-agent crew costs roughly five times what a single agent call costs. Design with cost awareness.
5. **Over-engineering.** If a single well-prompted agent can do the job, you do not need a multi-agent system. Use MAS when the task genuinely benefits from specialization.

## Why This Matters for Your Career

Multi-agent systems are rapidly becoming the standard architecture for enterprise AI. Companies need people who can design, build, and manage these systems. Job postings for "AI Orchestrator" and "Multi-Agent System Engineer" are growing rapidly. This course will give you that skill set, starting from the fundamentals and building to production-ready implementations.

## Key Takeaways

- A multi-agent system uses multiple specialized AI agents that coordinate to complete complex tasks
- Single agents suffer from role dilution; multi-agent systems solve this through specialization
- The four main architecture patterns are sequential, hierarchical, peer collaboration, and fan-out/fan-in
- Start simple (two to three agents) and add complexity only when needed
- Always include a quality control step in your multi-agent workflows'
WHERE module_id = 'bbbb0001-0000-0000-0000-000000000001' AND slug = 'what-are-multi-agent-systems';


-- Lesson 1.2: Why CrewAI? Comparing Frameworks
UPDATE public.lessons
SET content = '# Why CrewAI? Comparing Frameworks

Several frameworks exist for building multi-agent systems, and choosing the right one for your project is an important decision. In this lesson, we will do a deep comparison of CrewAI, LangGraph, AutoGen, and LangChain so you understand the trade-offs and can make informed choices throughout your career.

## The Multi-Agent Framework Landscape

As of 2026, the four most prominent frameworks for building AI agent systems are:

| Framework | Creator | Primary Metaphor | Best For |
|-----------|---------|-------------------|----------|
| CrewAI | CrewAI Inc. | Team of employees | Business process automation |
| LangGraph | LangChain | Directed graph | Complex stateful workflows |
| AutoGen | Microsoft | Group chat | Research and experimentation |
| LangChain | LangChain | Chain of calls | Simple linear pipelines |

Each framework models the problem differently, and that mental model determines what feels natural and what feels forced.

## CrewAI: The Team Simulator

CrewAI models AI collaboration the way human teams work. You define agents with roles, backstories, and goals, then assign them tasks within a crew. CrewAI handles the coordination, delegation, and communication between agents.

```python
from crewai import Agent, Task, Crew, Process

analyst = Agent(
    role="Senior Market Analyst",
    goal="Identify emerging market trends with data-backed insights",
    backstory="15 years at Goldman Sachs analyzing tech markets. "
              "Known for contrarian calls that prove correct.",
    tools=[SerperDevTool(), ScrapeWebsiteTool()],
    verbose=True
)
```

**Strengths:**
- Intuitive role-based agent design that mirrors real teams
- Built-in tool integration for web search, file operations, and more
- Support for both sequential and hierarchical crew structures
- Active community and rapid development cycle
- Memory system (short-term, long-term, entity) built in
- Delegation between agents is native to the framework

**Limitations:**
- Less fine-grained control over execution flow compared to LangGraph
- Hierarchical mode can be unpredictable with complex task sets
- Debugging can be challenging when agents make unexpected delegation choices

**Best for:** Business process automation, content pipelines, research workflows, and any scenario where you can model the work as a team effort.

## LangGraph: The Workflow Engine

LangGraph models workflows as directed graphs with nodes and edges. It excels at complex, stateful workflows with branching logic and human-in-the-loop patterns.

```python
from langgraph.graph import StateGraph, END

workflow = StateGraph(AgentState)
workflow.add_node("classify", classify_input)
workflow.add_node("research", do_research)
workflow.add_node("respond", generate_response)
workflow.add_conditional_edges("classify", route_by_type, {
    "technical": "research",
    "simple": "respond"
})
```

**Strengths:**
- Fine-grained control over execution flow with conditional edges
- Built-in state management and persistence via checkpointers
- Production-ready deployment options through LangGraph Cloud
- Excellent for complex conditional logic with loops and branches
- Human-in-the-loop patterns are first-class citizens
- Streaming support for real-time output

**Limitations:**
- Steeper learning curve — you need to think in graphs
- More boilerplate code for simple workflows
- Agent "personality" is not a built-in concept

**Best for:** Enterprise workflows, approval processes, long-running tasks with checkpoints, and any workflow with complex branching logic.

## AutoGen: The Research Framework

Microsoft''s AutoGen focuses on conversational multi-agent interactions. Agents communicate through messages in a group chat style, making it feel like a Slack channel where AI agents discuss problems.

**Strengths:**
- Flexible conversation patterns between agents
- Good for research and experimentation
- Code execution capabilities built in (agents can write and run code)
- Strong support for human-agent collaboration

**Limitations:**
- Conversations can be hard to control and debug
- Less structured than CrewAI or LangGraph
- Production deployment requires more custom engineering

**Best for:** Research tasks, code generation workflows, exploratory AI applications, and academic use cases.

## LangChain: The Foundation Layer

LangChain is not strictly a multi-agent framework — it is the foundation that LangGraph builds on. It provides chains, tools, memory, and LLM abstractions that many other frameworks use under the hood.

**Strengths:**
- Massive ecosystem of integrations (hundreds of tools and providers)
- Well-documented with extensive tutorials
- Good for simple, linear AI pipelines

**Limitations:**
- Chains are linear by design — no branching, looping, or parallelism
- Not designed for multi-agent coordination
- Can feel over-abstracted for simple tasks

**Best for:** Simple linear pipelines, prototyping, and as a building block for custom systems.

## When to Choose CrewAI

Choose CrewAI when:
- You think about the problem in terms of **team roles** and **task assignments**
- You want to get a working multi-agent system up quickly with minimal boilerplate
- You need **tool integration** out of the box
- The workflow is best modeled as a team completing a project
- You want built-in **memory** and **delegation** without custom code

Choose something else when:
- You need complex branching logic with persistent state (use **LangGraph**)
- You need fine-grained conversation control between agents (use **AutoGen**)
- You are building a simple linear pipeline with no agent collaboration (use **LangChain**)

## A Practical Decision Framework

Ask yourself these questions in order:

1. **Is this a simple linear task?** If yes, use LangChain or even a raw API call. You do not need agents.
2. **Does the task require multiple specialized perspectives?** If yes, continue to step 3.
3. **Can you describe the workflow as a team with roles?** If yes, use CrewAI.
4. **Does the workflow have complex branching, loops, or human-in-the-loop needs?** If yes, use LangGraph.
5. **Is this primarily a research or code-generation task with conversational agents?** If yes, consider AutoGen.

## Common Mistakes When Choosing a Framework

- **Choosing based on hype** rather than fit. The "best" framework is the one that matches your problem.
- **Over-engineering.** If a single LLM call solves your problem, you do not need a multi-agent framework at all.
- **Ignoring the ecosystem.** Consider community size, documentation quality, and update frequency. A well-maintained framework with good docs saves more time than a "better" framework with poor support.
- **Lock-in fear.** The concepts transfer between frameworks. Learning CrewAI well makes it easy to pick up LangGraph later.

## The Bottom Line

CrewAI is the fastest path from idea to working multi-agent system. Its role-based design is intuitive, its ecosystem is mature, and it maps naturally to how businesses think about work. That is why we start here — but throughout this course, you will learn principles that apply to any multi-agent framework.

## Key Takeaways

- CrewAI uses a team metaphor (agents with roles), LangGraph uses a graph metaphor (nodes and edges), AutoGen uses a conversation metaphor (group chat)
- Choose your framework based on the problem structure, not on popularity
- CrewAI is best for team-oriented workflows with clear roles and task assignments
- The concepts you learn in CrewAI transfer directly to other frameworks
- Start with the simplest tool that solves your problem — do not over-engineer'
WHERE module_id = 'bbbb0001-0000-0000-0000-000000000001' AND slug = 'why-crewai-comparing-frameworks';


-- ===== MODULE 2: CrewAI Architecture & Concepts =====

-- Lesson 2.1: Agents, Tasks, and Crews Explained
UPDATE public.lessons
SET content = '# Agents, Tasks, and Crews Explained

CrewAI is built on three core concepts: Agents, Tasks, and Crews. Understanding how they relate — and how to configure each one precisely — is the key to building effective multi-agent systems. This lesson goes deep into each concept with real code examples and design guidance.

## Agents

An Agent in CrewAI represents an autonomous AI entity with a specific role. Think of an agent as a team member you are hiring for a specific job. Each agent is defined by several key properties:

### The Agent Constructor

```python
from crewai import Agent

researcher = Agent(
    role="Senior Research Analyst",
    goal="Produce comprehensive, accurate research reports "
         "backed by verifiable data",
    backstory="You are a veteran analyst with 15 years of experience "
              "at a top consulting firm. You are known for your "
              "meticulous attention to detail and your ability to "
              "synthesize complex information into clear insights. "
              "You always cite your sources.",
    tools=[SerperDevTool(), ScrapeWebsiteTool()],
    llm="anthropic/claude-sonnet-4-20250514",
    verbose=True,
    allow_delegation=False,
    max_iter=5,
    memory=True
)
```

Let us break down each parameter:

- **role** (required): A short title like "Senior Research Analyst" or "Technical Writer." This is how other agents refer to this agent when delegating work.
- **goal** (required): What the agent is trying to achieve. This guides the agent''s decision-making throughout execution.
- **backstory** (required): Context that shapes the agent''s behavior. This is more important than most people realize — it primes the language model to respond in character.
- **tools** (optional): A list of tool instances the agent can use. Only give agents the tools they actually need.
- **llm** (optional): Which language model powers this agent. You can use different models for different agents — a cheaper model for simple tasks, a powerful model for complex reasoning.
- **verbose** (optional): When True, the agent logs its reasoning process. Essential during development.
- **allow_delegation** (optional): When True, the agent can delegate sub-tasks to other agents in the crew. Default is True.
- **max_iter** (optional): Maximum number of reasoning iterations before the agent must produce output. Prevents infinite loops.
- **memory** (optional): When True, the agent retains information across interactions within the same crew execution.

### The Power of Backstory

The backstory is the most underrated part of agent design. Compare these two outputs from agents with different backstories given the same task:

**Weak backstory:** "You are a researcher."
- Output tends to be generic, surface-level, and inconsistent in tone.

**Strong backstory:** "You are a veteran analyst with 15 years of experience at McKinsey. You are known for contrarian thinking — you always look for what the consensus is missing. You structure every analysis with a clear thesis, supporting evidence, and risk factors."
- Output is structured, opinionated, and consistently high quality.

> **Tip:** Write backstories as if you are writing a job posting for a highly specific role. The more detail you provide, the better the agent performs.

## Tasks

A Task is a specific piece of work assigned to an agent. Each task has a clear description, an expected output format, and an assigned agent.

### The Task Constructor

```python
from crewai import Task

research_task = Task(
    description=(
        "Research the topic: {topic}. "
        "Focus on developments from the last 12 months. "
        "Find at least 5 key data points with sources. "
        "Identify the top 3 trends and any contrarian viewpoints."
    ),
    expected_output=(
        "A structured research brief containing:\n"
        "1. Executive summary (3-4 sentences)\n"
        "2. Key findings (5+ bullet points with data)\n"
        "3. Trend analysis (top 3 trends explained)\n"
        "4. Contrarian viewpoints (at least 1)\n"
        "5. Source list with URLs"
    ),
    agent=researcher,
    context=[],  # list of other tasks whose output feeds into this one
    max_retry_limit=2,
    output_file="research_brief.md"
)
```

Key parameters:

- **description** (required): A detailed explanation of what needs to be done. Use `{variable}` placeholders for dynamic input.
- **expected_output** (required): What the result should look like. Be as specific as possible about format, length, and content.
- **agent** (required): Which agent is responsible for this task.
- **context** (optional): A list of other Task objects whose output this task depends on. This is how you create pipelines.
- **max_retry_limit** (optional): How many times CrewAI should retry if the task fails.
- **output_file** (optional): Automatically save the task output to a file.

### Writing Effective Task Descriptions

The task description is your primary lever for controlling output quality. Follow the **SCEQ** formula:

1. **Specific** — Name exactly what needs to be done
2. **Contextual** — Provide domain context and constraints
3. **Explicit** — State the format and structure of the output
4. **Quantified** — Include numbers (word count, number of items, etc.)

## Crews

A Crew is a team of agents working together on a set of tasks. The crew defines the team composition, the work to be done, and the execution strategy.

### The Crew Constructor

```python
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, analyst, writer],
    tasks=[research_task, analysis_task, writing_task],
    process=Process.sequential,
    verbose=True,
    memory=True,
    max_rpm=10,  # rate limit: max 10 requests per minute
    share_crew=False
)

# Execute the crew
result = crew.kickoff(inputs={"topic": "AI in healthcare"})
print(result.raw)        # raw string output
print(result.tokens_used) # token usage stats
```

Key parameters:

- **agents** (required): The list of agents in the crew.
- **tasks** (required): The list of tasks to execute, in order.
- **process** (required): `Process.sequential` or `Process.hierarchical`.
- **verbose** (optional): Enable detailed logging.
- **memory** (optional): Enable crew-level memory.
- **max_rpm** (optional): Rate limiting to avoid hitting API limits.
- **manager_llm** (optional): Required for hierarchical process — specifies the model for the manager agent.

## How They Fit Together

Think of it as an organizational structure:

```
Crew (The Project)
├── Agent: Researcher (Team Member 1)
│   └── Task: Research the topic
├── Agent: Analyst (Team Member 2)
│   └── Task: Analyze the findings
└── Agent: Writer (Team Member 3)
    └── Task: Write the report
```

When you call `crew.kickoff()`, CrewAI orchestrates the agents to complete the tasks according to the process you defined. Agents share context through the task dependency chain, building on each other''s work to produce the final output.

## Common Mistakes and How to Avoid Them

1. **Assigning too many tasks to one agent.** Each agent should own one to two tasks maximum. If an agent has five tasks, split it into multiple agents.
2. **Forgetting the context parameter.** Without `context`, downstream tasks do not receive upstream output. Your pipeline is broken silently.
3. **Vague expected_output.** "A good report" is not helpful. "A 500-word report with 5 sections, each containing 2-3 bullet points" gives the agent a clear target.
4. **Using the wrong process type.** Start with sequential. Only use hierarchical when you genuinely need dynamic task delegation.

## Key Takeaways

- Agents are defined by role, goal, and backstory — invest time in all three
- Tasks need specific descriptions and explicit expected output formats
- Crews coordinate agents and tasks using either sequential or hierarchical processes
- The `context` parameter on tasks creates the data pipeline between agents
- The mental model is: Crew = Project, Agents = Team Members, Tasks = Deliverables'
WHERE module_id = 'bbbb0002-0000-0000-0000-000000000002' AND slug = 'agents-tasks-crews-explained';


-- Lesson 2.2: The CrewAI Execution Model
UPDATE public.lessons
SET content = '# The CrewAI Execution Model

Understanding how CrewAI executes your crew is essential for designing reliable systems and debugging issues when they arise. This lesson takes you through the complete execution lifecycle, memory systems, delegation mechanics, and error handling — everything that happens between `crew.kickoff()` and your final result.

## Sequential Execution

In sequential mode, tasks execute one after another in the order you define them. Each task can access the output of previous tasks through its `context` parameter.

```python
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, analyst, writer],
    tasks=[research_task, analysis_task, writing_task],
    process=Process.sequential,
    verbose=True
)
```

**Execution flow:**
1. Task 1 runs — the researcher agent produces output
2. Task 2 runs — the analyst agent receives Task 1 output via `context=[research_task]`
3. Task 3 runs — the writer agent receives previous outputs via `context=[research_task, analysis_task]`
4. The crew returns the final task''s output

This is the simplest and most predictable execution model. Use it when tasks naturally build on each other — research first, then analysis, then writing.

```python
# Context chaining example
research_task = Task(
    description="Research {topic}",
    expected_output="Research brief with findings",
    agent=researcher
)

analysis_task = Task(
    description="Analyze the research findings",
    expected_output="Analysis with trends and insights",
    agent=analyst,
    context=[research_task]  # receives research output
)

writing_task = Task(
    description="Write a report based on the analysis",
    expected_output="Polished 800-word report",
    agent=writer,
    context=[research_task, analysis_task]  # receives both
)
```

> **Tip:** You can pass multiple tasks in the `context` list. The downstream agent receives all of their outputs, giving it a comprehensive view of the work done so far.

## Hierarchical Execution

In hierarchical mode, a manager agent coordinates the work. The manager reviews the list of tasks, decides which agent should handle each task, delegates work, and reviews results.

```python
crew = Crew(
    agents=[researcher, analyst, writer],
    tasks=[research_task, analysis_task, writing_task],
    process=Process.hierarchical,
    manager_llm="anthropic/claude-sonnet-4-20250514",
    verbose=True
)
```

**How the manager works:**
1. The manager reviews all tasks and available agents
2. It selects the best agent for the first task based on roles and goals
3. It delegates the task and receives the output
4. It evaluates the output quality — if unsatisfactory, it can re-delegate or request revisions
5. It moves to the next task, considering the context from completed tasks
6. This continues until all tasks are complete

**When to use hierarchical mode:**
- The optimal task order depends on intermediate results
- You want built-in quality review between tasks
- The workflow needs to adapt to unexpected findings
- You are willing to pay the extra token cost for the manager''s reasoning

**When to avoid it:**
- The task order is fixed and well-understood
- You need deterministic, reproducible execution
- Cost is a primary concern (the manager adds 20-40% overhead)
- You need to debug step by step

## The Complete Execution Lifecycle

Regardless of process type, every crew execution follows this lifecycle:

### Phase 1: Initialization
```
crew.kickoff(inputs={"topic": "AI trends"})
```
- Input variables are injected into task descriptions (replacing `{topic}`)
- Agents are initialized with their LLM connections
- Tools are validated and made available
- Memory stores are initialized if enabled

### Phase 2: Task Assignment
- **Sequential:** Tasks are queued in the order defined
- **Hierarchical:** The manager agent reviews all tasks and plans execution

### Phase 3: Agent Execution
For each task, the assigned agent:
1. Receives the task description and any context from previous tasks
2. Begins its reasoning loop (called the "ReAct loop")
3. Decides whether to use a tool or reason internally
4. If using a tool, invokes it and incorporates the result
5. Continues reasoning until it has a complete answer
6. Produces output matching the expected_output format

### Phase 4: Tool Invocation
When an agent decides it needs external information:
```
Agent thinks: "I need current data on AI market size"
Agent action: Use SerperDevTool with query "AI market size 2026"
Agent observation: [search results returned]
Agent thinks: "Now I have the data I need to continue"
```

This Thought -> Action -> Observation loop is the core of agent reasoning. The agent can invoke multiple tools in sequence during a single task.

### Phase 5: Context Passing
When a task completes, its output is stored and made available to downstream tasks through the `context` parameter. The context is injected into the next agent''s prompt as additional information.

### Phase 6: Completion
```python
result = crew.kickoff(inputs={"topic": "AI trends"})

# Access the results
print(result.raw)           # final output as string
print(result.tasks_output)  # output from each individual task
print(result.token_usage)   # token consumption breakdown
```

## Memory Systems

CrewAI supports memory at multiple levels, and understanding each type helps you decide when to enable them:

### Short-Term Memory
- Active within a single crew execution
- Stores intermediate results and agent observations
- Automatically managed — no configuration needed
- Enables agents to reference earlier findings within the same run

### Long-Term Memory
- Persists across multiple crew executions
- Stores lessons learned and successful strategies
- Enable with `memory=True` on the Crew
- Uses a local storage backend by default

```python
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.sequential,
    memory=True  # enables long-term memory
)
```

### Entity Memory
- Tracks information about specific entities (people, companies, concepts)
- Builds an entity knowledge graph over time
- Useful for crews that repeatedly work with the same subjects

> **Tip:** Start without memory enabled. Add it only when you notice that your crew would benefit from remembering past executions. Memory increases complexity and storage requirements.

## Delegation Mechanics

When `allow_delegation=True` on an agent, that agent can ask other agents in the crew for help. This is powerful but can lead to unexpected behavior:

```python
researcher = Agent(
    role="Senior Researcher",
    goal="Produce thorough research",
    backstory="...",
    allow_delegation=True  # can ask other agents for help
)
```

**How delegation works:**
1. An agent encounters a sub-problem outside its expertise
2. It reviews the other agents in the crew and their roles
3. It delegates the sub-problem to the most appropriate agent
4. It receives the result and incorporates it into its own work

**Controlling delegation:**
- Set `allow_delegation=False` on agents that should work independently
- In sequential mode, delegation is less common since each agent has a focused task
- In hierarchical mode, the manager handles delegation, so agent-level delegation is usually disabled

## Error Handling

When an agent encounters an error, CrewAI follows this recovery process:

1. **Capture** the error message and context
2. **Pass** the error back to the agent with instructions to try a different approach
3. **Retry** up to the configured `max_retry_limit`
4. **Fail gracefully** if retries are exhausted, returning the best output available

```python
task = Task(
    description="Research the topic...",
    expected_output="A detailed brief...",
    agent=researcher,
    max_retry_limit=3  # try up to 3 times on failure
)
```

## Common Mistakes and How to Avoid Them

1. **Not setting verbose=True during development.** Without verbose logging, you cannot see what agents are thinking or which tools they are using. Always enable it until your crew is stable.
2. **Enabling all memory types from the start.** Memory adds complexity. Get your crew working without memory first, then layer it on.
3. **Allowing delegation everywhere.** Uncontrolled delegation leads to agents passing work around in circles. Be intentional about which agents can delegate.
4. **Ignoring token usage.** Check `result.token_usage` after every run during development. A crew that costs $2 per run will drain your budget fast.

## Key Takeaways

- Sequential mode is predictable and cheap; hierarchical mode is flexible and expensive
- The execution lifecycle has six phases: initialization, assignment, execution, tool use, context passing, completion
- Memory comes in three types (short-term, long-term, entity) — start without it
- Delegation is powerful but must be controlled with `allow_delegation`
- Always check token usage and enable verbose logging during development'
WHERE module_id = 'bbbb0002-0000-0000-0000-000000000002' AND slug = 'crewai-execution-model';


-- ===== MODULE 3: Building Your First Crew =====

-- Lesson 3.1: Setting Up Your Environment
UPDATE public.lessons
SET content = '# Setting Up Your Environment

Before building your first crew, you need a properly configured development environment. This lesson walks you through every step in detail, including common pitfalls and how to resolve them. By the end, you will have a working CrewAI installation ready for development.

## Prerequisites

You will need:

- **Python 3.10 or higher** (CrewAI requires modern Python features including improved type hints)
- **pip** (Python package manager, included with Python)
- **A code editor** (VS Code recommended — it has excellent Python support)
- **An API key** for at least one LLM provider (Anthropic or OpenAI)
- **A terminal** (Terminal.app on macOS, Windows Terminal on Windows, or your editor''s built-in terminal)

### Checking Your Python Version

Open your terminal and run:

```bash
python3 --version
```

You should see `Python 3.10.x` or higher. If you see an older version, you will need to install a newer Python. On macOS, the easiest approach is:

```bash
brew install python@3.12
```

On Windows, download the latest installer from [python.org](https://python.org) and make sure to check "Add to PATH" during installation.

> **Important:** On many systems, `python` points to Python 2.x while `python3` points to Python 3.x. Always use `python3` to be safe, or verify with `python --version`.

## Step 1: Create a Project Directory

Create a new directory for your CrewAI project:

```bash
mkdir my-first-crew
cd my-first-crew
```

A clean directory per project keeps your experiments isolated and makes it easy to share or deploy individual projects later.

## Step 2: Set Up a Virtual Environment

Always use a virtual environment to isolate your project dependencies. This prevents version conflicts between projects and keeps your system Python clean.

```bash
# Create the virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate      # macOS / Linux
# venv\Scripts\activate       # Windows (Command Prompt)
# venv\Scripts\Activate.ps1   # Windows (PowerShell)
```

When activated, you will see `(venv)` at the beginning of your terminal prompt. Every `pip install` command now installs into this isolated environment.

> **Tip:** If you use VS Code, open the project folder and it will often detect the virtual environment automatically. You can also select it manually via the Python interpreter selector in the bottom status bar.

## Step 3: Install CrewAI

Install CrewAI and its recommended extras:

```bash
pip install crewai crewai-tools
```

This installs:
- `crewai` — the core framework (Agent, Task, Crew, Process classes)
- `crewai-tools` — the built-in tool library (web search, file reading, scraping, etc.)

The installation includes several dependencies: `langchain`, `pydantic`, `openai`, `anthropic`, and others. This is normal — CrewAI builds on established libraries.

### Optional: Install Additional Tool Dependencies

Some tools require extra packages:

```bash
# For web search (requires a Serper API key)
pip install google-serper

# For PDF and document processing
pip install pypdf docx2txt

# For code interpretation
pip install jupyter
```

## Step 4: Configure Your API Keys

Create a `.env` file in your project root:

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-key-here
SERPER_API_KEY=your-serper-key-here
```

### Getting API Keys

**Anthropic (Claude):**
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account and add a payment method
3. Navigate to API Keys and create a new key
4. Copy the key — it starts with `sk-ant-`

**OpenAI (GPT-4):**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account and add a payment method
3. Navigate to API Keys and create a new key

**Serper (Web Search):**
1. Go to [serper.dev](https://serper.dev)
2. Create a free account (includes 2,500 free searches)
3. Copy your API key from the dashboard

### Loading API Keys in Your Code

Install `python-dotenv` to load your `.env` file automatically:

```bash
pip install python-dotenv
```

Then in your Python files:

```python
from dotenv import load_dotenv
load_dotenv()  # loads variables from .env into environment

# Now CrewAI will automatically find your API keys
# via the environment variables
```

> **Security warning:** Never commit API keys to version control. Add `.env` to your `.gitignore` file immediately:

```bash
echo ".env" >> .gitignore
```

## Step 5: Create a Project Structure

For anything beyond a quick test, organize your project:

```
my-first-crew/
├── .env                 # API keys (git-ignored)
├── .gitignore           # includes .env
├── requirements.txt     # pip freeze > requirements.txt
├── agents.py            # agent definitions
├── tasks.py             # task definitions
├── crew.py              # crew assembly and execution
└── main.py              # entry point
```

Generate your `requirements.txt` for reproducibility:

```bash
pip freeze > requirements.txt
```

## Step 6: Verify the Installation

Create a file called `test_setup.py`:

```python
"""Verify CrewAI installation and API key configuration."""
from dotenv import load_dotenv
load_dotenv()

import os
from crewai import Agent, Task, Crew, Process

# Check CrewAI imports
print("CrewAI imported successfully!")

# Check API keys
anthropic_key = os.getenv("ANTHROPIC_API_KEY")
openai_key = os.getenv("OPENAI_API_KEY")

if anthropic_key:
    print(f"Anthropic API key found: {anthropic_key[:10]}...")
else:
    print("WARNING: No Anthropic API key found")

if openai_key:
    print(f"OpenAI API key found: {openai_key[:7]}...")
else:
    print("WARNING: No OpenAI API key found")

# Quick smoke test — create an agent (does not call LLM)
test_agent = Agent(
    role="Test Agent",
    goal="Verify installation",
    backstory="You are a test agent."
)
print(f"Agent created: {test_agent.role}")
print("\nSetup complete! You are ready to build your first crew.")
```

Run it:

```bash
python test_setup.py
```

If you see the success messages and your API keys are detected, you are ready to go.

## Using the CrewAI CLI

CrewAI also provides a CLI tool for scaffolding new projects:

```bash
crewai create crew my-project
```

This generates a full project structure with boilerplate code. We will start from scratch in the next lesson so you understand every piece, but the CLI is useful for real projects once you are comfortable with the fundamentals.

## Common Mistakes and How to Avoid Them

1. **Not activating the virtual environment.** If `pip install` puts packages in your system Python, you will have version conflicts. Always check for `(venv)` in your prompt.
2. **Python version mismatch.** CrewAI requires 3.10+. If you get syntax errors about type hints, check your Python version.
3. **Missing `.env` file.** If your crew runs but agents produce empty or error outputs, check that your API keys are loaded. Add a print statement to verify.
4. **Forgetting `load_dotenv()`.** The `.env` file does not load itself. You must call `load_dotenv()` before any CrewAI code runs.
5. **Installing globally.** Never `pip install` without a virtual environment active. It pollutes your system and causes conflicts.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError: No module named ''crewai''` | Activate your virtual environment and run `pip install crewai` |
| `python: command not found` | Use `python3` instead, or fix your PATH |
| `Permission denied` on macOS/Linux | Do NOT use `sudo pip install`. Fix your venv instead |
| API key errors at runtime | Verify `.env` file exists and `load_dotenv()` is called |
| `pydantic` validation errors | Run `pip install --upgrade crewai crewai-tools` |

## Key Takeaways

- Always use a virtual environment for CrewAI projects
- Install both `crewai` and `crewai-tools` packages
- Store API keys in a `.env` file and never commit them to git
- Use `python-dotenv` to load environment variables
- Verify your setup with a smoke test before building crews
- Organize your project with separate files for agents, tasks, and crew assembly'
WHERE module_id = 'bbbb0003-0000-0000-0000-000000000003' AND slug = 'setting-up-your-environment';


-- Lesson 3.2: Hello World: Your First Working Crew
UPDATE public.lessons
SET content = '# Hello World: Your First Working Crew

Time to build something real. In this lesson, you will create a two-agent crew that researches a topic and writes a summary. We will build it step by step, explain every line, and then run it to see your agents collaborate in real time.

## The Plan

We will build a crew with:
- **Research Agent**: Gathers information about a given topic using its training knowledge
- **Writer Agent**: Takes the research and produces a polished summary article

This is the most common multi-agent pattern — a research-then-write pipeline. Once you master this, you can adapt it to dozens of real-world use cases.

## Step 1: Import and Configure

Create a file called `first_crew.py`:

```python
"""My first CrewAI crew: Research and Write pipeline."""
from dotenv import load_dotenv
load_dotenv()

from crewai import Agent, Task, Crew, Process
```

The imports give you the four core classes:
- `Agent` — defines a team member
- `Task` — defines a unit of work
- `Crew` — assembles the team and coordinates execution
- `Process` — specifies how tasks are executed (sequential or hierarchical)

## Step 2: Define the Research Agent

```python
researcher = Agent(
    role="Senior Research Analyst",
    goal="Produce thorough, accurate research on the given topic "
         "with specific facts, statistics, and expert perspectives",
    backstory=(
        "You are a meticulous researcher who has spent 15 years at "
        "a leading think tank. You always verify facts from multiple "
        "angles and you have a talent for finding the most relevant "
        "information quickly. You structure your research as clear "
        "briefs with bullet points and supporting data."
    ),
    verbose=True,
    allow_delegation=False
)
```

**Why these choices:**
- The **role** is specific: "Senior Research Analyst" (not just "Researcher")
- The **goal** mentions specific output characteristics: "specific facts, statistics, and expert perspectives"
- The **backstory** establishes credibility, work style, and output format preferences
- **verbose=True** lets us watch the agent think in the terminal
- **allow_delegation=False** keeps this agent focused on its own task

## Step 3: Define the Writer Agent

```python
writer = Agent(
    role="Content Writer",
    goal="Transform research into clear, engaging, well-structured "
         "articles that a general audience can understand and enjoy",
    backstory=(
        "You are a skilled writer with a background in journalism "
        "and content marketing. You excel at making complex topics "
        "accessible without dumbing them down. You always structure "
        "your articles with a compelling introduction, logical body "
        "sections with clear transitions, and a memorable conclusion."
    ),
    verbose=True,
    allow_delegation=False
)
```

Notice how the writer''s backstory emphasizes **structure** and **accessibility** — qualities we want in the final output.

## Step 4: Define the Tasks

```python
research_task = Task(
    description=(
        "Research the topic: {topic}. "
        "Find key facts, recent developments, important trends, "
        "and notable expert opinions. Focus on information that "
        "would be valuable to someone learning about this topic "
        "for the first time."
    ),
    expected_output=(
        "A detailed research brief containing:\n"
        "- Executive summary (2-3 sentences)\n"
        "- 5 or more key findings with supporting data\n"
        "- Notable trends or patterns\n"
        "- At least 2 expert perspectives or quotes\n"
        "- Areas where more research is needed"
    ),
    agent=researcher
)

write_task = Task(
    description=(
        "Using the research provided, write a comprehensive yet "
        "accessible article about {topic}. The article should "
        "educate and engage a general audience."
    ),
    expected_output=(
        "A well-structured article of 400-600 words with:\n"
        "- An engaging headline\n"
        "- A hook introduction (1-2 sentences)\n"
        "- 3-4 body sections with clear headings\n"
        "- Specific facts and data woven into the narrative\n"
        "- A conclusion with a forward-looking statement"
    ),
    agent=writer,
    context=[research_task]
)
```

**Critical detail:** The `context=[research_task]` on the write task is what creates the pipeline. Without this, the writer would not receive the researcher''s output and would have to write from scratch.

The `{topic}` placeholder will be filled in when we run the crew.

## Step 5: Assemble and Run the Crew

```python
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
    verbose=True
)

# Run the crew with a specific topic
result = crew.kickoff(
    inputs={"topic": "The impact of AI agents on software development in 2026"}
)

# Display results
print("\n" + "=" * 60)
print("FINAL OUTPUT")
print("=" * 60)
print(result.raw)
```

## The Complete File

Here is the full `first_crew.py` for reference:

```python
"""My first CrewAI crew: Research and Write pipeline."""
from dotenv import load_dotenv
load_dotenv()

from crewai import Agent, Task, Crew, Process

# --- Agents ---
researcher = Agent(
    role="Senior Research Analyst",
    goal="Produce thorough, accurate research with facts and data",
    backstory="You are a meticulous researcher at a leading think tank "
              "with 15 years of experience synthesizing complex topics.",
    verbose=True,
    allow_delegation=False
)

writer = Agent(
    role="Content Writer",
    goal="Transform research into clear, engaging articles",
    backstory="You are a journalist turned content writer who makes "
              "complex topics accessible without dumbing them down.",
    verbose=True,
    allow_delegation=False
)

# --- Tasks ---
research_task = Task(
    description="Research the topic: {topic}. Find key facts, trends, "
                "and expert opinions.",
    expected_output="A research brief with executive summary, 5+ key "
                    "findings, trends, and expert perspectives.",
    agent=researcher
)

write_task = Task(
    description="Write a 400-600 word article about {topic} based on "
                "the research provided.",
    expected_output="A well-structured article with headline, intro, "
                    "3-4 body sections, and conclusion.",
    agent=writer,
    context=[research_task]
)

# --- Crew ---
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
    verbose=True
)

result = crew.kickoff(
    inputs={"topic": "The impact of AI agents on software development in 2026"}
)

print("\n" + "=" * 60)
print("FINAL OUTPUT")
print("=" * 60)
print(result.raw)
```

## Running the Crew

Execute it from your terminal:

```bash
python first_crew.py
```

## What Happens When You Run This

Because `verbose=True` is enabled, you will see the agents'' internal reasoning in your terminal:

1. **The researcher** receives the topic and begins reasoning about what information to gather
2. It produces a structured research brief following the expected output format
3. **The writer** receives the research brief as context (via the `context` parameter)
4. It crafts an article that incorporates the research findings
5. The final article is printed to your console

The whole process typically takes 30-60 seconds depending on your LLM provider and model.

## Experimenting with Your Crew

Now that it works, try these modifications to build your intuition:

### Change the Topic
```python
result = crew.kickoff(
    inputs={"topic": "Remote work trends in the post-pandemic world"}
)
```

### Adjust the Expected Output
Make the expected output more or less specific and observe how it changes the result.

### Modify the Backstory
Change the writer''s backstory to "You are a technical writer who writes for software engineers" and see how the tone changes.

### Add a Third Agent
Try adding a reviewer agent that critiques the writer''s output:

```python
reviewer = Agent(
    role="Editorial Reviewer",
    goal="Ensure articles are accurate, engaging, and well-structured",
    backstory="You are a senior editor at a major publication.",
    verbose=True
)

review_task = Task(
    description="Review the article for accuracy, clarity, and engagement. "
                "Provide specific feedback and a final score out of 10.",
    expected_output="A review with: strengths, weaknesses, specific "
                    "suggestions, and a quality score.",
    agent=reviewer,
    context=[write_task]
)
```

## Common Mistakes and How to Avoid Them

1. **Forgetting `load_dotenv()`.** Your crew will fail with API key errors. Always load your `.env` first.
2. **Missing the `context` parameter.** Without it, your agents work in isolation instead of as a pipeline.
3. **Too-generic backstories.** "You are a writer" produces worse output than a detailed backstory. Invest 2 minutes writing a good one.
4. **Not using `verbose=True`.** You cannot debug what you cannot see. Always enable verbose during development.
5. **Running before testing setup.** Run `test_setup.py` first to confirm your environment is working.

## Key Takeaways

- A two-agent research-write pipeline is the foundational CrewAI pattern
- The `context` parameter creates the data flow between tasks
- `{variable}` placeholders in task descriptions are filled by `crew.kickoff(inputs={})`
- `verbose=True` is essential during development for debugging
- Experiment with backstories, expected outputs, and additional agents to build intuition
- Congratulations — you have built your first working multi-agent system'
WHERE module_id = 'bbbb0003-0000-0000-0000-000000000003' AND slug = 'hello-world-first-crew';


-- ===== MODULE 4: Agent Roles & Task Design =====

-- Lesson 4.1: Designing Effective Agent Roles
UPDATE public.lessons
SET content = '# Designing Effective Agent Roles

The quality of your crew depends heavily on how well you design each agent''s role. A vague role produces vague results. A sharply defined role produces focused, high-quality output. This lesson teaches you the principles and patterns for designing agents that consistently deliver excellent work.

## The Three Pillars of Agent Design

Every CrewAI agent is defined by three required fields: role, goal, and backstory. Getting all three right is the difference between a crew that impresses and one that disappoints.

### Pillar 1: Role

The role should be specific and professional. It tells the language model what kind of expert it is:

```python
# Weak — too generic
Agent(role="Writer", ...)

# Strong — specific title that activates domain knowledge
Agent(role="Senior Technical Writer specializing in API documentation", ...)

# Even stronger — includes seniority and domain
Agent(role="Principal Data Scientist with expertise in NLP and transformer architectures", ...)
```

**Why specificity matters:** Language models have been trained on vast amounts of text written by different professionals. When you say "Senior Technical Writer specializing in API documentation," you activate patterns the model learned from actual API documentation. The output reads like real API docs, not generic prose.

### Pillar 2: Goal

The goal should describe the desired **outcome**, not the process:

```python
# Weak — describes process
Agent(goal="Write about things and do research", ...)

# Strong — describes outcome with quality criteria
Agent(
    goal="Produce documentation that enables developers to integrate "
         "our API within 30 minutes, with zero ambiguity in the "
         "instructions and working code examples for every endpoint",
    ...
)
```

Goals give the agent a success criterion it can work toward. The more measurable the goal, the more focused the output.

### Pillar 3: Backstory

The backstory provides context, personality, and expertise level. It is the most underrated part of agent design:

```python
# Weak — no personality or context
Agent(backstory="You write documentation.", ...)

# Strong — rich context that shapes behavior
Agent(
    backstory=(
        "You have spent 12 years writing developer documentation "
        "for companies like Stripe and Twilio. You are known for "
        "three things: crystal-clear code examples that work on "
        "first try, consistent formatting that developers can scan "
        "quickly, and anticipating the questions developers will ask "
        "before they ask them. You believe that if a developer needs "
        "to read a paragraph twice, the writer has failed."
    ),
    ...
)
```

> **Tip:** Write backstories as job descriptions for your ideal hire. What experience do they have? What are they known for? What principles guide their work?

## Real-World Agent Role Examples

Here are complete, production-quality agent definitions for common roles:

### The Research Analyst

```python
research_analyst = Agent(
    role="Senior Research Analyst",
    goal="Produce comprehensive research briefs that surface "
         "non-obvious insights and are backed by verifiable data",
    backstory=(
        "You spent 10 years as a research analyst at McKinsey, where "
        "you were known for three things: finding data others miss, "
        "identifying contrarian angles that challenge conventional "
        "wisdom, and structuring findings so that executives can make "
        "decisions in under 5 minutes of reading. You always cite "
        "sources and distinguish between facts and opinions."
    ),
    tools=[SerperDevTool(), ScrapeWebsiteTool()],
    verbose=True
)
```

### The Code Reviewer

```python
code_reviewer = Agent(
    role="Staff Software Engineer and Code Reviewer",
    goal="Identify bugs, security vulnerabilities, and maintainability "
         "issues in code before they reach production",
    backstory=(
        "You are a staff engineer with 18 years of experience across "
        "startups and FAANG companies. You have reviewed thousands of "
        "pull requests and mentored dozens of engineers. Your reviews "
        "are known for being thorough but kind — you always explain "
        "why something is a problem and suggest a specific fix. You "
        "prioritize: security issues first, correctness second, "
        "maintainability third, style last."
    ),
    verbose=True
)
```

### The Content Strategist

```python
content_strategist = Agent(
    role="Content Strategy Director",
    goal="Create content plans that maximize audience engagement "
         "and organic search visibility",
    backstory=(
        "You led content strategy at HubSpot for 8 years, growing "
        "organic traffic from 500K to 5M monthly visitors. You think "
        "in terms of content clusters, search intent, and audience "
        "journey stages. You always structure content plans with "
        "clear priorities, target keywords, and measurable KPIs."
    ),
    verbose=True
)
```

## Common Role Patterns

These proven patterns can be adapted to almost any domain:

| Pattern | Role | Typical Goal |
|---------|------|-------------|
| **Gatherer** | Research Analyst | Collect and organize information |
| **Analyzer** | Data Analyst | Find patterns and draw conclusions |
| **Creator** | Content Writer | Produce polished deliverables |
| **Reviewer** | Quality Reviewer | Check work for errors and improvements |
| **Planner** | Strategy Director | Create structured plans |
| **Critic** | Devil''s Advocate | Challenge assumptions and find weaknesses |
| **Synthesizer** | Report Writer | Combine multiple inputs into a cohesive output |

## The Complement Principle

The best crews have agents with **complementary** roles. If one agent creates, another should review. If one agent researches, another should analyze. This creates natural quality control:

```python
# Good: complementary roles create checks and balances
researcher = Agent(role="Research Analyst", ...)    # gathers data
critic = Agent(role="Research Critic", ...)         # challenges findings
writer = Agent(role="Technical Writer", ...)        # produces output
editor = Agent(role="Senior Editor", ...)           # reviews output
```

```python
# Bad: overlapping roles cause confusion
researcher1 = Agent(role="Research Analyst", ...)
researcher2 = Agent(role="Research Specialist", ...)  # too similar
writer1 = Agent(role="Content Writer", ...)
writer2 = Agent(role="Article Writer", ...)          # too similar
```

## Anti-Patterns to Avoid

### The Generalist
An agent with a role so broad it does nothing well:
```python
# Avoid this
Agent(role="AI Assistant", goal="Help with everything", ...)
```

### The Clone
Multiple agents with nearly identical roles and goals. If two agents are interchangeable, you only need one.

### The Micromanager
A role description so detailed it constrains creativity. Give agents room to apply their "expertise":
```python
# Too prescriptive — you are writing the output, not the role
Agent(
    backstory="In paragraph 1 you must write exactly 3 sentences. "
              "In paragraph 2 you must use a statistic...",
    ...
)
```

### The Orphan
An agent with no clear connection to other agents in the crew. Every agent should receive input from or provide output to at least one other agent.

## The Iteration Approach

Designing great roles is iterative. Follow this process:

1. **Start simple:** Define the role, goal, and a two-sentence backstory
2. **Run the crew** and evaluate the output
3. **Identify weaknesses:** Is the output too generic? Too verbose? Missing key elements?
4. **Refine the backstory** to address those weaknesses specifically
5. **Repeat** until the output consistently meets your standards

Most agents need two to three iterations to produce great results.

## Common Mistakes and How to Avoid Them

1. **Spending zero time on backstory.** A one-sentence backstory produces mediocre output. Spend five minutes writing a rich one.
2. **Using the same LLM for all agents.** A simple formatting agent does not need Claude Opus. Use cheaper models for simpler tasks.
3. **Identical goal and role.** The role is who the agent IS. The goal is what it is TRYING TO ACHIEVE. They should be different.
4. **Not testing roles in isolation.** Before assembling a crew, test each agent individually with a sample task.

## Key Takeaways

- The three pillars are role (who), goal (what outcome), and backstory (context and personality)
- Specific roles activate domain knowledge in the language model
- Rich backstories are the highest-leverage improvement you can make
- Use complementary roles for natural quality control
- Avoid generalists, clones, micromanagers, and orphan agents
- Design is iterative — expect two to three rounds of refinement per agent'
WHERE module_id = 'bbbb0004-0000-0000-0000-000000000004' AND slug = 'designing-effective-agent-roles';


-- Lesson 4.2: Task Decomposition Strategies
UPDATE public.lessons
SET content = '# Task Decomposition Strategies

The art of multi-agent orchestration is not just designing agents — it is breaking complex work into the right tasks. Poor decomposition leads to confused agents and low-quality output. Excellent decomposition makes even complex workflows reliable and consistent. This lesson teaches you four battle-tested strategies for task decomposition.

## Why Decomposition Matters

A single prompt like "Write a comprehensive market analysis report" might produce acceptable results from a single LLM call. But break it into research, analysis, drafting, and editing tasks assigned to specialized agents, and the quality jumps dramatically.

**The reason:** Each agent can focus deeply on one aspect of the work, and the output of each task serves as a quality checkpoint before the next stage begins.

## The Decomposition Process

Start with the end result and work backwards:

1. **Define the final deliverable**: What does the output look like? Be specific about format, length, and content.
2. **Identify the major phases**: What stages of work produce that deliverable?
3. **Define individual tasks**: What specific work happens in each phase?
4. **Assign to agents**: Which agent is best suited for each task?
5. **Define dependencies**: Which tasks need output from other tasks?

Here is a practical example — decomposing "Create a competitive analysis report":

```
Final Deliverable: A 2000-word competitive analysis report
├── Phase 1: Research → Task: Gather data on 5 competitors
├── Phase 2: Analysis → Task: Compare features, pricing, positioning
├── Phase 3: Drafting → Task: Write the report with charts placeholder
├── Phase 4: Review  → Task: Check accuracy, add missing context
└── Phase 5: Polish  → Task: Final editing and formatting
```

## Strategy 1: Pipeline Decomposition

Break the work into a linear sequence where each step transforms the previous step''s output:

```
Research → Analyze → Draft → Review → Finalize
```

```python
research_task = Task(
    description="Research {topic} — gather key data, trends, statistics",
    expected_output="Structured research brief with 10+ data points",
    agent=researcher
)

analysis_task = Task(
    description="Analyze the research findings. Identify the top 3 "
                "insights and any surprising patterns.",
    expected_output="Analysis summary with ranked insights and evidence",
    agent=analyst,
    context=[research_task]
)

draft_task = Task(
    description="Write a draft report based on the analysis.",
    expected_output="800-word draft report with intro, body, conclusion",
    agent=writer,
    context=[analysis_task]
)

review_task = Task(
    description="Review the draft for accuracy, clarity, and engagement. "
                "Fix any issues directly in the text.",
    expected_output="Polished final report with all issues resolved",
    agent=reviewer,
    context=[draft_task, research_task]  # reviewer sees both
)
```

**Best for:** Content creation, data processing, and report generation.

**Key insight:** The reviewer receives both the draft AND the original research as context. This lets it verify the draft against the source material.

## Strategy 2: Fan-Out / Fan-In

Multiple agents work on different aspects in parallel, then one agent synthesizes:

```python
# Fan-out: three parallel research tasks
market_research = Task(
    description="Research market trends in {industry}",
    expected_output="Market trends brief with data",
    agent=market_researcher
)

competitor_research = Task(
    description="Research top 5 competitors in {industry}",
    expected_output="Competitor profiles with strengths/weaknesses",
    agent=competitor_researcher
)

customer_research = Task(
    description="Research customer sentiment in {industry}",
    expected_output="Customer needs and pain points summary",
    agent=customer_researcher
)

# Fan-in: synthesis task receives all three
synthesis_task = Task(
    description="Synthesize all research into a unified market report. "
                "Cross-reference findings and identify opportunities.",
    expected_output="Comprehensive market report combining all research",
    agent=synthesizer,
    context=[market_research, competitor_research, customer_research]
)
```

**Best for:** Research-heavy tasks where different perspectives add value.

> **Note:** In sequential mode, these "parallel" tasks still execute one at a time. The parallelism is conceptual — each researcher works independently without seeing others'' output. True parallel execution requires custom async code.

## Strategy 3: Iterative Refinement

One agent produces a draft, another critiques it, and the first agent (or a third) revises:

```python
draft_task = Task(
    description="Write a first draft about {topic}",
    expected_output="Draft article, 600-800 words",
    agent=writer
)

critique_task = Task(
    description="Critique the draft. Rate it 1-10 on accuracy, clarity, "
                "and engagement. Provide 3 specific improvements.",
    expected_output="Critique with scores and specific improvement suggestions",
    agent=critic,
    context=[draft_task]
)

revision_task = Task(
    description="Revise the draft based on the critique. Address every "
                "suggestion. The final version should score 8+ on all criteria.",
    expected_output="Revised article incorporating all feedback",
    agent=writer,  # same writer improves their work
    context=[draft_task, critique_task]
)
```

**Best for:** Creative work, copywriting, and any task where quality improves with iteration.

**Warning:** Do not add more than two critique-revise cycles. Beyond that, you get diminishing returns and ballooning costs.

## Strategy 4: Specialist Routing

A coordinator agent examines the input and routes it to the appropriate specialist. This is best implemented with hierarchical process:

```python
crew = Crew(
    agents=[tech_expert, business_analyst, legal_reviewer, coordinator],
    tasks=[classify_task, handle_task, respond_task],
    process=Process.hierarchical,
    manager_llm="anthropic/claude-sonnet-4-20250514"
)
```

**Best for:** Customer support, document classification, multi-domain Q&A systems.

## Writing Effective Task Descriptions

A good task description follows the **SCEQ** formula:

### S — Specific
Name exactly what needs to be done:
```python
# Bad: "Analyze the data"
# Good: "Analyze quarterly revenue data for Q1-Q4 2025"
```

### C — Contextual
Provide domain context:
```python
# Bad: "Write a report"
# Good: "Write a report for the CFO who needs to present to the board next week"
```

### E — Explicit
State the format and structure:
```python
# Bad: "Give me a summary"
# Good: "Provide a 3-section summary: Key Findings (bullet points), Risks (numbered list), Recommendations (prioritized table)"
```

### Q — Quantified
Include numbers:
```python
# Bad: "Research the topic"
# Good: "Research the topic and provide at least 5 data points, 3 expert opinions, and 2 contrarian viewpoints"
```

## Complete Example: Task Description Done Right

```python
task = Task(
    description=(
        "Analyze the provided quarterly sales data for our SaaS product. "
        "Compare Q4 2025 against Q3 2025 and Q4 2024. "
        "Identify the top 3 growth trends, calculate year-over-year "
        "growth rates for each product tier (Starter, Pro, Enterprise), "
        "and flag any anomalies where growth deviates more than 15% "
        "from the historical average. "
        "If data is missing for any tier, note it explicitly rather "
        "than guessing."
    ),
    expected_output=(
        "A structured analysis containing:\n"
        "1. Executive summary (3-4 sentences)\n"
        "2. Growth trends (top 3, ranked by impact)\n"
        "3. YoY growth rates table (by tier)\n"
        "4. Anomalies flagged with severity rating\n"
        "5. Data quality notes (any missing data)\n"
        "Total length: 400-600 words"
    ),
    agent=analyst
)
```

## Common Mistakes and How to Avoid Them

1. **Tasks too large.** If a task description is more than a paragraph, split it into two tasks. Large tasks produce unfocused output.
2. **Tasks too small.** "Capitalize the title" is not a task for an agent. Only create tasks that require reasoning.
3. **Missing dependencies.** If Task B needs Task A''s output, you MUST include `context=[task_a]`. This is the most common source of bad results.
4. **Vague expected_output.** "A good analysis" tells the agent nothing. Specify format, structure, and length.
5. **No quality checkpoint.** Always include at least one review or critique task in workflows with three or more tasks.

## Key Takeaways

- Work backwards from the final deliverable to identify tasks
- Four strategies: pipeline, fan-out/fan-in, iterative refinement, specialist routing
- Pipeline is the most common and easiest to debug — start here
- Task descriptions should follow the SCEQ formula: Specific, Contextual, Explicit, Quantified
- Always define expected_output with format, structure, and length requirements
- Include review tasks as quality checkpoints in longer workflows'
WHERE module_id = 'bbbb0004-0000-0000-0000-000000000004' AND slug = 'task-decomposition-strategies';


-- ===== MODULE 5: Tool Integration & Custom Tools =====

-- Lesson 5.1: Built-in Tools Overview
UPDATE public.lessons
SET content = '# Built-in Tools Overview

Without tools, agents can only work with the knowledge baked into their language model. Tools give agents the ability to interact with the outside world — searching the web, reading files, calling APIs, and more. This lesson covers every major built-in tool, how to configure them, and best practices for tool assignment.

## What Are Tools in CrewAI?

A tool in CrewAI is a function that an agent can call during task execution. When an agent decides it needs external information or capabilities, it invokes a tool, receives the result, and incorporates it into its reasoning.

The agent decides **when** to use a tool based on the task description and its own reasoning. You do not need to explicitly tell the agent "use the search tool now" — it figures that out on its own. Your job is to give the agent the right tools and write a task description that implies when external information is needed.

```python
from crewai import Agent
from crewai_tools import SerperDevTool, ScrapeWebsiteTool

# Agent with tools
researcher = Agent(
    role="Research Analyst",
    goal="Find accurate, up-to-date information",
    backstory="You are a thorough researcher who always uses "
              "multiple sources to verify information.",
    tools=[SerperDevTool(), ScrapeWebsiteTool()],
    verbose=True
)
```

## The crewai-tools Library

The `crewai-tools` package provides ready-to-use tools organized by category:

### Information Gathering Tools

**SerperDevTool** — Search the web using the Serper API:
```python
from crewai_tools import SerperDevTool

search_tool = SerperDevTool()
# Requires SERPER_API_KEY in environment
# Free tier: 2,500 searches
```

The agent calls this when it needs current information not in its training data. It is the most commonly used tool in research-oriented crews.

**ScrapeWebsiteTool** — Extract content from web pages:
```python
from crewai_tools import ScrapeWebsiteTool

scrape_tool = ScrapeWebsiteTool()
# No API key required — uses HTTP requests
```

Useful when the agent finds a relevant URL through search and needs to read the full page content.

**WebsiteSearchTool** — Search within a specific website using RAG:
```python
from crewai_tools import WebsiteSearchTool

# Search within a specific site
docs_tool = WebsiteSearchTool(website="https://docs.crewai.com")
```

Great for agents that need to reference specific documentation.

### File Operations Tools

**FileReadTool** — Read contents of local files:
```python
from crewai_tools import FileReadTool

file_tool = FileReadTool()
# Agent can read any file by providing the path

# Or restrict to a specific file:
report_reader = FileReadTool(file_path="./data/report.txt")
```

**DirectoryReadTool** — List files in a directory:
```python
from crewai_tools import DirectoryReadTool

dir_tool = DirectoryReadTool(directory="./data")
```

**CSVSearchTool** — Search and query CSV files:
```python
from crewai_tools import CSVSearchTool

csv_tool = CSVSearchTool(csv="./data/sales.csv")
# Agent can ask natural language questions about the CSV data
```

### Knowledge & RAG Tools

**PDFSearchTool** — Search within PDF documents:
```python
from crewai_tools import PDFSearchTool

pdf_tool = PDFSearchTool(pdf="./documents/report.pdf")
```

**DOCXSearchTool** — Search within Word documents:
```python
from crewai_tools import DOCXSearchTool

docx_tool = DOCXSearchTool(docx="./documents/brief.docx")
```

These RAG-based tools chunk the document, create embeddings, and let the agent search semantically. They are essential for agents that need to work with long documents.

### Code & Development Tools

**CodeInterpreterTool** — Execute Python code:
```python
from crewai_tools import CodeInterpreterTool

code_tool = CodeInterpreterTool()
# Agent can write and execute Python code
# Useful for data analysis, calculations, chart generation
```

**GithubSearchTool** — Search GitHub repositories:
```python
from crewai_tools import GithubSearchTool

github_tool = GithubSearchTool(
    github_repo="https://github.com/crewAIInc/crewAI",
    content_types=["code", "issue"]
)
```

## Assigning Tools to Agents: Best Practices

### Rule 1: Give Agents Only the Tools They Need

More tools means more decisions the agent must make, which increases the chance of confusion and wrong tool selection:

```python
# Bad: agent has 8 tools and gets confused
researcher = Agent(
    tools=[search, scrape, file_read, csv, pdf, docx, code, github],
    ...
)

# Good: agent has 2 focused tools
researcher = Agent(
    tools=[SerperDevTool(), ScrapeWebsiteTool()],
    ...
)
```

### Rule 2: Match Tools to Roles

A research agent needs search tools. A data analyst needs file reading tools. A writing agent usually needs no tools at all:

```python
researcher = Agent(
    role="Research Analyst",
    tools=[SerperDevTool(), ScrapeWebsiteTool()],  # needs web access
    ...
)

data_analyst = Agent(
    role="Data Analyst",
    tools=[CSVSearchTool(csv="data.csv"), CodeInterpreterTool()],  # needs data
    ...
)

writer = Agent(
    role="Content Writer",
    tools=[],  # works from context, no tools needed
    ...
)
```

### Rule 3: Test Tool Availability First

Some tools require API keys or specific files. Verify before running:

```python
import os

# Check required API keys
assert os.getenv("SERPER_API_KEY"), "Missing SERPER_API_KEY"

# Check required files exist
assert os.path.exists("./data/sales.csv"), "Missing sales.csv"
```

### Rule 4: Consider Cost

Each tool invocation may trigger API calls that cost money:

| Tool | Cost Per Use | Notes |
|------|-------------|-------|
| SerperDevTool | ~$0.001 | Free tier available |
| ScrapeWebsiteTool | Free | HTTP requests only |
| CodeInterpreterTool | Free | Local execution |
| PDFSearchTool | ~$0.001 | Embedding API calls |

Monitor usage during development. An agent that calls search 20 times per task execution can add up quickly.

## How Agents Decide to Use Tools

The decision process follows the ReAct (Reasoning + Acting) pattern:

```
Agent thinks: "I need to find current market size data for AI"
Agent acts:   SerperDevTool("AI market size 2026")
Agent observes: [search results with market data]
Agent thinks: "I found a relevant article, let me get the full content"
Agent acts:   ScrapeWebsiteTool("https://example.com/ai-market-report")
Agent observes: [full article text]
Agent thinks: "Now I have the data I need to write the research brief"
```

The agent reasons about what it needs, uses a tool to get it, observes the result, and continues. This loop repeats until the agent has enough information to produce its output.

## Common Mistakes and How to Avoid Them

1. **Giving every agent every tool.** This creates decision overload. Be selective.
2. **Forgetting API keys.** Your crew will fail mid-execution when a tool cannot authenticate. Check keys before running.
3. **Not testing tools independently.** Before giving a tool to an agent, test it directly:
```python
tool = SerperDevTool()
result = tool.run("test query")
print(result)  # verify it works
```
4. **Using tools for static data.** If the data is in your task description or context, the agent does not need a tool. Tools are for dynamic, external information.
5. **Ignoring tool errors.** When a tool fails, the agent receives an error message. If you see repeated tool failures in verbose output, fix the tool configuration.

## Key Takeaways

- Tools extend agents beyond their training knowledge to interact with external data
- The `crewai-tools` library covers web search, file operations, RAG, and code execution
- Assign only the tools each agent actually needs — less is more
- Match tools to roles: researchers get search, analysts get data tools, writers usually get none
- Always test tools independently before assigning them to agents
- Monitor tool usage costs, especially for search APIs'
WHERE module_id = 'bbbb0005-0000-0000-0000-000000000005' AND slug = 'built-in-tools-overview';


-- Lesson 5.2: Building Custom Tools for Your Agents
UPDATE public.lessons
SET content = '# Building Custom Tools for Your Agents

The built-in tools cover common scenarios, but real-world projects often need custom tools. Need to query your company''s database? Call a proprietary API? Send a Slack message? You will build a custom tool. CrewAI provides two approaches: the class-based `BaseTool` pattern and the simpler `@tool` decorator. This lesson covers both with production-ready examples.

## Approach 1: The @tool Decorator (Quick and Simple)

The fastest way to create a custom tool is with the `@tool` decorator:

```python
from crewai.tools import tool

@tool("Search Company Database")
def search_company_db(query: str) -> str:
    """Searches the internal company database for customer information,
    product data, and order history. Accepts natural language queries."""
    # Your custom logic here
    results = db.execute_search(query)
    return format_results(results)
```

That is it. The function name becomes the tool identifier, the decorator argument is the display name, and the docstring becomes the description that helps the agent decide when to use it.

**Assign it to an agent:**

```python
agent = Agent(
    role="Customer Support Specialist",
    goal="Resolve customer inquiries accurately",
    backstory="...",
    tools=[search_company_db]
)
```

### Multiple Parameters

```python
@tool("Calculate Shipping Cost")
def calculate_shipping(
    weight_kg: float,
    destination_country: str,
    shipping_speed: str = "standard"
) -> str:
    """Calculates shipping cost based on package weight, destination,
    and shipping speed. Speed options: standard, express, overnight."""
    cost = shipping_api.get_quote(weight_kg, destination_country, shipping_speed)
    return f"Shipping cost: ${cost:.2f} for {shipping_speed} to {destination_country}"
```

The agent will understand the parameters from the function signature and docstring and provide appropriate values.

## Approach 2: The BaseTool Class (Full Control)

For more complex tools that need configuration, state, or Pydantic validation, use the class-based approach:

```python
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Type

class DatabaseQueryInput(BaseModel):
    """Input schema for the database query tool."""
    query: str = Field(
        description="Natural language question about customers or orders"
    )
    limit: int = Field(
        default=10,
        description="Maximum number of results to return"
    )

class DatabaseQueryTool(BaseTool):
    name: str = "Company Database Query"
    description: str = (
        "Queries the PostgreSQL customer database. Accepts natural "
        "language questions about customer accounts, order history, "
        "and subscription status. Returns structured data with up to "
        "the specified number of results."
    )
    args_schema: Type[BaseModel] = DatabaseQueryInput

    def _run(self, query: str, limit: int = 10) -> str:
        try:
            results = self.db_client.search(query, limit=limit)
            if not results:
                return "No results found for that query."
            return self._format_results(results)
        except Exception as e:
            return f"Database query failed: {str(e)}. Try rephrasing your query."

    def _format_results(self, results):
        formatted = []
        for r in results:
            formatted.append(f"- {r[''name'']}: {r[''value'']}")
        return "\n".join(formatted)
```

The key components:
- **name**: How the agent refers to this tool in its reasoning
- **description**: Helps the agent understand **when** to use it — this is critically important
- **args_schema**: Defines input parameters using Pydantic, with descriptions for each field
- **_run**: The actual logic that executes when the tool is called

## Real-World Custom Tool Examples

### API Integration Tool

```python
@tool("Send Slack Notification")
def send_slack_notification(channel: str, message: str) -> str:
    """Sends a notification message to a specified Slack channel.
    Use this when a task result needs to be communicated to the team.
    Channel should be the channel name without the # prefix."""
    import requests

    response = requests.post(
        "https://slack.com/api/chat.postMessage",
        headers={"Authorization": f"Bearer {os.getenv(''SLACK_TOKEN'')}"},
        json={"channel": channel, "text": message}
    )

    if response.json().get("ok"):
        return f"Message successfully sent to #{channel}"
    else:
        return f"Failed to send message: {response.json().get(''error'')}"
```

### Data Processing Tool

```python
@tool("Analyze CSV Data")
def analyze_csv(file_path: str, question: str) -> str:
    """Analyzes a CSV file and answers questions about the data.
    Provide the file path and a natural language question.
    Supports questions about sums, averages, trends, and comparisons."""
    import pandas as pd

    try:
        df = pd.read_csv(file_path)
        summary = f"Dataset: {len(df)} rows, {len(df.columns)} columns\n"
        summary += f"Columns: {'', ''.join(df.columns)}\n"
        summary += f"Sample data:\n{df.head(3).to_string()}\n\n"

        # Basic statistics
        numeric_cols = df.select_dtypes(include=[''number'']).columns
        if len(numeric_cols) > 0:
            summary += f"Statistics:\n{df[numeric_cols].describe().to_string()}"

        return summary
    except FileNotFoundError:
        return f"File not found: {file_path}"
    except Exception as e:
        return f"Error analyzing CSV: {str(e)}"
```

### Web API Tool

```python
class WeatherInput(BaseModel):
    city: str = Field(description="City name, e.g. San Francisco")

class WeatherTool(BaseTool):
    name: str = "Get Weather"
    description: str = (
        "Gets the current weather for a given city. Returns "
        "temperature, conditions, and humidity. Use this when "
        "a task requires current weather information."
    )
    args_schema: Type[BaseModel] = WeatherInput

    def _run(self, city: str) -> str:
        import requests
        api_key = os.getenv("WEATHER_API_KEY")
        url = f"https://api.weatherapi.com/v1/current.json?key={api_key}&q={city}"

        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            current = data["current"]
            return (
                f"Weather in {city}: {current[''condition''][''text'']}, "
                f"{current[''temp_c'']}°C, "
                f"Humidity: {current[''humidity'']}%"
            )
        except requests.Timeout:
            return f"Weather API timed out. Try again later."
        except requests.HTTPError as e:
            return f"Weather API error: {str(e)}"
```

## Writing Effective Tool Descriptions

The description is the single most important part of your custom tool. It determines when the agent chooses to use it. Follow these rules:

1. **State what the tool does** in the first sentence
2. **Specify what inputs it accepts** and any constraints
3. **Describe what it returns** so the agent knows what to expect
4. **Mention when to use it** if it is not obvious

```python
# Bad — vague, agent does not know when to use it
description = "A tool for data"

# Good — clear purpose, inputs, outputs, and usage context
description = (
    "Queries the PostgreSQL customer database. Accepts natural "
    "language questions about customer accounts, order history, "
    "and subscription status. Returns structured data as formatted "
    "text. Use this when the task requires specific customer data "
    "that is not available in the task context."
)
```

## Error Handling Best Practices

Your tools should **never** raise unhandled exceptions. An agent that receives a clear error message can adjust its approach. An agent that crashes cannot.

```python
@tool("Fetch Product Info")
def fetch_product(product_id: str) -> str:
    """Fetches detailed product information by ID."""
    try:
        product = api.get_product(product_id)
        if product is None:
            return f"No product found with ID: {product_id}. Verify the ID and try again."
        return f"Product: {product.name}, Price: ${product.price}, Stock: {product.stock}"
    except ConnectionError:
        return "Could not connect to the product API. The service may be down. Proceed with available information."
    except Exception as e:
        return f"Error fetching product: {str(e)}. Try a different approach."
```

**Key pattern:** Always return a string, even on error. Include guidance for the agent in the error message — "Try a different approach" or "Proceed with available information" helps the agent recover gracefully.

## Testing Custom Tools

Always test tools independently before giving them to agents:

```python
# Test the @tool decorator version
result = search_company_db.run("find customer John Smith")
print(result)

# Test the BaseTool class version
tool = DatabaseQueryTool()
result = tool._run(query="recent orders", limit=5)
print(result)
```

Test with:
- **Normal inputs** to verify basic functionality
- **Edge cases** like empty strings, missing data, and invalid inputs
- **Error conditions** like network failures and missing API keys

## Choosing Between @tool and BaseTool

| Feature | @tool Decorator | BaseTool Class |
|---------|----------------|----------------|
| Setup speed | Fast (3-5 lines) | Moderate (15-20 lines) |
| Input validation | Basic (type hints) | Full Pydantic validation |
| Configuration | Via closure variables | Via class attributes |
| Reusability | Limited | Highly reusable |
| Testing | Quick | Thorough |

**Rule of thumb:** Use `@tool` for quick prototypes and simple tools. Use `BaseTool` for production tools that need validation, configuration, or will be shared across crews.

## Common Mistakes and How to Avoid Them

1. **Raising exceptions instead of returning error strings.** Always catch exceptions and return helpful error messages.
2. **Vague descriptions.** The agent cannot use a tool it does not understand. Write descriptions as if explaining the tool to a new team member.
3. **Not testing independently.** A tool bug is much harder to diagnose when it is wrapped in agent reasoning. Test tools in isolation first.
4. **Hardcoding credentials.** Use environment variables for API keys, URLs, and other configuration. Never hardcode secrets.
5. **Returning too much data.** If a tool returns a 10,000-word document, it will eat the agent''s context window. Summarize or paginate large results.

## Key Takeaways

- Use `@tool` decorator for quick, simple tools; use `BaseTool` for production tools with validation
- The tool description is critical — it determines when the agent uses the tool
- Always return strings from tools, even on error; include recovery guidance in error messages
- Test tools independently before assigning them to agents
- Keep returned data concise to preserve the agent''s context window
- Use environment variables for all credentials and configuration'
WHERE module_id = 'bbbb0005-0000-0000-0000-000000000005' AND slug = 'building-custom-tools';


-- ===== MODULE 6: Advanced Crew Patterns =====

-- Lesson 6.1: Hierarchical vs Sequential Crews
UPDATE public.lessons
SET content = '# Hierarchical vs Sequential Crews

Choosing the right process type fundamentally shapes how your crew operates. This lesson goes beyond the basics to give you practical decision frameworks, production configurations, and hybrid patterns that professional orchestrators use in real deployments.

## Sequential Process Deep Dive

In sequential mode, tasks execute in a fixed order. You define the order, and CrewAI follows it exactly. This is the workhorse pattern for most production crews.

```python
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, analyst, writer, editor],
    tasks=[research_task, analysis_task, writing_task, editing_task],
    process=Process.sequential,
    verbose=True
)
```

### How Context Flows in Sequential Mode

The key to sequential crews is understanding context flow. Each task can access the output of any previous task through the `context` parameter:

```python
research_task = Task(
    description="Research {topic}",
    expected_output="Research brief",
    agent=researcher
    # No context — this is the first task
)

analysis_task = Task(
    description="Analyze the research findings",
    expected_output="Analysis with insights",
    agent=analyst,
    context=[research_task]  # sees research output
)

writing_task = Task(
    description="Write article based on analysis",
    expected_output="Draft article",
    agent=writer,
    context=[research_task, analysis_task]  # sees both
)

editing_task = Task(
    description="Edit and polish the article",
    expected_output="Final article",
    agent=editor,
    context=[writing_task]  # only sees the draft
)
```

Notice the editing task only receives the writing task output. It does not need the raw research — it just needs to polish the draft. Being selective about context keeps the agent focused and reduces token usage.

### Sequential Advantages and Disadvantages

**Advantages:**
- **Predictable** — you know exactly what happens and when
- **Debuggable** — if something goes wrong, check the failing task''s output
- **Cost-efficient** — no manager agent consuming tokens
- **Deterministic** — same input produces consistent execution flow
- **Simple** — easy to understand, explain, and maintain

**Disadvantages:**
- **Rigid** — cannot adapt if an early task produces unexpected results
- **No parallelism** — tasks execute one at a time
- **Order-dependent** — you must design the optimal order in advance
- **No dynamic routing** — every execution follows the same path

## Hierarchical Process Deep Dive

In hierarchical mode, a manager agent oversees the crew. The manager reviews tasks, decides which agent should handle each one, reviews output quality, and can re-delegate if needed.

```python
crew = Crew(
    agents=[researcher, analyst, writer, editor],
    tasks=[research_task, analysis_task, writing_task, editing_task],
    process=Process.hierarchical,
    manager_llm="anthropic/claude-sonnet-4-20250514",
    verbose=True
)
```

### How the Manager Works

The manager agent is created automatically by CrewAI. It receives:
1. A list of all agents and their roles/goals
2. A list of all tasks and their descriptions
3. The outputs of completed tasks

For each task, the manager:
1. Evaluates which agent is best suited based on the task description and agent roles
2. Delegates the task to the chosen agent
3. Reviews the output for quality
4. If the output is insufficient, it can request revisions or delegate to a different agent
5. Moves to the next task once satisfied

### Manager LLM Selection

The manager needs to be a strong reasoning model since it makes delegation and quality decisions:

```python
# Good: strong reasoning model for the manager
crew = Crew(
    process=Process.hierarchical,
    manager_llm="anthropic/claude-sonnet-4-20250514"
)

# Also good: use a different provider
crew = Crew(
    process=Process.hierarchical,
    manager_llm="openai/gpt-4o"
)
```

> **Cost consideration:** The manager uses tokens for every delegation decision and quality review. This typically adds 20-40% to total token usage. Use the most cost-effective model that still makes good delegation decisions.

### Hierarchical Advantages and Disadvantages

**Advantages:**
- **Adaptive** — the manager adjusts based on intermediate results
- **Quality control** — built-in output review before moving to next task
- **Dynamic delegation** — the manager can reassign tasks if an agent struggles
- **Handles ambiguity** — the manager can interpret vague requirements
- **Closer to real teams** — mirrors how human managers coordinate work

**Disadvantages:**
- **Less predictable** — the manager''s decisions introduce variability
- **More expensive** — the manager agent uses additional tokens
- **Harder to debug** — the manager''s reasoning may not always be transparent
- **Slower** — extra deliberation time for delegation decisions
- **Manager quality ceiling** — the crew is limited by the manager''s judgment

## The Hybrid Approach

In practice, many production systems use a hybrid approach. You create multiple sequential crews for well-defined sub-workflows, then coordinate them with a hierarchical meta-crew or simple Python logic:

```python
# Sub-crew 1: Research pipeline (sequential, predictable)
research_crew = Crew(
    agents=[web_researcher, data_analyst],
    tasks=[web_research_task, data_analysis_task],
    process=Process.sequential
)

# Sub-crew 2: Content pipeline (sequential, predictable)
content_crew = Crew(
    agents=[writer, editor],
    tasks=[writing_task, editing_task],
    process=Process.sequential
)

# Orchestrate with Python logic
research_result = research_crew.kickoff(inputs={"topic": topic})

# Pass research output to the content crew
content_result = content_crew.kickoff(
    inputs={
        "topic": topic,
        "research": research_result.raw
    }
)
```

This gives you the predictability of sequential mode within each sub-workflow, with the flexibility to add Python logic (conditionals, retries, routing) between crews.

## Decision Framework

Use this practical framework to choose your process type:

### Choose Sequential When:
1. The steps are always the same regardless of input
2. Each step clearly builds on the previous one
3. Cost efficiency is important
4. You need reproducible, debuggable execution
5. The workflow has fewer than 6 tasks

### Choose Hierarchical When:
1. The optimal task order depends on intermediate results
2. You need built-in quality review between tasks
3. Agent selection should be dynamic (different inputs may need different agents)
4. You are willing to pay extra for flexibility
5. The task requires creative problem-solving where the "best" approach is not obvious

### Choose Hybrid When:
1. The workflow has both well-defined and ambiguous sections
2. You need sub-workflows that are independently testable
3. You want to add Python-level control (conditionals, retries, external API calls) between crew executions
4. The overall system is complex (7+ tasks) but has clearly separable phases

## Production Configuration Tips

### Rate Limiting
Prevent hitting API rate limits with `max_rpm`:

```python
crew = Crew(
    agents=[...],
    tasks=[...],
    process=Process.sequential,
    max_rpm=10  # max 10 LLM requests per minute
)
```

### Output Formatting
Use Pydantic models for structured, predictable output:

```python
from pydantic import BaseModel

class ArticleOutput(BaseModel):
    title: str
    summary: str
    body: str
    keywords: list[str]

writing_task = Task(
    description="Write an article about {topic}",
    expected_output="Structured article with title, summary, body, keywords",
    agent=writer,
    output_pydantic=ArticleOutput
)
```

### Execution Callbacks
Monitor crew execution in real time:

```python
def on_task_complete(task_output):
    print(f"Task completed: {task_output.description[:50]}...")
    print(f"Output length: {len(task_output.raw)} chars")

crew = Crew(
    agents=[...],
    tasks=[...],
    process=Process.sequential,
    task_callback=on_task_complete
)
```

## Common Mistakes and How to Avoid Them

1. **Starting with hierarchical.** Always prototype with sequential first. Move to hierarchical only when you have evidence that dynamic delegation improves results.
2. **Using a weak manager LLM.** The manager makes critical decisions. Using a cheap, small model as manager leads to poor delegation choices.
3. **Ignoring cost differences.** Run both process types on the same inputs and compare token usage before choosing for production.
4. **Not logging execution.** In hierarchical mode especially, log the manager''s delegation decisions so you can understand and debug behavior.
5. **Over-coupling tasks.** If every task depends on every previous task, you are passing too much context. Be selective about the `context` parameter.

## Key Takeaways

- Sequential is predictable, cheap, and debuggable — use it for well-understood workflows
- Hierarchical is adaptive, quality-focused, but expensive — use it when flexibility matters
- The hybrid approach combines sequential sub-crews with Python-level orchestration
- Choose your manager LLM carefully — it is the most important model in hierarchical mode
- Start with sequential, measure results, and only switch to hierarchical if needed
- Use rate limiting, output formatting, and callbacks in all production crews'
WHERE module_id = 'bbbb0006-0000-0000-0000-000000000006' AND slug = 'hierarchical-vs-sequential-crews';


-- Lesson 6.2: Error Handling & Retry Patterns
UPDATE public.lessons
SET content = '# Error Handling & Retry Patterns

Production multi-agent systems must handle failures gracefully. LLM outputs are non-deterministic, tools can fail, and external APIs go down. This lesson covers every failure mode you will encounter and gives you battle-tested patterns for building resilient crews that recover automatically.

## Why Error Handling Matters More in Multi-Agent Systems

In a single LLM call, a failure is simple: the call fails, you retry. In a multi-agent system, failures cascade. If the research agent produces bad output, the analyst agent reasons from flawed data, the writer produces an inaccurate article, and the editor cannot fix fundamental errors. One bad link in the chain corrupts everything downstream.

This is why defensive design is not optional — it is the difference between a demo and a production system.

## Common Failure Modes

### 1. LLM Hallucination

The agent produces confident but incorrect information. This is the most dangerous failure because it looks like success.

**Detection strategies:**
```python
# Strategy: Add a fact-checker agent
fact_checker = Agent(
    role="Fact Checker",
    goal="Verify all claims against reliable sources",
    backstory="You are a professional fact-checker who trusts nothing "
              "without verification. You flag any claim that cannot be "
              "confirmed with a source.",
    tools=[SerperDevTool()],
    verbose=True
)

verification_task = Task(
    description=(
        "Verify every factual claim in the provided content. "
        "For each claim, either confirm it with a source URL or "
        "flag it as unverified. If more than 20% of claims are "
        "unverified, recommend rewriting those sections."
    ),
    expected_output=(
        "Verification report:\n"
        "- Verified claims with sources\n"
        "- Unverified claims with notes\n"
        "- Overall accuracy score (percentage verified)\n"
        "- Sections recommended for rewriting"
    ),
    agent=fact_checker,
    context=[writing_task]
)
```

**Prevention strategies:**
- Require citations in task expected outputs
- Use tools to verify claims against real data
- Include specific factual requirements in task descriptions (e.g., "Include only statistics from 2024 or later")

### 2. Tool Failures

External APIs time out, return errors, or produce unexpected responses.

**Handling in custom tools:**
```python
@tool("Search Web")
def search_web(query: str) -> str:
    """Searches the web for current information on any topic."""
    import requests

    try:
        response = requests.get(
            "https://api.serper.dev/search",
            params={"q": query},
            headers={"X-API-KEY": os.getenv("SERPER_API_KEY")},
            timeout=10  # never wait more than 10 seconds
        )
        response.raise_for_status()
        results = response.json().get("organic", [])

        if not results:
            return (
                f"No search results found for: {query}. "
                "Try broadening your search terms or proceed "
                "with your existing knowledge."
            )

        formatted = []
        for r in results[:5]:
            formatted.append(f"- {r[''title'']}: {r[''snippet'']}")
        return "\n".join(formatted)

    except requests.Timeout:
        return (
            "Search timed out. The search service may be slow. "
            "Proceed with your training knowledge and note that "
            "information may not be current."
        )
    except requests.HTTPError as e:
        return f"Search API error ({e.response.status_code}). Proceed with available information."
    except Exception as e:
        return f"Search failed: {str(e)}. Use your training knowledge instead."
```

**Key pattern:** Every error path returns a helpful string with guidance for the agent. Never let a tool raise an unhandled exception.

### 3. Output Format Errors

The agent produces output that does not match the expected format, breaking downstream tasks.

**Solution: Pydantic output validation:**
```python
from pydantic import BaseModel, Field
from typing import List

class ResearchBrief(BaseModel):
    executive_summary: str = Field(description="3-4 sentence summary")
    key_findings: List[str] = Field(description="5+ bullet points")
    trends: List[str] = Field(description="Top 3 trends")
    sources: List[str] = Field(description="Source URLs")

research_task = Task(
    description="Research {topic} thoroughly",
    expected_output="Structured research brief",
    agent=researcher,
    output_pydantic=ResearchBrief
)
```

When you use `output_pydantic`, CrewAI validates the output against the schema. If it does not match, the agent is asked to try again.

### 4. Context Window Overflow

Too much context is passed between tasks, exceeding the model''s limits. This causes truncation or outright failures.

**Mitigation strategies:**

```python
# Strategy 1: Be selective about context
writing_task = Task(
    description="Write an article about {topic}",
    agent=writer,
    context=[analysis_task]  # only the analysis, not raw research
)

# Strategy 2: Add a summarization step
summarize_task = Task(
    description="Summarize the research into a 500-word brief "
                "containing only the most important findings.",
    expected_output="Concise 500-word research summary",
    agent=summarizer,
    context=[research_task]
)

writing_task = Task(
    description="Write an article based on the research summary",
    agent=writer,
    context=[summarize_task]  # compressed context
)
```

**Strategy 3:** Use models with larger context windows for synthesis tasks that need to see many inputs.

### 5. Infinite Loops

An agent with `allow_delegation=True` can delegate to another agent, which delegates back, creating an infinite loop.

**Prevention:**
```python
# Set max iterations to prevent infinite loops
agent = Agent(
    role="Analyst",
    goal="...",
    backstory="...",
    max_iter=10,  # hard limit on reasoning iterations
    allow_delegation=False  # disable if delegation not needed
)
```

## CrewAI Built-in Retry Logic

CrewAI includes automatic retry behavior. When a task fails, CrewAI:
1. Captures the error message
2. Passes the error context back to the agent
3. Tells the agent what went wrong and asks it to try a different approach
4. Repeats up to the configured `max_retry_limit`

```python
task = Task(
    description="Research the latest AI trends using web search",
    expected_output="A detailed research brief with sources",
    agent=researcher,
    max_retry_limit=3  # try up to 3 times on failure
)
```

**How retries work internally:**
```
Attempt 1: Agent tries to use search tool → tool times out
CrewAI: "The previous attempt failed: Search timed out. Try again."
Attempt 2: Agent retries with a different query → success
```

The agent receives the error context, so it can adapt its approach on retry rather than blindly repeating the same action.

## Defensive Task Design

Write task descriptions that anticipate failures and provide fallback instructions:

```python
research_task = Task(
    description=(
        "Research the latest trends in AI orchestration frameworks. "
        "Use web search to find current data and statistics. "
        "\n\n"
        "If web search tools are unavailable or return errors, "
        "use your training knowledge and clearly note that the "
        "information may not reflect the very latest developments. "
        "\n\n"
        "If you cannot find data on a specific subtopic, acknowledge "
        "the gap rather than fabricating information. "
        "\n\n"
        "Prioritize accuracy over comprehensiveness — it is better "
        "to cover 3 topics well than 10 topics poorly."
    ),
    expected_output="Research brief with findings and confidence levels",
    agent=researcher,
    max_retry_limit=2
)
```

This gives the agent a graceful degradation path at every potential failure point.

## Post-Execution Validation

For critical workflows, validate the output after crew execution:

```python
def validate_and_run(crew, inputs, min_length=200, max_retries=2):
    """Run crew with post-execution validation and retry logic."""
    for attempt in range(max_retries + 1):
        result = crew.kickoff(inputs=inputs)

        # Validation checks
        if len(result.raw) < min_length:
            print(f"Attempt {attempt + 1}: Output too short ({len(result.raw)} chars)")
            if attempt < max_retries:
                continue
            else:
                print("WARNING: Max retries reached. Using best available output.")

        if "error" in result.raw.lower() and "unable" in result.raw.lower():
            print(f"Attempt {attempt + 1}: Output contains error indicators")
            if attempt < max_retries:
                continue

        # Passed validation
        return result

    return result  # return last attempt even if validation failed
```

## Logging and Observability

### Development Logging
Always enable verbose mode during development:

```python
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.sequential,
    verbose=True  # see agent reasoning in terminal
)
```

### Production Logging
In production, capture structured logs:

```python
import logging
import time

logger = logging.getLogger("crewai_production")

def run_crew_with_logging(crew, inputs):
    start_time = time.time()
    logger.info(f"Crew started with inputs: {inputs}")

    try:
        result = crew.kickoff(inputs=inputs)
        duration = time.time() - start_time

        logger.info(f"Crew completed in {duration:.1f}s")
        logger.info(f"Output length: {len(result.raw)} chars")
        logger.info(f"Token usage: {result.token_usage}")

        return result

    except Exception as e:
        duration = time.time() - start_time
        logger.error(f"Crew failed after {duration:.1f}s: {str(e)}")
        raise
```

## The Error Handling Checklist

Before deploying any crew to production, verify:

- [ ] All custom tools return strings on error (no unhandled exceptions)
- [ ] Tasks have `max_retry_limit` set (2-3 is typical)
- [ ] Agents have `max_iter` set to prevent infinite loops
- [ ] Task descriptions include fallback instructions
- [ ] Post-execution validation checks output quality
- [ ] Logging captures inputs, outputs, duration, and errors
- [ ] Pydantic models validate structured outputs
- [ ] Context passing is selective (not every task sees every output)

## Common Mistakes and How to Avoid Them

1. **No error handling in custom tools.** Every tool must catch exceptions and return helpful error strings. This is the number one cause of crew failures.
2. **No retry limits.** Without `max_retry_limit`, a failing task will retry indefinitely, burning tokens.
3. **No validation.** Trusting crew output blindly is dangerous. Always validate critical outputs.
4. **Logging too little.** In production, you need to reconstruct what happened when something goes wrong. Log everything.
5. **Not testing failure paths.** Deliberately break your tools (disconnect API, use invalid keys) and verify the crew degrades gracefully.

## Key Takeaways

- Errors in multi-agent systems cascade: one bad task corrupts all downstream tasks
- The five common failure modes are hallucination, tool failures, format errors, context overflow, and infinite loops
- Custom tools must never raise unhandled exceptions — always return error strings with recovery guidance
- Use `max_retry_limit` on tasks and `max_iter` on agents to prevent runaway execution
- Write defensive task descriptions with fallback instructions for every anticipated failure
- Validate outputs after execution and log everything for production observability'
WHERE module_id = 'bbbb0006-0000-0000-0000-000000000006' AND slug = 'error-handling-retry-patterns';


-- ===== MODULE 7: Capstone: Build a Production Crew =====

-- Lesson 7.1: Project Requirements & Architecture
UPDATE public.lessons
SET content = '# Project Requirements & Architecture

Your capstone project is to build a production-quality Content Research and Publishing crew. This is the kind of system companies pay consultants to build — a multi-agent pipeline that turns a topic and audience into a polished, SEO-optimized article. In this lesson, you will learn the business requirements, design the architecture, and make key technical decisions before writing a single line of code.

## The Business Problem

A content marketing team needs to produce high-quality articles consistently. Currently, the process is manual: a researcher gathers information, a writer drafts the article, an editor reviews it, and a publisher formats and distributes it. This takes days per article and the quality varies depending on who is available.

Your crew will automate this entire pipeline, producing consistent quality in under three minutes per article.

## Requirements

### Functional Requirements

1. Accept a **topic** and **target audience** as input
2. **Research** the topic using web search tools and produce a structured brief
3. Produce a **structured outline** based on the research, optimized for the target audience
4. **Write** a draft article (800-1200 words) following the outline
5. **Review** the draft for accuracy, clarity, engagement, and factual correctness
6. Produce a **final polished article** with SEO metadata (title tag, meta description, keywords)

### Non-Functional Requirements

- Complete execution in **under 3 minutes**
- Handle tool failures gracefully (never crash on a search API timeout)
- Produce **consistent quality** across different topics
- Cost less than **$0.50 per article** in API calls
- Code must be **clean, documented, and maintainable**

## Architecture Design

### Agent Roster

You will need five agents, each with a clearly defined role:

**1. Research Director**
```python
research_director = Agent(
    role="Senior Research Director",
    goal="Produce comprehensive research briefs that surface "
         "non-obvious insights backed by verifiable data",
    backstory=(
        "You are a former investigative journalist who spent 10 years "
        "at Reuters before moving into research consulting. You are "
        "known for finding angles that others miss and always "
        "distinguishing between verified facts and speculation. "
        "You structure every brief with an executive summary first, "
        "followed by detailed findings, because busy executives "
        "need the bottom line upfront."
    ),
    tools=[SerperDevTool(), ScrapeWebsiteTool()],
    verbose=True,
    allow_delegation=False
)
```

**2. Content Strategist**
```python
content_strategist = Agent(
    role="Content Strategy Director",
    goal="Create article outlines that maximize reader engagement "
         "and search engine visibility for the target audience",
    backstory=(
        "You led content strategy at a major SaaS company, growing "
        "organic traffic from 200K to 2M monthly visitors over 3 "
        "years. You think in terms of search intent, content "
        "structure, and audience journey stages. Every outline you "
        "create has a clear narrative arc and strategic keyword "
        "placement."
    ),
    verbose=True,
    allow_delegation=False
)
```

**3. Staff Writer**
```python
staff_writer = Agent(
    role="Senior Staff Writer",
    goal="Write engaging, well-structured articles that educate "
         "the target audience while maintaining accuracy",
    backstory=(
        "You are a versatile writer with 8 years of experience "
        "across technology, business, and science journalism. Your "
        "articles are known for clear explanations of complex topics, "
        "engaging openings that hook the reader, and smooth "
        "transitions between sections. You never pad your writing "
        "with filler — every sentence earns its place."
    ),
    verbose=True,
    allow_delegation=False
)
```

**4. Editorial Reviewer**
```python
editorial_reviewer = Agent(
    role="Senior Editorial Reviewer",
    goal="Ensure every article meets publication standards for "
         "accuracy, clarity, engagement, and readability",
    backstory=(
        "You are a veteran editor who has reviewed thousands of "
        "articles. You are known for being thorough but constructive. "
        "You check for: factual accuracy, logical flow, engaging "
        "openings, clear transitions, and a strong conclusion. You "
        "do not just find problems — you fix them directly in the "
        "text. If a paragraph is weak, you rewrite it."
    ),
    verbose=True,
    allow_delegation=False
)
```

**5. SEO Specialist**
```python
seo_specialist = Agent(
    role="SEO Optimization Specialist",
    goal="Optimize content for maximum search engine visibility "
         "without sacrificing readability",
    backstory=(
        "You are an SEO expert who understands both technical SEO "
        "and content optimization. You know that great SEO starts "
        "with great content, and your job is to make sure that "
        "great content is also discoverable. You optimize title tags, "
        "meta descriptions, header structure, and keyword density "
        "while keeping the content natural and reader-friendly."
    ),
    verbose=True,
    allow_delegation=False
)
```

### Task Flow

The pipeline follows the Pipeline Decomposition strategy from Module 4:

```
Research → Outline → Draft → Review → SEO Optimize
```

Each task feeds into the next through context passing:

```python
research_task = Task(
    description=(
        "Research {topic} for an audience of {audience}. "
        "Focus on recent developments, key statistics, "
        "expert opinions, and unique angles. Find at least "
        "5 data points and 3 expert perspectives."
    ),
    expected_output=(
        "A research brief containing:\n"
        "1. Executive summary (3 sentences)\n"
        "2. Key findings (5+ bullet points with data)\n"
        "3. Expert quotes or perspectives (3+)\n"
        "4. Unique angles not widely covered\n"
        "5. Source URLs for verification"
    ),
    agent=research_director,
    max_retry_limit=2
)

outline_task = Task(
    description=(
        "Create a detailed article outline for {topic} targeting "
        "{audience}. The outline should have a compelling narrative "
        "arc and strategic placement of key information."
    ),
    expected_output=(
        "Article outline with:\n"
        "- Headline options (3 variations)\n"
        "- Hook/opening angle\n"
        "- 4-5 main sections with subpoints\n"
        "- Key data points mapped to sections\n"
        "- Suggested word count per section\n"
        "- Target keywords for SEO"
    ),
    agent=content_strategist,
    context=[research_task],
    max_retry_limit=2
)

draft_task = Task(
    description=(
        "Write a draft article following the outline. Target "
        "800-1200 words. Write for {audience} — match their "
        "knowledge level and interests."
    ),
    expected_output=(
        "A complete article draft with:\n"
        "- Engaging headline\n"
        "- Hook introduction (2-3 sentences)\n"
        "- 4-5 body sections with headers\n"
        "- Specific data and examples woven in\n"
        "- Strong conclusion with forward-looking statement\n"
        "- 800-1200 word count"
    ),
    agent=staff_writer,
    context=[research_task, outline_task],
    max_retry_limit=2
)

review_task = Task(
    description=(
        "Review the draft article for accuracy, clarity, "
        "engagement, and readability. Fix any issues directly "
        "in the text — do not just list problems, solve them."
    ),
    expected_output=(
        "A polished article with all issues resolved, plus a "
        "brief review summary noting: what was strong, what was "
        "improved, and a final quality score out of 10."
    ),
    agent=editorial_reviewer,
    context=[draft_task, research_task],
    max_retry_limit=2
)

seo_task = Task(
    description=(
        "Optimize the reviewed article for search engines. "
        "Add SEO metadata and ensure header structure is optimal. "
        "Do not change the core content — only enhance discoverability."
    ),
    expected_output=(
        "Final article with SEO optimization, plus metadata:\n"
        "- SEO title tag (under 60 characters)\n"
        "- Meta description (under 160 characters)\n"
        "- Primary keyword\n"
        "- Secondary keywords (3-5)\n"
        "- Suggested URL slug"
    ),
    agent=seo_specialist,
    context=[review_task],
    max_retry_limit=2
)
```

### Why These Architecture Decisions?

**Sequential process:** The task order is always the same (research before writing, writing before review). There is no ambiguity that would benefit from a hierarchical manager.

**Five agents, five tasks:** Each agent has exactly one task. This keeps agents focused and makes debugging straightforward — if the outline is weak, you know to adjust the content strategist.

**Selective context:** The review task receives both the draft AND the original research so it can verify facts. The SEO task only receives the reviewed article because it does not need raw research data.

**allow_delegation=False:** In a sequential pipeline, delegation adds unpredictability without clear benefit. Each agent should focus on its assigned task.

## Cost Estimation

Estimate token usage for budget planning:

| Task | Est. Input Tokens | Est. Output Tokens | Model |
|------|------------------|-------------------|-------|
| Research | 1,000 | 800 | Claude Sonnet |
| Outline | 1,500 | 600 | Claude Sonnet |
| Draft | 2,500 | 1,500 | Claude Sonnet |
| Review | 3,000 | 1,800 | Claude Sonnet |
| SEO | 2,500 | 500 | Claude Haiku |

**Estimated total:** ~15,000 tokens per article, approximately $0.10-0.30 depending on model pricing.

> **Cost tip:** Use a cheaper, faster model (like Claude Haiku) for the SEO specialist since it is primarily a formatting and tagging task, not a deep reasoning task.

## Evaluation Criteria

Your completed crew will be evaluated on:

1. **Output quality** — Is the article well-written, accurate, and engaging?
2. **Execution reliability** — Does it handle edge cases (obscure topics, tool failures)?
3. **Cost efficiency** — Is token usage reasonable?
4. **Code quality** — Is the code clean, documented, and maintainable?
5. **Error handling** — Does the crew degrade gracefully when things go wrong?

## Common Mistakes and How to Avoid Them

1. **Building all five agents at once.** Build and test incrementally. Start with just the researcher.
2. **Using the same model for every agent.** Match model power to task complexity.
3. **Skipping the outline task.** Without a strategic outline, the writer produces unfocused content. The outline task is the highest-leverage step.
4. **Not including error handling.** Every task needs `max_retry_limit`. Every custom tool needs try/except.
5. **Testing with only one topic.** Test with at least 5 different topics and 3 different audiences to ensure consistency.

## Key Takeaways

- The capstone is a 5-agent Content Research and Publishing pipeline
- Sequential process is the right choice for this well-defined workflow
- Each agent gets exactly one task for clarity and debuggability
- Context passing must be selective — not every task needs every previous output
- Budget token usage by matching model power to task complexity
- Build and test incrementally, not all at once'
WHERE module_id = 'bbbb0007-0000-0000-0000-000000000007' AND slug = 'capstone-requirements-architecture';


-- Lesson 7.2: Implementation Guide & Best Practices
UPDATE public.lessons
SET content = '# Implementation Guide & Best Practices

This final lesson provides the complete roadmap for building your capstone crew, along with production best practices that distinguish a hobby project from a professional deployment. Follow these steps in order, test at every stage, and you will have a production-ready multi-agent system.

## Step 1: Project Setup

Create a dedicated project with proper structure:

```bash
mkdir content-crew && cd content-crew
python3 -m venv venv
source venv/bin/activate
pip install crewai crewai-tools python-dotenv
```

Organize your code into a clean project structure:

```
content-crew/
├── .env                     # API keys (git-ignored)
├── .gitignore               # includes .env, venv/, __pycache__/
├── requirements.txt         # pip freeze > requirements.txt
├── config.py                # centralized configuration
├── agents/
│   ├── __init__.py
│   ├── researcher.py        # Research Director agent
│   ├── strategist.py        # Content Strategist agent
│   ├── writer.py            # Staff Writer agent
│   ├── reviewer.py          # Editorial Reviewer agent
│   └── seo_specialist.py    # SEO Specialist agent
├── tasks/
│   ├── __init__.py
│   ├── research.py          # Research task
│   ├── outline.py           # Outline task
│   ├── draft.py             # Draft writing task
│   ├── review.py            # Review task
│   └── seo.py               # SEO optimization task
├── tools/
│   ├── __init__.py
│   └── custom_tools.py      # any custom tools
├── crew.py                  # crew assembly
├── main.py                  # entry point
└── tests/
    └── test_crew.py         # test suite
```

**Why this structure matters:** Separating agents, tasks, and tools into their own files makes the code maintainable as complexity grows. When you need to adjust the writer, you open `agents/writer.py` — you do not search through a 500-line monolith.

### Configuration Management

Create a `config.py` that centralizes all configurable values:

```python
"""Centralized configuration for the content crew."""
import os
from dotenv import load_dotenv

load_dotenv()

# LLM Configuration
RESEARCH_MODEL = os.getenv("RESEARCH_MODEL", "anthropic/claude-sonnet-4-20250514")
WRITING_MODEL = os.getenv("WRITING_MODEL", "anthropic/claude-sonnet-4-20250514")
SEO_MODEL = os.getenv("SEO_MODEL", "anthropic/claude-haiku-3-20250630")

# Execution Configuration
MAX_RPM = int(os.getenv("MAX_RPM", "10"))
VERBOSE = os.getenv("VERBOSE", "true").lower() == "true"
MAX_RETRY = int(os.getenv("MAX_RETRY", "2"))

# Output Configuration
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "./output")
```

This lets you change models, rate limits, and behavior without modifying code — critical for production deployments where different environments may need different settings.

## Step 2: Build Agents with Precision

Each agent should be in its own file with a detailed backstory. Here is the pattern:

```python
# agents/researcher.py
"""Research Director agent definition."""
from crewai import Agent
from crewai_tools import SerperDevTool, ScrapeWebsiteTool
from config import RESEARCH_MODEL, VERBOSE

def create_research_director() -> Agent:
    """Create and return the Research Director agent."""
    return Agent(
        role="Senior Research Director",
        goal=(
            "Produce comprehensive research briefs that surface "
            "non-obvious insights backed by verifiable data"
        ),
        backstory=(
            "You are a former investigative journalist who spent "
            "10 years at Reuters before moving into research "
            "consulting. You are known for finding angles that "
            "others miss and always distinguishing between verified "
            "facts and speculation. You structure every brief with "
            "an executive summary first, followed by detailed "
            "findings with source citations."
        ),
        tools=[SerperDevTool(), ScrapeWebsiteTool()],
        llm=RESEARCH_MODEL,
        verbose=VERBOSE,
        allow_delegation=False,
        max_iter=10
    )
```

**Key design decisions:**
- Use a factory function (`create_research_director()`) instead of a module-level variable so the agent is created fresh each time
- Import configuration from `config.py` — never hardcode model names or settings
- Set `allow_delegation=False` for all agents in a sequential pipeline
- Set `max_iter=10` as a safety limit against infinite reasoning loops

Repeat this pattern for each of the five agents, adjusting role, goal, backstory, and tools.

## Step 3: Define Tasks with SCEQ

Each task should be in its own file following the SCEQ formula from Module 4:

```python
# tasks/research.py
"""Research task definition."""
from crewai import Task
from config import MAX_RETRY

def create_research_task(agent) -> Task:
    """Create the research task assigned to the given agent."""
    return Task(
        description=(
            "Research {topic} for an audience of {audience}. "
            "Focus on: recent developments (last 12 months), "
            "key statistics and data points, expert opinions, "
            "and unique angles not widely covered. "
            "\n\n"
            "If web search is unavailable, use your training "
            "knowledge and clearly note any information that "
            "may not be current."
        ),
        expected_output=(
            "Structured research brief:\n"
            "1. Executive summary (3 sentences)\n"
            "2. Key findings (5+ bullet points with data)\n"
            "3. Expert perspectives (3+)\n"
            "4. Unique angles (2+)\n"
            "5. Source URLs"
        ),
        agent=agent,
        max_retry_limit=MAX_RETRY
    )
```

## Step 4: Assemble the Crew

```python
# crew.py
"""Content crew assembly and execution."""
from crewai import Crew, Process
from agents.researcher import create_research_director
from agents.strategist import create_content_strategist
from agents.writer import create_staff_writer
from agents.reviewer import create_editorial_reviewer
from agents.seo_specialist import create_seo_specialist
from tasks.research import create_research_task
from tasks.outline import create_outline_task
from tasks.draft import create_draft_task
from tasks.review import create_review_task
from tasks.seo import create_seo_task
from config import MAX_RPM, VERBOSE

def build_content_crew() -> Crew:
    """Build and return the content production crew."""

    # Create agents
    researcher = create_research_director()
    strategist = create_content_strategist()
    writer = create_staff_writer()
    reviewer = create_editorial_reviewer()
    seo = create_seo_specialist()

    # Create tasks with proper context chaining
    research_task = create_research_task(researcher)
    outline_task = create_outline_task(strategist)
    outline_task.context = [research_task]

    draft_task = create_draft_task(writer)
    draft_task.context = [research_task, outline_task]

    review_task = create_review_task(reviewer)
    review_task.context = [draft_task, research_task]

    seo_task = create_seo_task(seo)
    seo_task.context = [review_task]

    return Crew(
        agents=[researcher, strategist, writer, reviewer, seo],
        tasks=[research_task, outline_task, draft_task,
               review_task, seo_task],
        process=Process.sequential,
        verbose=VERBOSE,
        max_rpm=MAX_RPM
    )
```

## Step 5: Create the Entry Point

```python
# main.py
"""Entry point for the content production crew."""
import sys
import time
import logging
from crew import build_content_crew

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run(topic: str, audience: str) -> str:
    """Run the content crew and return the final article."""
    crew = build_content_crew()

    logger.info(f"Starting crew | Topic: {topic} | Audience: {audience}")
    start_time = time.time()

    try:
        result = crew.kickoff(inputs={
            "topic": topic,
            "audience": audience
        })

        duration = time.time() - start_time
        logger.info(f"Crew completed in {duration:.1f}s")
        logger.info(f"Output length: {len(result.raw)} chars")
        logger.info(f"Token usage: {result.token_usage}")

        return result.raw

    except Exception as e:
        duration = time.time() - start_time
        logger.error(f"Crew failed after {duration:.1f}s: {str(e)}")
        raise

if __name__ == "__main__":
    topic = sys.argv[1] if len(sys.argv) > 1 else "AI agents in 2026"
    audience = sys.argv[2] if len(sys.argv) > 2 else "software developers"

    article = run(topic, audience)
    print("\n" + "=" * 60)
    print("FINAL ARTICLE")
    print("=" * 60)
    print(article)
```

Usage:

```bash
python main.py "The future of AI agents" "business executives"
```

## Step 6: Test Incrementally

Do **not** build all five agents and tasks at once. Build and test incrementally:

```python
# Test phase 1: researcher only
from agents.researcher import create_research_director
from tasks.research import create_research_task
from crewai import Crew, Process

researcher = create_research_director()
research_task = create_research_task(researcher)

mini_crew = Crew(
    agents=[researcher],
    tasks=[research_task],
    process=Process.sequential,
    verbose=True
)

result = mini_crew.kickoff(inputs={
    "topic": "AI agents",
    "audience": "developers"
})
print(result.raw)
# Evaluate: Is the research brief comprehensive? Are there 5+ data points?
```

Repeat this for each phase:
1. **Researcher only** — verify research quality
2. **Researcher + Strategist** — verify outline builds on research
3. **Add Writer** — verify article follows outline
4. **Add Reviewer** — verify review catches issues and fixes them
5. **Add SEO Specialist** — verify metadata is correct

This incremental approach makes debugging dramatically easier. If the article quality drops after adding the reviewer, you know exactly where to investigate.

## Production Best Practices

### Output Validation

```python
def validate_output(result) -> dict:
    """Validate crew output meets minimum quality standards."""
    issues = []

    if len(result.raw) < 500:
        issues.append(f"Output too short: {len(result.raw)} chars (min 500)")

    if "SEO title" not in result.raw.lower() and "title tag" not in result.raw.lower():
        issues.append("Missing SEO metadata")

    if result.raw.count("#") < 3:
        issues.append("Insufficient heading structure")

    return {
        "valid": len(issues) == 0,
        "issues": issues,
        "length": len(result.raw)
    }
```

### Cost Monitoring

```python
def log_cost(result):
    """Estimate and log the cost of a crew execution."""
    usage = result.token_usage
    # Approximate cost (adjust for your pricing)
    input_cost = usage.get("total_input_tokens", 0) * 0.000003
    output_cost = usage.get("total_output_tokens", 0) * 0.000015
    total = input_cost + output_cost
    logger.info(f"Estimated cost: ${total:.4f}")
```

### Graceful Error Recovery

```python
def run_with_fallback(topic, audience, max_attempts=2):
    """Run crew with fallback to simpler configuration on failure."""
    for attempt in range(max_attempts):
        try:
            crew = build_content_crew()
            result = crew.kickoff(inputs={
                "topic": topic, "audience": audience
            })
            validation = validate_output(result)
            if validation["valid"]:
                return result
            logger.warning(f"Validation issues: {validation[''issues'']}")
        except Exception as e:
            logger.error(f"Attempt {attempt + 1} failed: {e}")

    # Fallback: simpler crew with fewer agents
    logger.info("Falling back to simplified crew")
    return run_simplified_crew(topic, audience)
```

## Deployment Checklist

Before deploying to production:

- [ ] All API keys are in environment variables, not in code
- [ ] `requirements.txt` is up to date (`pip freeze > requirements.txt`)
- [ ] Every custom tool has error handling (no unhandled exceptions)
- [ ] Every task has `max_retry_limit` set
- [ ] Output validation is in place
- [ ] Logging captures inputs, outputs, duration, cost, and errors
- [ ] Tested with at least 5 different topics
- [ ] Tested with at least 3 different audiences
- [ ] Tested with API keys removed (verifies graceful degradation)
- [ ] Cost per execution is within budget
- [ ] Code is documented and organized in separate files

## What to Build Next

Once your capstone crew is working, consider these extensions:

1. **Add memory** — enable long-term memory so the crew improves over time
2. **Add a human-in-the-loop** — pause after the review task for human approval
3. **Build a web interface** — use FastAPI or Streamlit to create a UI
4. **Add batch processing** — process multiple topics from a CSV file
5. **Integrate with a CMS** — automatically publish articles to WordPress or Ghost
6. **A/B test backstories** — run the same topic with different agent backstories and compare quality

## Common Mistakes and How to Avoid Them

1. **Not testing incrementally.** Build one agent at a time. Debugging a 5-agent crew from scratch is a nightmare.
2. **Hardcoding configuration.** Use `config.py` and environment variables for everything that might change.
3. **Skipping validation.** Always validate crew output before using it downstream.
4. **Ignoring cost.** Monitor token usage from day one. A crew that costs $2 per run adds up fast.
5. **No logging.** When something breaks in production at 3 AM, logs are your only friend.

## Congratulations

Completing this capstone means you can design, build, and deploy production multi-agent systems with CrewAI. You understand agent role design, task decomposition, tool integration, process selection, error handling, and production deployment practices. This is a rare and valuable skill in the AI industry.

## Key Takeaways

- Organize production code with separate files for agents, tasks, tools, and configuration
- Use factory functions and centralized config for flexibility
- Build and test incrementally — one agent at a time
- Validate outputs, monitor costs, and log everything
- Use environment variables for all configuration that might change between environments
- The skills you have learned transfer to any multi-agent framework — CrewAI is just the beginning'
WHERE module_id = 'bbbb0007-0000-0000-0000-000000000007' AND slug = 'capstone-implementation-guide';
