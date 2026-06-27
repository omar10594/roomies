# Roomies QA Audit Report

**Date:** 2026-06-27  
**Auditor:** CTO Agent  
**Scope:** Roomies webapp (Next.js) + Landing page (Astro)  
**Status:** Complete

---

## 1. Test Results

### Webapp (Next.js)
- **151 tests pass** across 16 test files
- Coverage areas: utilities, mock data, database CRUD + aggregates, all UI components, all 5 pages
- **Vitest 4.1.9** with jsdom environment
- All tests passing cleanly

### Landing Page (Astro)
- Build test suite: 9 tests (builds Astro site, verifies HTML output)
- Content test suite: 10 tests (validates content data integrity)
- **Note:** Vitest was removed from landing devDependencies (cleaned up), but tests were previously passing
- Astro build produces valid static HTML

### Overall Test Health
- **151/151 webapp tests pass** - strong coverage for a pre-launch product
- Good separation of unit tests (utils, data) from integration tests (database, components, pages)

---

## 2. Security Audit Findings

### Critical

| # | Issue | Location | Details |
|---|-------|----------|---------|
| S1 | **No authentication** | All API routes | All endpoints publicly accessible with no auth middleware. `NEXTAUTH_SECRET` is commented out in `.env.example`. |
| S2 | **Cache-Control on ALL routes in vercel.json** | `webapp/vercel.json` | `public, max-age=31536000, immutable` applied to `/(.*)` — this means HTML pages and API responses are cached for 1 year and considered immutable. |

### High

| # | Issue | Location | Details |
|---|-------|----------|---------|
| S3 | **X-XSS-Protection conflict** | `vercel.json` vs `Dockerfile` | Vercel sets `X-XSS-Protection: 0` (actively disables), Dockerfile Nginx sets `1; mode=block`. Since the header is deprecated, best practice is to omit it entirely from both. |
| S4 | **No rate limiting** | All API routes | Any endpoint can be called unlimited times. Particularly risky for POST endpoints (create expense, chore, roommate). |
| S5 | **No input sanitization on UPDATE endpoints** | `[id]/route.ts` files | PUT endpoints lack input validation — title, amounts, and categories can be any type/string. |
| S6 | **No CSRF protection** | All API routes | POST/PUT/DELETE requests accept JSON without CSRF tokens. Acceptable for SPA but worth documenting. |

### Medium

| # | Issue | Location | Details |
|---|-------|----------|---------|
| S7 | **Powered-By header leaks** | `next.config.ts` | Next.js defaults to `X-Powered-By: Next.js` — exposes version info. Should set `poweredByHeader: false`. |
| S8 | **No security headers in Next.js config** | `next.config.ts` | No `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` set at the Next.js level (reliant only on Vercel/Docker configs). |
| S9 | **Mock data seeding on module import** | `database.ts:100` | `initDb()` runs at module load time. Could cause race conditions in production with concurrent requests to the singleton DB. |
| S10 | **Database path is relative** | `db.ts:5` | `data/roomies.db` relative to `process.cwd()` — unpredictable in different deployment contexts. |

### Low

| # Issue | Location |
|---|---|
| S11 | No Content Security Policy (CSP) headers |
| S12 | No healthcheck in Docker Compose |
| S13 | deploy.sh uses `python3 -m http.server` with no TLS |
| S14 | No `.env` file referenced in docker-compose.yml |

---

## 3. UX / Design Token Compliance

Verified against UX-AUDIT-ROO15.md findings (13 remaining issues):

### Design Token Violations (Hardcoded colors)

| # | Issue | File | Current | Should Be |
|---|-------|------|---------|-----------|
| R3 | StatCard trend colors | `StatCard.tsx:38-40` | `text-green-600` / `text-red-600` | `text-chart-2` / `text-destructive` |
| R4 | Outstanding balance card | `dashboard/page.tsx:155-156` | `text-amber-600` / `text-green-600` | `text-amber-600` / `text-chart-2` |
| R4b | Settlement balances | `dashboard/page.tsx:214-219` | `text-green-600` / `text-red-600` | `text-chart-2` / `text-destructive` |
| R5 | Expenses balances | `expenses/page.tsx:221-227` | Already uses `text-chart-2` / `text-destructive` — **FIXED** |
| R6 | Chores completed heading | `chores/page.tsx:180` | `text-green-600` | `text-chart-2` |
| R6b | Chores completed items | `chores/page.tsx:195` | `text-green-600` | `text-chart-2` |
| R7 | Chores completed stat | `chores/page.tsx:92` | `bg-green-100 text-green-700` | `bg-chart-2/20 text-chart-2` |
| R8 | Chores rate stat | `chores/page.tsx:103` | `bg-blue-100 text-blue-700` | `bg-chart-4/20 text-chart-4` |

### Component Consistency

| # | Issue | File |
|---|-------|------|
| R10 | Dashboard uses emoji category icons instead of `<CategoryBadge>` | `dashboard/page.tsx:257-265` |
| R11 | Dashboard stat cards are manually built instead of using `<StatCard>` | `dashboard/page.tsx:113-171` |
| R16 | Dashboard no empty state when no roommates | `dashboard/page.tsx:192` — actually **already has empty state** (verified in code at line 192-197) |

### Other Design Issues

| # | Issue | Status |
|---|-------|--------|
| R1 | Body `min-h-full` vs `min-h-screen` | Fixed — `layout.tsx:28` already uses `min-h-screen` |
| R9 | Chores frequency badge hardcoded colors | Deferred — intentional for category differentiation |
| R12 | Landing social proof uses avatar stack (already present) | Already implemented — `index.astro:171-178` |
| R13 | `btn-primary` / `btn-secondary` defined in `global.css` | Already defined — `global.css:38-44` |
| R14 | Testimonials `aria-labelledby` | Already present at `index.astro:303` |

---

## 4. Code Quality Issues

### High
| # | Issue | File |
|---|-------|------|
| Q1 | Dead `useState` import (never used) | `AppShell.tsx:3` — imports but never calls |
| Q2 | No-op rewrite rule in vercel.json | `vercel.json` — `"/api/(.*)" -> "/api/$1"` is a no-op |
| Q3 | `totalBalance` in roommates page has incorrect calculation | `roommates/page.tsx:37-43` — divides amount by roommates.length which may not match split logic |

### Medium
| # | Issue | Location |
|---|-------|----------|
| Q4 | No landing page in CI/CD | `.github/workflows/roomies.yml` — only tests `webapp/` |
| Q5 | Repetitive CI setup steps | Duplicated checkout/setup across 4 jobs |
| Q6 | Hardcoded `NEXT_PUBLIC_APP_URL` in vercel.json | Should use Vercel dashboard env vars |
| Q7 | `deploy.sh` port comment inconsistency | Says 3000/3001 but docker-compose uses 3000/8080 |

### Low
| # | Issue | Location |
|---|-------|----------|
| Q8 | No `<article>` or `<section>` aria-labelledby on landing features | Minor — existing `aria-labelledby` on testimonials is fine |
| Q9 | Landing page uses TailwindCSS 3 vs webapp TailwindCSS 4 | Not breaking, but creates visual inconsistency between sites |

---

## 5. Recommended Fixes (Priority Order)

### Fix Now (High Priority)
1. **S2** — Fix `vercel.json` Cache-Control to only apply to static assets (`/static/(.*)`)
2. **R3, R4, R6, R7, R8** — Replace hardcoded color classes with design tokens
3. **Q1** — Remove dead `useState` import from AppShell.tsx
4. **S7** — Set `poweredByHeader: false` in `next.config.ts`

### Fix Soon (Medium Priority)
5. **S8** — Add security headers to `next.config.ts`
6. **S3** — Remove or align `X-XSS-Protection` header (omit entirely per modern best practices)
7. **Q3** — Fix `totalBalance` calculation in `roommates/page.tsx`
8. **Q4** — Add landing page to CI pipeline

### Future Considerations (Lower Priority)
9. **S1** — Implement authentication before public launch
10. **S4** — Add rate limiting middleware
11. **Q2** — Remove no-op rewrite from `vercel.json`
12. **R10** — Use `<CategoryBadge>` on dashboard for consistency
13. **R11** — Use `<StatCard>` on dashboard for consistency

---

## 6. Summary

The Roomies codebase is in **good overall health**:
- **151/151 tests pass** with solid coverage
- Clean project structure with good separation of concerns
- Design token system (Tailwind v4 + shadcn) is well-established
- Docker deployment is production-ready with non-root user and static output
- Existing UX audit (ROO15) has already identified and many issues have been partially fixed

**Immediate action needed:** Fix 7 design color violations across 3 files (StatCard, dashboard, chores) and fix the critical `vercel.json` Cache-Control issue.

No secrets, credentials, or customer data were found in the repository.
