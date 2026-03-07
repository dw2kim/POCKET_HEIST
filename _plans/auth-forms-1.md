# Plan: Authentication Forms

## Context
The `/login` and `/signup` pages are currently placeholder shells with just a heading. We need to add working auth forms with email/password fields, a password visibility toggle, console-logging on submit, and cross-links between the two pages. No real auth backend — just the UI and console output for now.

## Approach
Create a single shared `AuthForm` client component that accepts a `mode` prop (`"login"` | `"signup"`) to control button text and the switch link. This avoids duplicating form logic across two pages and follows best practice (as noted in the spec's open questions).

## Files to create

### 1. `tests/components/AuthForm.test.tsx` (TDD — write first)
- Login mode renders email input, password input, and "Log In" button
- Signup mode renders email input, password input, and "Sign Up" button
- Password toggle switches input type between `password` and `text`
- Submitting with valid data calls `console.log` with `{ email, password }`
- Login form links to `/signup`, signup form links to `/login`
- Mock `next/link` as a plain `<a>` tag (same pattern as Navbar test)

### 2. `components/AuthForm/AuthForm.tsx`
- `"use client"` — needs `useState` for password visibility toggle
- Props: `mode: "login" | "signup"`
- `<form>` with `onSubmit` handler: `e.preventDefault()` then `console.log({ email, password })`
- Email `<input>`: `type="email"`, `required`, with `<label>`
- Password `<input>`: dynamic `type` (`password` | `text`), `required`, with `<label>`
- Toggle button: `Eye` / `EyeOff` icons from `lucide-react`, `aria-label` ("Show password" / "Hide password"), `type="button"`
- Submit button: text based on mode ("Log In" / "Sign Up")
- Switch link using `next/link`: "Don't have an account? Sign up" ↔ "Already have an account? Log in"

### 3. `components/AuthForm/AuthForm.module.css`
- Form layout styles using `@apply` with theme tokens from `globals.css`
- Password field wrapper for positioning the toggle icon over the input
- `@reference "../../app/globals.css"` for theme variables (same as Navbar pattern)

### 4. `components/AuthForm/index.ts`
- `export { default } from './AuthForm'`

## Files to modify

### 5. `app/(public)/login/page.tsx`
- Import `AuthForm`, render `<AuthForm mode="login" />`
- Keep the `center-content` / `page-content` wrapper

### 6. `app/(public)/signup/page.tsx`
- Import `AuthForm`, render `<AuthForm mode="signup" />`
- Keep the `center-content` / `page-content` wrapper

## Verification
1. `npx vitest run tests/components/AuthForm.test.tsx` — all tests pass
2. `npm run build` — no build errors
3. Manual: visit `/login` and `/signup`, fill form, submit, check console, toggle password, switch between forms
