//==============================================================================================
//  1) DESCRIPTION
//    Page — /admin/maint/logging: force-dynamic route; fetches the first page of xlg_logging
//    plus the total page count and hands them to nextjs-shared's <OwnerTableLogging> table.
//==============================================================================================

import Table from 'nextjs-shared/OwnerTableLogging'
import { table_Logging } from 'nextjs-shared/structures'
import { Metadata } from 'next'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Logging'
}

export default async function Page() {
  const functionName = 'LoggingPage'
  const rowsPerPage = ROWS_PER_PAGE
  let initialRows: table_Logging[] = []
  let initialTotalPages = 0

  try {
    const [rowsResult, pagesResult] = await Promise.all([
      fetchFiltered({
        caller: functionName,
        table: 'xlg_logging',
        filters: [],
        orderBy: 'lg_lgid DESC',
        limit: rowsPerPage,
        offset: 0,
        skipCache: true
      }),
      fetchTotalPages({
        caller: functionName,
        table: 'xlg_logging',
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
