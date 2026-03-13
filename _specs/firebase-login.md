# Spec for Firebase Login Form

## Scope
- What this feature includes: Build out the login page with email and password fields, wire it to Firebase Auth using `signInWithEmailAndPassword`, and show a success message on login
- What this feature does NOT include: Post-login redirect, session persistence across pages, password reset flow, or any dashboard gating behind auth

## Functional requirements
- The login page at `app/(public)/login/page.tsx` must render a form with email and password fields, and a "Log In" submit button
- On form submission, authenticate the user via Firebase Auth `signInWithEmailAndPassword` using the `getClientAuth()` export from `lib/firebase/config.ts`
- On successful login, display a success message inline (e.g. "Welcome back, {codename}!") using the user's `displayName` from their Firebase Auth profile
- On failure, display a user-friendly error message inline in the form
- Include a link to `/signup` for users who don't have an account
- The login page should reuse the same form styling patterns as the signup page (CSS module with `@apply` directives referencing `globals.css`)

## Dependencies
- `lib/firebase/config.ts` — existing Firebase client config with `getClientAuth()`
- `app/(public)/signup/page.tsx` — reference for form structure, error handling pattern, and styling approach
- `app/(public)/signup/signup.module.css` — reference for CSS module pattern
- `app/globals.css` — global theme tokens and utility classes (`.center-content`, `.page-content`, `.form-title`, `.btn`)
- Existing `tests/pages/auth.test.tsx` — contains LoginPage test stubs that currently fail because the page is a skeleton; these tests need to be updated to match the new implementation

## Figma design reference (only if referenced)
- N/A

## Possible edge cases
- Invalid email format — surface Firebase auth error to the user
- Wrong password — surface Firebase auth error without revealing whether the email exists
- User account does not exist — surface Firebase auth error
- Network error during login — display a generic error message
- User's `displayName` is null (e.g. account created outside the app) — fall back to a generic success message like "You're logged in!"
- Rapid repeated submissions — disable the button while loading to prevent duplicate calls

## Acceptance criteria
- The login form collects email and password
- Submitting with valid credentials calls `signInWithEmailAndPassword` with the correct arguments
- On success, a welcome message is displayed inline showing the user's codename (displayName)
- No redirect happens after successful login
- Auth errors (wrong password, user not found, invalid email) are displayed as readable messages
- A link to `/signup` is present for new users
- The form uses a CSS module following the same pattern as the signup page
- The existing LoginPage tests in `tests/pages/auth.test.tsx` are updated to reflect the new form (replacing the skeleton-based tests that currently fail)

## Open questions
- **(nice-to-have)** Should the success message disappear after a timeout, or persist until the user navigates away? The success message should persist until the user navigates away. No auto-dismiss, no dismiss button.
- **(nice-to-have)** Should the form fields be cleared after a successful login? No, form fields should remain as-is after login.

## Testing Guidelines
Create a test file in ./tests folder for the new feature, and create meaningful tests for the following cases without going too heavy:
- Login form renders email input, password input, and submit button
- Login form has a link to the signup page
- Successful login displays a welcome message containing the user's codename
- Wrong credentials show a user-friendly error message
- Firebase `signInWithEmailAndPassword` is called with the correct auth instance and credentials
