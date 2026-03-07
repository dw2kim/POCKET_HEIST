# Plan: Authentication Forms

## Context
The `/login` and `/signup` pages are currently placeholder shells with just a heading. We need to add working auth forms with email/password fields, a password visibility toggle, console-logging on submit, and cross-links between the two pages. No real auth backend — just the UI and console output for now.

## Approach
Create a single shared `AuthForm` client component that accepts a `mode` prop (`"login"` | `"signup"`) to control button text and the switch link. This avoids duplicating form logic across two pages.

## Files to create

### 1. `tests/components/AuthForm.test.tsx`
Tests (written first, TDD):
- Login mode renders email input, password input, and "Log In" button
- Signup mode renders email input, password input, and "Sign Up" button
- Password toggle switches input type between `password` and `text`
- Submitting with valid data calls `console.log` with `{ email, password }`
- Login form links to `/signup`, signup form links to `/login`
- Mock `next/link` as a plain `<a>` tag (same pattern as other tests)

### 2. `components/AuthForm/AuthForm.tsx`
- `"use client"` — needs `useState` for password visibility toggle
- Props: `mode: "login" | "signup"`
- `<form>` with `onSubmit` handler that calls `e.preventDefault()` then `console.log({ email, password })`
- Email `<input>` with `type="email"`, `required`, `<label>` for accessibility
- Password `<input>` with dynamic `type` (`password` | `text`), `required`, `<label>`
- Toggle button using `Eye` / `EyeOff` icons from `lucide-react`, with `aria-label` ("Show password" / "Hide password"), `type="button"` to prevent form submission
- Submit button with text "Log In" or "Sign Up" based on mode
- Switch link: "Don't have an account? **Sign up**" (login) / "Already have an account? **Log in**" (signup) using `next/link`

### 3. `components/AuthForm/AuthForm.module.css`
- Form layout styles using `@apply` with theme tokens from `globals.css`
- Password field wrapper for positioning the toggle icon
- Use `@reference` to `globals.css` for theme variables

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
1. Run `npx vitest run tests/components/AuthForm.test.tsx` — all tests pass
2. Run `npm run build` — no build errors
3. Manual check: visit `/login` and `/signup`, fill form, submit, verify console output, toggle password, switch between forms
