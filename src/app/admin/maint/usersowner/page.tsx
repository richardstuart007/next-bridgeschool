import Table from '@/src/ui/admin/usersowner/table'
import { Metadata } from 'next'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'usersowner'
}

export default async function Page() {
  const functionName = 'UsersownerPage'
  const rowsPerPage = 17
  let initialRows: object[] = []
  let initialTotalPages = 0

  try {
    ;[initialRows, initialTotalPages] = await Promise.all([
      fetchFiltered({
        caller: functionName,
        table: 'tuo_usersowner',
        filters: [],
        orderBy: 'uo_usid, uo_owner',
        limit: rowsPerPage,
        offset: 0,
        skipCache: true
      }),
      fetchTotalPages({
        caller: functionName,
        table: 'tuo_usersowner',
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
