-- Seed: Supercharging Context & Memory (7 modules, 14 lessons)
-- Premium course ($29/mo) — Karpathy LLM Wiki + AI 2027 + Obsidian

-- ============================================================================
-- COURSE: Supercharging Context & Memory
-- ============================================================================

-- Create the course
insert into public.courses (title, slug, description, is_free, price, "order") values
('Supercharging Context & Memory', 'supercharging-context-memory', 'Turn your AI from a forgetful assistant into a compounding knowledge engine. Build LLM-powered knowledge bases using Karpathy''s wiki pattern, Obsidian, and Claude Code — so every conversation makes your AI smarter.', false, 29.00, 5);

-- ============================================================================
-- Module 1: The Context Bottleneck
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'eeee0001-0000-0000-0000-000000000001',
  (select id from public.courses where slug = 'supercharging-context-memory'),
  'The Context Bottleneck',
  'the-context-bottleneck',
  'Why AI forgets everything between sessions, and why solving this is the single biggest unlock for orchestrators.',
  1
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('eeee0001-0000-0000-0000-000000000001', 'The Smart New Hire Problem', 'the-smart-new-hire-problem', 'text',
'# The Smart New Hire Problem

GPT-4 has the raw intelligence to do a significant portion of many people''s jobs. But it is like a brilliant new hire who just walked in the door five minutes ago — no context about your company, your codebase, your decisions, your customers, or your history. A smart new hire is not very useful five minutes after arriving. But give them a month of context, and they become indispensable.

This is the core problem every AI orchestrator faces: **your AI is stateless**. Every conversation starts from zero. Every context window gets wiped. Every insight you built up in the last session is gone.

## What AI 2027 Tells Us

Leopold Aschenbrenner''s influential analysis argues that AGI could arrive as early as 2027. But raw intelligence is not the bottleneck — context is. The models are already smart enough. What transforms them from passive assistants into active agents is persistent context, memory, and the ability to build on previous work.

Think about the difference between a tool you use once (a calculator) and a system that learns your business (a senior employee). The gap is not intelligence — it is accumulated context.

## The Three Memory Problems

### 1. Session Memory — Vanishes After Every Chat
You spend 30 minutes explaining your project architecture to Claude. You close the tab. Next session, it knows nothing. All that context work is gone.

### 2. Project Memory — Scattered Across Files
Your project has a README, a CLAUDE.md, some docs, Slack threads, design decisions, and learned lessons. But this knowledge lives in fragments across different systems. No AI can see the full picture.

### 3. Compounding Memory — Nothing Builds on Itself
The most insidious problem. Traditional RAG retrieves information at query time, but nothing accumulates. Each query is independent. You never get the compounding effect where today''s research builds on yesterday''s insights.

## Why This Course Exists

This course teaches you to solve all three problems. You will build a system where:

- Every conversation adds to a persistent knowledge base
- Your AI reads from structured, interlinked context — not scattered files
- Knowledge compounds over time — each session makes the next one better
- You own everything as plain markdown files with zero vendor lock-in

The tools: Karpathy''s LLM Wiki pattern, Obsidian for visual knowledge management, and Claude Code as the engine that reads, writes, and maintains your knowledge base.

By the end of this course, your AI will not be a forgetful assistant. It will be a compounding knowledge engine that gets smarter every day you use it.', 1),

('eeee0001-0000-0000-0000-000000000001', 'From Assistants to Agents: The Memory Gap', 'from-assistants-to-agents', 'text',
'# From Assistants to Agents: The Memory Gap

The difference between a chatbot and an agent is not intelligence — it is state. A chatbot answers questions. An agent pursues goals, maintains context across sessions, and takes actions based on accumulated knowledge. The bridge between them is memory.

## The Agent Evolution

AI capabilities are evolving rapidly. In 2025, we got stumbling agents — specialized coding tools that could complete simple tasks. By 2026, AI research accelerated with systems that could automate portions of their own development. The trend is clear: agents are becoming more capable, and the bottleneck is shifting from raw intelligence to context management.

When you give an AI tools, context, and memory, it transforms from passively responding to prompts into actively pursuing goals. It stops being an assistant and starts being an employee.

## Why Context Windows Are Not Enough

Claude supports 200,000 tokens — roughly 150,000 words. That sounds like a lot, until you realize:

- A medium codebase is 500,000+ tokens
- A year of project decisions, meeting notes, and Slack threads easily exceeds 1 million tokens
- Context windows are ephemeral — they reset every session

Even if context windows grew to 10 million tokens, you would still face the fundamental problem: **how do you decide what goes into the window?** Raw documents are noisy. You need curated, structured, pre-synthesized context.

## The Neuralese Insight

One fascinating insight from AI research: language is actually a bottleneck for AI reasoning. Each token of text carries about 16.6 bits of information, while the model''s internal state carries thousands of floating-point numbers — roughly 1,000 times more information density.

What this means practically: when you force an AI to reason purely through text (chain-of-thought), you are constraining it to a low-bandwidth channel. But when you give it pre-structured context — synthesized summaries, entity pages, cross-referenced knowledge — you are doing the heavy cognitive work upfront, freeing the model to reason at its full capacity.

This is exactly what a well-maintained knowledge base does. Instead of the AI re-deriving understanding from raw documents every session, it reads pre-compiled knowledge that has already been synthesized, cross-referenced, and validated.

## The Compounding Effect

Here is the key mental model: **treat your AI knowledge base like a codebase, not a chat history.**

Chat history is linear and disposable. A codebase is structured, versioned, and compounds over time. Every commit makes the codebase more capable. Every merged PR adds functionality that future PRs can build on.

Your knowledge base should work the same way:
- Every research session adds synthesized wiki pages
- Every project adds entity pages and lessons learned
- Every question and answer gets filed back as a permanent page
- Cross-references are maintained so knowledge connects to related knowledge

The result is a system where your AI is not starting from scratch — it is building on everything you have ever worked on together.

## What This Looks Like in Practice

Imagine opening Claude Code and saying: "Based on everything we know about our competitor landscape, our Q3 metrics, and the customer feedback from last month, draft a product strategy for Q4."

With a standard AI, this is impossible — it has no context.

With a well-maintained knowledge base, the AI reads the competitor analysis pages, the Q3 metrics summary, the customer feedback synthesis, follows the cross-references between them, and produces a strategy grounded in your actual data.

That is the difference memory makes. And that is what you are building in this course.', 2);

-- ============================================================================
-- Module 2: Karpathy''s LLM Wiki Pattern
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'eeee0002-0000-0000-0000-000000000002',
  (select id from public.courses where slug = 'supercharging-context-memory'),
  'Karpathy''s LLM Wiki Pattern',
  'karpathys-llm-wiki-pattern',
  'The three-layer architecture that turns raw documents into a self-maintaining, interlinked knowledge base.',
  2
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('eeee0002-0000-0000-0000-000000000002', 'The Three-Layer Architecture', 'the-three-layer-architecture', 'text',
'# The Three-Layer Architecture

Andrej Karpathy — former Director of AI at Tesla, co-founder of OpenAI — described an approach to personal knowledge management that is replacing RAG for many orchestrators. Instead of embedding documents and doing similarity search at query time, you treat the LLM as a compiler that reads raw sources and produces a structured, interlinked wiki.

## The Three Layers

### Layer 1: Raw Sources (Immutable)
The raw layer is your source of truth. Papers, articles, code snippets, screenshots, meeting notes, datasets — anything you want to remember. The LLM reads from this layer but **never modifies it**. You just drop files in and forget about organizing them.

```
raw/
  papers/
    attention-is-all-you-need.pdf
    scaling-laws.pdf
  articles/
    ai-2027-summary.md
  code/
    mcp-server-example/
  notes/
    q3-retro.md
    customer-feedback-march.md
```

The raw folder is append-only. You never delete, rename, or reorganize. It is a dump of everything that matters.

### Layer 2: The Wiki (LLM-Maintained)
This is where the magic happens. The wiki is a directory of LLM-generated markdown files: summaries, entity pages, concept pages, comparisons, syntheses, and an overview. The LLM owns this layer completely — it creates and maintains all content.

```
wiki/
  index.md              # Catalog of every page
  log.md                # Append-only activity log
  concepts/
    attention-mechanism.md
    scaling-laws.md
    context-windows.md
  entities/
    openai.md
    anthropic.md
    karpathy.md
  projects/
    q3-product-strategy.md
  syntheses/
    rag-vs-wiki-comparison.md
    ai-timeline-analysis.md
```

Each wiki page is dense, cross-referenced, and maintained. When you ingest a new paper about attention mechanisms, the LLM does not just create a summary — it updates the existing attention-mechanism.md page, adds cross-references to related pages, updates the index, and logs the change.

### Layer 3: The Schema (Configuration)
A single document (like CLAUDE.md) that tells the LLM how the wiki is structured, what conventions to follow, and what workflows to execute. This is the rulebook.

```markdown
# Wiki Schema

## Structure
- One page per concept, entity, or synthesis
- Pages use wikilinks: [[concept-name]]
- Every page has a one-line summary at the top
- Cross-references go in a ## Related section at the bottom

## Workflows
- ingest: read source → summarize → update wiki pages → update index → log
- query: search wiki → synthesize answer → optionally file answer as new page
- lint: check for contradictions, stale claims, orphaned pages, missing links
```

## Why This Beats RAG

RAG (Retrieval-Augmented Generation) is stateless. Each query independently searches a vector database, retrieves chunks, and generates a response. Nothing compounds. Query the same topic 100 times and the 100th query is no better than the first.

The LLM Wiki is stateful. Every ingest enriches the wiki. Every query can produce new pages. Every lint pass improves consistency. The knowledge base gets better over time — like a codebase that improves with every commit.

## The Compiler Analogy

Think of the LLM as a compiler:
- **Source code** = your raw documents
- **Compiled output** = the wiki
- **Build configuration** = the schema

Just like a compiler transforms messy source code into optimized machine code, the LLM transforms scattered raw documents into structured, interlinked, queryable knowledge. And just like recompiling after a code change only updates what changed, re-ingesting a new source only updates the relevant wiki pages.', 1),

('eeee0002-0000-0000-0000-000000000002', 'Ingest, Query, and Lint Workflows', 'ingest-query-lint-workflows', 'text',
'# Ingest, Query, and Lint Workflows

The LLM Wiki is not a static collection of files — it is an active system maintained by three core workflows. Understanding these workflows is how you turn a pile of markdown into a living knowledge base.

## The Ingest Workflow

When you add a new source document, the LLM performs a multi-step process:

1. **Read the source** — The LLM reads the full raw document
2. **Discuss key takeaways** — Optionally, the LLM highlights what is new or surprising before writing
3. **Write a summary page** — Creates a new wiki page summarizing the source
4. **Update the index** — Adds the new page to index.md with a one-line description
5. **Update related pages** — This is critical. A single source typically affects 10-15 existing wiki pages. New information about attention mechanisms? The LLM updates the attention page, the transformer page, the scaling laws page, and any entity pages for researchers mentioned.
6. **Log the change** — Appends an entry to log.md with timestamp and what changed

The multi-page update step is what makes this different from a simple summarizer. The wiki is interconnected — new knowledge ripples through the entire graph.

### Ingest Example

You drop a new research paper into `raw/papers/`. Then:

```
> ingest raw/papers/context-length-study-2026.pdf

Reading source... 47 pages, ~28,000 words
Key takeaways:
  - Context windows beyond 500K tokens show diminishing returns
  - Structured context (wiki-style) outperforms raw context by 3.2x
  - Cross-referenced knowledge reduces hallucination by 40%

Creating: wiki/concepts/context-length-diminishing-returns.md
Updating: wiki/concepts/context-windows.md (added new research findings)
Updating: wiki/concepts/rag-limitations.md (added comparison data)
Updating: wiki/entities/anthropic.md (added context window research)
Updating: wiki/index.md (added new page)
Logging: [2026-04-09] ingest | Context Length Study 2026
```

## The Query Workflow

Querying the wiki is more powerful than querying raw documents because the knowledge has already been synthesized:

1. **Search relevant pages** — The LLM identifies which wiki pages are relevant to your question
2. **Read and cross-reference** — Follows links between pages to build a complete picture
3. **Synthesize an answer** — Produces a response grounded in your curated knowledge
4. **Optionally file back** — Good answers can become new wiki pages

### Query Example

```
> What do we know about how context structure affects AI performance?

Searching wiki... found 4 relevant pages
  - context-windows.md
  - context-length-diminishing-returns.md
  - rag-vs-wiki-comparison.md
  - structured-context-benefits.md

Answer:
Based on our knowledge base, structured context (wiki-style) consistently
outperforms raw context injection by 2.5-3.2x on reasoning tasks...
[detailed answer with citations to wiki pages]

File this answer as a wiki page? (y/n)
```

The critical insight: good answers should not vanish into chat history. They should be filed as permanent wiki pages that future queries can build on.

## The Lint Workflow

Lint is the maintenance workflow that keeps the wiki healthy:

- **Contradictions** — Two pages claim different things about the same topic
- **Stale claims** — Information that may be outdated based on newer sources
- **Orphaned pages** — Pages with no inbound links (disconnected knowledge)
- **Missing cross-references** — Pages that should link to each other but do not
- **Data gaps** — Topics mentioned but never properly covered

### Lint Example

```
> lint

Scanning 87 wiki pages...

⚠ Contradiction: context-windows.md says Claude supports 100K tokens,
  but anthropic.md says 200K tokens. The 200K figure is from a newer source.
  → Updated context-windows.md

⚠ Orphaned: deployment-checklist.md has 0 inbound links
  → Added link from project-management.md

⚠ Stale: gpt-4-pricing.md references prices from 2024
  → Flagged for re-research

✓ 3 issues found, 2 auto-fixed, 1 flagged
```

Run lint periodically — weekly for active knowledge bases, monthly for stable ones. It is the equivalent of running tests on your codebase.

## The Compound Loop

These three workflows form a virtuous cycle:

1. **Ingest** adds new knowledge and connects it to existing knowledge
2. **Query** synthesizes answers and files insights back as new pages
3. **Lint** catches inconsistencies and strengthens cross-references

Every cycle through this loop makes the knowledge base more complete, more connected, and more reliable. This is the compounding effect that RAG cannot achieve.', 2);

-- ============================================================================
-- Module 3: Building Your Knowledge Base with Obsidian
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'eeee0003-0000-0000-0000-000000000003',
  (select id from public.courses where slug = 'supercharging-context-memory'),
  'Building Your Knowledge Base with Obsidian',
  'building-knowledge-base-obsidian',
  'Set up Obsidian as your visual knowledge management layer — interlinked notes, graph view, and local-first ownership.',
  3
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('eeee0003-0000-0000-0000-000000000003', 'Why Obsidian for LLM Knowledge Bases', 'why-obsidian-for-llm-knowledge-bases', 'text',
'# Why Obsidian for LLM Knowledge Bases

Karpathy''s LLM Wiki pattern works with any markdown editor. But Obsidian turns it into a superpower. Obsidian is a free, local-first markdown editor built specifically for interlinked knowledge — and it is the perfect visual layer on top of your LLM-maintained wiki.

## What Obsidian Brings to the Table

### 1. Wikilinks — [[Double Bracket Linking]]
Type `[[concept-name]]` and Obsidian creates a bidirectional link. Click it to navigate. See all pages that link to a concept in the backlinks panel. This is exactly how your wiki pages should reference each other.

### 2. Graph View — See Your Knowledge
Obsidian''s graph view renders your entire knowledge base as an interactive network graph. Nodes are pages, edges are links. You can instantly see:
- Which concepts are central (many connections)
- Which pages are orphaned (no connections)
- How topics cluster together
- Where cross-references are missing

This visual layer is invaluable for the lint workflow. Instead of asking the LLM to find orphaned pages, you can see them immediately.

### 3. Local-First — You Own Everything
Your vault is a folder of plain markdown files on your local disk. No cloud service, no database, no vendor lock-in. You can:
- Back it up with git
- Sync it with any cloud service
- Read it with any text editor
- Process it with any script or LLM

### 4. Search — Instant Full-Text Search
Obsidian''s search is fast. Search across your entire knowledge base in milliseconds. Combined with the LLM''s ability to read files, this gives you two complementary search systems: Obsidian for quick human browsing, Claude Code for deep AI-powered synthesis.

### 5. Templates — Consistent Page Structure
Create templates for different page types: concept pages, entity pages, project pages, meeting notes. This enforces the schema your LLM expects and keeps the wiki consistent.

## Setting Up Your Vault

### Step 1: Create the Vault
Create a new Obsidian vault at your wiki location. If you are following Karpathy''s pattern:

```
my-knowledge-base/
  raw/            # Immutable source documents
  wiki/           # LLM-maintained markdown pages
  CLAUDE.md       # Schema for Claude Code
  .obsidian/      # Obsidian config (auto-created)
```

Open this folder as an Obsidian vault. Obsidian will index all markdown files in both `raw/` and `wiki/`.

### Step 2: Configure Wikilinks
In Settings → Files & Links:
- Set "New link format" to "Relative path to file"
- Enable "Automatically update internal links"
- Set "Default location for new notes" to `wiki/`

### Step 3: Create Templates
Create a `templates/` folder with:

**templates/concept.md:**
```markdown
# {{title}}

> One-line summary.

## Overview

## Key Points

## Related
- [[]]
```

**templates/entity.md:**
```markdown
# {{title}}

> One-line description.

## Background

## Key Contributions

## Related
- [[]]
```

### Step 4: Set Up the Graph View
Open the graph view (Ctrl/Cmd + G). Configure:
- Color groups: concepts (blue), entities (green), projects (orange)
- Filter by folder: show only `wiki/` to hide raw sources
- Adjust link distance and repel force for readability

You now have a visual, searchable, interlinked knowledge base that both you and your LLM can read and write.', 1),

('eeee0003-0000-0000-0000-000000000003', 'Obsidian Plugins for AI Workflows', 'obsidian-plugins-ai-workflows', 'text',
'# Obsidian Plugins for AI Workflows

Obsidian''s plugin ecosystem extends its capabilities far beyond a simple markdown editor. For AI orchestrators building LLM knowledge bases, these plugins transform Obsidian into a full knowledge management platform.

## Essential Plugins

### Dataview — Query Your Knowledge Base
Dataview lets you write queries against your notes'' metadata. Add YAML frontmatter to your wiki pages:

```yaml
---
type: concept
domain: ai-memory
sources: 3
last_updated: 2026-04-09
status: active
---
```

Then query across your entire wiki:

```dataview
TABLE sources, last_updated, status
FROM "wiki/concepts"
WHERE domain = "ai-memory"
SORT last_updated DESC
```

This gives you a live dashboard of your knowledge base — which pages are stale, which concepts have the most sources, where the gaps are.

### Templater — Dynamic Templates
Templater goes beyond basic templates. You can:
- Auto-insert today''s date
- Prompt for page type and populate the correct template
- Run JavaScript to auto-generate frontmatter
- Create consistent page structure across hundreds of pages

### Graph Analysis — Advanced Graph Metrics
The core graph view shows connections visually. Graph Analysis adds metrics:
- **Betweenness centrality** — which concepts are bridges between clusters
- **Page rank** — which pages are most important based on link structure
- **Clustering coefficient** — how tightly grouped your knowledge is

These metrics directly support the lint workflow. High centrality pages need more attention. Low clustering areas might need more cross-references.

### Obsidian Git — Version Control Your Knowledge
Since your knowledge base is a folder of markdown files, you can version control it with git. The Obsidian Git plugin automates:
- Auto-commit every N minutes
- Push to a remote repository
- View file history and diffs

This is critical for knowledge bases maintained by LLMs. If Claude Code updates 15 pages during an ingest, you can review the diff, revert specific changes, and maintain a full history of how your knowledge evolved.

### Local LLM Plugins
Several plugins connect Obsidian directly to local LLMs via Ollama:
- **Obsidian LLM Wiki** — Implements Karpathy''s pattern locally with zero cloud dependencies
- **Smart Connections** — Finds semantically related notes using local embeddings
- **Copilot** — Chat with your notes using any LLM

For privacy-sensitive knowledge bases (company data, personal research), local LLMs keep everything on your machine.

## The Combined Stack

The ideal setup for an AI orchestrator:

| Layer | Tool | Purpose |
|-------|------|---------|
| Editor | Obsidian | Visual knowledge management, graph view, search |
| LLM Engine | Claude Code | Ingest, query, lint, cross-reference maintenance |
| Version Control | Git | History, diffs, collaboration, rollback |
| Schema | CLAUDE.md | Rules and conventions for the LLM |
| Storage | Local disk | Plain markdown, zero vendor lock-in |

Obsidian is the human interface. Claude Code is the AI engine. Git is the safety net. Together they give you a knowledge base that is visual, AI-maintained, version-controlled, and entirely yours.', 2);

-- ============================================================================
-- Module 4: Claude Code as Your Wiki Engine
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'eeee0004-0000-0000-0000-000000000004',
  (select id from public.courses where slug = 'supercharging-context-memory'),
  'Claude Code as Your Wiki Engine',
  'claude-code-wiki-engine',
  'Configure Claude Code to read, write, and maintain your knowledge base — CLAUDE.md schema, custom commands, and automated workflows.',
  4
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('eeee0004-0000-0000-0000-000000000004', 'Writing Your Schema (CLAUDE.md)', 'writing-your-schema', 'text',
'# Writing Your Schema (CLAUDE.md)

The schema is the single most important file in your knowledge base. It tells Claude Code how your wiki is structured, what conventions to follow, and how to handle every workflow. A well-written schema means Claude Code can maintain your knowledge base autonomously. A vague schema means inconsistent, messy results.

## What Goes in the Schema

### 1. Wiki Structure
Define your folder layout and page types:

```markdown
## Structure

wiki/ contains all LLM-maintained pages:
- concepts/    — One page per concept (e.g., attention-mechanism.md)
- entities/    — One page per person, company, or product
- projects/    — One page per project or initiative
- syntheses/   — Comparison pages, analysis pages, strategy docs

raw/ contains immutable source documents. Never modify files in raw/.

index.md is a catalog of every wiki page with a one-line summary.
log.md is an append-only record of all changes.
```

### 2. Page Conventions
Define how pages should look:

```markdown
## Page Conventions

Every wiki page must have:
1. A YAML frontmatter block with type, domain, sources, last_updated, status
2. A one-line summary after the title (blockquote format)
3. Clear sections with ## headings
4. A ## Related section at the bottom with [[wikilinks]] to related pages
5. Citations to raw sources using [Source Title](../raw/path/to/source.md)

Page names use kebab-case: attention-mechanism.md, not Attention Mechanism.md
```

### 3. Workflow Definitions
Define the three core workflows:

```markdown
## Workflows

### ingest <path>
1. Read the source file completely
2. Identify key concepts, entities, and claims
3. Create or update wiki pages for each concept/entity
4. Add cross-references between affected pages
5. Update index.md with any new pages
6. Append to log.md: ## [DATE] ingest | Source Title

### query <question>
1. Identify relevant wiki pages (check index.md first)
2. Read those pages and follow cross-references
3. Synthesize an answer with citations to wiki pages
4. If the answer is substantial, offer to file it as a new wiki page

### lint
1. Scan all wiki pages for:
   - Contradictions between pages
   - Stale claims (check last_updated dates)
   - Orphaned pages (no inbound [[links]])
   - Missing cross-references
   - Pages without proper frontmatter
2. Fix what you can automatically
3. Flag what needs human review
4. Log results to log.md
```

### 4. Quality Rules
Set expectations for content quality:

```markdown
## Quality Rules

- Never invent information. Every claim must trace to a raw source.
- When two sources contradict, note both and flag for resolution.
- Keep pages focused. If a page covers too many topics, split it.
- Prefer updating existing pages over creating new ones.
- Every page should have at least 2 inbound links from other pages.
- Run lint after every 5 ingests or weekly, whichever comes first.
```

## Testing Your Schema

After writing your schema, test it with a simple ingest:

1. Drop an article into `raw/`
2. Run Claude Code and say: "ingest raw/article.md"
3. Check: Did it create the right pages? Update related pages? Follow your conventions?
4. If not, refine the schema and try again

The schema is a living document. Refine it as you learn what works for your knowledge domain.', 1),

('eeee0004-0000-0000-0000-000000000004', 'Custom Commands for Knowledge Workflows', 'custom-commands-knowledge-workflows', 'text',
'# Custom Commands for Knowledge Workflows

Claude Code supports custom slash commands that live in `.claude/commands/`. For a knowledge base, these commands encode your three core workflows so you can run them with a single command instead of typing instructions every time.

## The Ingest Command

Create `.claude/commands/ingest.md`:

```markdown
Read the file at $ARGUMENTS completely. Then:

1. Identify every key concept, entity, claim, and data point
2. For each concept/entity:
   - If a wiki page exists, update it with the new information
   - If no page exists, create one following the template in CLAUDE.md
3. Add [[wikilinks]] between all affected pages
4. Update wiki/index.md with any new pages (one line each: link + summary)
5. Append to wiki/log.md: ## [today''s date] ingest | [source filename]
6. Report: pages created, pages updated, total cross-references added
```

Now you can run: `/ingest raw/papers/new-paper.pdf`

## The Query Command

Create `.claude/commands/query.md`:

```markdown
Answer this question using only the knowledge in wiki/: $ARGUMENTS

1. Read wiki/index.md to find relevant pages
2. Read those pages and follow [[wikilinks]] to gather full context
3. Synthesize a comprehensive answer with citations to specific wiki pages
4. If the answer reveals a gap in the wiki, note what source would fill it
5. Ask: "Should I save this answer as a wiki page?"
```

Now you can run: `/query What is the relationship between context length and AI performance?`

## The Lint Command

Create `.claude/commands/lint.md`:

```markdown
Scan every file in wiki/ and check for:

1. Pages without proper YAML frontmatter
2. Pages with no inbound [[wikilinks]] from other pages (orphans)
3. Contradictions between pages (same topic, different claims)
4. Stale pages (last_updated older than 30 days with active sources)
5. Missing ## Related sections
6. Broken [[wikilinks]] that point to nonexistent pages

For each issue:
- Fix automatically if the fix is clear and safe
- Flag for human review if ambiguous
- Report a summary: X issues found, Y auto-fixed, Z flagged

Append results to wiki/log.md
```

Now you can run: `/lint`

## Advanced Commands

### /summarize — Weekly Knowledge Digest
```markdown
Read wiki/log.md for entries from the last 7 days.
Summarize: what was ingested, what questions were asked, what issues were found.
Create wiki/syntheses/weekly-digest-[date].md with the summary.
```

### /gaps — Find Missing Knowledge
```markdown
Read wiki/index.md and all concept pages.
Identify topics that are mentioned in multiple pages but have no dedicated page.
List them as "knowledge gaps" with the pages that reference them.
```

### /connect — Deep Cross-Reference Pass
```markdown
Read every page in wiki/. For each page, identify 2-3 pages that should be
cross-referenced but are not. Add the links and update the ## Related sections.
Report how many new cross-references were added.
```

## The Power of Commands

These commands are not just shortcuts — they encode your methodology. When you onboard a new team member, they do not need to learn your wiki conventions. They just run `/ingest`, `/query`, and `/lint`. The commands carry the knowledge of how your system works.

And because they are plain markdown files, they are version-controlled, shareable, and improvable over time. Your knowledge management process itself becomes part of your knowledge base.', 2);

-- ============================================================================
-- Module 5: Interlinking and Cross-Reference Strategies
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'eeee0005-0000-0000-0000-000000000005',
  (select id from public.courses where slug = 'supercharging-context-memory'),
  'Interlinking & Cross-Reference Strategies',
  'interlinking-cross-reference-strategies',
  'The art of connecting knowledge — wikilinks, backlinks, graph density, and avoiding hallucinated references.',
  5
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('eeee0005-0000-0000-0000-000000000005', 'The Link Graph: Why Connections Matter More Than Content', 'the-link-graph', 'text',
'# The Link Graph: Why Connections Matter More Than Content

A knowledge base with 100 unlinked pages is just a folder. A knowledge base with 100 pages and 500 cross-references is a graph — and graphs are where AI reasoning shines.

## Why Links Matter

When an AI reads a single page, it gets one perspective. When it reads a page and follows its links, it gets context — related concepts, supporting evidence, contradicting viewpoints, historical context. The links are what turn isolated facts into connected knowledge.

### The Density Metric

A useful way to measure knowledge base quality is **link density**: the average number of links per page.

- **< 2 links per page**: Disconnected. The AI treats each page independently.
- **3-5 links per page**: Connected. The AI can follow references for context.
- **6-10 links per page**: Dense. The AI discovers unexpected connections.
- **> 10 links per page**: Possibly over-linked. Some links may be noise.

Your goal is a link density of 4-6 for concept pages and 3-4 for entity pages.

## Types of Links

### 1. Definitional Links
"Attention mechanisms are a core component of [[transformer-architecture]]"

These establish hierarchical relationships — a concept is part of, or depends on, another concept.

### 2. Comparative Links
"Unlike [[rag-retrieval]], the wiki pattern maintains state between queries"

These highlight differences and trade-offs between related concepts.

### 3. Evidence Links
"This claim is supported by findings in [[context-length-study-2026]]"

These trace claims back to sources, improving reliability and enabling fact-checking.

### 4. Application Links
"This concept is used in [[q4-product-strategy]] and [[customer-onboarding-flow]]"

These connect abstract knowledge to concrete projects, showing how theory applies in practice.

## The Hallucination Problem

One critical gotcha with LLM-maintained wikis: **wikilinks are harder than they look**. When the LLM creates a page and adds `[[some-concept]]` links, it might hallucinate page names that do not exist. This creates broken links — 404s in your knowledge graph.

The solution: links must be resolved against the existing page set at write time, not guessed at compile time.

### Resolution Strategy

In your schema, add:

```markdown
## Link Rules
- Before adding a [[wikilink]], verify the target page exists in wiki/
- If the target page does not exist, either:
  a) Create a stub page with a "needs content" status, or
  b) Use plain text instead of a wikilink
- Never guess page names. Check index.md or the filesystem.
- After any ingest or lint pass, verify all [[wikilinks]] resolve
```

### Stub Pages

Stub pages are placeholders that signal a knowledge gap:

```markdown
---
type: concept
status: stub
---

# Retrieval-Augmented Generation

> Stub — this page needs content.

## Mentioned in
- [[rag-vs-wiki-comparison]]
- [[context-windows]]
```

Stubs are valuable because they make gaps visible. In Obsidian''s graph view, stubs appear as small, sparsely connected nodes — easy to spot and prioritize.

## Building the Graph Incrementally

Do not try to link everything at once. Let the graph grow organically through the ingest → query → lint cycle:

1. **Ingest** creates pages with initial links to obviously related concepts
2. **Query** reveals connections you had not considered (file these as new links)
3. **Lint** finds orphans and suggests missing cross-references
4. **The /connect command** does a deep pass to add links you missed

Over time, the graph gets denser and more useful — exactly the compounding effect you want.', 1),

('eeee0005-0000-0000-0000-000000000005', 'Practical Linking Patterns and Pitfalls', 'practical-linking-patterns', 'text',
'# Practical Linking Patterns and Pitfalls

Building a well-linked knowledge base is a skill. Here are the patterns that work, the mistakes to avoid, and the techniques that make your wiki genuinely useful for AI reasoning.

## Pattern 1: The Hub-and-Spoke

Create central "hub" pages for major topics that link out to detailed "spoke" pages:

```
[[ai-memory]] (hub)
  ├── [[context-windows]]
  ├── [[rag-retrieval]]
  ├── [[llm-wiki-pattern]]
  ├── [[fine-tuning-as-memory]]
  └── [[neuralese-recurrence]]
```

Hub pages provide the AI with a starting point for any topic. When asked about AI memory, it reads the hub page first and follows spokes as needed.

## Pattern 2: The Comparison Page

When two concepts are frequently compared, create a dedicated comparison page:

```markdown
# RAG vs LLM Wiki

| Dimension | RAG | LLM Wiki |
|-----------|-----|----------|
| State | Stateless | Stateful |
| Compounds | No | Yes |
| Setup cost | Low | Medium |
| Query quality | Good for simple Q&A | Excellent for synthesis |
| Maintenance | Embedding updates | Lint passes |

## When to Use RAG
...

## When to Use LLM Wiki
...

## Related
- [[rag-retrieval]]
- [[llm-wiki-pattern]]
- [[context-windows]]
```

Comparison pages prevent the AI from giving one-sided answers and ensure trade-offs are always visible.

## Pattern 3: The Timeline Page

For topics that evolve over time, create timeline pages:

```markdown
# AI Model Timeline

## 2023
- GPT-4 released (March) — [[gpt-4]]
- Claude 2 released (July) — [[anthropic]]

## 2024
- Claude 3 family (March) — [[claude-3-comparison]]
- GPT-4o multimodal (May)

## 2025
- Claude 3.5 Sonnet — 200K context — [[context-windows]]
- Agent frameworks mature — [[crewai]], [[langgraph]]

## 2026
- Claude 4.5 / Opus — [[claude-code]]
- LLM Wiki pattern emerges — [[llm-wiki-pattern]]
```

Timelines give the AI temporal context — essential for questions like "how has X evolved?" or "what changed since we last reviewed this?"

## Common Pitfalls

### Pitfall 1: Over-Linking
Not every mention needs a wikilink. Link when the connection adds navigational or contextual value. "AI models use [[transformer-architecture]]" is useful. "The study was published in [[2026]]" is not — a year is not a concept page.

### Pitfall 2: Circular Summaries
Page A summarizes Page B, and Page B summarizes Page A. The AI reads both and gains nothing. Each page should add unique information, not just restate what the linked page says.

### Pitfall 3: Stale Link Targets
You renamed `attention.md` to `attention-mechanism.md` but did not update the 12 pages that link to it. Now you have 12 broken links. This is why the lint workflow checks for broken wikilinks — and why Obsidian''s "automatically update internal links" setting is critical.

### Pitfall 4: Flat Hierarchies
If every page links to every other page, the graph becomes noise. Structure matters. Use hub pages to create navigable hierarchies. An AI reading a graph with clear clusters learns more than one reading a hairball.

## Measuring Link Quality

Run these checks periodically:

1. **Orphan count**: Pages with 0 inbound links → should be 0
2. **Average link density**: Links per page → target 4-6
3. **Broken links**: Wikilinks pointing to nonexistent pages → should be 0
4. **Hub coverage**: Every concept should be reachable within 2 clicks from a hub page
5. **Cluster balance**: No single cluster should contain more than 30% of all pages

These metrics tell you whether your knowledge base is well-structured or drifting toward chaos.', 2);

-- ============================================================================
-- Module 6: Scaling Your Knowledge Base
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'eeee0006-0000-0000-0000-000000000006',
  (select id from public.courses where slug = 'supercharging-context-memory'),
  'Scaling Your Knowledge Base',
  'scaling-your-knowledge-base',
  'Handle large wikis — index strategies, selective context loading, team collaboration, and when to add RAG on top.',
  6
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('eeee0006-0000-0000-0000-000000000006', 'When Your Wiki Outgrows the Context Window', 'wiki-outgrows-context-window', 'text',
'# When Your Wiki Outgrows the Context Window

A personal wiki of 50-100 pages fits easily in Claude''s 200K token context window. But what happens when your knowledge base grows to 500 pages? 1,000? 10,000? At some point, the AI cannot read the entire wiki in one session. Here is how to scale.

## The Growth Curve

Karpathy''s research wiki contains roughly 100 articles and over 400,000 words. At that scale, the LLM can still manage by reading the index, identifying relevant pages, and loading only what it needs. This "index-first" strategy works up to about 200-300 focused pages.

Beyond that, you need a layered loading strategy.

## Strategy 1: Index-Based Navigation

The index.md file is your table of contents. Keep it lean — one line per page with a link and summary:

```markdown
- [[attention-mechanism]] — How neural networks focus on relevant input
- [[scaling-laws]] — Relationship between model size, data, and performance
- [[rag-retrieval]] — Retrieval-augmented generation for external knowledge
```

The AI reads the index first (a few thousand tokens), identifies which pages are relevant, then loads only those pages. For a 300-page wiki, the index might be 10,000 tokens — trivial.

## Strategy 2: Hierarchical Indexes

For larger wikis, create domain-specific sub-indexes:

```
wiki/
  index.md                    # Master index (links to sub-indexes)
  domains/
    ai-memory/index.md        # All pages about memory and context
    ai-agents/index.md        # All pages about agent architectures
    company/index.md           # All pages about your company
    projects/index.md          # All project pages
```

The AI reads the master index, picks the relevant domain, reads the sub-index, then loads specific pages. This scales to thousands of pages with minimal context overhead.

## Strategy 3: Summary Pages

For dense topic areas, maintain summary pages that condense 10-20 detailed pages into a single overview:

```markdown
# AI Memory — Summary

This page summarizes our knowledge about AI memory systems.
For full details, see the individual pages linked below.

## Key Findings
- Context windows beyond 500K show diminishing returns [[context-length-study]]
- Structured context outperforms raw by 3.2x [[structured-context-benefits]]
- The LLM Wiki pattern compounds while RAG stays flat [[rag-vs-wiki-comparison]]

## Open Questions
- How does memory interact with fine-tuning? [[fine-tuning-as-memory]]
- What is the optimal link density? (no data yet)
```

Summary pages act as compression layers. The AI reads the summary and only dives into detailed pages when needed.

## Strategy 4: Selective Context Loading

Build a custom command that loads context intelligently:

```markdown
## /context <topic>
1. Read wiki/index.md
2. Identify the 5-10 most relevant pages for <topic>
3. Read those pages
4. Follow their most important [[wikilinks]] (max 2 hops)
5. Summarize the loaded context: "I have loaded X pages covering Y, Z"
6. Ready for questions about this topic
```

This gives you focused, deep context on demand — better than loading everything or loading nothing.

## When to Add RAG

At very large scale (1,000+ pages, or when speed matters), you can add a RAG layer on top of the wiki:

- **Embed all wiki pages** using a local embedding model
- **Semantic search** to find relevant pages by meaning, not just keywords
- **Hybrid approach**: RAG finds candidates, then the LLM reads the full pages

The wiki pattern and RAG are not mutually exclusive. The wiki gives you structured, pre-synthesized knowledge. RAG gives you fast retrieval at scale. Together they handle any size knowledge base.

But start with the wiki alone. Most personal and team knowledge bases never need RAG — the index-based approach scales further than you think.', 1),

('eeee0006-0000-0000-0000-000000000006', 'Team Knowledge Bases and Collaboration', 'team-knowledge-bases-collaboration', 'text',
'# Team Knowledge Bases and Collaboration

A personal knowledge base is powerful. A team knowledge base is transformative. When everyone on a team contributes to and queries from the same structured wiki, knowledge stops being locked in individual heads and starts being a shared, compounding asset.

## Setting Up for Teams

### Git as the Backbone
Your wiki is a folder of markdown files — perfect for git. The setup:

1. Create a git repository for the knowledge base
2. Each team member clones the repo and opens it in Obsidian
3. Claude Code reads and writes the same wiki folder
4. Changes are committed, pushed, and pulled like code

### Branch Strategy
Treat knowledge updates like code changes:

- **Main branch**: The canonical wiki. Always consistent and lint-clean.
- **Feature branches**: For large ingests or restructuring. "feat/ingest-q3-reports"
- **Pull requests**: Review wiki changes before merging, especially AI-generated content.

This sounds like overkill for a wiki, but it solves a real problem: when an LLM updates 15 pages during an ingest, you want to review those changes before they become canonical knowledge.

### Merge Conflicts
Markdown merge conflicts are rare and easy to resolve. But they do happen when two people update the same page simultaneously. The solution:
- Keep pages focused (one concept per page) to minimize overlap
- Use the lint workflow to catch inconsistencies after merges
- Prefer creating new pages over editing existing ones in parallel

## Contribution Patterns

### The Knowledge Curator Role
One team member (or a rotating role) is the knowledge curator. They:
- Review and merge wiki PRs
- Run weekly lint passes
- Identify knowledge gaps and assign research
- Maintain the schema and conventions

This role is not heavy — maybe an hour per week. But it keeps the wiki healthy.

### Async Knowledge Sharing
Instead of meetings to share learnings, team members:
1. Drop their raw sources into `raw/`
2. Run `/ingest` to process them into wiki pages
3. Open a PR with the changes
4. The curator reviews and merges

The wiki becomes the team''s shared brain. New hires read the wiki instead of asking dozens of "how does X work?" questions. Knowledge transfers happen automatically through the structure.

### AI-Assisted Onboarding
When a new person joins:
1. They clone the knowledge base
2. They ask Claude Code: `/query What are the key projects, technologies, and processes on this team?`
3. Claude reads the wiki and produces a comprehensive onboarding summary
4. The new hire follows links to dive deeper into specific areas

This is dramatically more effective than a stack of documents or a week of shadow sessions.

## Access Control

Not all knowledge should be visible to everyone. Options:
- **Separate repos**: Public team wiki + private leadership wiki
- **Folder-based access**: Use gitignore patterns or separate vaults for sensitive content
- **Redacted summaries**: Public wiki pages that reference private sources without exposing details

Keep it simple. Most teams only need one shared wiki with a small private section for sensitive topics.

## Measuring Team Knowledge Health

Track these metrics monthly:
- **Pages per team member**: Are people contributing?
- **Ingest frequency**: How often are new sources being processed?
- **Query frequency**: Is the wiki actually being used?
- **Link density trend**: Is the graph getting richer over time?
- **Lint issue count**: Is quality improving or degrading?

A healthy team wiki shows increasing page count, stable link density, decreasing lint issues, and regular query activity. If queries drop, the wiki is not useful enough — time to improve the schema or add more content.', 2);

-- ============================================================================
-- Module 7: Capstone — Build Your AI Second Brain
-- ============================================================================

insert into public.modules (id, course_id, title, slug, description, "order")
values (
  'eeee0007-0000-0000-0000-000000000007',
  (select id from public.courses where slug = 'supercharging-context-memory'),
  'Capstone: Build Your AI Second Brain',
  'capstone-build-ai-second-brain',
  'Put it all together — build a complete, working knowledge base from scratch and prove it compounds.',
  7
);

insert into public.lessons (module_id, title, slug, content_type, content, "order") values
('eeee0007-0000-0000-0000-000000000007', 'Project Setup and First Ingest', 'project-setup-first-ingest', 'text',
'# Project Setup and First Ingest

Time to build. In this lesson you will create your knowledge base from scratch, configure Claude Code to maintain it, and run your first ingest to see the system in action.

## Step 1: Create the Folder Structure

```bash
mkdir -p my-knowledge-base/{raw,wiki/{concepts,entities,projects,syntheses},templates,.claude/commands}
cd my-knowledge-base
git init
```

## Step 2: Write Your CLAUDE.md

Create `CLAUDE.md` at the root. This is your schema — the rulebook for Claude Code. Start with the template from Module 4, then customize:

- Set your domains (what topics does this knowledge base cover?)
- Define your page types (concepts, entities, projects, or something domain-specific?)
- Set your quality rules (citation requirements, link density targets, lint schedule)

## Step 3: Create Your Custom Commands

Create the three core commands in `.claude/commands/`:
- `ingest.md` — Process new sources into wiki pages
- `query.md` — Search the wiki and synthesize answers
- `lint.md` — Check wiki health and fix issues

Copy the templates from Module 4 and adjust for your domain.

## Step 4: Create the Index and Log

```bash
echo "# Wiki Index\n\nNo pages yet." > wiki/index.md
echo "# Wiki Log\n\n" > wiki/log.md
```

## Step 5: Open in Obsidian

Open the `my-knowledge-base` folder as an Obsidian vault. Configure wikilinks and templates as described in Module 3.

## Step 6: Your First Ingest

Pick a source you care about — an article, a paper, meeting notes, a product spec. Drop it in `raw/`.

Then open Claude Code and run:

```
/ingest raw/your-source.md
```

Watch what happens:
- Claude reads the source
- Creates wiki pages for key concepts and entities
- Adds cross-references between pages
- Updates the index
- Logs the activity

Now open Obsidian and explore. Click through the pages. Open the graph view. You should see your first cluster of connected knowledge.

## Step 7: Commit

```bash
git add -A
git commit -m "feat: initial knowledge base with first ingest"
```

Your knowledge base is alive. Every future ingest will build on this foundation.', 1),

('eeee0007-0000-0000-0000-000000000007', 'The 30-Day Compound Test', 'the-30-day-compound-test', 'text',
'# The 30-Day Compound Test

Your knowledge base is set up and your first ingest is complete. Now comes the real test: does it compound? Over the next 30 days, you will follow a daily practice that proves — or disproves — whether the system delivers on its promise.

## The Daily Practice

Spend 10-15 minutes per day:

### Week 1: Build the Foundation (Days 1-7)
- **Ingest 2-3 sources per day** — articles, papers, meeting notes, anything relevant to your domain
- **Run /query once per day** — ask a real question you care about
- **File good answers** back as wiki pages
- **Commit at the end** of each session

By day 7, you should have 20-30 wiki pages with a growing link graph.

### Week 2: Deepen Connections (Days 8-14)
- **Continue ingesting** 1-2 sources per day
- **Run /lint** on day 8 and day 14 — fix orphans and contradictions
- **Run /connect** to add cross-references you missed
- **Start asking synthesis questions**: "What patterns do we see across X and Y?"

By day 14, your link density should be 3-5 per page and the graph should show clear clusters.

### Week 3: Test Synthesis (Days 15-21)
- **Ask hard questions** that require synthesizing across multiple pages
- **Compare answers** to what you would have gotten from a fresh ChatGPT session (no wiki)
- **Note the differences** — the wiki-backed answers should be more specific, more nuanced, and cite your actual data
- **Create comparison and timeline pages** for topics that span multiple sources

### Week 4: Prove the Compound (Days 22-30)
- **Re-ask questions from Week 1** — are the answers better now that the wiki has grown?
- **Run a full lint pass** — the wiki should be healthier than it was on day 14
- **Check your metrics**: page count, link density, orphan count, query quality
- **Write a reflection** page: what worked, what did not, what to improve

## What Success Looks Like

At the end of 30 days, you should have:

- **50-80 wiki pages** covering your domain
- **Link density of 4-6** per page
- **Zero orphaned pages** (everything connects to something)
- **Noticeably better answers** compared to day 1
- **A feeling of accumulated knowledge** — your AI assistant "knows" your domain

## What Failure Looks Like

If the system is not working, you will see:

- Pages that are just summaries with no cross-references
- The AI giving generic answers that do not reference your wiki
- A flat graph with no clusters or hub pages
- No improvement in answer quality over the 30 days

If this happens, the issue is almost always the schema. Refine your CLAUDE.md, add more specific workflow instructions, and try again.

## The Long Game

After 30 days, the daily practice becomes a habit. Your knowledge base grows passively as you work — every research session, every meeting, every project adds to the wiki. Six months in, you have a comprehensive, interlinked record of everything you know about your domain.

This is the AI second brain. Not a chatbot that forgets. Not a search engine that retrieves. A compounding system that builds on everything it has ever learned, structured for AI reasoning, visualized in Obsidian, and maintained by Claude Code.

Your AI is no longer a forgetful assistant. It is the smartest person on your team — because it never forgets and it never stops connecting.', 2);
