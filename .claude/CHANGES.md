# Changes — next-bridgeschool, "version": "2.1.1"

## 6 x src/ui/admin/**/formPopup.tsx / tablePopup.tsx
- Updated `MyPopup` prop: `maxWidth=` → `overrideClass=` to match renamed prop in nextjs-shared

## src/app/dashboard/layout.tsx
- Changed `overflow-hidden` to `overflow-y-auto` on the content div so mobile can scroll down

## src/app/dashboard/page.tsx
- Removed `h-screen` from `<main>` — on mobile the nav already consumes height so h-screen caused content to overflow and be clipped

## src/ui/login/socials.tsx
- Reduced Google and GitHub icon size from h-8 w-8 (32px) to h-5 w-5 (20px) — 32px was oversized for the button; 20px matches the standard social-button convention

## src/ui/login/form.tsx
- Moved "Not Registered yet?" button to below Guest Access — better visual flow, registration is a lower-priority action than guest login

## src/app/(login)/login/page.tsx
- Replaced centred single-column layout with split-screen: orange brand panel (left, desktop only) + form panel (right); mobile stays full-width form only

## src/app/page.tsx
- Replaced home/splash page with a server-side redirect to /login — root URL now goes directly to login in all environments

## src/ui/login/form.tsx
- Removed bg-gray-50 from outer panel (no overall background); wrapped credentials section in its own bg-gray-50 rounded box; reduced login button top margin mt-4→mt-2; reduced email label top margin mt-5→mt-1
- Reordered login sections: Socials → Guest Access → Email/credentials → Register button
- Applied Option A colour scheme: Google=white/gray-border, GitHub=gray-800, International=indigo-500, NZ Bridge=teal-600, Login=orange-500, Register=gray-400
- Added Facebook OAuth: FacebookIcon SVG + button (brand blue #1877F2), always visible alongside Google

## src/root/constants/constants_other.ts
- Added 'facebook' to ProviderType union

## src/root/auth.ts
- Imported Facebook provider from next-auth/providers/facebook; added Facebook({clientId, clientSecret}) to providers list

## src/ui/login/socials_signin.ts
- Added 'facebook' to provider union type

## src/ui/login/form.tsx
- Updated "Continue with" button to handle 'facebook' provider; added 'facebook' case to getAccountMessage()

## .env.locallocal / .env.localdev / .env.localprod
- Added FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET placeholder entries

## next.config.mjs
- Added allowedDevOrigins: ['192.168.1.23'] to allow mobile device on local network to access HMR in dev mode

## src/root/auth.ts
- Removed temporary FACEBOOK_DEBUG console.log
- Added @googlemail.com → @gmail.com normalisation before tus_users lookup — Facebook returns the legacy googlemail.com domain for Gmail accounts, which would fail the email lookup without this fix
- Added effectiveProvider logic: Gmail addresses are always treated as Google users regardless of which social provider was used
- Removed the "user must exist" guard — providerSignIn already auto-creates new users via write_users; re-fetch after creation if userRecord was null

## src/ui/login/socials.tsx
- Wrapped in bg-gray-50 rounded box with mt-3 gap; removed mt-9 from label

## src/ui/login/GuestLogin.tsx
- Wrapped in bg-gray-50 rounded box with mt-3 gap; removed mt-9 from label
