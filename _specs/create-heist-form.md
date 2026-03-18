# Spec for Create Heist Form

## Scope
- What this feature includes: A functional form at `/heists/create` that writes a new Heist document to Firestore and redirects to `/heists` on success
- What this feature does NOT include: Editing an existing heist, deadline customisation beyond the fixed 48-hour window, or any heist status transitions

## Functional requirements
- The page is already accessible at `app/(dashboard)/heists/create/page.tsx` — implement the form there
- The form must be a client component (`"use client"`)
- **Fields shown to the user:**
  - `title` — text input, required
  - `description` — textarea, required
  - `assignedTo` — dropdown/select of other users fetched from the `users` Firestore collection, required
- **Fields derived automatically (not shown):**
  - `createdBy` — `user.uid` from `useUser()`
  - `createdByCodeName` — `user.displayName` from the auth user (set to the codename at signup)
  - `assignedToCodeName` — resolved from the selected user's `codename` field in the `users` collection
  - `createdAt` — `serverTimestamp()` (FieldValue)
  - `deadline` — `new Date(Date.now() + 48 * 60 * 60 * 1000)` computed on the client at submit time
  - `finalStatus` — always `null` on creation
- Fetch all users from the `users` Firestore collection on mount and exclude the currently logged-in user from the assignable list
- On submit, call `addDoc` on the `heists` collection using `heistConverter` and `CreateHeistInput` from `types/firestore`
- On success, redirect to `/heists` using `useRouter`
- Show an inline error message on Firestore write failure
- Disable the submit button while the form is submitting

## Dependencies
- `app/(dashboard)/heists/create/page.tsx` — page to be implemented
- `types/firestore/heist.ts` — `CreateHeistInput`, `heistConverter`, `COLLECTIONS`
- `types/firestore/index.ts` — barrel export
- `lib/firebase/config.ts` — `getClientDb()`
- `hooks/useUser.ts` — `useUser()` for current user's UID and display name
- `app/(public)/login/login.module.css` — reference for existing form field styling conventions
- `app/(public)/signup/page.tsx` — reference for the Firestore `users` document shape (`{ id, codename }`)

## Figma design reference (only if referenced)
- N/A

## Possible edge cases
- The `users` collection is empty (only one registered user) — the assignee dropdown will be empty; show a message explaining that no other users are available
- The user's `displayName` is `null` (e.g. auth profile update failed at signup) — fallback to `"Unknown Agent"` for `createdByCodeName`
- Firestore write succeeds but redirect fails — the heist is created but the user stays on the form; avoid double-submission by disabling the button after first success
- Slow network on mount — show a loading state in the assignee dropdown while users are being fetched

## Acceptance criteria
- Submitting the form with all valid inputs creates a document in the `heists` Firestore collection with the correct shape matching `CreateHeistInput`
- The newly created document has `finalStatus: null` and a `deadline` approximately 48 hours after `createdAt`
- After a successful write the user is redirected to `/heists`
- The assignee dropdown lists all users except the currently logged-in user, displaying their codename
- Submitting while fields are empty is prevented by HTML5 `required` validation
- An error message is shown if the Firestore write fails
- The submit button is disabled while a write is in progress

## Open questions
- **(nice-to-have)** Should the heist `title` have a maximum character length enforced on the client? no limit
- **(nice-to-have)** Should the `deadline` be fixed at exactly 48 hours or should the creator be able to choose a different window in the future? fixed at 48 hours

## Testing Guidelines
Create a test file at `tests/app/heists/create/CreateHeistPage.test.tsx` and cover:
- Renders the title, description, and assignee fields
- Assignee dropdown excludes the currently logged-in user
- Shows a loading/disabled state on the assignee dropdown while users are being fetched
- Submit button is disabled while the form is submitting
- A successful submission calls `addDoc` with the correct payload and redirects to `/heists`
- An error from `addDoc` displays an inline error message
- Shows a "no other users" message when the `users` collection only contains the current user
