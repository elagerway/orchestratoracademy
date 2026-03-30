# Build Instructions

> This document is your companion throughout AI Orchestrator Academy.
> It will grow with each module as you learn new techniques.
> By the end of the course, this becomes your personal playbook for orchestrating AI.

---

## The Orchestrator Workflow

Every project follows the same cycle:

1. **Define** — Write a spec describing what you're building
2. **Build** — Give the spec to the AI agent and let it implement
3. **Test** — Run the output, verify it works
4. **Review** — Check the code, look for issues
5. **Test again** — Run tests after any changes
6. **Push** — Deploy to production

Never skip the spec. The spec IS the product.

---

## Why Markdown?

Markdown is the language AI agents understand best. When you give an AI agent a well-structured Markdown document, it can:

- Parse your requirements precisely
- Follow your structure and hierarchy
- Reference specific sections as it builds
- Update the document as the project evolves

Your specs, PRDs, instructions, and documentation should ALL be Markdown files. They live in your project repo alongside your code. They are version-controlled. They are the source of truth.

---

## Document Types

### 1. Product Requirements Document (PRD)

The PRD defines WHAT you're building and WHY.

```markdown
# PRD: [Project Name]

## Overview
What is this project? Who is it for? What problem does it solve?

## Target Users
- User type 1: description and goals
- User type 2: description and goals

## Core Features
### Feature 1: [Name]
- Description: What it does
- User flow: How the user interacts with it
- Acceptance criteria: How you know it's done

### Feature 2: [Name]
...

## Tech Stack
- Framework: [e.g., Next.js 15]
- Database: [e.g., Supabase]
- Hosting: [e.g., Vercel]
- APIs: [list external services]

## Milestones
- M1: [Name] — [scope] — [timeline]
- M2: [Name] — [scope] — [timeline]
- M3: [Name] — [scope] — [timeline]
```

### 2. Feature Spec

The feature spec defines HOW a specific feature works in detail.

```markdown
# Feature Spec: [Feature Name]

## Purpose
Why does this feature exist? What user problem does it solve?

## User Flow
1. User does X
2. System responds with Y
3. User sees Z

## Data Model
- Table/entity name
- Fields and types
- Relationships

## API Endpoints
- POST /api/thing — creates a thing
- GET /api/thing/:id — retrieves a thing

## UI Components
- Component name: what it renders, where it lives

## Edge Cases
- What happens when...
- What if the user...

## Testing
- Test case 1: description
- Test case 2: description
```

### 3. CLAUDE.md (Project Instructions)

This file lives at the root of your project. It tells the AI agent how to work in your codebase.

```markdown
# Project Instructions

## Overview
Brief description of the project.

## Tech Stack
- List of technologies and versions

## Conventions
- File naming conventions
- Code style preferences
- Where things go (folder structure)

## Commands
- How to run the dev server
- How to run tests
- How to deploy

## Important Notes
- Things the agent should never change
- Known issues to be aware of
```

---

## The Spec-Driven Build Process

### Step 1: Write Your PRD
```
$ claude "I want to build [description]. Create a PRD for this."
```
Review the output. Edit it. Make it yours. Save it as `docs/prd.md`.

### Step 2: Create Feature Specs
```
$ claude "Based on docs/prd.md, create a detailed feature spec for [feature name]."
```
Save each spec as `docs/specs/[feature-name].md`.

### Step 3: Build from Spec
```
$ claude "Build [feature] following the spec in docs/specs/[feature-name].md"
```
The agent reads your spec and implements it.

### Step 4: Test
```
$ claude "Run the tests and fix any failures"
```

### Step 5: Review
```
$ claude "Review the code you just wrote for bugs, security issues, and quality"
```

### Step 6: Push
```
$ git add . && git commit -m "feat: [description]" && git push
```

---

## Module Progress

As you complete each module, new sections will be added below:

- [ ] Module 1: Welcome to AI Orchestration
- [ ] Module 2: The AI Orchestrator Role
- [ ] Module 3: Tools & Platforms Landscape
- [ ] ...

*This document will continue to expand as you progress through the course.*

---

> **Remember:** You are the orchestrator. You define. You instruct. You review.
> The AI agent implements. That's the division of labor.
