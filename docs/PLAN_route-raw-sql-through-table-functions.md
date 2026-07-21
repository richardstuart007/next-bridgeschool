# PLAN_route-raw-sql-through-table-functions — next-bridgeschool

## Title
Fix: route next-bridgeschool's raw sql() calls through shared table_ functions

## Plan
- [x] Step 1: `src/lib/tables/tableSpecific/fetch_NextSeq.ts` — rewrite to use `table_fetch` from `nextjs-shared/table_fetch`, single-table equality WHERE on `tqq_questions`, aggregate column `COALESCE(MAX(qq_seq) + 1, 1) AS next_qq_seq`, `skipCache: true` (sequence allocation must never be stale). Drop `write_logging`/`console.error` imports and calls — `table_fetch` logs failures internally. Throw if `next_qq_seq` comes back null.
- [x] Step 2: `src/lib/tables/tableSpecific/fetch_SessionInfo.ts` — rewrite to use `table_query` from `nextjs-shared/table_query` for the `tss_sessions` JOIN `tus_users`. Drop the hand-built `cacheKey`/`cache_get`/`cache_set`/`CACHE_HIT`/`CACHE_MISS`/`CACHE_SAV` logging entirely — `table_query` caches by query+params internally. Add an explicit `if (rows.length === 0) throw new Error(...)` guard before building the `structure_SessionsInfo` result, so a DB failure still surfaces as a thrown error to callers (preserves current behavior).
- [x] Step 3: `src/ui/dashboard/graph/Recent/Recent_fetch_1.ts` — rewrite to use `table_query`, dropping the manually-built `cacheKey`/`cache_get`/`cache_set`. Returns `[]` on failure as it already effectively does — no throw guard needed.
- [x] Step 4: `src/ui/dashboard/graph/Recent/Recent_fetch_Averages.ts` — rewrite to use `table_query`. Keep the dynamic `IN (...)` placeholder-building logic as-is; drop the manual cache handling. Returns `[]` on failure — no throw guard needed.
- [x] Step 5: `src/ui/dashboard/graph/Top/Top_fetch.ts` — rewrite to use `table_query`, removing the duplicated query-string-built-twice pattern and the manual cache key. Returns `[]` on failure — no throw guard needed.
- [x] Step 6: `src/ui/dashboard/graph/User/User_fetch.ts` — rewrite to use `table_query`, removing the hand-rolled `buildSql_Placeholders`/`buildSql_Readable` cache-key plumbing. **Decision (confirmed with user):** no throw guard — `table_query` returns `[]` both on genuine DB failure and on a legitimate "no history in this date range" result (verified by reading `table_query`'s source), and this is a plain `SELECT ... LIMIT` with no aggregate, so the two cases are indistinguishable from the return value alone. Guard would incorrectly throw for any user with no recent history.
- [x] Step 7: `src/ui/dashboard/graph/User/User_fetch_Average.ts` — rewrite to use `table_query`, with an explicit `if (rows.length === 0) throw new Error(...)` guard. Unlike Step 6, this query is a bare `SUM`/`ROUND` aggregate with no `GROUP BY`, so Postgres always returns exactly one row even over zero matching history rows — `rows.length === 0` here is an unambiguous failure signal, so the guard is safe.
- [x] Type check and build: `npx tsc --noEmit` then `npm run build`

## Changes

### src/lib/tables/tableSpecific/fetch_NextSeq.ts
- Replaced raw `sql()`/`db.query` call with `table_fetch`, `skipCache: true` since this allocates the next sequence number. Removed `write_logging`/`console.error` (handled internally by `table_fetch`).

### src/lib/tables/tableSpecific/fetch_SessionInfo.ts
- Replaced raw `sql()`/`db.query` JOIN with `table_query`. Removed hand-built `cacheKey`/`cache_get`/`cache_set`/`CACHE_HIT`/`CACHE_MISS`/`CACHE_SAV` logging — `table_query` caches internally. Added `if (rows.length === 0) throw` guard to preserve throw-on-failure behavior (a valid `ssid` should always join to exactly one row).

### src/ui/dashboard/graph/Recent/Recent_fetch_1.ts
- Replaced raw `sql()`/`db.query` with `table_query`. Removed manually-built `cacheKey`/`cache_get`/`cache_set`. No throw guard — already returned `[]` on failure.

### src/ui/dashboard/graph/Recent/Recent_fetch_Averages.ts
- Replaced raw `sql()`/`db.query` with `table_query`, keeping the dynamic `IN (...)` placeholder logic. Removed manual cache handling. No throw guard — already returned `[]` on failure.

### src/ui/dashboard/graph/Top/Top_fetch.ts
- Replaced raw `sql()`/`db.query` with `table_query`, removing the duplicated query-string-built-twice pattern and manual cache key. No throw guard — already returned `[]` on failure.

### src/ui/dashboard/graph/User/User_fetch.ts
- Replaced raw `sql()`/`db.query` with `table_query`, removing `buildSql_Placeholders`/`buildSql_Readable` cache-key plumbing. No throw guard added (user-confirmed decision): `table_query` returns `[]` on both genuine failure and a legitimate "no history in this date range" result, and this plain `SELECT ... LIMIT` query has no way to distinguish the two — a guard would incorrectly throw for any user with no recent history. This is a behavior change from the original (which re-threw on any caught DB error); a genuine DB failure now surfaces as an empty chart instead of a thrown error.

### src/ui/dashboard/graph/User/User_fetch_Average.ts
- Replaced raw `sql()`/`db.query` with `table_query`, removing `buildSql_Placeholders`/`buildSql_Readable` cache-key plumbing. Added `if (rows.length === 0) throw` guard — safe here because the bare `SUM`/`ROUND` aggregate (no `GROUP BY`) always returns exactly one row even over zero matching history rows, so an empty result set is an unambiguous failure signal.
