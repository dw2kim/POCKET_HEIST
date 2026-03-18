# Spec for useHeist Hook

## Scope
- What this feature includes: a `useHeist` React hook that subscribes to the Firestore `heists` collection in real-time and returns a filtered array of `Heist` objects based on a `mode` argument (`"active"`, `"assigned"`, or `"expired"`); and wiring up the hook on the `/heists` dashboard page to display heist titles under each of the three sections
- What this feature does NOT include: pagination, sorting UI, heist detail navigation, creating or mutating heists, or displaying any heist fields beyond title on the dashboard page

## Functional requirements
- The hook accepts a single `mode` argument of type `"active" | "assigned" | "expired"`
- The hook resolves the current user's UID via `useUser` and only subscribes once the UID is available
- The hook uses `onSnapshot` for real-time updates and unsubscribes on cleanup
- For `"active"` mode: query heists where `assignedTo` equals the current user's UID and `deadline` is greater than now
- For `"assigned"` mode: query heists where `createdBy` equals the current user's UID and `deadline` is greater than now
- For `"expired"` mode: query heists where `deadline` is less than or equal to now and `finalStatus` is not null — no user filter applied
- The hook applies the `heistConverter` to deserialize Firestore documents into typed `Heist` objects
- The hook returns `{ heists: Heist[], loading: boolean }`
- The `/heists` page calls the hook three times (once per mode) and renders a list of heist titles under each of the three existing section headings: "Your Active Heists", "Heists You've Assigned", "All Expired Heists"
- While loading, each section shows a loading placeholder text
- If a section has no results, it shows a short empty-state message

## Dependencies
- `hooks/useUser.ts` — provides the current authenticated user's UID
- `types/firestore/heist.ts` — `Heist` type and `heistConverter`
- `types/firestore/index.ts` — `COLLECTIONS.HEISTS` constant
- `lib/firebase/config.ts` — `getClientDb()`
- `app/(dashboard)/heists/page.tsx` — page where the hook is consumed

## Figma design reference (only if referenced)
- N/A

## Possible edge cases
- Current user is not yet resolved (auth loading) — hook should not subscribe until UID is available; return `loading: true` in this state
- Firestore query returns zero documents — each section should render an empty-state message rather than nothing
- User's UID changes mid-session (sign-out / sign-in) — the snapshot listener should be torn down and re-established
- `expired` mode has no user dependency — it should still subscribe even if UID is not yet resolved, as long as auth loading is complete and the user is confirmed to be logged in (consistent with route guard behaviour)
- Clock skew: deadline comparison uses the client-side `new Date()` at subscription time, not a server-side timestamp

## Acceptance criteria
- `useHeist("active")` returns only heists where `assignedTo === currentUser.uid` and `deadline > now`
- `useHeist("assigned")` returns only heists where `createdBy === currentUser.uid` and `deadline > now`
- `useHeist("expired")` returns only heists where `deadline <= now` and `finalStatus !== null`
- Adding or updating a heist document in Firestore causes the relevant section to update without a page refresh
- The `/heists` page renders a title list under each of the three sections, or an empty-state message if the list is empty
- The hook is named `useHeist` and lives at `hooks/useHeist.ts`

## Open questions
- Should `"expired"` mode require the user to be logged in at all, given it ignores user filters? **(nice-to-have)** — current route guard already ensures auth, so this is consistent
- Should the deadline comparison for `"expired"` use a Firestore `where` clause with `Timestamp.now()` or a client-side `new Date()`? **(nice-to-have)** — Firestore `where` with a `Timestamp` is more reliable but requires importing `Timestamp`

## Testing Guidelines
Create a test file in `./tests/hooks/useHeist.test.ts` for the new feature, and create meaningful tests for the following cases without going too heavy:
- Returns `loading: true` before the snapshot resolves
- Returns the correct filtered heist list for each mode (`"active"`, `"assigned"`, `"expired"`)
- Returns an empty array when no documents match the query
- Unsubscribes from the snapshot listener on unmount
