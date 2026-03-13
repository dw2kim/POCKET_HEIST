# Spec for Navbar Logout Button

## Scope
- What this feature includes: Adding a logout button to the existing `Navbar` component that signs the user out via Firebase Auth. The button is only visible when a user is currently authenticated.
- What this feature does NOT include: Post-logout redirect, auth-gated route protection, or any changes to the login/signup pages.

## Functional requirements
- The `Navbar` component must detect whether a Firebase user is currently signed in
- When a user is signed in, a "Log Out" button is rendered in the navbar
- When no user is signed in, the logout button is not rendered
- Clicking the logout button calls Firebase Auth's `signOut` to end the session
- The Navbar must become a client component (`"use client"`) to subscribe to auth state

## Dependencies
- `components/Navbar/Navbar.tsx` — the existing Navbar component (currently a server component with no auth awareness)
- `components/Navbar/Navbar.module.css` — existing navbar styles
- `lib/firebase/config.ts` — provides `getClientAuth()` for accessing the Firebase Auth instance
- `app/(dashboard)/layout.tsx` — renders `<Navbar />` for all dashboard routes
- `app/globals.css` — global theme tokens including `.btn` class

## Figma design reference (only if referenced)
- File: https://www.figma.com/design/ekUtcj4lDIWWoZJVsLBZL8/Daewon---Heist-Exercise?node-id=1002-4&t=LRiFyRkJSIhF10eP-4
- Key visual constraints: Refer to the Figma node for button placement and styling within the navbar

## Possible edge cases
- User signs out in another tab — `onAuthStateChanged` listener should reflect the change
- `signOut` call fails (e.g. network error) — should handle gracefully without crashing the navbar
- Auth state is still loading on initial render — the logout button should not flash in or out; wait for auth state to resolve before showing/hiding

## Acceptance criteria
- The logout button appears in the navbar only when a user is signed in
- The logout button does not appear when no user is signed in
- Clicking the logout button successfully signs the user out via Firebase Auth
- The navbar updates reactively when auth state changes (sign-in or sign-out)
- Existing navbar elements (heading, "Create Heist" link) remain unchanged
- No redirect occurs after logout

## Open questions
- **(nice-to-have)** Should the user's codename or avatar be displayed next to the logout button?
- **(nice-to-have)** Should there be a confirmation prompt before signing out, or sign out immediately on click?

## Testing Guidelines
Create a test file in ./tests folder for the new feature, and create meaningful tests for the following cases without going too heavy:
- Navbar renders the logout button when a user is signed in
- Navbar does not render the logout button when no user is signed in
- Clicking the logout button calls Firebase `signOut`
- Existing navbar elements (heading, Create Heist link) still render correctly
