'use client'

//==============================================================================================
//  1) DESCRIPTION
//    MaintPopup — modal wrapper that renders the reference <Table> (scoped by sbid / owner /
//    subject) inside <MyPopup>.
//
//    Parameters:
//      sbid / owner / subject — passed through to <Table> as selected_* to scope the list
//      isOpen                 — whether the modal is shown
//      onClose                — called to close the modal
//==============================================================================================

import MyPopup from 'nextjs-shared/MyPopup'
import Table from '@/src/ui/admin/reference/table'

interface Props {
  sbid: number | undefined
  owner: string | undefined
  subject: string | undefined
  isOpen: boolean
  onClose: () => void
}

export default function MaintPopup({ sbid, owner, subject, isOpen, onClose }: Props) {
  return (
    <MyPopup isOpen={isOpen} onClose={onClose} overrideClass='max-w-screen-2xl'>
      <Table selected_sbid={sbid} selected_owner={owner} selected_subject={subject} />
    </MyPopup>
  )
}
