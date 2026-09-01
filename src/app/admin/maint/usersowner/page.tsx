//==============================================================================================
//  1) DESCRIPTION
//    Page — /admin/maint/usersowner: server component; fetches the first page of tuo_usersowner
//    plus the total page count and hands them to the client <Table>.
//==============================================================================================

import Table from '@/src/ui/admin/usersowner/table'
import { Metadata } from 'next'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'usersowner'
}

export default async function Page() {
  const functionName = 'UsersownerPage'
  const rowsPerPage = ROWS_PER_PAGE
  let initialRows: object[] = []
  let initialTotalPages = 0

  try {
    const [rowsResult, pagesResult] = await Promise.all([
      fetchFiltered({
        caller: functionName,
        table: 'tuo_usersowner',
        filters: [],
        orderBy: 'uo_usid, uo_owner',
        limit: rowsPerPage,
        offset: 0,
        skipCache: true
      }),
      fetchTotalPages({
        caller: functionName,
        table: 'tuo_usersowner',
        filters: [],
        items_per_page: rowsPerPage,
        skipCache: true
      })
    ])
    if (!rowsResult.ok) throw new Error(rowsResult.error ?? 'fetchFiltered failed')
    if (!pagesResult.ok) throw new Error(pagesResult.error ?? 'fetchTotalPages failed')
    initialRows = rowsResult.data
    initialTotalPages = pagesResult.data
  } catch (error) {
    console.error(`${functionName}: Error fetching initial data`, error)
  }

  return (
    <div className='w-full md:p-6'>
      <Table initialRows={initialRows} initialTotalPages={initialTotalPages} />
    </div>
  )
}
