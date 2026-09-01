'use client'

//==============================================================================================
//  1) DESCRIPTION
//    FormPopup — modal wrapper: renders the dashboard user <Form> inside <MyPopup>.
//
//    Parameters:
//      uid     — the user id to edit (passed through to <Form>)
//      isOpen  — whether the modal is shown
//      onClose — closes the modal
//==============================================================================================

import MyPopup from 'nextjs-shared/MyPopup'
import Form from '@/src/ui/dashboard/users/form'

interface Props {
  uid: number
  isOpen: boolean
  onClose: () => void
}

export default function FormPopup({ uid, isOpen, onClose }: Props) {
  return (
    <MyPopup isOpen={isOpen} onClose={onClose}>
      <Form admin_uid={uid} />
    </MyPopup>
  )
}
