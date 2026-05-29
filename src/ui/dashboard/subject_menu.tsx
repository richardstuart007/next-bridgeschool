import { fetch_SessionInfo } from '@/src/lib/tables/tableSpecific/fetch_SessionInfo'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import type { JoinParams, Filter } from 'nextjs-shared/structures'
import { table_Subject, table_Reference } from '@/src/lib/tables/definitions'
import { MyLink } from 'nextjs-shared/MyLink'
import { REFS_DIRECT_MAX } from '@/src/lib/tableUtils'
import { LEVELS, QUIZ_COLOR } from '@/src/root/constants/colours'
// Note: level.text is applied explicitly on all title spans to avoid CSS inheritance issues
import ReferenceCard from '@/src/ui/dashboard/reference/ReferenceCard'

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

      // Fetch all references for this user to support inline display
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
    <div className='p-4 md:p-6 space-y-6'>
      {LEVELS.map(level => {
        const group = subjects.filter(s => s.sb_level === level.key)
        if (group.length === 0) return null
        return (
          <div key={level.key}>
            <h2 className='text-sm font-bold text-gray-600 uppercase tracking-wide mb-2'>
              {level.label}
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
              {group.map(subject => {
                const refs = refsBySbid.get(subject.sb_sbid) ?? []
                const isQuizOnly = subject.sb_cntreference === 0 && subject.sb_cntquestions > 0
                const isSingleRef = subject.sb_cntreference <= REFS_DIRECT_MAX && refs.length === 1

                if (isQuizOnly) {
                  return (
                    <div
                      key={subject.sb_sbid}
                      className={`h-24 rounded-lg shadow-sm flex flex-col justify-between p-2 ${level.color}`}
                    >
                      <span className={`text-sm font-semibold text-center flex-1 flex items-center justify-center px-1 leading-tight ${level.text}`}>
                        {subject.sb_title}
                      </span>
                      <MyLink
                        href={{
                          pathname: '/dashboard/quiz',
                          query: {
                            uq_route: 'reference-select',
                            uq_column: 'qq_sbid',
                            uq_sbid: String(subject.sb_sbid)
                          },
                          reference: 'quiz',
                          segment: String(subject.sb_sbid)
                        }}
                        overrideClass={`h-7 text-xs w-full justify-center ${QUIZ_COLOR}`}
                        caller={functionName}
                      >
                        Quiz
                      </MyLink>
                    </div>
                  )
                }

                if (isSingleRef) {
                  return (
                    <div
                      key={subject.sb_sbid}
                      className={`h-24 rounded-lg shadow-sm flex flex-col justify-between p-2 ${level.color}`}
                    >
                      <span className={`text-sm font-semibold text-center flex-1 flex items-center justify-center px-1 leading-tight ${level.text}`}>
                        {subject.sb_title}
                      </span>
                      <ReferenceCard reference={refs[0]} />
                    </div>
                  )
                }

                return (
                  <MyLink
                    key={subject.sb_sbid}
                    href={{
                      pathname: '/dashboard/reference_select',
                      reference: 'reference_select',
                      segment: String(subject.sb_sbid),
                      query: {
                        uq_sbid: JSON.stringify(subject.sb_sbid),
                        uq_route: 'subject'
                      }
                    }}
                    overrideClass={`h-24 justify-center text-sm font-semibold ${level.color}`}
                    caller={functionName}
                  >
                    {subject.sb_title}
                  </MyLink>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
