//==============================================================================================
//  1) DESCRIPTION
//    Page — /admin/maint/owner: server component; fetches the first page of tow_owner plus
//    the total page count and hands them to the client <Table>.
//==============================================================================================

import Table from '@/src/ui/admin/owner/table'
import { table_Owner } from '@/src/lib/tables/definitions'
import { Metadata } from 'next'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'owner'
}

export default async function Page() {
  const functionName = 'OwnerPage'
  const rowsPerPage = ROWS_PER_PAGE
  let initialRows: table_Owner[] = []
  let initialTotalPages = 0

  try {
    const [rowsResult, pagesResult] = await Promise.all([
      fetchFiltered({
        caller: functionName,
        table: 'tow_owner',
        filters: [],
        orderBy: 'ow_owner',
        limit: rowsPerPage,
        offset: 0,
        skipCache: true
      }),
      fetchTotalPages({
        caller: functionName,
        table: 'tow_owner',
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
