'use client'

//==============================================================================================
//  1) DESCRIPTION
//    FormPopup — modal wrapper: renders the user password <Form> inside <MyPopup>, closing the
//    popup (via onClose) once the form reports a successful update.
//
//    Parameters:
//      isOpen   — whether the modal is shown
//      onClose  — called to close the modal (also on form success)
//      record / *Record / selected_* — passed straight through to <Form> where present
//==============================================================================================

import MyPopup from 'nextjs-shared/MyPopup'
import Form from '@/src/ui/admin/users/pwdedit/form'
import { table_Users } from '@/src/lib/tables/definitions'

interface Props {
  userRecord: table_Users | null
  isOpen: boolean
  onClose: () => void
}

export default function EditPopup({ userRecord, isOpen, onClose }: Props) {
  return (
    <MyPopup isOpen={isOpen} onClose={onClose}>
      {userRecord && <Form UserRecord={userRecord} />}
    </MyPopup>
  )
}
