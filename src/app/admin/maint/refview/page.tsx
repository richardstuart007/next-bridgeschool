//==============================================================================================
//  1) DESCRIPTION
//    Page — /admin/maint/refview: server component; fetches the first page of trf_reference
//    plus the total page count and hands them to the dashboard reference <Table> (read view).
//==============================================================================================

import Table from '@/src/ui/dashboard/reference/table'
import { Metadata } from 'next'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'
import { fetch_SessionInfo } from '@/src/lib/tables/tableSpecific/fetch_SessionInfo'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'
import type { JoinParams } from 'nextjs-shared/structures'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'References'
}

export default async function Page() {
  const functionName = 'AdminRefViewPage'
  const rowsPerPage = ROWS_PER_PAGE
  const joins: JoinParams[] = [{ table: 'tsb_subject', on: 'rf_sbid = sb_sbid' }]

  let si_usid = 0
  let initialRows: object[] = []
  let initialTotalPages = 0

  try {
    const sessionInfo = await fetch_SessionInfo({ caller: functionName })
    si_usid = sessionInfo?.si_usid ?? 0

    const [rowsResult, pagesResult] = await Promise.all([
      fetchFiltered({
        caller: functionName,
        table: 'trf_reference',
        joins,
        filters: [],
        orderBy: 'rf_owner, rf_subject, rf_ref',
        limit: rowsPerPage,
        offset: 0
      }),
      fetchTotalPages({
        caller: functionName,
        table: 'trf_reference',
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
        initialUsid={si_usid}
        initialRows={initialRows}
        initialTotalPages={initialTotalPages}
      />
    </div>
  )
}
