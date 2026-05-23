import Table from '@/src/ui/admin/who/table'
import { table_Who } from '@/src/lib/tables/definitions'
import { Metadata } from 'next'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'who'
}

export default async function Page() {
  const functionName = 'WhoPage'
  const rowsPerPage = ROWS_PER_PAGE
  let initialRows: table_Who[] = []
  let initialTotalPages = 0

  try {
    ;[initialRows, initialTotalPages] = await Promise.all([
      fetchFiltered({
        caller: functionName,
        table: 'twh_who',
        filters: [],
        orderBy: 'wh_who',
        limit: rowsPerPage,
        offset: 0,
        skipCache: true
      }),
      fetchTotalPages({
        caller: functionName,
        table: 'twh_who',
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
