'use client'
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
