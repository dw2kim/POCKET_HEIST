# Low Priority Tech Debt

## 1. Signup input missing `w-full`

**File:** `app/(public)/signup/signup.module.css`

The `.input` rule is missing `w-full`, unlike the login form's `.input`. Causes signup inputs to not fill their container.

**Fix:** Add `w-full` to the signup `.input` class.

---

## 2. Home page missing auth-based redirect

**File:** `app/(public)/page.tsx`

Comment says the page should redirect unauthenticated users to `/login`, but no redirect logic exists. The public layout now handles authenticated users, but the comment is misleading.

**Fix:** Either implement the redirect or update/remove the stale comment to reflect the actual intent.

---

## 3. `getInitials` assumption undocumented

**File:** `components/Avatar/Avatar.tsx`

The function relies on PascalCase codenames to extract initials via uppercase letter matching. This assumption is not documented and could confuse future contributors.

**Fix:** Add a brief JSDoc comment explaining the PascalCase assumption and fallback behavior.

---

## 4. Semicolons in home page

**File:** `app/(public)/page.tsx`

Has semicolons after the `lucide-react` import and closing JSX expression, violating the project's no-semicolons convention.

**Fix:** Remove the semicolons.
