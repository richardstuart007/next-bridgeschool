export const dynamic = 'force-dynamic'
import SubjectMenu from '@/src/ui/dashboard/subject_menu'
import { Suspense } from 'react'

export default async function Page() {
  return (
    <main className='flex flex-col p-2 md:p-4'>
      <div className='flex-grow'>
        <Suspense fallback={null}>
          <SubjectMenu />
        </Suspense>
      </div>
    </main>
  )
}
