export const dynamic = 'force-dynamic'
import Graph_Summary from '@/src/ui/dashboard/graph/graph_summary'
import { Suspense } from 'react'

export default async function Page() {
  return (
    <div className='flex-1 min-h-0 overflow-hidden flex flex-col'>
      <Suspense fallback={null}>
        <Graph_Summary />
      </Suspense>
    </div>
  )
}
