# Spec for Firebase Signup with Codename Generation

## Functional requirements
- The signup page at `app/(public)/signup/page.tsx` must render a form with email, password, and confirm password fields, and a submit button
- On form submission, create a new Firebase Auth user using `createUserWithEmailAndPassword` from the Firebase web SDK, using the `auth` export from `lib/firebase/config.ts`
- After successful account creation, generate a random codename by selecting one word from each of three distinct word sets and joining them in PascalCase (e.g. `CrimsonSilentFox`)
- Update the newly created user's Firebase Auth profile `displayName` with the generated codename
- Create a document in the Firestore `users` collection (using the `db` export from `lib/firebase/config.ts`) with the following fields only: `id` (the Firebase Auth user UID) and `codename` (the generated display name) — the user's email must NOT be stored
- On success, redirect the user to `/heists`
- On failure, display a user-friendly error message inline in the form

## Figma design reference (only if referenced)
- N/A

## Possible edge cases
- Passwords do not match — show validation error before submitting to Firebase
- Email is already registered — surface Firebase auth error to the user
- Weak password (Firebase enforces minimum length) — surface error to the user
- Firestore write fails after auth user is created — the user is authenticated but has no `users` document; this should be handled gracefully
- Network error during signup — display a generic error message
- Codename collision in Firestore is acceptable; uniqueness is not required

## Acceptance criteria
- The signup form collects email, password, and confirm password
- Submitting with mismatched passwords shows an error and does not call Firebase
- A valid submission creates a Firebase Auth user
- The user's `displayName` is set to a randomly generated PascalCase codename composed of one word from each of three independent word sets
- A document is written to the `users` Firestore collection containing only `id` and `codename`
- The user's email is never written to Firestore
- After successful signup the user is redirected to `/heists`
- Auth and Firestore errors are displayed to the user in a readable form
- The implementation uses only the Firebase web SDK (no Admin SDK, no server-side Firebase)
- All Firebase interactions use the `auth` and `db` exports from `lib/firebase/config.ts`

## Open questions
- Should the word lists be hardcoded in the codebase or loaded from an external source? load from the new file, and store them there
- How many words should be in each word set — is there a minimum vocabulary size for adequate randomness? no
- Should the codename be regenerated if it happens to match a profanity or blocked term? no
- Is there a desired thematic style for the word sets (e.g. heist/crime-themed adjectives and nouns)? yes. nouns

## Testing Guidelines
Create a test file in ./tests folder for the new feature, and create meaningful tests for the following cases without going too heavy:
- Codename generator returns a string composed of exactly three PascalCase words joined together
- Codename generator always picks from all three word sets
- Codename generator produces different results across multiple calls (non-deterministic)
- Signup form renders email, password, and confirm password fields
- Mismatched passwords show a validation error and do not invoke Firebase
- Successful form submission calls Firebase auth and Firestore write with correct arguments
- Auth errors are surfaced to the user as readable messages
