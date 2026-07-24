# PLAN_rename-dev-ports — next-bridgeschool

## Title
Change dev ports in .env files and package.json from 3000/3001/3002 to 4030/4031/4032

## Plan
- [x] Update `package.json` dev scripts (`locallocal`, `localdev`, `localprod`) ports from 3000/3001/3002 to 4030/4031/4032
- [x] Update `NEXTAUTH_URL` in `.env.locallocal`, `.env.localdev`, `.env.localprod` (and `.env`) to match the new ports
- [x] Update the matching port references in `.claude/CLAUDE.md`'s Commands section

## Changes
### package.json
- `locallocal`/`localdev`/`localprod` scripts now run `next dev --turbopack --port 4030/4031/4032` instead of 3000/3001/3002

### .env / .env.locallocal / .env.localdev / .env.localprod
- `NEXTAUTH_URL` updated to `http://localhost:4030` / `4031` / `4032` to match the new ports

### .claude/CLAUDE.md
- Commands section comment updated from "port 3000/3001/3002" to "port 4030/4031/4032" to match `package.json`

## Testing
- [x] Run `npm run locallocal` and confirm the app starts on port 4030 with no leftover `localhost:3000` references (stale `.next` cache was already cleared this session)
- [x] Sign in via credentials, guest login, GitHub, Google, and Facebook on `http://localhost:4030` and confirm all succeed
- [x] Repeat against `localdev` (4031) and `localprod` (4032) if those environments are used
