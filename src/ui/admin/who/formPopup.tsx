'use client'

//==============================================================================================
//  1) DESCRIPTION
//    FormPopup — modal wrapper: renders the who <Form> inside <MyPopup>, closing the
//    popup (via onClose) once the form reports a successful update.
//
//    Parameters:
//      isOpen   — whether the modal is shown
//      onClose  — called to close the modal (also on form success)
//      record / *Record / selected_* — passed straight through to <Form> where present
//==============================================================================================

import MyPopup from 'nextjs-shared/MyPopup'
import Form from '@/src/ui/admin/who/form'
import { table_Who } from '@/src/lib/tables/definitions'

interface Props {
  record: table_Who | null
  isOpen: boolean
  onClose: () => void
}

export default function FormPopup({ record, isOpen, onClose }: Props) {
  return (
    <MyPopup isOpen={isOpen} onClose={onClose}>
      <Form record={record} onSuccess={handleSuccess} shouldCloseOnUpdate={true} />
    </MyPopup>
  )
  //
  // Close the popup on success
  //
  function handleSuccess() {
    onClose()
  }
}
