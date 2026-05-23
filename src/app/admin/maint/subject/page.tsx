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
    ;[initialRows, initialTotalPages] = await Promise.all([
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
  } catch (error) {
    console.error(`${functionName}: Error fetching initial data`, error)
  }

  return (
    <div className='w-full md:p-6'>
      <Table initialRows={initialRows} initialTotalPages={initialTotalPages} />
    </div>
  )
}
