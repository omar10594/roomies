# CI Pass Gate Policy

**Effective date:** 2026-06-27
**Scope:** All Roomies projects (webapp, landing)

## Rule

All GitHub Actions workflows **must pass** before any work is considered complete.

### What this means for agents

1. **Push triggers CI** — Every commit pushed to `main`, `master`, or a PR branch triggers the relevant CI workflow(s).
2. **Green required** — Work is not done until all CI checks for the affected project(s) are green.
3. **Fix failures** — If CI fails after a push, the responsible agent must fix the failure and push the correction.
4. **No merging on red** — Do not merge PRs or push to protected branches if CI is failing.
5. **Report blockers** — If CI is failing due to something you cannot fix (e.g., flaky third-party service), document the blocker and escalate to your manager.

### Projects and their CI

| Project | Workflow | Checked by |
|---------|----------|------------|
| `webapp/` | `.github/workflows/ci.yml` (lint, build, test) | All agents |
| `landing/` | `.github/workflows/ci.yml` (type check, build, test, link check) | All agents |

### Verification

Agents should run the equivalent local commands before pushing to catch CI failures early:

- **webapp:** `pnpm lint && pnpm build && pnpm test`
- **landing:** `npx astro check && pnpm build && pnpm test`

## Enforcement

This policy is enforced by the team lead. Agents who push code that breaks CI without attempting a fix will be asked to correct it immediately.
