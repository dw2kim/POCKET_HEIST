# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run lint      # Run ESLint
npm run test      # Run all tests (Vitest)
npx vitest run tests/components/Navbar.test.tsx  # Run a single test file
```

## Architecture

**Next.js App Router** with two route groups controlling layout:

- `app/(public)/` — No navbar: home (`/`), login, signup, preview
- `app/(dashboard)/` — Persistent `<Navbar />`: all `/heists/*` routes

The layout hierarchy is:
```
app/layout.tsx                  # Root (html/body)
├── app/(public)/layout.tsx     # Bare wrapper
└── app/(dashboard)/layout.tsx  # Injects <Navbar />
```

**Path alias:** `@/*` maps to the project root (e.g., `@/components/Navbar`).

## Routing

| Route | Purpose |
|---|---|
| `/` | Splash/home |
| `/login`, `/signup` | Auth pages (not yet wired) |
| `/heists` | Dashboard — three sections: active, assigned, expired |
| `/heists/create` | Create heist form |
| `/heists/[id]` | Heist detail |

## Styling

- **Tailwind CSS 4** via `@import "tailwindcss"` in `globals.css` — no `tailwind.config` file needed.
- Custom theme tokens are defined with `@theme` in `globals.css`:
  - Colors: `primary` (#C27AFF), `secondary` (#FB64B6), `dark` (#030712), `light`, `lighter`, `success`, `error`, `heading`, `body`
- Reusable layout classes defined globally: `.page-content`, `.center-content`, `.form-title`
- Component-scoped styles use CSS Modules (e.g., `Navbar.module.css`)

## Components

Components live in `components/<ComponentName>/` with an `index.ts` re-export and optional `.module.css`. Import via `@/components/ComponentName`.

## Testing

Vitest + React Testing Library with jsdom. Tests live in `tests/` mirroring the source structure. Vitest globals are enabled — no need to import `describe`/`it`/`expect`.

## Additional Coding Preferences

- Do not use semicolons for JavaScript or TypeScript code.
- Do not apply Tailwind classes directly in the component template unless it's essential or just one at most if an element is needed. More than a single Tailwind class combine them into a custom class using the @apply directive.
- Use minimal project dependencies where possible.
- Use git switch command to switch to new branch, not git checkout 