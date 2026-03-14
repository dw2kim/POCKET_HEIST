# Spec for Auth Route Guards

## Scope
- What this feature includes: A `useUser` hook that subscribes to Firebase auth state, route protection in both route group layouts that redirects users based on their auth status, and a transient loading state shown while Firebase resolves the initial auth check.
- What this feature does NOT include: Role-based access control, server-side auth checks, middleware-based redirects, or any changes to the login/signup form logic.

## Functional requirements
- A `useUser` hook is created that subscribes to `onAuthStateChanged` and returns the current user and a boolean `loading` flag
- `loading` is `true` until Firebase has resolved the initial auth state; it becomes `false` once the first callback fires
- The `(public)` group layout (`app/(public)/layout.tsx`) uses `useUser` to redirect authenticated users — e.g. away from `/login`, `/signup`, and `/` — to `/heists`
- The `(dashboard)` group layout (`app/(dashboard)/layout.tsx`) uses `useUser` to redirect unauthenticated users to `/login`
- While `loading` is `true`, both layouts render a minimal, non-disruptive loading indicator rather than the page content or a redirect, preventing a flash of protected content
- Once `loading` is `false`, the appropriate redirect or page render takes place

## Dependencies
- `lib/firebase/config.ts` — provides `getClientAuth()` for accessing the Firebase Auth instance
- `firebase/auth` — `onAuthStateChanged`, `User`
- `app/(public)/layout.tsx` — public group layout to be converted to a client component and guarded
- `app/(dashboard)/layout.tsx` — dashboard group layout to be converted to a client component and guarded
- `next/navigation` — `useRouter` for programmatic redirect
- `components/Navbar/Navbar.tsx` — already a client component; rendered inside the dashboard layout

## Figma design reference (only if referenced)
- https://www.figma.com/design/ekUtcj4lDIWWoZJVsLBZL8/Daewon---Heist-Exercise?node-id=1002-2&t=4I9kjo035g6sYVua-0

## Possible edge cases
- Firebase takes longer than expected to resolve auth state on cold load — loading indicator prevents content flash or premature redirect
- User manually navigates to `/login` while already authenticated — should be redirected to `/heists`
- User's session expires or they sign out in another tab — dashboard layout should detect the state change and redirect to `/login`
- `useUser` must clean up the `onAuthStateChanged` listener on unmount to avoid memory leaks

## Acceptance criteria
- Visiting `/login` or `/signup` while authenticated redirects to `/heists`
- Visiting `/heists` or any dashboard route while unauthenticated redirects to `/login`
- A simple loading state is shown in both layouts until Firebase auth state is resolved
- No flash of protected page content occurs before the redirect fires
- Unauthenticated users are never shown dashboard content
- Authenticated users are never shown public-only pages (login, signup, home)
- The `useUser` hook is a reusable, standalone hook in the `hooks/` directory

## Open questions
- **(nice-to-have)** Should the `/` (home/splash) page also redirect authenticated users away, or is it intentionally accessible to everyone? no
- **(nice-to-have)** Should the `/preview` page in the public group be excluded from the auth guard since it may be intentionally public for all? no

## Testing Guidelines
Create a test file in ./tests folder for the new feature, and create meaningful tests for the following cases without going too heavy:
- `useUser` returns `loading: true` before `onAuthStateChanged` fires
- `useUser` returns the user and `loading: false` after auth state resolves
- Dashboard layout redirects to `/login` when no user is present
- Public layout redirects to `/heists` when a user is present
- Loading indicator is rendered while auth state is unresolved
