import Table from 'nextjs-shared/Table_Logging'
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
    ;[initialRows, initialTotalPages] = await Promise.all([
      fetchFiltered({
        caller: functionName,
        table: 'tlg_logging',
        filters: [],
        orderBy: 'lg_lgid DESC',
        limit: rowsPerPage,
        offset: 0,
        skipCache: true
      }),
      fetchTotalPages({
        caller: functionName,
        table: 'tlg_logging',
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
