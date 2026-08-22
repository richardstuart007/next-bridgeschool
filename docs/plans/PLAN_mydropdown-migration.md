# PLAN_mydropdown-migration — next-bridgeschool

## Title
Migrate all MyDropdown call sites to MySelectTable / MySelect

## Background / verified findings

`nextjs-shared` is decommissioning `MyDropdown` in favor of `MySelectTable` (table-backed) and
`MySelect` (pre-supplied options). next-bridgeschool is the only remaining consumer of
`MyDropdown` (34 call sites, 14 files) — tracked in nextjs-shared's own
`.claude/CLAUDE.md` under "Outstanding items > next-bridgeschool".

Verified this session, after running `#reinstall` to pull the current nextjs-shared commit
(previously stale — npm had cached an older git-ref resolution; fixed via a forced reinstall):

- `MySelectTable` and the updated `MySelect` (whose `options` prop now accepts
  `{ value, label }` pairs, not just `string[]`) both exist in the installed
  `nextjs-shared` (now resolved to commit `689ec566`, package version `2.1.77`).
- **`npx tsc --noEmit` currently FAILS** — 9 call sites pass `tableColumn`/`tableColumnValue` to
  `MyDropdown`, and this same nextjs-shared release removed those two props from `MyDropdown`
  itself (replaced by `whereColumnValuePairs: ColumnValuePair[]`, matching `MySelectTable`'s own
  API). This means the project will not currently build — fixing these 9 sites is no longer
  optional cleanup, it is required just to restore a working build, independent of whether the
  rest of the migration proceeds.
- Group A (`table=` sites) is a true drop-in to `MySelectTable` for every prop **except** the 9
  sites below, which must additionally convert `tableColumn`/`tableColumnValue` to
  `whereColumnValuePairs={[{ column: <tableColumn>, value: <tableColumnValue> }]}`:
  - `src/ui/admin/questions/detail/form.tsx:169` (`tableColumn='sb_owner'`)
  - `src/ui/admin/questions/detail/form.tsx:256` (`tableColumn='rf_sbid'`)
  - `src/ui/admin/questions/table.tsx:365` (`tableColumn='sb_owner'`)
  - `src/ui/admin/reference/form.tsx:144` (`tableColumn='sb_owner'`)
  - `src/ui/admin/reference/table.tsx:342` (`tableColumn='sb_owner'`)
  - `src/ui/dashboard/history/table.tsx:521` (`tableColumn='uo_usid'`)
  - `src/ui/dashboard/history/table.tsx:543` (`tableColumn='sb_owner'`)
  - `src/ui/dashboard/reference/table.tsx:496` (`tableColumn='uo_usid'`)
  - `src/ui/dashboard/reference/table.tsx:518` (`tableColumn='sb_owner'`)
- Group B (`tableData=` sites) needs real per-site rework, verified individually:
  - `formattedCountries` (`dashboard/users/form.tsx:249`) — already `{value,label}[]` (string
    values). Drop `optionLabel`/`optionValue`, pass directly as `options`.
  - `LEVEL_OPTIONS` (`admin/subject/form.tsx:181`, `admin/subject/table.tsx:345`) — already
    `{value,label}[]` where value === label (strings). Same as above, direct pass-through.
  - `User_limitMonths_Average_Options`, `Recent_usersReturned_Options`,
    `Recent_usersAverage_Options`, `Top_limitMonths_Options` — each `{value: number, label:
    string}[]`. `MySelect`'s option type requires `value: string`, so these need
    `.map(opt => ({ value: String(opt.value), label: opt.label }))`. The existing `onChange`
    handlers (`handleMonthsChange` etc.) already accept `string | number` and call `Number(value)`
    internally, so no handler signature changes are needed — only the wiring changes, e.g.
    `onChange={e => handleMonthsChange(e.target.value)}`.
  - `Comparison_values` (from `nextjs-shared/table_comparison_values`, used in
    `admin/questions/table.tsx:412`) — shape is `{optionLabel, optionValue}[]`, not
    `{label,value}`. Needs a local map: `Comparison_values.map(o => ({ value: o.optionValue,
    label: o.optionValue }))`. Note: the *existing* call already passes
    `optionLabel='optionValue'` (not `'optionLabel'`), so the displayed text today is already the
    operator symbol (`=`, `<>`, ...), not the friendly text (`Equal`, `Not Equal`, ...) — this is
    pre-existing behavior, preserved as-is, not something this migration changes.
- `src/content/conventions/architecture/components/content.ts:15` documents `'MySelect /
  MyDropdown'` as the single-choice dropdown pattern in prose — low-priority doc update to mention
  `MySelectTable` too, once the migration below is done.

## Plan

`MyDropdown` is being discontinued entirely for this project — every one of the 34 sites below
moves directly to its replacement component in one edit. None of the 9 `tableColumn` sites get an
intermediate "fix `MyDropdown`'s props" step; they go straight to `MySelectTable` with
`whereColumnValuePairs`, same as every other Group A site.

- [x] Group A (26 sites, `table=`) — replace `MyDropdown` with `MySelectTable` at every site:
      swap the import and component name; for the 17 sites with no `tableColumn`, every other prop
      (`selectedOption`/`setSelectedOption`, `searchEnabled`, `includeBlank`,
      `overrideClass_Dropdown`, `overrideClass_Label`, `name`, `label`, `optionLabel`,
      `optionValue`) carries over unchanged; for the 9 sites listed above, additionally replace
      `tableColumn`/`tableColumnValue` with `whereColumnValuePairs={[{ column: <tableColumn>,
      value: <tableColumnValue> }]}` in the same edit.
- [x] Group B (8 sites, `tableData=`) — replace `MyDropdown` with `MySelect` at every site per the
      per-site mapping above (`selectedOption`/`setSelectedOption` → `value`/`onChange`,
      `overrideClass_Dropdown` → `overrideClass`, `overrideClass_Label` → `labelClass`, drop
      `optionLabel`/`optionValue` in favor of a real `options={[{value,label}]}` array).
- [x] Remove the now-unused `MyDropdown` import from each of the 14 files.
- [x] Project-wide grep for `MyDropdown` to confirm zero remaining usages.
- [x] Update `src/content/conventions/architecture/components/content.ts:15` to mention
      `MySelectTable` alongside `MySelect`. — **Not applicable**: this file does not exist anywhere
      in the project (confirmed via grep and glob); the note in nextjs-shared's outstanding-items
      tracker referencing it was stale, likely copied from a different project.
- [x] Run `npx tsc --noEmit` and `npm run build` to confirm a clean build.

## Changes

### src/ui/dashboard/history/table.tsx
- `MyDropdown` → `MySelectTable` for both sites (`tuo_usersowner` owner picker, `tsb_subject`
  subject picker); both had `tableColumn`/`tableColumnValue`, converted to `whereColumnValuePairs`.

### src/ui/dashboard/users/form.tsx
- FEDCOUNTRY picker: `MyDropdown` (`tableData={formattedCountries}`) → `MySelect`
  (`options={formattedCountries}`, `value`/`onChange` in place of `selectedOption`/
  `setSelectedOption`, explicit `id='us_fedcountry'` since the label contains dynamic text).
- Owner picker (`tow_owner`): `MyDropdown` → `MySelectTable`, no `tableColumn`, pure rename.

### src/ui/dashboard/reference/table.tsx
- All 4 sites (`tuo_usersowner`, `tsb_subject`, `twh_who`, `trt_reftype`) → `MySelectTable`; the
  first two had `tableColumn`/`tableColumnValue`, converted to `whereColumnValuePairs`.

### src/ui/admin/usersowner/table.tsx
- Both sites (`tus_users`, `tow_owner`) → `MySelectTable`, pure rename, no `tableColumn`.

### src/ui/admin/questions/table.tsx
- Owner picker (`tow_owner`) → `MySelectTable`, pure rename.
- Subject picker (`tsb_subject`, had `tableColumn='sb_owner'`) → `MySelectTable` with
  `whereColumnValuePairs`.
- Comparison-operator picker (`Comparison_values`) → `MySelect`, with a local
  `Comparison_values.map(o => ({ value: o.optionValue, label: o.optionValue }))` transform
  (preserves the pre-existing behavior where the displayed text is the operator symbol, not the
  friendly name — the original call already passed `optionLabel='optionValue'`).

### src/ui/admin/usersowner/form.tsx
- Both sites (`tus_users`, `tow_owner`) → `MySelectTable`, pure rename.

### src/ui/admin/reference/table.tsx
- All 4 sites (`tow_owner`, `tsb_subject`, `twh_who`, `trt_reftype`) → `MySelectTable`; the subject
  site had `tableColumn`/`tableColumnValue`, converted to `whereColumnValuePairs`.

### src/ui/admin/questions/detail/form.tsx
- Owner picker (`tow_owner`) → `MySelectTable`, pure rename.
- Subject picker (`tsb_subject`, `tableColumn='sb_owner'`) and Reference picker (`trf_reference`,
  `tableColumn='rf_sbid'`) → `MySelectTable` with `whereColumnValuePairs`.

### src/ui/admin/subject/form.tsx
- Owner picker (`tow_owner`) → `MySelectTable`, pure rename.
- Level picker (`LEVEL_OPTIONS`) → `MySelect`, direct `options={LEVEL_OPTIONS}` pass-through
  (already `{value,label}` string pairs).

### src/ui/admin/subject/table.tsx
- Owner picker (`tow_owner`) → `MySelectTable`, pure rename.
- Level picker (`LEVEL_OPTIONS`) → `MySelect`, direct pass-through, same as the form.

### src/ui/admin/reference/form.tsx
- All 4 sites (`tow_owner`, `tsb_subject`, `twh_who`, `trt_reftype`) → `MySelectTable`; the subject
  site had `tableColumn`/`tableColumnValue`, converted to `whereColumnValuePairs`.

### src/ui/dashboard/graph/User/User_Header.tsx, Recent/Recent_Header.tsx, Top/Top_Header.tsx
- All 4 sites (`User_limitMonths_Average_Options`, `Recent_usersReturned_Options`,
  `Recent_usersAverage_Options`, `Top_limitMonths_Options`) → `MySelect`, with options mapped to
  string values (`String(opt.value)`) since `MySelect`'s option type requires `value: string`
  while these constants are `{value: number, label: string}[]`. Existing `handle*Change` handlers
  already accepted `string | number` and did their own `Number()` conversion, so only the wiring
  changed (`onChange={e => handle...Change(e.target.value)}`), not the handlers themselves.

### package.json
- `nextjs-shared` dependency line restored to the bare `github:richardstuart007/nextjs-shared`
  spec (a `#main` suffix had been added earlier in this session while diagnosing a stale npm
  git-ref cache; removed per direct instruction).

### Verification
- `npx tsc --noEmit` passes with no errors.
- `npm run build` succeeds (`next build`, all routes compiled).
- Project-wide grep for `MyDropdown` returns zero matches.

## Testing
- [ ] `/dashboard/user` — open the Bridge Federation Country picker (search-enabled `MySelect`)
      and the Owner picker (`MySelectTable`); confirm both list options, search still narrows the
      country list, and selecting a value saves correctly.
- [ ] `/dashboard/history` — confirm the Owner and Subject header pickers still filter the table
      (Subject list should still be filtered to the selected Owner via `whereColumnValuePairs`).
- [ ] `/dashboard/reference_select` — confirm Owner, Subject, Who, and Type pickers all still
      filter the reference list, and Subject still narrows to the selected Owner.
- [ ] `/admin/maint/usersowner` — confirm the User and Owner picker dropdowns (table and form)
      still populate and filter correctly.
- [ ] `/admin/maint/questions` — confirm the Owner/Subject filters (Subject scoped to Owner) and
      the comparison-operator picker next to the ref-id filter still work; the operator dropdown
      should still display the raw symbols (`=`, `<>`, `LIKE`, ...) as before, not friendly names —
      that's pre-existing behavior, unchanged by this migration.
- [ ] `/admin/maint/reference` (table and add/edit form) — confirm Owner/Subject/Who/Type pickers
      all populate and filter correctly, including Subject scoped to the selected Owner.
- [ ] `/admin/maint/subject` (table and add/edit form) — confirm the Owner picker and the Level
      picker (Beginner/Improver/Intermediate/Advanced/Random) both work.
- [ ] `/dashboard/graphs` — confirm the three month/count selectors (Your Results, Recent
      Averages ×2, Top Results) still change their values and the page refreshes with updated data
      after each change.
- [ ] Confirmed via `npx tsc --noEmit` and `npm run build` — both pass with no errors.
