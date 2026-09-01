'use client'

//==============================================================================================
//  1) DESCRIPTION
//    FormPopup — modal wrapper: renders the friends <Form> inside <MyPopup>.
//
//    Parameters:
//      isOpen          — whether the modal is shown
//      onClose         — closes the modal (also on form success)
//      uf_usid         — the user whose friends are being edited
//      friendOptions   — selectable friends ({ value, label })
//      selectedFriends — currently-selected friend ids
//      onFriendsChange — called when the selection changes
//==============================================================================================

import MyPopup from 'nextjs-shared/MyPopup'
import Form from './form'

interface Props {
  isOpen: boolean
  onClose: () => void
  uf_usid: number
  friendOptions: { value: string | number; label: string }[]
  selectedFriends: Array<string | number>
  onFriendsChange: (selected: Array<string | number>) => void
}

export default function FormPopup({
  isOpen,
  onClose,
  uf_usid,
  friendOptions,
  selectedFriends,
  onFriendsChange
}: Props) {
  return (
    <MyPopup isOpen={isOpen} onClose={onClose}>
      <Form
        uf_usid={uf_usid}
        friendOptions={friendOptions}
        selectedFriends={selectedFriends}
        onFriendsChange={onFriendsChange}
        onClose={onClose}
      />
    </MyPopup>
  )
}
