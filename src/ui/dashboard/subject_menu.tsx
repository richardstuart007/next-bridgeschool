import { fetch_SessionInfo } from '@/src/lib/tables/tableSpecific/fetch_SessionInfo'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import type { JoinParams, Filter } from 'nextjs-shared/structures'
import { table_Subject, table_Reference } from '@/src/lib/tables/definitions'
import { LEVELS } from '@/src/root/constants/colours'
import SubjectSection from '@/src/ui/dashboard/SubjectSection'

export default async function SubjectMenu() {
  const functionName = 'SubjectMenu'
  let subjects: table_Subject[] = []
  let refsBySbid = new Map<number, table_Reference[]>()

  try {
    const sessionInfo = await fetch_SessionInfo({ caller: functionName })
    const si_usid = sessionInfo?.si_usid ?? 0

    if (si_usid) {
      const subjectJoins: JoinParams[] = [{ table: 'tuo_usersowner', on: 'sb_owner = uo_owner' }]
      const subjectFilters: Filter[] = [
        { column: 'uo_usid', value: si_usid, operator: '=' },
        { column: 'sb_cntquestions', value: 1, operator: '>=' }
      ]

      subjects = (await fetchFiltered({
        caller: functionName,
        table: 'tsb_subject',
        joins: subjectJoins,
        filters: subjectFilters,
        orderBy: 'sb_level, sb_title',
        limit: 100,
        offset: 0,
        distinctColumns: []
      })) as table_Subject[]

      const refJoins: JoinParams[] = [{ table: 'tuo_usersowner', on: 'rf_owner = uo_owner' }]
      const refFilters: Filter[] = [{ column: 'uo_usid', value: si_usid, operator: '=' }]

      const allRefs = (await fetchFiltered({
        caller: functionName,
        table: 'trf_reference',
        joins: refJoins,
        filters: refFilters,
        orderBy: 'rf_sbid, rf_ref',
        limit: 500,
        offset: 0,
        distinctColumns: []
      })) as table_Reference[]

      for (const ref of allRefs) {
        const existing = refsBySbid.get(ref.rf_sbid) ?? []
        refsBySbid.set(ref.rf_sbid, [...existing, ref])
      }
    }
  } catch (error) {
    console.error(`${functionName}: Error fetching subjects`, error)
  }

  return (
    <div className='p-4 md:p-6 pb-6 md:pb-8 space-y-6'>
      {LEVELS.map(level => {
        const group = subjects.filter(s => s.sb_level === level.key)
        if (group.length === 0) return null
        const groupRefs: Record<number, table_Reference[]> = {}
        for (const subject of group) {
          const subjectRefs = refsBySbid.get(subject.sb_sbid)
          if (subjectRefs) groupRefs[subject.sb_sbid] = subjectRefs
        }
        return (
          <SubjectSection key={level.key} level={level} subjects={group} refs={groupRefs} />
        )
      })}
    </div>
  )
}
