import Table from '@/src/ui/admin/reference/table'
import { Metadata } from 'next'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'
import type { JoinParams } from 'nextjs-shared/structures'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Reference'
}

export default async function Page() {
  const functionName = 'ReferenceAdminPage'
  const rowsPerPage = 17
  const joins: JoinParams[] = [
    { table: 'tuo_usersowner', on: 'rf_owner = uo_owner' },
    { table: 'tsb_subject', on: 'rf_sbid = sb_sbid' }
  ]
  const distinctColumns = ['rf_owner', 'rf_subject', 'rf_ref']
  let initialRows: object[] = []
  let initialTotalPages = 0

  try {
    ;[initialRows, initialTotalPages] = await Promise.all([
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
  } catch (error) {
    console.error(`${functionName}: Error fetching initial data`, error)
  }

  return (
    <div className='w-full md:p-6'>
      <Table initialRows={initialRows} initialTotalPages={initialTotalPages} />
    </div>
  )
}
