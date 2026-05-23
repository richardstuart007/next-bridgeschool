import Table from '@/src/ui/admin/questions/table'
import { Metadata } from 'next'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'questions'
}

export default async function Page() {
  const functionName = 'QuestionsPage'
  const rowsPerPage = ROWS_PER_PAGE
  let initialRows: object[] = []
  let initialTotalPages = 0

  try {
    ;[initialRows, initialTotalPages] = await Promise.all([
      fetchFiltered({
        caller: functionName,
        table: 'tqq_questions',
        filters: [],
        orderBy: 'qq_owner, qq_subject, qq_seq',
        limit: rowsPerPage,
        offset: 0,
        skipCache: true
      }),
      fetchTotalPages({
        caller: functionName,
        table: 'tqq_questions',
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
