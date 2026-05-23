export const dynamic = 'force-dynamic'
import Table from 'nextjs-shared/BackupTable'
import { basetables } from '@/src/lib/copytables/tables'
import { Metadata } from 'next'
import { Suspense } from 'react'

const title = 'Backuptable'
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
        <Table tables={basetables} />
      </Suspense>
    </div>
  )
}
