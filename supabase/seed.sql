-- Seed: AI Orchestration Foundations (Free Course)

-- Insert the course
insert into public.courses (id, title, slug, description, thumbnail_url, is_free, price, "order")
values (
  '11111111-1111-1111-1111-111111111111',
  'AI Orchestration Foundations',
  'ai-orchestration-foundations',
  'Your complete introduction to AI Orchestration. Learn the fundamentals of orchestrating AI systems, from prompt engineering to building your first workflows. This free course gives you everything you need to understand the AI Orchestrator role and start building.',
  null,
  true,
  null,
  1
);

-- Module 1: Welcome to AI Orchestration
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0001-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'Welcome to AI Orchestration',
  'welcome-to-ai-orchestration',
  'Get oriented with the world of AI Orchestration and understand why this skill is transforming industries.',
  1
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0001-0000-0000-0000-000000000001', 'What is AI Orchestration?', 'what-is-ai-orchestration', 'text',
'# What is AI Orchestration?

AI Orchestration is the practice of designing, coordinating, and managing multiple AI systems to work together toward a common goal. Think of it like conducting an orchestra — each AI model or agent is an instrument, and the orchestrator ensures they play in harmony.

## Why It Matters

- **Businesses** are adopting AI at unprecedented rates, but most struggle to make different AI tools work together effectively
- **The gap** between having AI tools and getting real value from them is where orchestrators thrive
- **AI Orchestrators** bridge the gap between technical AI capabilities and business outcomes

## What You''ll Learn in This Course

By the end of this course, you''ll understand:
- The AI Orchestrator role and why companies need it
- Core tools and platforms in the AI ecosystem
- How to engineer effective prompts
- How to build your first AI workflow
- Ethical considerations and best practices

Let''s get started!', 1),

('aaaa0001-0000-0000-0000-000000000001', 'The AI Landscape in 2026', 'ai-landscape-2026', 'text',
'# The AI Landscape in 2026

The AI ecosystem has evolved dramatically. Here''s what you need to know about where things stand today.

## Key Trends

### 1. Multi-Model Architectures
No single AI model does everything well. Modern applications use multiple specialized models working together — a language model for text, a vision model for images, a code model for programming.

### 2. Agent-Based Systems
AI agents that can autonomously plan, reason, and execute tasks are becoming mainstream. Frameworks like CrewAI and LangGraph make it possible to build teams of AI agents that collaborate.

### 3. Enterprise Adoption
Companies are moving beyond chatbots. They''re building AI into core business processes — customer support, sales, operations, product development.

### 4. The Orchestration Layer
This is where you come in. Someone needs to design how these systems connect, manage their interactions, and ensure they deliver value. That''s the AI Orchestrator.

## The Opportunity

The demand for people who can orchestrate AI systems far exceeds supply. This isn''t just a technical role — it requires understanding business problems, choosing the right AI tools, and designing systems that deliver measurable results.', 2);

-- Module 2: The AI Orchestrator Role
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0002-0000-0000-0000-000000000002',
  '11111111-1111-1111-1111-111111111111',
  'The AI Orchestrator Role',
  'the-ai-orchestrator-role',
  'Understand what an AI Orchestrator does day-to-day and the skills required to excel in this role.',
  2
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0002-0000-0000-0000-000000000002', 'Day in the Life of an AI Orchestrator', 'day-in-the-life', 'text',
'# Day in the Life of an AI Orchestrator

What does an AI Orchestrator actually do? Let''s walk through a typical day.

## Morning: Strategy & Planning
- Review AI system performance metrics from overnight runs
- Meet with stakeholders to understand new business requirements
- Prioritize which AI workflows need optimization

## Midday: Building & Configuring
- Design new agent workflows for a customer onboarding process
- Configure prompt chains that connect multiple AI models
- Test and iterate on agent behaviors

## Afternoon: Monitoring & Optimizing
- Monitor live AI systems for errors or degraded performance
- Analyze cost vs. output quality across different models
- Document patterns and create reusable templates

## Key Skills
1. **Systems Thinking** — seeing how components connect
2. **Prompt Engineering** — communicating effectively with AI
3. **Technical Literacy** — understanding APIs, data flows, and integrations
4. **Business Acumen** — translating business needs into AI solutions
5. **Communication** — explaining AI capabilities and limitations to non-technical stakeholders', 1),

('aaaa0002-0000-0000-0000-000000000002', 'Career Paths & Opportunities', 'career-paths', 'text',
'# Career Paths & Opportunities

AI Orchestration opens multiple career paths depending on your background and interests.

## Roles

### AI Orchestration Consultant
Work with multiple companies to design and implement AI workflows. High demand, premium rates.

### In-House AI Orchestrator
Join a company''s AI team to manage their AI infrastructure and build internal tools.

### AI Solutions Architect
Design large-scale AI systems for enterprise clients. Combines orchestration with architecture skills.

### AI Coaching & Training
Teach others how to orchestrate AI — in corporate settings or as an independent educator.

## Compensation
AI Orchestrators command premium compensation due to the unique combination of technical and business skills required. Freelance consultants typically charge $150-300/hour.

## Getting Started
The best way to start is to build. This course will give you the foundations, and our advanced courses (CrewAI, LangGraph, AI Communications) will give you specialized, hands-on skills.', 2);

-- Module 3: Tools & Platforms Landscape
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0003-0000-0000-0000-000000000003',
  '11111111-1111-1111-1111-111111111111',
  'Tools & Platforms Landscape',
  'tools-platforms-landscape',
  'Survey the key tools, platforms, and frameworks that AI Orchestrators use daily.',
  3
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0003-0000-0000-0000-000000000003', 'AI Models & Providers', 'ai-models-providers', 'text',
'# AI Models & Providers

Understanding the AI model landscape is essential for any orchestrator. Here''s your guide.

## Large Language Models (LLMs)

### Anthropic Claude
- Best for: Complex reasoning, long documents, coding, safety-conscious applications
- Models: Claude Opus (most capable), Claude Sonnet (balanced), Claude Haiku (fastest)
- Key strength: Large context windows, nuanced understanding

### OpenAI GPT
- Best for: General-purpose text generation, broad knowledge
- Models: GPT-4o, GPT-4o-mini
- Key strength: Versatile, large ecosystem

### Google Gemini
- Best for: Multimodal tasks (text + image + video)
- Models: Gemini Ultra, Pro, Flash
- Key strength: Native multimodal capabilities

### Open Source Models
- Llama, Mistral, DeepSeek
- Best for: Self-hosted deployments, privacy-sensitive applications, cost optimization

## Choosing the Right Model
The orchestrator''s job is to match the right model to the right task. Factors to consider:
- **Capability** — what the task requires
- **Cost** — price per token or API call
- **Speed** — latency requirements
- **Privacy** — data handling requirements
- **Reliability** — uptime and consistency', 1),

('aaaa0003-0000-0000-0000-000000000003', 'Orchestration Frameworks', 'orchestration-frameworks', 'text',
'# Orchestration Frameworks

These are the tools you''ll use to build AI systems that go beyond simple chatbots.

## CrewAI
Build teams of AI agents that collaborate on complex tasks. Each agent has a role, backstory, and set of tools. Great for simulating team workflows.

## LangGraph
Build stateful, multi-step AI workflows as graphs. Excellent for complex decision trees, human-in-the-loop patterns, and production deployments.

## LangChain
The foundational framework for chaining AI model calls together. Good for building pipelines and RAG (Retrieval-Augmented Generation) systems.

## Magpipe
Build AI-powered communication systems — voice agents, chat agents, phone automation, SMS workflows. Essential for customer-facing AI.

## Claude Code / Agentic Coding
Use AI agents for software development — coding, debugging, testing, deployment. The future of software engineering.

## When to Use What
- **Simple chains**: LangChain
- **Complex workflows**: LangGraph
- **Multi-agent teams**: CrewAI
- **Voice/chat agents**: Magpipe
- **Development automation**: Claude Code

Our advanced courses dive deep into CrewAI, LangGraph, and Magpipe.', 2);

-- Module 4: Prompt Engineering Fundamentals
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0004-0000-0000-0000-000000000004',
  '11111111-1111-1111-1111-111111111111',
  'Prompt Engineering Fundamentals',
  'prompt-engineering-fundamentals',
  'Master the art and science of communicating with AI models effectively.',
  4
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0004-0000-0000-0000-000000000004', 'Anatomy of a Great Prompt', 'anatomy-of-great-prompt', 'text',
'# Anatomy of a Great Prompt

Prompt engineering is the foundation of AI orchestration. A well-crafted prompt is the difference between mediocre and exceptional AI output.

## The RACE Framework

### Role
Tell the AI who it is. Context matters.
> "You are a senior data analyst with 10 years of experience in SaaS metrics."

### Action
Be specific about what you want done.
> "Analyze the following monthly revenue data and identify trends."

### Context
Provide relevant background information.
> "This data is from a B2B SaaS company that launched 18 months ago."

### Expectations
Define the output format and quality bar.
> "Provide your analysis in bullet points, highlighting the top 3 insights with supporting data."

## Common Mistakes
1. **Being too vague** — "Help me with marketing" vs "Write 3 email subject lines for a product launch targeting CTOs"
2. **Overloading** — Trying to do too much in one prompt
3. **Missing context** — Not providing enough background for the AI to work with
4. **No format specification** — Not telling the AI how you want the output structured', 1),

('aaaa0004-0000-0000-0000-000000000004', 'Advanced Prompt Techniques', 'advanced-prompt-techniques', 'text',
'# Advanced Prompt Techniques

Once you''ve mastered the basics, these techniques will take your prompts to the next level.

## Chain-of-Thought Prompting
Ask the AI to think step by step. This dramatically improves accuracy for complex tasks.
> "Think through this step by step before giving your final answer."

## Few-Shot Learning
Provide examples of what you want. The AI learns the pattern from your examples.

## System Prompts
Set persistent instructions that shape all subsequent interactions. This is how you configure an AI agent''s personality and behavior.

## Prompt Chaining
Break complex tasks into a series of simpler prompts, where each output feeds into the next input. This is the foundation of AI workflows.

## Meta-Prompting
Use AI to help you write better prompts. Ask: "What additional context would help you give a better answer to this question?"

## Temperature & Parameters
Understanding model parameters:
- **Temperature**: Controls randomness (0 = deterministic, 1 = creative)
- **Max tokens**: Controls response length
- **Top-p**: Controls diversity of word choices

## Practice Exercise
Try rewriting this basic prompt using the techniques above:
**Basic**: "Write me a blog post about AI."
**Your improved version**: Apply RACE framework + chain-of-thought + format specification.', 2);

-- Module 5: Building Your First AI Workflow
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0005-0000-0000-0000-000000000005',
  '11111111-1111-1111-1111-111111111111',
  'Building Your First AI Workflow',
  'building-first-ai-workflow',
  'Get hands-on and build a real AI workflow from scratch.',
  5
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0005-0000-0000-0000-000000000005', 'Workflow Design Principles', 'workflow-design-principles', 'text',
'# Workflow Design Principles

Before you build, you need to think like an architect. Here are the principles that guide effective AI workflow design.

## 1. Start with the Outcome
What business result are you trying to achieve? Work backwards from the desired output.

## 2. Decompose the Problem
Break complex tasks into discrete steps. Each step should have:
- A clear input
- A specific AI operation
- A defined output

## 3. Choose the Right Model for Each Step
Not every step needs the most powerful model. Use fast, cheap models for simple tasks and reserve powerful models for complex reasoning.

## 4. Build in Error Handling
AI outputs are probabilistic. Plan for:
- Unexpected output formats
- Hallucinated information
- Rate limits and API failures

## 5. Human-in-the-Loop
Decide where human review is needed. High-stakes decisions should have human checkpoints.

## 6. Measure Everything
Track:
- Latency per step
- Cost per execution
- Output quality scores
- Error rates

## Example Workflow: Content Pipeline
1. **Research** (Claude) → gather information on a topic
2. **Outline** (Claude) → create structured outline
3. **Draft** (Claude) → write the content
4. **Review** (Human) → approve or request changes
5. **Polish** (Claude) → final editing and formatting
6. **Publish** (Automation) → push to CMS', 1),

('aaaa0005-0000-0000-0000-000000000005', 'Hands-On: Build a Research Agent', 'build-research-agent', 'text',
'# Hands-On: Build a Research Agent

Let''s build a simple but powerful AI workflow — a research agent that can gather, analyze, and summarize information on any topic.

## The Workflow

### Step 1: Define the Research Question
The user provides a topic. The AI breaks it into 3-5 specific research questions.

### Step 2: Gather Information
For each question, the AI searches for relevant information and extracts key facts.

### Step 3: Analyze & Synthesize
The AI cross-references findings, identifies patterns, and resolves contradictions.

### Step 4: Generate Report
A structured report with:
- Executive summary
- Key findings
- Supporting evidence
- Recommendations

## Implementation Approach

```
Input: "Research the impact of AI on customer service in 2026"

→ Step 1: Break into questions
  - What AI tools are being used in customer service?
  - What measurable improvements have companies seen?
  - What are the limitations and challenges?
  - What best practices have emerged?

→ Step 2-3: Research and analyze each question

→ Step 4: Compile into structured report
```

## Key Takeaways
- Workflows are just organized chains of AI calls
- Each step has a clear purpose and output format
- The orchestrator designs the flow, not the individual AI responses
- Start simple, add complexity as needed

In our advanced courses, you''ll build this with CrewAI (multi-agent) and LangGraph (stateful workflows).', 2);

-- Module 6: AI Ethics & Responsible Use
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0006-0000-0000-0000-000000000006',
  '11111111-1111-1111-1111-111111111111',
  'AI Ethics & Responsible Use',
  'ai-ethics-responsible-use',
  'Understand the ethical considerations and responsibilities that come with orchestrating AI systems.',
  6
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0006-0000-0000-0000-000000000006', 'Ethics for AI Orchestrators', 'ethics-for-orchestrators', 'text',
'# Ethics for AI Orchestrators

As an AI Orchestrator, you have significant influence over how AI impacts people. That comes with responsibility.

## Core Principles

### 1. Transparency
Users should know when they''re interacting with AI. Don''t disguise AI as human. Be upfront about AI''s role in any process.

### 2. Bias Awareness
AI models reflect biases in their training data. As an orchestrator, you must:
- Test for biased outputs across different demographics
- Design workflows that include bias checks
- Choose diverse training data when fine-tuning

### 3. Privacy & Data Protection
- Never send sensitive personal data to AI models without explicit consent
- Understand where data is stored and processed
- Use local/self-hosted models for sensitive information
- Comply with GDPR, CCPA, and other regulations

### 4. Accountability
When an AI system makes a mistake, the orchestrator is responsible. You designed the workflow, chose the models, and set the parameters.

### 5. Human Oversight
Critical decisions should always have human review. AI should augment human judgment, not replace it entirely.

## Red Lines
Some applications of AI are simply not ethical:
- Deceptive content that harms people
- Surveillance without consent
- Discriminatory decision-making
- Manipulation of vulnerable populations', 1),

('aaaa0006-0000-0000-0000-000000000006', 'Building Responsible AI Systems', 'building-responsible-systems', 'text',
'# Building Responsible AI Systems

Practical steps to build AI systems you can be proud of.

## Safety by Design

### Input Validation
Always validate and sanitize inputs before passing them to AI models. Prevent prompt injection attacks.

### Output Filtering
Review AI outputs before they reach end users. Implement content filters for harmful or inappropriate content.

### Rate Limiting
Prevent abuse by limiting how frequently AI systems can be called.

### Audit Trails
Log all AI interactions for review. This helps with debugging, compliance, and accountability.

## Testing for Fairness
- Test your workflows with diverse inputs
- Check for consistent quality across different user groups
- Have diverse teams review AI outputs

## Cost Consciousness
AI APIs cost money. Responsible orchestration means:
- Not wasting compute on unnecessary calls
- Choosing appropriately-sized models for each task
- Setting budgets and alerts

## Staying Current
The AI ethics landscape evolves rapidly. Stay informed by:
- Following AI safety research (Anthropic, DeepMind, etc.)
- Joining professional communities
- Updating your practices as new guidelines emerge

## Your Commitment
As a graduate of AI Orchestrator Academy, you commit to building AI systems that are transparent, fair, safe, and beneficial. This isn''t just good ethics — it''s good business.', 2);

-- Module 7: Next Steps
insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'aaaa0007-0000-0000-0000-000000000007',
  '11111111-1111-1111-1111-111111111111',
  'Next Steps: Your Orchestration Journey',
  'next-steps-your-journey',
  'Chart your path forward with advanced courses, certification, and career opportunities.',
  7
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('aaaa0007-0000-0000-0000-000000000007', 'What You''ve Learned', 'what-youve-learned', 'text',
'# What You''ve Learned

Congratulations! You''ve completed AI Orchestration Foundations. Let''s recap what you now know.

## Your New Skills

### Understanding the Landscape
You know the major AI models, providers, and when to use each one. You understand the AI Orchestrator role and its career potential.

### Prompt Engineering
You can craft effective prompts using the RACE framework, chain-of-thought prompting, few-shot learning, and other advanced techniques.

### Workflow Design
You understand how to decompose problems, design multi-step AI workflows, and build systems that deliver real business value.

### Tools & Frameworks
You know about CrewAI, LangGraph, Magpipe, and other orchestration frameworks — and when to use each one.

### Ethics & Responsibility
You understand the ethical considerations of AI orchestration and are committed to building responsible systems.

## You''re Ready For More
This foundation prepares you for our advanced courses where you''ll get hands-on with real tools and build production-ready systems.', 1),

('aaaa0007-0000-0000-0000-000000000007', 'Advanced Courses & Certification', 'advanced-courses-certification', 'text',
'# Advanced Courses & Certification

Ready to level up? Here''s what''s next.

## Advanced Courses

### CrewAI Mastery
Build multi-agent AI teams that collaborate on complex tasks. You''ll build production crews with custom tools, role-based agents, and advanced coordination patterns. **7 modules + capstone project.**

### LangGraph Advanced
Master stateful, multi-step AI workflows. Learn graph-based workflow design, state management, branching logic, human-in-the-loop patterns, and production deployment. **7 modules + capstone project.**

### AI Communications with Magpipe
Build AI-powered voice and chat agents. Learn to create phone automation, SMS workflows, and intelligent conversational agents. You''ll interact with live AI agents during lessons. **9 modules + capstone project.**

## Certification
Complete any advanced course and pass the final assessment to earn a verifiable AI Orchestrator certificate. Share it on LinkedIn, add it to your portfolio, and stand out to employers.

## Job Board
Certified graduates get access to our Job Board where companies looking for AI Orchestrators can find and hire you. Set your rates, showcase your skills, and start consulting.

## Community
Join a community of AI Orchestrators sharing knowledge, opportunities, and support.

## Start Your Next Course
Head to the course catalog to enroll in an advanced course and take the next step in your AI Orchestrator journey.

**The future belongs to orchestrators. You''re now one of them.**', 2);

-- Seed placeholder premium courses (locked)
insert into public.courses (title, slug, description, is_free, price, "order") values
('CrewAI Mastery', 'crewai-mastery', 'Build production multi-agent AI teams with CrewAI. Learn agent roles, task design, custom tools, and advanced coordination patterns through hands-on projects and a capstone.', false, 29.00, 2),
('LangGraph Advanced', 'langgraph-advanced', 'Master stateful, multi-step AI workflows with LangGraph. Cover graph design, state management, branching logic, human-in-the-loop patterns, and production deployment.', false, 29.00, 3),
('AI Communications with Magpipe', 'ai-communications-magpipe', 'Build AI-powered voice and chat agents with Magpipe. Create phone automation, SMS workflows, and intelligent conversational agents. Interact with live AI agents during lessons.', false, 29.00, 4);
