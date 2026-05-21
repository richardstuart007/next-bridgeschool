'use client'
import MyPopup from 'nextjs-shared/MyPopup'
import Form from '@/src/ui/admin/owner/form'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function FormPopup({ isOpen, onClose }: Props) {
  //
  // Close the popup on success
  //
  const handleSuccess = () => {
    onClose()
  }
  return (
    <MyPopup isOpen={isOpen} onClose={onClose}>
      <Form onSuccess={handleSuccess} shouldCloseOnUpdate={true} />
    </MyPopup>
  )
}
