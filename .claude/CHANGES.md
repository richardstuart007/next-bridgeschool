# Changes — next-bridgeschool, "version": "2.1.2"

## src/lib/tables/definitions.ts
- Added `rf_pubtype: string` to `table_Reference` and `table_ReferenceSubject` to track publication type (`'learn'` or `'solution'`)

## src/ui/dashboard/reference/ReferenceCard.tsx
- Added Heroicons `PlayCircleIcon` (video) and `DocumentTextIcon` (read/PDF) displayed inside resource buttons
- Button label now derives from `rf_pubtype` + `rf_type`: solution → `'Solution'`, learn+youtube → `'Video Explanation'`, learn+other → `'Read'`
- For `rf_pubtype === 'solution'`: Quiz button renders first, resource button second
- For `rf_pubtype === 'learn'`: existing order unchanged (resource first, Quiz second)
