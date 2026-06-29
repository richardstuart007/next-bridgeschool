# Plan — next-bridgeschool, "version": "2.1.2"

## Current task: rf_pubtype — reference publication type
- [x] Add `rf_pubtype: string` to `table_Reference` and `table_ReferenceSubject` in definitions.ts
- [x] Update ReferenceCard.tsx — icons, labels (Solution / Video Explanation / Read), Quiz-first for solution type
- [ ] User runs SQL in pgAdmin4:
  ALTER TABLE trf_reference ADD COLUMN rf_pubtype VARCHAR(20) NOT NULL DEFAULT 'learn';
  UPDATE trf_reference SET rf_pubtype = 'solution' WHERE rf_sbid = 1004;
- [ ] Admin maintenance UI for rf_pubtype (separate task — deferred)

## Outstanding items
_(none)_
