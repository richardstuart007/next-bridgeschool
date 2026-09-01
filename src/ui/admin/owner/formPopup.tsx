'use client'

//==============================================================================================
//  1) DESCRIPTION
//    FormPopup — modal wrapper: renders the owner <Form> inside <MyPopup>, closing the
//    popup (via onClose) once the form reports a successful update.
//
//    Parameters:
//      isOpen   — whether the modal is shown
//      onClose  — called to close the modal (also on form success)
//      record / *Record / selected_* — passed straight through to <Form> where present
//==============================================================================================

import MyPopup from 'nextjs-shared/MyPopup'
import Form from '@/src/ui/admin/owner/form'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function FormPopup({ isOpen, onClose }: Props) {
  return (
    <MyPopup isOpen={isOpen} onClose={onClose}>
      <Form onSuccess={handleSuccess} shouldCloseOnUpdate={true} />
    </MyPopup>
  )
  //
  // Close the popup on success
  //
  function handleSuccess() {
    onClose()
  }
}
