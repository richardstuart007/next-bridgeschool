//==============================================================================================
//  1) DESCRIPTION
//    Page — /admin/maint/sessions: server component; fetches the first page of tss_sessions
//    (joined to tus_users) plus the total page count and hands them to the client <Table>.
//==============================================================================================

import Table from '@/src/ui/admin/sessions/table'
import { table_SessionsUser } from '@/src/lib/tables/definitions'
import { Metadata } from 'next'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'
import type { JoinParams } from 'nextjs-shared/structures'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sessions'
}

export default async function Page() {
  const functionName = 'SessionsPage'
  const rowsPerPage = ROWS_PER_PAGE
  const joins: JoinParams[] = [{ table: 'tus_users', on: 'ss_usid = us_usid' }]
  let initialRows: table_SessionsUser[] = []
  let initialTotalPages = 0

  try {
    const [rowsResult, pagesResult] = await Promise.all([
      fetchFiltered({
        caller: functionName,
        table: 'tss_sessions',
        joins,
        filters: [],
        orderBy: 'ss_ssid DESC',
        limit: rowsPerPage,
        offset: 0,
        skipCache: true
      }),
      fetchTotalPages({
        caller: functionName,
        table: 'tss_sessions',
        joins,
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
