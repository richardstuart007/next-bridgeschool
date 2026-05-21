# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Type check (no test suite exists)
npx tsc --noEmit

# Format
npm run prettier

# Check formatting
npm run prettier:check

# Development — three environments, each copies a different .env file
npm run locallocal   # port 3000, local DB
npm run localdev     # port 3001, dev DB
npm run localprod    # port 3002, prod DB

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
- `write_logging` — application logging to DB
- `userCache_store` — per-user server-side cache (cache key = SQL string)
- UI components: `MyButton`, `MyInput`, `MyDropdown`, `MyTextarea`, `MyConfirmDialog`

### Authentication & Session
- `src/root/auth.ts` — NextAuth config; exports `auth`, `signIn`, `signOut`
- `src/proxy.ts` — Next.js middleware; protects `/dashboard` and `/admin` routes via a session cookie, not the NextAuth session
- `src/lib/cookie/` — cookie read/write/delete for the session cookie (`co_ssid`)
- `src/lib/dataAuth/` — sign-in logic, guest user setup
- `src/context/UserContext.tsx` — client-side React context holding `structure_ContextInfo` (ssid, usid, dbName, shrink, detail)

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
| `maint-action.ts` | `Maint` (server action), `StateSetup` type | Form submission handler |
| `maint-validate.ts` | subject-specific validate fn | Business rule validation |
| `maint.tsx` | `Form` (default) | Form component (`'use client'`) |
| `maintPopup.tsx` | `MaintPopup` (default) | Modal wrapper around `Form` |
| `table.tsx` | `Table` (default) | Paginated data table (`'use client'`) |

Server actions always use `write_Logging` (not `console.error`) for error logging with `lg_severity: 'E'`. Log messages include both a consequence string and the actual `(error as Error).message`.

### Data & types
- `src/lib/tables/definitions.ts` — DB row types (`table_Reference`, `table_Subject`, etc.)
- `src/lib/tables/structures.ts` — non-row types (`structure_ContextInfo`, `structure_SessionsInfo`, etc.)
- `src/lib/tables/tableSpecific/` — narrow DB helpers (fetch a single value, update a count, etc.)
- Table names follow the pattern `t<prefix>_<name>` (e.g. `tsb_subject`, `trf_reference`)
- Column names are prefixed with the table prefix (e.g. `sb_owner`, `rf_rfid`)

### Environment
Three `.env` variants exist (`.env.locallocal`, `.env.localdev`, `.env.localprod`). The dev scripts copy the right one to `.env` before starting. Required variables: `POSTGRES_URL`, `AUTH_SECRET`, `GITHUB_CLIENT_ID/SECRET`, `GOOGLE_CLIENT_ID/SECRET`, `GUEST_*_EMAIL/PASSWORD`.
