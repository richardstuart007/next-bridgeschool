'use client'

//==============================================================================================
//  1) DESCRIPTION
//    FormPopup — modal wrapper: renders the question hands <Form> inside <MyPopup>, closing the
//    popup (via onClose) once the form reports a successful update.
//
//    Parameters:
//      isOpen   — whether the modal is shown
//      onClose  — called to close the modal (also on form success)
//      record / *Record / selected_* — passed straight through to <Form> where present
//==============================================================================================

import MyPopup from 'nextjs-shared/MyPopup'
import Form from '@/src/ui/admin/questions/hands/form'
import { table_Questions } from '@/src/lib/tables/definitions'

interface Props {
  record: table_Questions
  isOpen: boolean
  onClose: () => void
}

export default function FormPopup({ record, isOpen, onClose }: Props) {
  return (
    <MyPopup isOpen={isOpen} onClose={onClose} overrideClass='max-w-screen-2xl'>
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
