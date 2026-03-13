# Firebase Login Form

## Context
The login page (`app/(public)/login/page.tsx`) is a skeleton with just a heading. We need to wire it up with Firebase Auth so users can log in with email/password and see a success message. The signup page is already implemented and serves as the reference pattern. No redirect after login — just an inline success message.

## Plan

### Step 1: Create login form styles — `app/(public)/login/login.module.css` (new)
- Reuse the same class names and pattern as `signup.module.css`
- Add `@reference "../../globals.css"` for Tailwind 4 CSS module compatibility
- Classes: `.form`, `.fieldGroup`, `.input`, `.error`, `.link`
- Add `.success` class using `text-success` for the welcome message

### Step 2: Build login form — `app/(public)/login/page.tsx` (modify)
- `"use client"` component with `useState` for email, password, error, loading, success
- Import `signInWithEmailAndPassword` from `firebase/auth`
- Import `getClientAuth` from `@/lib/firebase/config`
- Fields: email, password, submit button ("Log In"), link to `/signup`
- Password visibility toggle button (show/hide) — existing tests expect this
- Submit handler:
  1. `signInWithEmailAndPassword(getClientAuth(), email, password)`
  2. On success: set success state with `user.displayName` (fallback to "You're logged in!" if null)
  3. Do not clear form fields on success
  4. No redirect
  5. Map Firebase error codes to friendly messages on failure (`auth/invalid-credential`, `auth/invalid-email`, `auth/user-not-found`, `auth/too-many-requests`)
- Success message:
  - Shows "Welcome back, {codename}!" inline
  - Persists until the user navigates away (no auto-dismiss, no dismiss button)

### Step 3: Update tests — `tests/pages/auth.test.tsx` (modify)
- Add `signInWithEmailAndPassword` to the `firebase/auth` mock
- Rewrite LoginPage tests:
  - Renders email, password, and submit button
  - Has link to signup page
  - Successful login shows welcome message with codename
  - Wrong credentials show friendly error
  - `signInWithEmailAndPassword` called with correct auth instance and credentials
- Keep password toggle test (already exists, will work once login page has the toggle)
- Keep all existing SignupPage tests unchanged

## Key files
| File | Action |
|------|--------|
| `app/(public)/login/page.tsx` | Modify |
| `app/(public)/login/login.module.css` | Create |
| `tests/pages/auth.test.tsx` | Modify |

## Verification
1. `npm run test` — all tests pass (login + signup + codename)
2. `npm run build` — no type errors
3. `npm run dev` → navigate to `/login` → log in with existing account → see welcome message