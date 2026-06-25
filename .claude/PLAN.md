# Plan — next-bridgeschool, "version": "2.1.1"

## Current task
_No active task._

## Outstanding items
- [ ] Reinstall nextjs-shared — `MyPopup.maxWidth` prop was renamed to `overrideClass` in nextjs-shared. The 6 consuming files in this project have already been updated. Reinstall is needed to pull the new package version and verify the build. User runs:
  Remove-Item -Recurse -Force node_modules
  Remove-Item -Force package-lock.json
  npm install --legacy-peer-deps
  Remove-Item -Recurse -Force .next
  npx tsc --noEmit
  npm run build
