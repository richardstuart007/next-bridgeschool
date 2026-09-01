'use client'

//==============================================================================================
//  1) DESCRIPTION
//    FormPopup — modal wrapper: renders the question <Form> inside <MyPopup>, closing the
//    popup (via onClose) once the form reports a successful update.
//
//    Parameters:
//      isOpen   — whether the modal is shown
//      onClose  — called to close the modal (also on form success)
//      record / *Record / selected_* — passed straight through to <Form> where present
//==============================================================================================

import MyPopup from 'nextjs-shared/MyPopup'
import Form from '@/src/ui/admin/questions/detail/form'
import { table_Questions } from '@/src/lib/tables/definitions'

interface Props {
  questionRecord?: table_Questions | undefined
  selected_owner?: string | undefined
  selected_subject?: string | undefined
  isOpen: boolean
  onClose: () => void
}

export default function FormPopup({
  questionRecord,
  selected_owner,
  selected_subject,
  isOpen,
  onClose
}: Props) {
  return (
    <MyPopup isOpen={isOpen} onClose={onClose}>
      <Form
        questionRecord={questionRecord}
        selected_owner={selected_owner}
        selected_subject={selected_subject}
        onSuccess={handleSuccess}
        shouldCloseOnUpdate={true}
      />
    </MyPopup>
  )
  //
  // Close the popup on success
  //
  function handleSuccess() {
    onClose()
  }
}
