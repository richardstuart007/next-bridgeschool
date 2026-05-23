import Table from '@/src/ui/dashboard/subject/table'
import { Metadata } from 'next'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'
import { fetch_SessionInfo } from '@/src/lib/tables/tableSpecific/fetch_SessionInfo'
import { table_fetch, table_fetch_Props } from 'nextjs-shared/table_fetch'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'
import type { JoinParams, Filter } from 'nextjs-shared/structures'
import { table_Subject } from '@/src/lib/tables/definitions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Subject'
}

export default async function Page() {
  const functionName = 'SubjectPage'
  const joins: JoinParams[] = [{ table: 'tuo_usersowner', on: 'sb_owner = uo_owner' }]
  const rowsPerPage = ROWS_PER_PAGE

  let si_usid = 0
  let ownerRows: { uo_owner: string }[] = []
  let initialRows: table_Subject[] = []
  let initialTotalPages = 0

  try {
    const sessionInfo = await fetch_SessionInfo({ caller: functionName })
    si_usid = sessionInfo?.si_usid ?? 0

    if (si_usid) {
      ownerRows = await table_fetch({
        caller: functionName,
        table: 'tuo_usersowner',
        whereColumnValuePairs: [{ column: 'uo_usid', value: si_usid }]
      } as table_fetch_Props)

      const initOwner = ownerRows.length === 1 ? ownerRows[0].uo_owner : ''
      const filters: Filter[] = [
        { column: 'uo_usid', value: si_usid, operator: '=' },
        { column: 'sb_cntquestions', value: 1, operator: '>=' },
        ...(initOwner ? [{ column: 'sb_owner', value: initOwner, operator: '=' as const }] : [])
      ]

      ;[initialRows, initialTotalPages] = await Promise.all([
        fetchFiltered({
          caller: functionName,
          table: 'tsb_subject',
          joins,
          filters,
          orderBy: 'sb_owner, sb_subject',
          limit: rowsPerPage,
          offset: 0,
          distinctColumns: []
        }),
        fetchTotalPages({
          caller: functionName,
          table: 'tsb_subject',
          joins,
          filters,
          items_per_page: rowsPerPage,
          distinctColumns: []
        })
      ])
    }
  } catch (error) {
    console.error(`${functionName}: Error fetching initial data`, error)
  }

  return (
    <div className='w-full md:p-6'>
      <Table
        initialUsid={si_usid}
        initialOwners={ownerRows}
        initialRows={initialRows}
        initialTotalPages={initialTotalPages}
      />
    </div>
  )
}
