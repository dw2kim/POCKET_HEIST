# Plan: HeistCard Component

## Context
The `/heists` dashboard currently renders heist titles as plain `<li>` elements. The spec calls for a `HeistCard` component matching the Figma design — showing title, assigned agent, creator agent, and a deadline with time-remaining — displayed in a responsive 3-column grid for the active and assigned sections. The expired section stays as a plain list.

**Spec:** `_specs/heist-card-component.md`

---

## Step 1: Create `utils/formatTimeRemaining.ts`

Pure function: `formatTimeRemaining(deadline: Date, now?: Date): string`

- `diffMs < 0` → `"Overdue"`
- `≥ 24h` → `"Xd Yh"` (e.g. `"1d 4h"`)
- `1–24h` → `"Xh Ym"` (e.g. `"4h 42m"`)
- `< 1h` → `"Xm"` (e.g. `"42m"`)
- Exactly 0 → `"0m"` (not overdue)

Optional `now` param for deterministic tests.

## Step 2: Create `tests/utils/formatTimeRemaining.test.ts`

Test cases: days+hours, hours+minutes, minutes only, exactly 0, overdue, boundary at 24h and 1h.

## Step 3: Create `components/HeistCard/HeistCard.module.css`

`@reference "../../app/globals.css"` — following Navbar pattern.

Key classes from Figma:
- `.card` — `bg-lighter`, `border border-[#1e2939]`, `rounded-[10px]`, padding ~21px, flex column, gap 12px
- `.cardHeader` — flex row, justify-between, align-start
- `.title` — 16px white, line-height 24px, letter-spacing -0.31px, `line-clamp-2`
- `.metaRow` — flex row, items-center, gap 8px
- `.metaLabel` / `.metaValuePrimary` / `.metaValueSecondary` — 14px, body/primary/secondary colors
- `.deadlineText` — 14px body color
- `.timeRemaining` — 14px primary color
- `.skeleton` — pulse animation placeholder blocks

## Step 4: Create `components/HeistCard/HeistCard.tsx` + `index.ts`

**HeistCard** (default export):
- Props: `{ heist: Heist }`
- Layout: card shell → header row (title as `<Link>` to `/heists/[id]` + `Clock` icon 16px) → 3 meta rows
  - Row 1: `User` icon (12px) + "To:" + `assignedToCodeName` in primary
  - Row 2: `UserPen` icon (12px) + "By:" + `createdByCodeName` in secondary
  - Row 3: `CalendarClock` icon (12px) + formatted date + `•` + `formatTimeRemaining(deadline)`
- Fallback "Unknown Agent" if codenames are empty
- Icons from `lucide-react` (already a project dependency)
- No `"use client"` needed — pure presentational, no hooks/handlers

**HeistCardSkeleton** (named export):
- Same card shell with 4 animated pulse `<div>` placeholder blocks
- No props

**`index.ts`**: `export { default, HeistCardSkeleton } from "./HeistCard"`

## Step 5: Create `tests/components/HeistCard.test.tsx`

No Firebase mocks needed — HeistCard is pure presentational.

Test cases:
- Renders title as link to `/heists/[id]`
- Shows `assignedToCodeName` in "To:" row
- Shows `createdByCodeName` in "By:" row
- Shows "Overdue" when deadline is past
- Shows formatted time when deadline is future
- `HeistCardSkeleton` renders without crashing

## Step 6: Add `.grid` class to `app/(dashboard)/heists/heists.module.css`

```css
.grid {
  @apply mt-2 grid grid-cols-1 gap-4;
}
```
With responsive breakpoints: 2 cols at `sm` (640px), 3 cols at `lg` (1024px).

## Step 7: Update `app/(dashboard)/heists/page.tsx`

- Import `HeistCard`, `HeistCardSkeleton` from `@/components/HeistCard`
- Add local `HeistCardGrid` helper: loading → 3 `HeistCardSkeleton` in grid, empty → message, otherwise → cards in grid
- Active and assigned sections use `HeistCardGrid`
- Expired section keeps existing `HeistList` (unchanged)

---

## Files Summary

| File | Action |
|---|---|
| `utils/formatTimeRemaining.ts` | Create |
| `tests/utils/formatTimeRemaining.test.ts` | Create |
| `components/HeistCard/HeistCard.module.css` | Create |
| `components/HeistCard/HeistCard.tsx` | Create |
| `components/HeistCard/index.ts` | Create |
| `tests/components/HeistCard.test.tsx` | Create |
| `app/(dashboard)/heists/heists.module.css` | Modify — add `.grid` |
| `app/(dashboard)/heists/page.tsx` | Modify — wire HeistCardGrid |

## Verification

1. `npx vitest run tests/utils/formatTimeRemaining.test.ts` — all cases pass
2. `npx vitest run tests/components/HeistCard.test.tsx` — all 6 cases pass
3. `npm run lint` — clean
4. `npm run build` — compiles
5. `npm run dev` → `/heists` → active/assigned show card grid, expired shows plain list, loading shows skeleton cards
