'use client'
import MyPopup from 'nextjs-shared/MyPopup'
import Form from '@/src/ui/admin/subject/form'
import { table_Subject } from '@/src/lib/tables/definitions'

interface Props {
  record: table_Subject | null
  isOpen: boolean
  onClose: () => void
}

export default function FormPopup({ record, isOpen, onClose }: Props) {
  //
  // Close the popup on success
  //
  const handleSuccess = () => {
    onClose()
  }
  return (
    <MyPopup isOpen={isOpen} onClose={onClose}>
      <Form record={record} onSuccess={handleSuccess} shouldCloseOnUpdate={true} />
    </MyPopup>
  )
}
