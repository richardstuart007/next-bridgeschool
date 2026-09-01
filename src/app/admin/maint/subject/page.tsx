//==============================================================================================
//  1) DESCRIPTION
//    Page — /admin/maint/subject: server component; fetches the first page of tsb_subject plus
//    the total page count and hands them to the client <Table>.
//==============================================================================================

import Table from '@/src/ui/admin/subject/table'
import { table_Subject } from '@/src/lib/tables/definitions'
import { Metadata } from 'next'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Subject'
}

export default async function Page() {
  const functionName = 'SubjectAdminPage'
  const rowsPerPage = ROWS_PER_PAGE
  let initialRows: table_Subject[] = []
  let initialTotalPages = 0

  try {
    const [rowsResult, pagesResult] = await Promise.all([
      fetchFiltered({
        caller: functionName,
        table: 'tsb_subject',
        filters: [],
        orderBy: 'sb_owner, sb_subject',
        limit: rowsPerPage,
        offset: 0,
        skipCache: true
      }),
      fetchTotalPages({
        caller: functionName,
        table: 'tsb_subject',
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
