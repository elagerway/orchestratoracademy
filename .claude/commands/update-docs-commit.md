Update `docs/architecture.md` and `docs/changelog.md` to reflect the current state of the codebase, then run a code review, fix any issues, and commit everything.

## Steps

1. **Read** `docs/architecture.md` and `docs/changelog.md`
2. **Review** all staged and unstaged changes (`git diff` and `git status`)
3. **Update `docs/architecture.md`** — add or modify sections to reflect any new systems, integrations, components, or structural changes. Don't remove existing content unless it's outdated.
4. **Update `docs/changelog.md`** — add a new version entry at the top with today's date. List what was Added, Changed, Fixed, or Removed. Follow the existing format.
5. **Code Review (MANDATORY)** — run the `code-reviewer` agent on all changed files. Fix any bugs, security issues, or logic errors found. Do NOT skip this step.
6. **Stage all changes** including the updated docs and any review fixes
7. **Commit** with a clear message describing what changed

Do NOT push — just commit locally.
