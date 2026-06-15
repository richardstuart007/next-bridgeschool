# Plan — next-bridgeschool

## Current task: Dependency pin + /owner route (nextjs-shared v2.0.1)
- [x] Pin all dependency versions (remove ^ ranges) to align with nextjs-shared v2.0.1
- [x] Downgrade next-auth from beta v5 to stable v4.24.14
- [x] Bump typescript 5→6, zod 3→4, next 16.2.4→16.2.9, react 19.2.4→19.2.7
- [x] Update dev scripts to use --turbopack --port flags
- [x] Create /owner route with Logging and Cache tabs (OwnerTableLogging, OwnerTableCache)
- [x] Create DevHeader component with Owner link and DB location badge
- [x] Update layout.tsx to use DevHeader instead of inline badge div
- [x] Delete src/app/admin/maint/cache/page.tsx (moved to /owner)
- [x] Update logging import to OwnerTableLogging
- [x] Remove Cache menu item from admin menu

## Outstanding items
- [x] Consume nextjs-shared v2.0.2: rename `write_Logging` → `write_logging` across all call sites (27 files updated)
- [ ] After rename: remove node_modules/nextjs-shared, npm update nextjs-shared, tsc, build
