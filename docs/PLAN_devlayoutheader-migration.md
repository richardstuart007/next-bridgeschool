# PLAN_devlayoutheader-migration — next-bridgeschool

## Title
Reinstall to pick up nextjs-shared@2.1.37 and switch layout.tsx to shared DevLayoutHeader

## Plan
- [x] User runs:
  Remove-Item -Recurse -Force node_modules
- [x] User runs:
  Remove-Item -Force package-lock.json
- [x] User runs:
  npm install
- [x] User runs:
  Remove-Item -Recurse -Force .next
- [x] User runs:
  npx tsc --noEmit
- [x] In src/app/layout.tsx, replace the local DevHeader import with:
  import { DevLayoutHeader } from 'nextjs-shared/DevLayoutHeader'
- [x] In src/app/layout.tsx, change `<DevHeader dbLocation={DB_LOCATION} />` to `<DevLayoutHeader dbLocation={DB_LOCATION} />`
- [x] Leave the existing `{IS_DEV && ...}` / `{NEXT_PUBLIC_APPENV_ISDEV && ...}` wrapper exactly as-is (DevLayoutHeader self-gates internally too — harmless double-guard, not a behavior change)
- [x] Do not pass `extraLinks` — omitting it defaults to `[]`, matching current no-extra-links behavior
- [x] Delete the now-unused local src/app/DevHeader.tsx (or wherever it currently lives)
- [x] Run npx tsc --noEmit to confirm clean
- [x] Run npm run build to confirm clean

## Changes
### package.json / package-lock.json / node_modules
- Clean reinstall (via the `reinstall` skill: removed `node_modules`, `package-lock.json`, `.next`, ran `npm install --legacy-peer-deps`, `npx tsc --noEmit`, `npm run build`) to pick up `nextjs-shared@2.1.37`, which now exports `DevLayoutHeader`. Confirmed installed version is 2.1.37.

### src/app/layout.tsx
- Replaced `import { DevHeader } from '@/src/ui/DevHeader'` with `import { DevLayoutHeader } from 'nextjs-shared/DevLayoutHeader'`.
- Replaced `<DevHeader dbLocation={DB_LOCATION} />` with `<DevLayoutHeader dbLocation={DB_LOCATION} />`, unchanged inside the existing `{NEXT_PUBLIC_APPENV_ISDEV && ...}` guard. No `extraLinks` passed (defaults to `[]`, matching prior no-extra-links behavior).

### src/ui/DevHeader.tsx
- Deleted — no longer referenced anywhere in the project after the layout.tsx switch to the shared component.

## Testing
- [ ] Run npm run localdev (or locallocal/localprod) and open any page — confirm the dev header bar still appears at the top with the "Owner" link and the DB location badge (yellow pill showing dev/local/prod), matching how it looked before this change.
- [ ] Click the "Owner" link from a non-/owner page and confirm it still navigates to /owner and the back-link (sessionStorage `ownerFrom`) still works when returning.
- [ ] Confirm the header does NOT appear when NEXT_PUBLIC_APPENV_ISDEV is not 'true' (e.g. a prod-style env), same as before.
- [ ] Confirmed via npx tsc --noEmit + npm run build (both passed cleanly) — no other functional change to verify beyond the header itself.
