# Auth Route Guards

## Context
Both route group layouts are currently server components with no auth awareness. Pages in `(public)` (login, signup, home) are currently accessible to authenticated users, and pages in `(dashboard)` are accessible to unauthenticated users. We need a shared `useUser` hook and guard logic in each layout that redirects users based on their auth state, with a simple loading placeholder shown while Firebase resolves the initial auth check.

## Plan

### Step 1: Create `useUser` hook — `hooks/useUser.ts` (create)
- Create the `hooks/` directory
- Export a `useUser()` hook that:
  - Holds `user: User | null` (starts `null`) and `loading: boolean` (starts `true`)
  - Subscribes to `onAuthStateChanged(getClientAuth(), (u) => { setUser(u); setLoading(false) })` in a `useEffect`
  - Returns the cleanup (unsubscribe) function from the effect
  - Returns `{ user, loading }`
- Imports: `useState`, `useEffect` from React; `onAuthStateChanged`, `User` from `firebase/auth`; `getClientAuth` from `@/lib/firebase/config`

### Step 2: Guard the dashboard layout — `app/(dashboard)/layout.tsx` (modify)
- Add `"use client"` directive
- Import `useUser` from `@/hooks/useUser`
- Import `useRouter` from `next/navigation`
- In a `useEffect` watching `[user, loading]`:
  - If `!loading && !user`: call `router.replace('/login')`
- While `loading` is `true`: render a simple full-screen placeholder — a `<div className="center-content">` with a brief `<p>` loading indicator
- Otherwise render the existing layout (`<Navbar />` + `<main>{children}</main>`)
- Keep the existing `Navbar` import — no changes to Navbar itself

### Step 3: Guard the public layout — `app/(public)/layout.tsx` (modify)
- Add `"use client"` directive
- Import `useUser` from `@/hooks/useUser`
- Import `useRouter` from `next/navigation`
- In a `useEffect` watching `[user, loading]`:
  - If `!loading && user`: call `router.replace('/heists')`
- While `loading` is `true`: render the same simple full-screen placeholder (a `<div className="center-content">` with a brief `<p>` loading indicator)
- Otherwise render `<main className="public">{children}</main>` as today

### Step 4: Write tests — `tests/hooks/useUser.test.tsx` (create) + `tests/layouts/` (create)
- **`tests/hooks/useUser.test.tsx`**:
  - Mock `firebase/auth` (capture `onAuthStateChanged` callback) and `@/lib/firebase/config`
  - Test: returns `loading: true` before the callback fires
  - Test: returns `user` and `loading: false` after callback fires with a user
  - Test: returns `null` user and `loading: false` after callback fires with `null`

- **`tests/layouts/dashboard.test.tsx`**:
  - Mock `useUser` to control `{ user, loading }` state
  - Mock `next/navigation` (`useRouter`)
  - Test: shows loading indicator while `loading: true`
  - Test: redirects to `/login` when `loading: false` and `user` is `null`
  - Test: renders children when `loading: false` and `user` is present

- **`tests/layouts/public.test.tsx`**:
  - Same mock pattern
  - Test: shows loading indicator while `loading: true`
  - Test: redirects to `/heists` when `loading: false` and `user` is present
  - Test: renders children when `loading: false` and `user` is `null`

## Key files
| File | Action |
|------|--------|
| `hooks/useUser.ts` | Create — shared auth state hook |
| `app/(dashboard)/layout.tsx` | Modify — add `"use client"`, guard via `useUser`, loading state |
| `app/(public)/layout.tsx` | Modify — add `"use client"`, guard via `useUser`, loading state |
| `tests/hooks/useUser.test.tsx` | Create — unit tests for useUser hook |
| `tests/layouts/dashboard.test.tsx` | Create — redirect + loading tests |
| `tests/layouts/public.test.tsx` | Create — redirect + loading tests |

## Verification
1. `npm run test` — all tests pass
2. `npm run build` — no type errors
3. `npm run dev` → visit `/login` while signed in → redirected to `/heists`
4. `npm run dev` → visit `/heists` while signed out → redirected to `/login`
5. On cold load, a brief loading state appears before any redirect or page renders
