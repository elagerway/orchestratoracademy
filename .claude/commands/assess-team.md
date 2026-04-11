Assess your team's AI orchestration maturity and report results to Orchestrator Academy.

The API token is: $ARGUMENTS

## Process

### 1. Check installed tools
Run each command and record pass/fail:
- `claude --version` → Claude Code CLI
- `node --version` → Node.js
- `git --version` → Git
- `docker --version` → Docker
- `supabase --version` → Supabase CLI
- `npx --version` → npx

Build a `tool_checks` object: `{"claude": true/false, "node": true/false, ...}`

### 2. Verify API keys
Test each with a live call:

**Anthropic:** Check if `ANTHROPIC_API_KEY` env var exists, then:
```bash
curl -s https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-haiku-4-5-20251001","max_tokens":10,"messages":[{"role":"user","content":"ping"}]}' \
  -o /dev/null -w "%{http_code}"
```
200 = pass, anything else = fail.

**OpenAI:** Check if `OPENAI_API_KEY` env var exists. If yes, test similarly.

**Supabase:** Check if `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` exist.

Build an `api_checks` object: `{"anthropic": true/false, "openai": true/false, "supabase": true/false}`

### 3. Scan repositories
In the current directory and up to 3 levels deep, find:
- `find . -name "CLAUDE.md" -maxdepth 3` → count CLAUDE.md files
- `find . -name ".mcp.json" -o -name "mcp.json" -maxdepth 3` → count MCP configs
- `find . -name "*.md" -path "*/specs/*" -maxdepth 4` → count spec files
- Look for agent patterns in filenames containing "agent", "crew", "pipeline"

Build a `repo_analysis` object: `{"claude_md_count": N, "mcp_config_count": N, "spec_count": N, "agent_patterns": [...]}`

### 4. Calculate maturity score (1-5)
- **Level 1:** Missing most tools (< 3 of 6), no API keys working
- **Level 2:** Most tools installed (3-4 of 6), at least 1 API key works
- **Level 3:** All core tools (5+ of 6), 2+ API keys work, some repo patterns
- **Level 4:** All tools + all APIs + CLAUDE.md files found + MCP configs present
- **Level 5:** Level 4 + spec files found + agent patterns detected

### 5. Generate gap report
Write a markdown report covering:
- What tools are missing and how to install them
- What API keys need to be set up
- What project patterns are missing (CLAUDE.md, MCP configs, specs)
- Which Orchestrator Academy courses address each gap

### 6. Post results to API
```bash
curl -X POST https://orchestratoracademy.com/api/assess \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "tool_checks": {...},
    "api_checks": {...},
    "repo_analysis": {...},
    "maturity_score": N,
    "gap_report": "...",
    "raw_results": {...}
  }'
```

Use the token from $ARGUMENTS as the Bearer token.
If running locally, use http://localhost:3001/api/assess instead.

### 7. Display results
Print to terminal:
- Maturity score with a visual bar (e.g., ████░░░░░░ 4/5)
- Gap report
- Recommended courses from the API response
- XP earned and any achievements unlocked
