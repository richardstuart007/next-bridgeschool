//==============================================================================================
//  1) DESCRIPTION
//    Page — /admin/maint/reference: server component; fetches the first page of trf_reference
//    plus the total page count and hands them to the client <Table>.
//==============================================================================================

import Table from '@/src/ui/admin/reference/table'
import { Metadata } from 'next'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'
import type { JoinParams } from 'nextjs-shared/structures'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Reference'
}

export default async function Page() {
  const functionName = 'ReferenceAdminPage'
  const rowsPerPage = ROWS_PER_PAGE
  const joins: JoinParams[] = [
    { table: 'tuo_usersowner', on: 'rf_owner = uo_owner' },
    { table: 'tsb_subject', on: 'rf_sbid = sb_sbid' }
  ]
  const distinctColumns = ['rf_owner', 'rf_subject', 'rf_ref']
  let initialRows: object[] = []
  let initialTotalPages = 0

  try {
    const [rowsResult, pagesResult] = await Promise.all([
      fetchFiltered({
        caller: functionName,
        table: 'trf_reference',
        joins,
        filters: [],
        orderBy: 'rf_owner, rf_subject, rf_ref',
        limit: rowsPerPage,
        offset: 0,
        distinctColumns
      }),
      fetchTotalPages({
        caller: functionName,
        table: 'trf_reference',
        joins,
        filters: [],
        items_per_page: rowsPerPage,
        distinctColumns
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
