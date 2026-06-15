# Changes — 2026-06-15

## package.json + package-lock.json
- All dependency versions pinned from `^range` to exact versions, aligning with nextjs-shared v2.0.1
- `next-auth` corrected back to `5.0.0-beta.31` (the blanket pin had incorrectly set it to v4.24.14; auth code uses v5 API)
- Added `@types/pg` `8.11.6` to devDependencies — previously transitive via old @neondatabase/serverless, now explicit
- `typescript` bumped 5.2.2 → 6.0.3
- `zod` bumped 3.x → 4.4.3 (major version)
- `next` bumped 16.2.4 → 16.2.9
- `react` / `react-dom` bumped 19.2.4 → 19.2.7
- Removed `overrides` block (no longer needed with exact-pinned versions)
- Dev scripts `locallocal/localdev/localprod` updated to use `--turbopack --port` instead of `set PORT=...`

## src/app/admin/maint/cache/page.tsx — DELETED
- Cache admin page removed from admin section; cache management moved to `/owner` route

## src/app/admin/maint/logging/page.tsx
- Import renamed: `nextjs-shared/Table_Logging` → `nextjs-shared/OwnerTableLogging` to match renamed export in nextjs-shared v2.0.1

## src/app/layout.tsx
- Replaced inline dev-only DB badge div with `<DevHeader dbLocation={DB_LOCATION} />` component
- Removed `DatabaseBadgeColors` constant (now handled inside DevHeader)

## src/ui/admin/menu.tsx
- Removed 'Cache' menu item — cache management moved to `/owner` route

## src/ui/DevHeader.tsx — NEW
- Dev-only header component shown when `NEXT_PUBLIC_APPENV_ISDEV` is true
- Shows "Owner" link that saves current path to sessionStorage before navigating to `/owner`
- Shows current DB location badge

## src/app/owner/page.tsx — NEW
- Owner page with tabbed interface (Logging | Cache)
- Uses `OwnerTableLogging` and `OwnerTableCache` from nextjs-shared

## src/app/owner/layout.tsx — NEW
- Layout for `/owner` route; dev-only (redirects to `/` in non-dev environments)
- Shows back-navigation link using path saved in sessionStorage by DevHeader
