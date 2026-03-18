# Create Heist Form

## Context
The `/heists/create` page is an empty shell. This plan implements the full form so users can create heist documents in Firestore and assign them to other users. The form uses existing types (`CreateHeistInput`) and Firebase utilities (`getClientDb`), and follows the form patterns established in the login/signup pages.

## Files

| File | Action |
|------|--------|
| `types/firestore/index.ts` | Modify — add `USERS: "users"` to `COLLECTIONS` |
| `hooks/useUsers.ts` | Create — hook to fetch all user docs, excluding current user |
| `app/(dashboard)/heists/create/create.module.css` | Create — form styles following login/signup pattern |
| `app/(dashboard)/heists/create/page.tsx` | Modify — full form implementation |
| `tests/app/heists/create/CreateHeistPage.test.tsx` | Create — unit tests |

## Implementation

### 1. `types/firestore/index.ts`
Add `USERS: "users"` to `COLLECTIONS` so both collections use the shared constant.

### 2. `hooks/useUsers.ts`
New hook: `useUsers(excludeUid?: string) => { users: UserDoc[], loading: boolean }`
- `UserDoc = { id: string, codename: string }`
- On mount, `getDocs(collection(getClientDb(), COLLECTIONS.USERS))`
- Map snapshot to `{ id: doc.id, codename: doc.data().codename }`
- Filter out `excludeUid`
- Follows the same pattern as `hooks/useUser.ts`

### 3. `app/(dashboard)/heists/create/create.module.css`
- `@reference "../../../../globals.css"` at top
- Reuse login/signup field patterns: `.form`, `.fieldGroup`, `.input`, `.error`
- Add `.select` (same as `.input`), `.textarea` (extends `.input` with min-height + resize)
- Add `.emptyMessage` for "no other agents available" state

### 4. `app/(dashboard)/heists/create/page.tsx`
Convert to `"use client"`. Form with three visible fields:

- **Title** — text input, `required`
- **Description** — textarea, `required`
- **Assign To** — `<select>` populated by `useUsers(user.uid)`
  - Loading state: disabled option "Loading agents..."
  - Empty state: message "No other agents available"

On submit, build `CreateHeistInput`:
- `createdBy`: `user.uid`
- `createdByCodeName`: `user.displayName ?? "Unknown Agent"`
- `assignedTo` / `assignedToCodeName`: from selected user in dropdown
- `createdAt`: `serverTimestamp()`
- `deadline`: `new Date(Date.now() + 48 * 60 * 60 * 1000)`
- `finalStatus`: `null`

Call `addDoc(collection(getClientDb(), COLLECTIONS.HEISTS), data)`, then `router.push("/heists")`.

### 5. Tests (`tests/app/heists/create/CreateHeistPage.test.tsx`)
Mock setup following `tests/pages/auth.test.tsx` pattern:
- Mock `next/navigation`, `firebase/firestore`, `@/lib/firebase/config`, `@/hooks/useUser`, `@/hooks/useUsers`

Test cases:
1. Renders title input, description textarea, assignee dropdown, and submit button
2. Dropdown lists users from `useUsers`, excludes current user
3. Empty users → shows "no other agents" message
4. Loading users → dropdown disabled with loading text
5. Successful submit → `addDoc` called with correct `CreateHeistInput`, redirects to `/heists`
6. Failed submit → inline error message
7. Submit button disabled while submitting
8. Null `displayName` → falls back to `"Unknown Agent"` for `createdByCodeName`

## Key references
- Form pattern: `app/(public)/signup/page.tsx`
- CSS module pattern: `app/(public)/login/login.module.css`
- Test pattern: `tests/pages/auth.test.tsx`
- Types: `types/firestore/heist.ts` (`CreateHeistInput`, `COLLECTIONS`)
- Firebase: `lib/firebase/config.ts` (`getClientDb`)
- Auth hook: `hooks/useUser.ts`

## Verification
1. `npm run lint` — no errors
2. `npm run test` — all tests pass
3. Manual: visit `/heists/create`, fill form, submit → document appears in Firestore, redirect to `/heists`
