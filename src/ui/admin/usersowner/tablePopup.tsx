'use client'

//==============================================================================================
//  1) DESCRIPTION
//    TablePopup — modal wrapper that renders the usersowner <Table> (scoped to one user)
//    inside <MyPopup>.
//
//    Parameters:
//      uid     — user id passed through to <Table> as selected_uid
//      isOpen  — whether the modal is shown
//      onClose — called to close the modal
//==============================================================================================

import MyPopup from 'nextjs-shared/MyPopup'
import Table from '@/src/ui/admin/usersowner/table'

interface Props {
  uid: number | null
  isOpen: boolean
  onClose: () => void
}

export default function TablePopup({ uid, isOpen, onClose }: Props) {
  return (
    <MyPopup isOpen={isOpen} onClose={onClose} overrideClass='max-w-screen-2xl'>
      <Table selected_uid={uid} />
    </MyPopup>
  )
}
