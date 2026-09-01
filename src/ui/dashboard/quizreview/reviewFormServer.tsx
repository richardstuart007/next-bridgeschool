'use server'

//==============================================================================================
//  1) DESCRIPTION
//    ReviewFormServer — server component: loads the ths_history row for hs_hsid, optionally
//    filters out correctly-answered questions (si_skipcorrect), fetches the matching
//    tqq_questions rows, and renders <ReviewFormClient>.
//
//    Parameters:
//      hs_hsid — the history id being reviewed
//==============================================================================================

import ReviewFormClient from '@/src/ui/dashboard/quizreview/reviewFormClient'
import { table_fetch } from 'nextjs-shared/table_fetch'
import { table_Questions, table_Usershistory } from '@/src/lib/tables/definitions'
import { fetch_SessionInfo } from '@/src/lib/tables/tableSpecific/fetch_SessionInfo'

interface ReviewFormServerProps {
  hs_hsid: number
}

/**
 * Server component: fetches session info, questions + history, passes to client
 */
export default async function ReviewFormServer({ hs_hsid }: ReviewFormServerProps) {
  const functionName = 'ReviewFormServer'

  //
  //  Get Session Info
  //
  const SessionInfo = await fetch_SessionInfo({ caller: functionName })
  const si_skipcorrect = SessionInfo.si_skipcorrect

  //
  //  Fetch the history record
  //
  const historyResult = await table_fetch({
    caller: functionName,
    table: 'ths_history',
    whereColumnValuePairs: [{ column: 'hs_hsid', value: hs_hsid }],
    limit: 1
  })
  if (!historyResult.ok) throw new Error(historyResult.error ?? 'table_fetch failed')
  const historyRows = historyResult.data
  let history: table_Usershistory = historyRows[0]
  if (!history) throw new Error(`History record not found for hs_hsid=${hs_hsid}`)

  //
  //  Process History: Remove correct answers if si_skipcorrect is true
  //
  if (si_skipcorrect) {
    const newHs_qqid: number[] = []
    const newHs_ans: number[] = []
    for (let i = 0; i < history.hs_ans.length; i++) {
      if (history.hs_ans[i] !== 0 && history.hs_qqid[i] !== undefined) {
        newHs_qqid.push(history.hs_qqid[i])
        newHs_ans.push(history.hs_ans[i])
      }
    }
    history.hs_qqid = newHs_qqid
    history.hs_ans = newHs_ans
  }

  //
  //  If no questions remain after filtering, return empty set safely
  //
  if (!history.hs_qqid || history.hs_qqid.length === 0) {
    return <ReviewFormClient history={history} questions={[]} />
  }

  //
  //  Fetch all questions in this history
  //
  const questionsResult = await table_fetch({
    caller: functionName,
    table: 'tqq_questions',
    whereColumnValuePairs: [{ column: 'qq_qqid', value: history.hs_qqid, operator: 'IN' }],
    orderBy: 'qq_qqid'
  })
  if (!questionsResult.ok) throw new Error(questionsResult.error ?? 'table_fetch failed')
  const questions: table_Questions[] = questionsResult.data as table_Questions[]

  return <ReviewFormClient history={history} questions={questions} />
}
