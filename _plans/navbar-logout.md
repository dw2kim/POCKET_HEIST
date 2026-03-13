# Navbar Logout Button

## Context
The Navbar (`components/Navbar/Navbar.tsx`) is currently a stateless server component with no auth awareness. We need to add a logout button that only appears when a user is signed in, shows the user's codename, and calls Firebase `signOut` immediately on click. No redirect after logout. This is the first use of `onAuthStateChanged` in the codebase.

## Plan

### Step 1: Update Navbar styles — `components/Navbar/Navbar.module.css` (modify)
- Add `.logoutBtn` class — ghost/text style button using `text-body`, hover to `text-heading`, with `cursor-pointer`
- Add `.siteNav ul` rule with `flex items-center gap-2` to space the nav items
- Add `.codename` class — `text-body text-sm` for the display name next to logout

### Step 2: Convert Navbar to client component — `components/Navbar/Navbar.tsx` (modify)
- Add `"use client"` directive
- Import `useState`, `useEffect` from React
- Import `onAuthStateChanged`, `signOut`, `User` from `firebase/auth`
- Import `getClientAuth` from `@/lib/firebase/config`
- Add auth state subscription:
  - `useState<User | null>(null)` for user
  - `useEffect` with `onAuthStateChanged(getClientAuth(), setUser)` and cleanup
- Add `handleLogout` — calls `signOut(getClientAuth())`, no redirect
- In the `<ul>`, after "Create Heist", conditionally render when `user` is truthy:
  - A `<span>` showing `user.displayName` (the codename)
  - A `<button>` with text "Log Out" using `styles.logoutBtn`

### Step 3: Update tests — `tests/components/Navbar.test.tsx` (modify)
- Add Firebase auth mocks (`onAuthStateChanged`, `signOut`, `getClientAuth`) following the pattern from `tests/pages/auth.test.tsx`
- Capture the `onAuthStateChanged` callback so tests can simulate auth state changes
- Keep existing tests (heading, Create Heist link) — they pass regardless of auth state
- Add new tests:
  - Does not show logout button when no user is signed in
  - Shows logout button when user is signed in
  - Shows the user's codename when signed in
  - Calls `signOut` when logout button is clicked

## Key files
| File | Action |
|------|--------|
| `components/Navbar/Navbar.tsx` | Modify — add `"use client"`, auth subscription, logout button |
| `components/Navbar/Navbar.module.css` | Modify — add `.logoutBtn`, `.codename`, `ul` layout |
| `tests/components/Navbar.test.tsx` | Modify — add Firebase mocks & 4 new tests |

## Verification
1. `npm run test` — all tests pass (Navbar + auth + codename)
2. `npm run build` — no type errors
3. `npm run dev` → log in → navigate to `/heists` → see codename + "Log Out" button → click → button disappears