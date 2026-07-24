# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## nextjs-shared reference
Read `node_modules/nextjs-shared/CONSUMING_PROJECTS.md` before implementing any feature from nextjs-shared. It contains all component APIs, database function signatures, coding conventions, and setup instructions.

## Commands

```bash
# Type check (no test suite exists)
npx tsc --noEmit

# Format
npm run prettier

# Check formatting
npm run prettier:check

# Development — three environments, each copies a different .env file
npm run locallocal   # port 4030, local DB
npm run localdev     # port 4031, dev DB
npm run localprod    # port 4032, prod DB

# Build / start
npm run build
npm run start
```

No test runner is configured. Use `npx tsc --noEmit` to verify correctness after changes.

## Architecture

### Stack
- Next.js App Router (React 19, TypeScript strict mode)
- Neon/Postgres database via `nextjs-shared` package
- NextAuth v5 (beta) with Credentials, GitHub, and Google providers
- Tailwind CSS, Chart.js, Zod validation

### `nextjs-shared` package
A private shared package (`github:richardstuart007/nextjs-shared`) that provides all direct DB access. This repo never calls the DB directly — it always goes through these imports:
- `table_fetch`, `fetchFiltered`, `fetchTotalPages` — reads
- `table_write`, `table_update`, `table_delete`, `table_check` — writes
- `write_Logging` — application logging to DB (use `lg_severity: 'E'` for errors, `'I'` for info)
- `cache_get`, `cache_set`, `cache_clearUser` — per-user server-side cache (cache key = SQL string)
- `sql` from `nextjs-shared/db` — low-level query access; used only in `fetch_SessionInfo` for joins not covered by the table helpers
- UI components: `MyButton`, `MyInput`, `MyDropdown`, `MyTextarea`, `MyConfirmDialog`, `MyPagination`
- `Filter` type from `nextjs-shared/structures` — used to build `fetchFiltered` calls

### Authentication & Session
- `src/root/auth.ts` — NextAuth config; exports `auth`, `signIn`, `signOut`
- `src/proxy.ts` — Next.js middleware; protects `/dashboard` and `/admin` routes by checking the `co_ssid` session cookie, not the NextAuth session
- `src/lib/cookie/` — cookie read/write/delete for `co_ssid`
- `src/lib/dataAuth/` — sign-in logic, guest user setup
- `src/lib/authServer_au_ssid.ts` — server helper; reads `au_ssid` from the NextAuth session token
- `src/context/UserContext.tsx` — client-side React context holding `structure_ContextInfo` (`cx_ssid`, `cx_usid`, `cx_dbName`, `cx_shrink`, `cx_detail`)

### Session info fetch & cache
`src/lib/tables/tableSpecific/fetch_SessionInfo.ts` is the standard way to get the current user's DB session row. It:
1. Reads `co_ssid` via `getAuthServer_au_ssid()`
2. Checks `cache_get` — logs `CACHE_HIT`
3. On miss, joins `tss_sessions` + `tus_users`, logs `CACHE_MISS` then `CACHE_SAV`
4. Returns `structure_SessionsInfo`

Cache is cleared per-user via `src/lib/tables/cache/userCache_purge.ts` (wraps `cache_clearUser`). Call this after any user record update.

### Route structure
| Prefix | Access |
|---|---|
| `/` | Public |
| `/login`, `/register` | Public (redirect to dashboard if logged in) |
| `/dashboard/*` | Requires session cookie |
| `/admin/*` | Requires session cookie |

Routes are defined as constants in `src/root/constants/constants_validroutes.ts`.

### Admin module pattern
Every subject under `src/ui/admin/<subject>/` follows this file structure:

| File | Exports | Role |
|---|---|---|
| `form-action.ts` | `Action` (server action), `StateSetup` type | Form submission handler |
| `form-validate.ts` | subject-specific validate fn | Business rule validation |
| `form.tsx` | default `Form` | Form component (`'use client'`) |
| `formPopup.tsx` | default `FormPopup` | Modal wrapper around `Form` |
| `table.tsx` | default `Table` | Paginated data table (`'use client'`) |

Server actions always use `write_Logging` (not `console.error`) for errors. Log messages include both a consequence string and `(error as Error).message`.

Before any delete, use `table_check` to verify no FK references exist in dependent tables. If found, surface the message to the user rather than proceeding.

### Table components
All tables use `ROWS_PER_PAGE = 50` from `src/lib/tableUtils.ts` for pagination. Filters are built as `Filter[]` (from `nextjs-shared/structures`) and passed to `fetchFiltered`. Tables always pass `skipCache: true` on admin maintenance fetches.

### Dashboard quiz flow
`src/ui/dashboard/quiz/QuizServer.tsx` (server component) fetches questions and session settings, then passes them to `QuizClient.tsx` (client component). The split keeps DB access server-side while the interactive quiz runs client-side.

### Data & types
- `src/lib/tables/definitions.ts` — DB row types (`table_Reference`, `table_Subject`, `table_Questions`, `table_Users`, `table_Sessions`, `table_Usershistory`, etc.)
- `src/lib/tables/structures.ts` — non-row types (`structure_ContextInfo`, `structure_SessionsInfo`, `ColumnValuePair`, `TableColumnValuePairs`, etc.)
- `src/lib/tables/tableSpecific/` — narrow DB helpers (fetch a single value, update a count, etc.)
- Table names follow the pattern `t<prefix>_<name>` (e.g. `tsb_subject`, `trf_reference`)
- Column names are prefixed with the table prefix (e.g. `sb_owner`, `rf_rfid`)

### DB copy / backup tools
`src/lib/copytables/envs.ts` — defines the three environments (`Local-Local`, `Local-Dev`, `Local-Prod`) used by the admin copy/backup UI.
`src/lib/copytables/tables.ts` — splits tables into `basetables` (reference/content data) and `transtables` (user/transactional data).
These are consumed by `CopyTable` and `BackupTable` components imported from `nextjs-shared`.

### MyButton height on tablet/desktop

`MyButton`'s default class includes `md:h-8`, which overrides any bare `h-*` value in `overrideClass` at the `md` breakpoint. Whenever a custom height is set on `MyButton`, always include the matching `md:h-*` variant in `overrideClass` to prevent the default from winning on tablet and desktop:

```tsx
overrideClass='h-16 md:h-16 w-16 ...'
```

Without `md:h-16`, the button will render correctly on mobile but collapse to 32px on iPad/desktop.

## Schema file

`scripts/schema.sql` is the single source of truth for the database structure. Every new table and index must be added here.

### Environment
Three `.env` variants exist (`.env.locallocal`, `.env.localdev`, `.env.localprod`). The dev scripts copy the right one to `.env` before starting. Required variables: `POSTGRES_URL`, `AUTH_SECRET`, `GITHUB_CLIENT_ID/SECRET`, `GOOGLE_CLIENT_ID/SECRET`, `GUEST_*_EMAIL/PASSWORD`.
