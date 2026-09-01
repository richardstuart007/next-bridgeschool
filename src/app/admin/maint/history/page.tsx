//==============================================================================================
//  1) DESCRIPTION
//    Page — /admin/maint/history: server component; fetches the first page of ths_history
//    (joined to tsb_subject + tus_users) plus the total page count and hands them to the client
//    <Table>.
//==============================================================================================

import Table from '@/src/ui/dashboard/history/table'
import { Metadata } from 'next'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'
import type { JoinParams } from 'nextjs-shared/structures'
import { table_UsershistorySubjectUser } from '@/src/lib/tables/definitions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'History'
}

export default async function Page() {
  const functionName = 'AdminHistoryPage'
  const rowsPerPage = ROWS_PER_PAGE
  const joins: JoinParams[] = [
    { table: 'tsb_subject', on: 'hs_sbid = sb_sbid' },
    { table: 'tus_users', on: 'hs_usid = us_usid' }
  ]

  let initialRows: table_UsershistorySubjectUser[] = []
  let initialTotalPages = 0

  try {
    const [rowsResult, pagesResult] = await Promise.all([
      fetchFiltered({
        caller: functionName,
        table: 'ths_history',
        joins,
        filters: [],
        orderBy: 'hs_hsid DESC',
        limit: rowsPerPage,
        offset: 0
      }),
      fetchTotalPages({
        caller: functionName,
        table: 'ths_history',
        joins,
        filters: [],
        items_per_page: rowsPerPage
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
      <Table
        initialRows={initialRows}
        initialTotalPages={initialTotalPages}
      />
    </div>
  )
}
