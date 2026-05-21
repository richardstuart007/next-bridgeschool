import Table from '@/src/ui/dashboard/reference/table'
import { Metadata } from 'next'
import { fetch_SessionInfo } from '@/src/lib/tables/tableSpecific/fetch_SessionInfo'
import { table_fetch, table_fetch_Props } from 'nextjs-shared/table_fetch'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'
import { JoinParams, Filter } from 'nextjs-shared/tableFetchUtils'
import { table_Subject } from '@/src/lib/tables/definitions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Reference-select'
}

export default async function Page({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[]>>
}) {
  const functionName = 'ReferencePage'
  const urlSearch = await searchParams
  const uq_sbid = String(urlSearch?.uq_sbid) || 'unknown'
  const rowsPerPage = 20
  const joins: JoinParams[] = [
    { table: 'tuo_usersowner', on: 'rf_owner = uo_owner' },
    { table: 'tsb_subject', on: 'rf_sbid = sb_sbid' }
  ]

  let si_usid = 0
  let initialSubjectInfo: table_Subject | undefined
  let initialRows: object[] = []
  let initialTotalPages = 0

  try {
    const sessionInfo = await fetch_SessionInfo({ caller: functionName })
    si_usid = sessionInfo?.si_usid ?? 0

    if (si_usid) {
      const sbidNum = Number(uq_sbid)

      if (sbidNum > 0) {
        const subjectRows = await table_fetch({
          caller: functionName,
          table: 'tsb_subject',
          whereColumnValuePairs: [{ column: 'sb_sbid', value: sbidNum }]
        } as table_fetch_Props)
        initialSubjectInfo = subjectRows[0] as table_Subject | undefined
      }

      const filters: Filter[] = [
        { column: 'uo_usid', value: si_usid, operator: '=' },
        ...(sbidNum > 0
          ? [{ column: 'rf_sbid', value: sbidNum, operator: '=' as const }]
          : [])
      ]

      ;[initialRows, initialTotalPages] = await Promise.all([
        fetchFiltered({
          caller: functionName,
          table: 'trf_reference',
          joins,
          filters,
          orderBy: 'rf_owner, rf_subject, rf_ref',
          limit: rowsPerPage,
          offset: 0,
          distinctColumns: []
        }),
        fetchTotalPages({
          caller: functionName,
          table: 'trf_reference',
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
        uq_sbid={uq_sbid}
        initialUsid={si_usid}
        initialSubjectInfo={initialSubjectInfo}
        initialRows={initialRows}
        initialTotalPages={initialTotalPages}
      />
    </div>
  )
}
