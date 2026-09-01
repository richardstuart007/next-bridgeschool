//==============================================================================================
//  1) DESCRIPTION
//    Page — /dashboard/history: for the signed-in user (fetch_SessionInfo -> si_usid), fetches
//    their country + owner rows and the first page of ths_history (joined to tsb_subject +
//    tus_users), then hands them to the client <Table>.
//==============================================================================================

import Table from '@/src/ui/dashboard/history/table'
import { Metadata } from 'next'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'
import { fetch_SessionInfo } from '@/src/lib/tables/tableSpecific/fetch_SessionInfo'
import { table_fetch, table_fetch_Props } from 'nextjs-shared/table_fetch'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'
import type { JoinParams, Filter } from 'nextjs-shared/structures'
import { table_UsershistorySubjectUser } from '@/src/lib/tables/definitions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'History'
}

export default async function Page() {
  const functionName = 'HistoryPage'
  const rowsPerPage = ROWS_PER_PAGE
  const joins: JoinParams[] = [
    { table: 'tsb_subject', on: 'hs_sbid = sb_sbid' },
    { table: 'tus_users', on: 'hs_usid = us_usid' }
  ]

  let si_usid = 0
  let initialCountryCode = ''
  let initialUserName = ''
  let ownerRows: { uo_owner: string }[] = []
  let initialRows: table_UsershistorySubjectUser[] = []
  let initialTotalPages = 0

  try {
    const sessionInfo = await fetch_SessionInfo({ caller: functionName })
    si_usid = sessionInfo?.si_usid ?? 0

    if (si_usid) {
      const [userResult, ownerResult] = await Promise.all([
        table_fetch({
          caller: functionName,
          table: 'tus_users',
          whereColumnValuePairs: [{ column: 'us_usid', value: si_usid }]
        } as table_fetch_Props),
        table_fetch({
          caller: functionName,
          table: 'tuo_usersowner',
          whereColumnValuePairs: [{ column: 'uo_usid', value: si_usid }]
        } as table_fetch_Props)
      ])
      if (!userResult.ok) throw new Error(userResult.error ?? 'table_fetch failed')
      if (!ownerResult.ok) throw new Error(ownerResult.error ?? 'table_fetch failed')
      const userRows = userResult.data
      const fetchedOwnerRows = ownerResult.data
      initialCountryCode = userRows[0]?.us_fedcountry ?? ''
      initialUserName = userRows[0]?.us_name ?? ''
      ownerRows = fetchedOwnerRows

      const initOwner = ownerRows.length === 1 ? ownerRows[0].uo_owner : ''
      const filters: Filter[] = [
        { column: 'hs_usid', value: si_usid, operator: '=' },
        ...(initOwner ? [{ column: 'hs_owner', value: initOwner, operator: '=' as const }] : [])
      ]

      const [rowsResult, pagesResult] = await Promise.all([
        fetchFiltered({
          caller: functionName,
          table: 'ths_history',
          joins,
          filters,
          orderBy: 'hs_hsid DESC',
          limit: rowsPerPage,
          offset: 0
        }),
        fetchTotalPages({
          caller: functionName,
          table: 'ths_history',
          joins,
          filters,
          items_per_page: rowsPerPage
        })
      ])
      if (!rowsResult.ok) throw new Error(rowsResult.error ?? 'fetchFiltered failed')
      if (!pagesResult.ok) throw new Error(pagesResult.error ?? 'fetchTotalPages failed')
      initialRows = rowsResult.data
      initialTotalPages = pagesResult.data
    }
  } catch (error) {
    console.error(`${functionName}: Error fetching initial data`, error)
  }

  return (
    <div className='w-full md:p-6'>
      <Table
        fixedUsid={si_usid}
        fixedUserName={initialUserName}
        initialUsid={si_usid}
        initialCountryCode={initialCountryCode}
        initialOwners={ownerRows}
        initialRows={initialRows}
        initialTotalPages={initialTotalPages}
      />
    </div>
  )
}
