# PLAN_owner-page-ownerpage-tabbar — next-bridgeschool

## Title
Replace hand-rolled /owner page tab bar with nextjs-shared/OwnerPage

## Plan
- [x] Replace `src/app/owner/page.tsx`'s hand-rolled `useState<Tab>`/tab-bar `<button>` markup with `OwnerPage`, matching CONSUMING_PROJECTS.md's documented "no extra tabs" example:
  ```tsx
  import OwnerPage from 'nextjs-shared/OwnerPage'
  import OwnerTableLogging from 'nextjs-shared/OwnerTableLogging'
  import OwnerTableCache from 'nextjs-shared/OwnerTableCache'

  export default function Page() {
    return (
      <OwnerPage
        tabs={[
          { label: 'Logging', content: <OwnerTableLogging /> },
          { label: 'Cache', content: <OwnerTableCache /> },
        ]}
      />
    )
  }
  ```
  `src/app/owner/layout.tsx` already correctly uses `OwnerLayout` (which supplies padding), so no other file needs to change. `OwnerPage` also wraps its tab content in `Suspense` internally, so the standalone `Suspense` import goes away too.
- [x] Type-check with `npx tsc --noEmit` and build with `npm run build`

## Changes

### src/app/owner/page.tsx
- Replaced the hand-rolled `useState<Tab>` tab-bar (`useState`, raw `<button>` per tab, manual `Suspense` wrap) with `OwnerPage` from `nextjs-shared`, passing `tabs={[{ label: 'Logging', ... }, { label: 'Cache', ... }]}`. `OwnerPage` owns tab-switching state and wraps content in `Suspense` internally, so both the local `useState` and the standalone `Suspense` import were removed.
- Visual change (discussed and accepted before implementing): the active-tab indicator changes from this page's previous black/gray (`border-gray-900 text-gray-900`) to `MyTab`'s default blue (`border-blue-600 text-blue-700`), since `OwnerPage` doesn't expose a styling-override prop for its tab bar.
- `npx tsc --noEmit` and `npm run build` both clean.

## Testing
- [x] Open `/owner` and confirm the Logging/Cache tab bar renders and switches content correctly.
- [x] Confirm the active tab now shows in blue (expected change) rather than the previous black/gray.
- [x] Confirm the page's padding/back-link (from `OwnerLayout`) still looks correct — no double padding now that the page's own tab bar no longer carries its own horizontal spacing.
