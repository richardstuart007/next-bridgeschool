# MyButton / MyTextarea cleanup — replace raw button/textarea elements

## Plan

Replace four remaining raw HTML `<button>`/`<textarea>` elements with the shared `MyButton` /
`MyTextarea` components from `nextjs-shared`, matching the existing usage pattern already present
in each file.

## Changes

- [x] `src/ui/dashboard/dashboardMenu/NavDrawer.tsx:91-97` — replace raw close `<button>` with
      `MyButton`:
  ```tsx
  <MyButton
    onClick={onClose}
    aria-label='Close menu'
    overrideClass='h-10 md:h-10 w-10 px-0 md:px-0 rounded bg-transparent hover:bg-gray-100'
  >
    <XMarkIcon className='h-5 w-5 text-gray-700' />
  </MyButton>
  ```
  `MyButton` is already imported in this file (used for "Logoff" at line 110).

- [x] `src/ui/login/form.tsx:266-272` — replace raw "not Registered" `<button>` with `MyButton`:
  ```tsx
  <MyButton
    type='button'
    onClick={function () { router.push('/register') }}
    overrideClass='h-auto md:h-auto px-0 md:px-0 bg-transparent hover:bg-transparent italic font-bold text-black hover:text-gray-700'
  >
    not Registered click here
  </MyButton>
  ```
  `MyButton` is already imported in this file (used for "Login" a few lines above).

- [x] `src/ui/admin/questions/answers/form.tsx:92-99` — add import
      `import { MyTextarea } from 'nextjs-shared/MyTextarea'` and replace raw `<textarea>` with:
  ```tsx
  <MyTextarea
    overrideClass='w-full h-auto px-4 md:px-4 py-[9px]'
    id={`qq_ans${index}`}
    name={`qq_ans${index}`}
    value={qq_ans[index] || ''}
    onChange={e => handleAnswerChange(index, e.target.value)}
    rows={3}
  />
  ```
  `rounded-md border border-blue-500` and `text-xs` are dropped from the override — they're
  already `MyTextarea`'s defaults, identical to the original raw classes.

- [x] `src/ui/admin/questions/detail/form.tsx:285-292` — replace raw `<textarea>` (the `qq_help`
      field) with `MyTextarea`, matching the sibling `qq_detail` field's pattern already used at
      line 226 in the same file:
  ```tsx
  <MyTextarea
    overrideClass='w-96  px-4 pt-2 rounded-md border border-blue-500 text-xs  '
    id='qq_help'
    rows={4}
    name='qq_help'
    value={qq_help}
    onChange={e => setqq_help(e.target.value)}
  />
  ```
  No new import needed (`MyTextarea` already imported for `qq_detail`).

## Changes

### src/ui/dashboard/dashboardMenu/NavDrawer.tsx
- Replaced the raw close `<button>` in the drawer header with `MyButton`, keeping the same
  `h-10 w-10` sizing and hover styling via `overrideClass` (with the `md:h-10` variant to prevent
  `MyButton`'s default `md:h-8` from overriding it on tablet/desktop).

### src/ui/login/form.tsx
- Replaced the raw "not Registered click here" `<button>` with `MyButton`, using `h-auto md:h-auto`
  and `px-0 md:px-0` in `overrideClass` to preserve the original borderless, auto-height text-link
  appearance.

### src/ui/admin/questions/answers/form.tsx
- Added `import { MyTextarea } from 'nextjs-shared/MyTextarea'`.
- Replaced the raw answer `<textarea>` with `MyTextarea`, dropping `rounded-md border
  border-blue-500` and `text-xs` from the override since they match `MyTextarea`'s existing
  defaults.

### src/ui/admin/questions/detail/form.tsx
- Replaced the raw `qq_help` `<textarea>` with `MyTextarea`, matching the existing `qq_detail`
  field's pattern in the same file (no new import needed).

## Testing
- [x] Open the dashboard on tablet/desktop width and confirm the nav drawer close (X) button still
      renders at full size (not collapsed) and closes the drawer on click.
- [x] Open `/login`, confirm the "not Registered click here" link still looks and behaves like a
      plain text link (no button chrome) and navigates to `/register`.
- [x] Open an admin question's Answers panel and confirm each answer textarea still looks and
      behaves the same (border, sizing, text entry).
- [x] Open an admin question's Detail panel and confirm the "Help" textarea still looks and behaves
      the same as the "Question" textarea above it (border, sizing, text entry).
- [x] `npx tsc --noEmit` passed with no errors after all four edits.
