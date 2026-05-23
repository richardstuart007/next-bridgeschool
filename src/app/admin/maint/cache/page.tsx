import Table_Cache from 'nextjs-shared/Table_Cache'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cache'
}

export default function Page() {
  return (
    <div className='w-full md:p-6'>
      <Table_Cache />
    </div>
  )
}
