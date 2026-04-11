Scaffold a production-ready AI project based on your Orchestrator Academy progress.

The API token is: $ARGUMENTS

## Process

### 1. Fetch your learning context
Call the API to get your assessment and course progress:
```bash
curl -s https://orchestratoracademy.com/api/learning-path/me \
  -H "Authorization: Bearer <TOKEN>"
```

If running locally, use http://localhost:3001 instead.
Parse the response to understand maturity level, completed courses, and gaps.

### 2. Ask about the use case
Ask the user interactively:
- **Project name:** What should we call this project?
- **Use case:** What problem are you solving? (e.g., "AI-powered customer support", "Content generation pipeline", "Data analysis dashboard")
- **Key integrations:** What services do you need? (Supabase, Stripe, external APIs, etc.)

### 3. Generate the project scaffold

Create a new directory with the project name and generate:

**Always include:**
- `package.json` with Next.js, Supabase, Tailwind, TypeScript
- `tsconfig.json`
- `.env.example` with all required environment variables
- `README.md` with setup instructions and architecture overview
- `.gitignore`

**CLAUDE.md** — Generate a project-specific CLAUDE.md:
```markdown
# Project: <name>

## Overview
<use case description>

## Tech Stack
- Next.js 15 (App Router)
- Supabase (PostgreSQL + Auth + RLS)
- Tailwind CSS 4 + shadcn/ui
- Claude API for AI features

## Conventions
- Server components by default, 'use client' only when needed
- All database access through Supabase client
- RLS policies on every table
- Environment variables in .env.local, never committed

## Key Files
- src/app/ — pages and API routes
- src/components/ — React components
- src/lib/ — utilities, types, Supabase client
- supabase/migrations/ — database migrations
- specs/ — feature specifications
```

**MCP config** (`.mcp.json`):
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

**Specs directory** (`specs/`):
- Generate a starter spec based on the use case
- Include acceptance criteria, data model outline, and API routes needed

**Supabase setup:**
- `supabase/migrations/001_initial.sql` — starter schema based on use case
- Basic RLS policies

### 4. Run setup commands
```bash
npm install
supabase init  # if supabase/ directory doesn't exist
git init
git add -A
git commit -m "feat: initial project scaffold from Orchestrator Academy"
```

### 5. Report completion
```bash
curl -X POST https://orchestratoracademy.com/api/deploy-complete \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "<name>",
    "use_case": "<description>",
    "scaffold_type": "nextjs-supabase",
    "technologies": ["nextjs", "supabase", "tailwind", "typescript"],
    "completed_courses": [...]
  }'
```

### 6. Display summary
Print:
- What was created (files, directories)
- Next steps (set up .env.local, run dev server, start building)
- XP earned and achievements unlocked
- Link to continue learning on Orchestrator Academy
