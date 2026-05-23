export const dynamic = 'force-dynamic'
import CopyTable from 'nextjs-shared/CopyTable'
import { Metadata } from 'next'
import { Suspense } from 'react'

const title = 'Copytable'
export const metadata: Metadata = {
  title: title
}

export default function Page() {
  return (
    <div className='w-full md:p-6'>
      <Suspense>
        <CopyTable baseDir='C:/Users/richa/github/next-bridgeschool' />
      </Suspense>
    </div>
  )
}
