# Plan: useHeist Hook for Real-time Firestore Data

## Context
The `/heists` dashboard page has three placeholder sections (active, assigned, expired) with no data. We need a `useHeist(mode)` hook that subscribes to the Firestore `heists` collection in real-time via `onSnapshot`, filtered by mode, and wire it into the page to display heist titles.

**Spec:** `_specs/use-heist-hook.md`
**Worktree:** `../POCKET_HEIST-use-heist-hook` (branch: `claude/feature/use-heist-hook`)

---

## Step 1: Create `hooks/useHeist.ts`

Create the hook following the existing `useUser.ts` pattern (useState + useEffect + cleanup).

- Export a `HeistMode` type: `"active" | "assigned" | "expired"`
- Internal `buildQuery(mode, uid)` helper that constructs the Firestore query:
  - `"active"`: `assignedTo == uid` AND `deadline > Timestamp.now()`
  - `"assigned"`: `createdBy == uid` AND `deadline > Timestamp.now()`
  - `"expired"`: `deadline <= Timestamp.now()` AND `finalStatus != null`
- Attach `heistConverter` via `.withConverter()` on the collection ref
- Gate subscription on `!userLoading` (and `user?.uid` for active/assigned)
- Return `{ heists: Heist[], loading: boolean }`

**Reuse:**
- `useUser` from `hooks/useUser.ts` — for current user UID
- `heistConverter` from `types/firestore/heist.ts` — Firestore doc → `Heist`
- `COLLECTIONS.HEISTS` from `types/firestore/index.ts`
- `getClientDb()` from `lib/firebase/config.ts`

**Imports needed from `firebase/firestore`:** `collection`, `query`, `where`, `onSnapshot`, `Timestamp`

## Step 2: Modify `app/(dashboard)/heists/page.tsx`

- Add `"use client"` directive
- Import `useHeist` and CSS module
- Call `useHeist("active")`, `useHeist("assigned")`, `useHeist("expired")`
- Create a local `HeistList` component (not extracted — single use) that renders:
  - Loading text when `loading` is true
  - Empty-state message when `heists` is empty
  - `<ul>` of `<li>` with `heist.title` otherwise
- Wrap each section in `<section>` with CSS module class

## Step 3: Create `app/(dashboard)/heists/heists.module.css`

Follow `Navbar.module.css` pattern:
- `@reference` to `../../globals.css` (up: `heists` → `(dashboard)` → `app`)
- Classes needed: `.section`, `.list`, `.listItem`, `.emptyMessage`, `.loadingMessage`

## Step 4: Create `tests/hooks/useHeist.test.tsx`

Follow `tests/hooks/useUser.test.tsx` pattern:

Mock:
- `firebase/firestore` — `collection`, `query`, `where`, `onSnapshot`, `Timestamp`
- `@/lib/firebase/config` — `getClientDb`
- `@/hooks/useUser` — return controllable `{ user, loading }`

Test cases:
1. Returns `loading: true` before snapshot resolves
2. Returns correct heists for each mode after snapshot fires
3. Returns empty array when no docs match
4. Calls unsubscribe on unmount

---

## Firestore Composite Indexes

Three composite indexes will be needed (Firestore logs creation links in browser console):
- `heists`: `assignedTo` (==) + `deadline` (asc)
- `heists`: `createdBy` (==) + `deadline` (asc)
- `heists`: `deadline` (desc) + `finalStatus` (!=)

## Verification

1. `npm run lint` — passes
2. `npx vitest run tests/hooks/useHeist.test.tsx` — all 4 tests pass
3. `npm run build` — compiles without errors
4. `npm run dev` → navigate to `/heists` → verify sections show loading → titles or empty states
5. Check browser console for composite index creation links during manual test
