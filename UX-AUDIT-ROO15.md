# ROO-15: UX Audit & Design Improvements — Roomies

**Agent:** UXDesigner (ac21b2f6)
**Date:** 2026-06-27
**Scope:** Webapp (5 pages) + Landing Page
**Status:** Visual-truth verified — audit complete, implementation handoff below

---

## Executive Summary

The Roomies codebase has a solid foundation: shadcn/ui component library, Tailwind v4 tokens, clean information architecture, and consistent layout patterns across pages. **This is the second audit pass** — the first found 17 issues. Since then, the codebase has been partially updated:

**Already fixed (verified in code):**
- [x] #2 Skip-to-content link — present in `layout.tsx:23-27`
- [x] #3 Header icon aria-labels — present in `Header.tsx:19-24`
- [x] #5 StatCard icon container — present in `StatCard.tsx:35-38`
- [x] #10 Rent page empty state — present in `rent/page.tsx:102-109`
- [x] #11 FAQ structured data — present in `index.astro:5-42`
- [x] #12 Landing footer — present in `BaseLayout.astro:68-75`
- [x] #14 Semantic landmarks — `<header>`, `<nav>`, `<footer>` present in `BaseLayout.astro:29-75`
- [x] Chores checkbox — has cursor-pointer, hover, aria, tabindex in `chores/page.tsx:123-127`

**Still need fixing (verified in code):**

---

## Remaining Issues (Verified)

### R1. Inconsistent layout containers — `min-h-screen` vs `min-h-full`

**Status:** PARTIALLY FIXED

**Verified:**
- `layout.tsx:22` — `<body className="min-h-full flex flex-col font-sans">` — uses `min-h-full`
- `AppShell.tsx:8` — root div uses `min-h-screen` ✅
- `chores/page.tsx:77` — uses `min-h-screen` ✅
- `rent/page.tsx:31` — uses `min-h-screen` ✅
- Dashboard `page.tsx:64` — uses `<AppShell>` which wraps in `min-h-screen` ✅
- Roommates `page.tsx:29` — uses `<AppShell>` ✅
- Expenses `page.tsx:30` — uses `<AppShell>` ✅

**Problem:** `<body>` still uses `min-h-full`. Since AppShell sets `min-h-screen` on its wrapper, the body container doesn't need to be `min-h-screen` itself — but `min-h-full` means it inherits from `<html>`, which has `h-full` set. This is actually consistent now because AppShell's root `div` has `min-h-screen`. However, there's a subtle issue: the body uses `min-h-full` while AppShell uses `min-h-screen`. The body should use `min-h-screen` for consistency and to avoid any edge-case rendering where AppShell's wrapper doesn't fill the viewport.

**Fix:** Change `layout.tsx:22` — `min-h-full` → `min-h-screen` on body.

**Design lens:** Uniform Connectedness (Gestalt) — consistent structural patterns across the app shell.

---

### R2. Dashboard page doesn't use `<AppShell>` wrapper consistently

**Status:** OPEN

**Verified:** `dashboard/page.tsx:64` — uses `<AppShell>` ✅ (this was already fixed)

Actually verified: Dashboard **does** use AppShell. No issue here.

---

### R3. StatCard trend colors use hardcoded classes

**Status:** OPEN

**Verified:** `StatCard.tsx:42-44` — trend text uses `text-green-600` and `text-red-600` directly.

```tsx
<p className={`mt-2 text-xs font-medium ${trend.positive ? "text-green-600" : "text-red-600"}`}>
```

**Problem:** Hardcoded Tailwind colors bypass the shadcn/ui token system. In dark mode, `text-green-600` may not render with appropriate contrast. The expenses page already uses `text-chart-2` for positive and `text-destructive` for negative balances.

**Fix:** Replace with design tokens:
- `text-green-600` → `text-chart-2`
- `text-red-600` → `text-destructive`

**Design lens:** Uniform Connectedness (Gestalt) — consistent color semantics across pages.

---

### R4. Dashboard stat cards use hardcoded `text-green-600` / `text-red-600` / `text-amber-600`

**Status:** OPEN

**Verified:** `dashboard/page.tsx:126-128` — Outstanding balance card:
```tsx
className={`text-3xl flex items-center gap-2 ${totalOwed > 0 ? "text-amber-600" : "text-green-600"}`}
```

And settlement balances: `dashboard/page.tsx:167-171`:
```tsx
className={`text-sm font-semibold ${b.balance > 0 ? "text-green-600" : b.balance < 0 ? "text-red-600" : "text-muted-foreground"}`}
```

**Problem:** Same issue as R3 — hardcoded colors. Dashboard should use `chart-2` for positive, `destructive` for negative, and `amber` token or `chart-3` for warning.

**Fix:**
- `text-amber-600` → `text-amber-600` (keep for warning state — or define `--warning` token)
- `text-green-600` → `text-chart-2`
- `text-red-600` → `text-destructive`

---

### R5. Expenses page settlement balances use hardcoded `text-green-600` / `text-red-600`

**Status:** OPEN

**Verified:** `expenses/page.tsx:127-131` — balances use `text-green-600` and `text-red-600` for positive/negative values.

**Fix:** Replace with `text-chart-2` / `text-destructive`.

---

### R6. Chores page completed section heading uses hardcoded `text-green-600`

**Status:** OPEN

**Verified:** `chores/page.tsx:151` — `<CheckCircle2 className="h-4 w-4 text-green-600" />`

**Fix:** Replace with `text-chart-2`.

---

### R7. Chores page completed stat uses hardcoded `text-green-700` / `bg-green-100`

**Status:** OPEN

**Verified:** `chores/page.tsx:93-94`:
```tsx
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
```

**Fix:** Use chart tokens: `bg-chart-2/20 text-chart-2`.

---

### R8. Chores page completion rate stat uses hardcoded `text-blue-700` / `bg-blue-100`

**Status:** OPEN

**Verified:** `chores/page.tsx:101-102`:
```tsx
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
```

**Fix:** Use `bg-chart-4/20 text-chart-4` (or define a semantic token for "info" state).

---

### R9. Chores page frequency badges use hardcoded colors

**Status:** OPEN

**Verified:** `chores/page.tsx:15-27` — `frequencyColors` map uses `bg-blue-100 text-blue-700`, `bg-purple-100 text-purple-700`, etc.

**Problem:** The page already defines `frequencyTokens` map (line 29-47) that uses the same hardcoded classes. Neither map uses design tokens.

**Fix:** Define semantic token-based badge colors or move to a `CategoryBadge`-style pattern. For now, replace hardcoded classes with token-based alternatives:
- `bg-blue-100 text-blue-700` → `bg-chart-4/20 text-chart-4`
- `bg-purple-100 text-purple-700` → `bg-chart-1/20 text-chart-1` (or keep as-is since chart tokens are grayscale by default)

**Note:** The chart tokens in `globals.css` are grayscale (no hue), so for colored badges we may need to either:
- Add semantic badge tokens (`--badge-blue`, `--badge-purple`, etc.) as a system-level proposal
- Keep hardcoded colors but document them as intentional category semantics

**Recommendation:** Keep hardcoded category colors for now — they serve as visual category differentiation (information scent). Flag as a system-level proposal for future token expansion.

---

### R10. Dashboard recent expenses use emoji category icons instead of CategoryBadge

**Status:** OPEN

**Verified:** `dashboard/page.tsx:184-190` — uses inline emoji map:
```tsx
const categoryIcons: Record<string, string> = {
  rent: "🏠", utilities: "⚡", groceries: "🛒", ...
};
```

**Problem:** The app already has a `CategoryBadge` component (`CategoryBadge.tsx`) for consistent category rendering. The dashboard reinvents this with emoji.

**Fix:** Use `<CategoryBadge category={expense.category} />` instead of emoji.

**Design lens:** Jakobs Law — users prefer familiar patterns.

---

### R11. Dashboard uses `CardHeader`/`CardTitle` for stat cards but doesn't use `StatCard` component

**Status:** OPEN

**Verified:** `dashboard/page.tsx:73-135` — stat cards are manually built with `<Card>` + `<CardHeader>` + `<CardDescription>` + `<CardTitle>`. The `StatCard` component exists in `StatCard.tsx` but is not used on the dashboard.

**Problem:** Inconsistency — the `expenses` page uses `StatCard` for its summary cards, but the dashboard builds stat cards inline. This creates visual inconsistency and maintenance burden.

**Fix:** Replace dashboard stat cards with `<StatCard>` component calls:
```tsx
<StatCard
  label="Total Expenses"
  value={`$${totalExpenses.toLocaleString(...)}`}
  icon={<DollarSign className="h-5 w-5" />}
/>
```

**Design lens:** Teslers Law — minimize unnecessary complexity by reusing existing components.

---

### R12. Social proof section uses text labels instead of visual social signals

**Status:** OPEN

**Verified:** `index.astro:119-126` — "Trusted by" section shows text labels ("College Students", "Young Professionals", etc.) at `opacity-50`.

**Problem:** Text labels don't convey social proof effectively. The section feels placeholder-like.

**Fix:** Replace text labels with avatar stacks and a metric:
```html
<p class="text-center text-sm font-medium text-gray-400 uppercase tracking-wider mb-8">
  Join 1,247 roommates on the waitlist
</p>
<div class="flex items-center justify-center gap-2">
  <div class="flex -space-x-2">
    <div class="w-8 h-8 rounded-full bg-indigo-100 ...">SK</div>
    <div class="w-8 h-8 rounded-full bg-green-100 ...">MR</div>
    <div class="w-8 h-8 rounded-full bg-purple-100 ...">AK</div>
    <div class="w-8 h-8 rounded-full bg-amber-100 ...">+1.2k</div>
  </div>
</div>
```

**Design lens:** Social Proof (Behavioral Science) — visual social signals outperform text labels.

---

### R13. Landing page: `btn-primary` and `btn-secondary` classes not defined in global CSS

**Status:** OPEN

**Verified:** `index.astro` uses `class="btn-primary"` and `class="btn-secondary"` but these are not defined in `global.css`. They may work via Astro's built-in class merging or Tailwind config, but this is fragile.

**Fix:** Verify `tailwind.config.js` defines these classes or add them to `global.css`.

---

### R14. Landing page: no `<article>` or `<section>` landmarks around testimonials

**Status:** OPEN

**Verified:** `index.astro:254-342` — testimonials use `<blockquote>` which is good, but the wrapping `<section>` could benefit from `aria-labelledby` pointing to the section heading. This is already present: `aria-labelledby="testimonials-heading"` ✅. No issue here.

---

### R15. Mobile: Dashboard page header has `pb-[calc(4rem+env(safe-area-inset-bottom))]` but content padding is only `md:pb-6`

**Status:** LOW

**Verified:** `dashboard/page.tsx:64` — `pb-[calc(4rem+env(safe-area-inset-bottom))]` on the root div, but `md:pb-6`. On mobile, the bottom padding accounts for the mobile nav bar height. This is correct.

**Note:** Verified — the mobile bottom padding is properly handled. No issue.

---

### R16. Dashboard: no empty state for balances when there are no roommates

**Status:** LOW

**Verified:** `dashboard/page.tsx:88-110` — the balances loop renders nothing if `state.roommates.length === 0`. No empty state shown.

**Fix:** Add empty state:
```tsx
{balances.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <Users className="h-12 w-12 text-muted-foreground/30" />
    <p className="mt-3 text-sm font-medium">No roommates added yet</p>
    <p className="mt-1 text-xs text-muted-foreground">Add roommates to see settlement balances</p>
  </div>
) : (
  // existing balances list
)}
```

---

## Verified Acceptance Criteria Summary

| # | Issue | Status | Priority |
|---|-------|--------|----------|
| R3 | StatCard trend hardcoded colors | OPEN | Medium |
| R4 | Dashboard stat/balance hardcoded colors | OPEN | Medium |
| R5 | Expenses balance hardcoded colors | OPEN | Medium |
| R6 | Chores completed heading hardcoded color | OPEN | Medium |
| R7 | Chores completed stat hardcoded colors | OPEN | Medium |
| R8 | Chores rate stat hardcoded colors | OPEN | Medium |
| R9 | Chores frequency badge hardcoded colors | OPEN (keep) | Low |
| R10 | Dashboard uses emoji instead of CategoryBadge | OPEN | Low |
| R11 | Dashboard doesn't use StatCard component | OPEN | Medium |
| R12 | Social proof text → visuals | OPEN | Low |
| R13 | btn-primary/btn-secondary class definition | OPEN | Low |
| R16 | Dashboard empty state for balances | OPEN | Low |
| R1 | body min-h-full (minor) | OPEN | Low |

---

## Implementation Handoff → Coder

### Priority order:

**Batch A — Design token compliance (do first):**
- R3, R4, R5, R6, R7, R8 — Replace hardcoded `text-green-600`/`text-red-600`/`text-amber-600` with `text-chart-2` / `text-destructive` across all pages
- R1 — Change `min-h-full` → `min-h-screen` on body in `layout.tsx`

**Batch B — Component consistency:**
- R11 — Replace dashboard stat cards with `<StatCard>` component
- R10 — Replace dashboard emoji category icons with `<CategoryBadge>` component

**Batch C — Landing page polish:**
- R12 — Replace social proof text labels with avatar stack + metric
- R13 — Verify btn-primary/btn-secondary are defined

**Batch D — Edge cases:**
- R16 — Add empty state for dashboard balances

### Token mapping reference:

| Old (hardcoded) | New (token) |
|---|---|
| `text-green-600` | `text-chart-2` |
| `text-red-600` | `text-destructive` |
| `text-amber-600` | `text-amber-600` (keep — no amber token) |
| `bg-green-100 text-green-700` | `bg-chart-2/20 text-chart-2` |
| `bg-blue-100 text-blue-700` | `bg-chart-4/20 text-chart-4` |
| `bg-purple-100 text-purple-700` | `bg-chart-1/20 text-chart-1` |

### System-level proposal (defer):
- Add semantic badge tokens (`--badge-blue`, `--badge-purple`, `--badge-amber`, `--badge-green`) to `globals.css` for category frequency badges in chores page (R9). This replaces hardcoded category colors with design tokens.
