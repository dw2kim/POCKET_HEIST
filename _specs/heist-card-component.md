# Spec for Heist Card Component

## Scope
- What this feature includes: a `HeistCard` component that displays a single heist's key information (title, assigned agent, creator agent, deadline); a `HeistCardSkeleton` component that mirrors the same card layout for loading states; wiring both into the `/heists` dashboard page to replace the plain title list for the `"active"` and `"assigned"` sections only, displayed in a three-column grid
- What this feature does NOT include: the expired section (continues to show plain titles or can remain as-is), heist detail page content (the `/heists/[id]` route remains an empty stub), delete/edit actions on the card, any status badge for active/assigned cards

## Functional requirements
- `HeistCard` accepts a single `heist: Heist` prop
- The card title is a `<Link>` pointing to `/heists/[heist.id]`
- The card displays three metadata rows: "To:" + `assignedToCodeName`, "By:" + `createdByCodeName`, and the deadline date with a time-remaining label
- The time-remaining label calculates the difference between `heist.deadline` and `now` on the client side; if deadline is in the past it shows "Overdue", otherwise shows a human-friendly string (e.g. "4h 42m", "1d 0h")
- `HeistCardSkeleton` renders the same card shell with animated placeholder blocks in place of all text content; no props required
- The heists page replaces the `HeistList` component for the active and assigned sections with a three-column grid of `HeistCard` items (or `HeistCardSkeleton` items while loading)
- The expired section is not changed by this feature
- The grid is responsive: three columns on desktop (≥ 1024px), two columns on tablet (≥ 640px), one column on mobile
- The `HeistCard` component lives at `components/HeistCard/` following the existing component structure convention

## Dependencies
- `types/firestore/heist.ts` — `Heist` type
- `hooks/useHeist.ts` — already used on the heists page, no changes needed
- `app/(dashboard)/heists/page.tsx` — replace the `HeistList` for active and assigned with the card grid
- `app/(dashboard)/heists/heists.module.css` — add grid container class
- `app/(dashboard)/heists/[id]/page.tsx` — link target, no changes needed (empty stub)
- `app/globals.css` — theme tokens (`--color-lighter`, `--color-primary`, `--color-secondary`, `--color-body`, `--color-heading`)

## Figma design reference
- File: https://www.figma.com/design/ekUtcj4lDIWWoZJVsLBZL8/Daewon---Heist-Exercise?node-id=1002-25
- Component name: HeistCard (node `1002:25` inside ActiveHeists section)
- Key visual constraints:
  - Card background `#101828` (= `var(--color-lighter)`), border `1px solid #1e2939`, `border-radius: 10px`
  - Padding ~21px on all sides; flex column layout with ~12px gap between title block and metadata block
  - Title: Inter Regular 16px, white, `line-height: 24px`, `letter-spacing: -0.31px`; wraps to 2 lines; sits alongside a small ~16px clock/timer icon in the top-right corner
  - Three metadata rows, each ~20px tall with ~8px gap between rows; each row has a small ~12px icon on the left
  - "To:" label in `#99a1af` (= `var(--color-body)`), agent codename in `#c27aff` (= `var(--color-primary)`), 14px Inter Regular
  - "By:" label in `#99a1af`, creator codename in `#fb64b6` (= `var(--color-secondary)`), 14px Inter Regular
  - Deadline row: formatted date in `#99a1af`, followed by a bullet `•`, then time-remaining string in `#c27aff`; if overdue the label reads "Overdue" in `#c27aff`

## Possible edge cases
- Title is very long — should truncate or wrap gracefully without breaking the card layout
- `assignedToCodeName` or `createdByCodeName` is missing or empty — display a fallback like "Unknown Agent"
- `deadline` is exactly now — treat as not yet overdue (strictly greater-than check)
- Time-remaining display: values over 24 hours should show days + hours (e.g. "1d 4h"), under 1 hour should show minutes (e.g. "42m")
- Skeleton count: show a fixed count (e.g. 3) of skeleton cards while loading, not a dynamic count
- The grid should not collapse into a single column on very wide viewports — respect the three-column max

## Acceptance criteria
- `HeistCard` renders the heist title as a Next.js `<Link>` to `/heists/[id]`
- `HeistCard` shows three metadata rows matching the Figma design token colors
- `HeistCard` deadline row shows "Overdue" for past deadlines and a formatted time string for future ones
- `HeistCardSkeleton` renders the same card shape with pulsing placeholder blocks and no real text
- The active and assigned sections on `/heists` use the three-column card grid (not the plain list)
- Loading state shows skeleton cards; empty state shows the existing empty message
- The expired section is unaffected

## Open questions
- How many skeleton cards should show per section while loading? 3 cards
- Should the card have any hover/focus styling? **(nice-to-have)** — a subtle border color lift on hover would match the dark theme; can be added without blocking implementation

## Testing Guidelines
Create a test file at `tests/components/HeistCard.test.tsx` for the new component, covering:
- Renders the heist title as a link to `/heists/[id]`
- Renders `assignedToCodeName` in the "To:" row
- Renders `createdByCodeName` in the "By:" row
- Shows "Overdue" when deadline is in the past
- Shows a formatted time string when deadline is in the future
- `HeistCardSkeleton` renders without crashing and does not display real text content
