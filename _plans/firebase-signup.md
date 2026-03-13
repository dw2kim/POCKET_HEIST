# Firebase Signup with Codename Generation

## Context
The signup page (`app/(public)/signup/page.tsx`) is currently a skeleton with just a heading. We need to wire it up with Firebase Auth, add a codename generator, and store minimal user data in Firestore. This is the first Firebase integration in the project — the SDK isn't even installed yet.

## Plan

### Step 1: Install Firebase SDK
- `npm install firebase`

### Step 2: Create Firebase config — `lib/firebase/config.ts` (new)
- Initialize Firebase app with `NEXT_PUBLIC_FIREBASE_*` env vars
- Use `getApps().length === 0` guard to prevent re-init on hot reload
- Export `auth` (from `getAuth`) and `db` (from `getFirestore`)
- Create `.env.local.example` documenting required env vars

### Step 3: Create codename generator — `lib/codename.ts` (new)
- Three heist/crime-themed noun word sets (~10 words each), all PascalCase
- Export `generateCodename()` — picks one random word from each set, joins them
- Export the three arrays for test verification

### Step 4: Create signup form styles — `app/(public)/signup/signup.module.css` (new)
- `.form`, `.fieldGroup`, `.input`, `.error`, `.link` classes using `@apply`
- Reuse global `.form-title`, `.center-content`, `.page-content`, `.btn`

### Step 5: Build signup form — `app/(public)/signup/page.tsx` (modify)
- `"use client"` component with `useState` for email, password, confirmPassword, error, loading
- Fields: email, password, confirm password, submit button ("Sign Up"), link to `/login`
- Submit handler:
  1. Validate passwords match (error if not, don't call Firebase)
  2. `createUserWithEmailAndPassword(auth, email, password)`
  3. `generateCodename()` → `updateProfile(user, { displayName: codename })`
  4. `setDoc(doc(db, "users", uid), { id: uid, codename })` — no email stored
  5. `router.push("/heists")` on success
  6. Map Firebase error codes to friendly messages on failure
- If Firestore write fails after auth succeeds, still redirect (user is authenticated)

### Step 6: Write tests
**`tests/lib/codename.test.ts`** (new):
- Returns string of exactly 3 PascalCase words
- Each word from its respective set
- Non-deterministic across multiple calls

**`tests/pages/auth.test.tsx`** (modify):
- Fix existing `/password/i` selector to `/^password$/i` to avoid collision with "Confirm password"
- Add: renders confirm password field
- Add: mismatched passwords shows error, no Firebase call
- Add: successful submission calls Firebase auth + Firestore, redirects
- Add: auth error displayed to user
- Mock Firebase modules (`firebase/auth`, `firebase/firestore`, `@/lib/firebase/config`) and `next/navigation`

## Key files
| File | Action |
|------|--------|
| `lib/firebase/config.ts` | Create |
| `lib/codename.ts` | Create |
| `app/(public)/signup/page.tsx` | Modify |
| `app/(public)/signup/signup.module.css` | Create |
| `tests/lib/codename.test.ts` | Create |
| `tests/pages/auth.test.tsx` | Modify |

## Verification
1. `npm run test` — all existing + new tests pass
2. `npm run build` — no type errors
3. `npm run dev` → navigate to `/signup` → fill form → verify Firebase user created and redirected to `/heists`
