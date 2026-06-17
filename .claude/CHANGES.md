# Changes — next-bridgeschool, "version": "2.1.0"

## package.json / node_modules
- Reinstalled nextjs-shared after upstream package update
- Full clean reinstall: removed node_modules, package-lock.json, .next, then npm install --legacy-peer-deps and rebuild

## package.json
- Removed `@types/bcryptjs: 3.0.0` from devDependencies — bcryptjs now ships its own type definitions, stub package was redundant and caused a deprecation warning

## src/root/global.css
- Removed `@plugin "@tailwindcss/forms"` — package was removed from dependencies in the previous round but the CSS import was left behind, causing the build to fail

## package.json
- Restored `next-auth` from `4.24.14` to `5.0.0-beta.31` — code uses v5 API (NextAuthConfig, AuthError, handlers destructure); v4 was accidentally set during the dependency pin round
