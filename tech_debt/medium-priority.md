# Medium Priority Tech Debt

## 1. `handleLogout` silently swallows errors

**File:** `components/Navbar/Navbar.tsx`

`signOut()` returns a Promise that is never awaited or caught. If it rejects (e.g. network failure), the user gets no feedback.

**Fix:** Await and catch the error, surface it via console or a toast.

---

## 2. Firebase config reinitializes on every call

**File:** `lib/firebase/config.ts`

`getClientAuth()` and `getClientDb()` call `getApp()` on every invocation, which runs `getApps()` each time. The instances should be module-level singletons initialized once.

**Fix:** Promote to `export const clientAuth = getAuth(app)` and `export const clientDb = getFirestore(app)` at module scope. Update all call sites.

---

## 3. Duplicated Firebase error type casting

**Files:** `app/(public)/login/page.tsx`, `app/(public)/signup/page.tsx`

Both files manually cast `(err as { code?: string }).code`. This is duplicated and bypasses TypeScript safety.

**Fix:** Extract a shared `getFirebaseErrorCode(err: unknown): string` helper in `lib/firebase/errors.ts`.

---

## 4. Hardcoded hex colors in Navbar CSS

**File:** `components/Navbar/Navbar.module.css`

`#1e2939` (border), `#9810fa` / `#e60076` (gradient) bypass the `@theme` design tokens in `globals.css`.

**Fix:** Add named tokens (`--color-border`, `--color-gradient-from`, `--color-gradient-to`) to `@theme` and reference them.

---

## 5. Inline styles in preview page

**File:** `app/(public)/preview/page.tsx`

Uses a `style` prop with multiple inline CSS properties, violating the project's `@apply` convention.

**Fix:** Move to a CSS class using `@apply flex items-center gap-4 mt-4`.
