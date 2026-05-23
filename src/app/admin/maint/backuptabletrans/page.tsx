export const dynamic = 'force-dynamic'
import Table from '@/src/ui/admin/backup/table'
import { transtables } from '@/src/ui/admin/backup/basetables'
import { Metadata } from 'next'
import { Suspense } from 'react'

const title = 'Backuptabletrans'
export const metadata: Metadata = {
  title: title
}
//
//  App route
//
export default function Page() {
  return (
    <div className='w-full md:p-6'>
      <Suspense>
        <Table tables={transtables} />
      </Suspense>
    </div>
  )
}
