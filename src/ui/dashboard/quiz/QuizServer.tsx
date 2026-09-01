'use server'

//==============================================================================================
//  1) DESCRIPTION
//    QuizServer — server component: reads si_maxquestions from the session, fetches the
//    questions for the given column/value (rfid or sbid), drops questions with no answers,
//    sorts by qq_qqid, caps at si_maxquestions, and renders <QuizClient>.
//
//    Parameters:
//      uq_rfid   — reference id (used when uq_column is 'qq_rfid')
//      uq_column — 'qq_rfid' or 'qq_sbid' — which column to filter questions by
//      uq_sbid   — subject id (used when uq_column is 'qq_sbid')
//==============================================================================================

import QuizClient from '@/src/ui/dashboard/quiz/QuizClient'
import { table_fetch } from 'nextjs-shared/table_fetch'
import { table_Questions } from '@/src/lib/tables/definitions'
import { fetch_SessionInfo } from '@/src/lib/tables/tableSpecific/fetch_SessionInfo'

export interface QuizServerProps {
  uq_rfid: number
  uq_column: string
  uq_sbid: number
}

//--------------------------------------------------------------------------------------------------
//.  Server component: prepares quiz data and passes to QuizClient
//--------------------------------------------------------------------------------------------------
export default async function QuizServer({ uq_rfid, uq_column, uq_sbid }: QuizServerProps) {
  const functionName = 'QuizServer'

  //----------------------------------------------------------------------------------------------
  //.  Fetch session info to get quiz settings
  //----------------------------------------------------------------------------------------------
  const SessionInfo = await fetch_SessionInfo({ caller: functionName })
  if (!SessionInfo) throw new Error('SessionInfo not found')
  const { si_maxquestions } = SessionInfo

  //----------------------------------------------------------------------------------------------
  //.  Determine column value for filtering
  //----------------------------------------------------------------------------------------------
  const Column_value = uq_column === 'qq_rfid' ? uq_rfid : uq_column === 'qq_sbid' ? uq_sbid : 0

  //----------------------------------------------------------------------------------------------
  //.  Fetch questions from DB based on column/value
  //----------------------------------------------------------------------------------------------
  const questionsResult = await table_fetch({
    caller: functionName,
    table: 'tqq_questions',
    whereColumnValuePairs: [{ column: uq_column, value: Column_value }]
  })
  if (!questionsResult.ok) throw new Error(questionsResult.error ?? 'table_fetch failed')
  let questions: table_Questions[] = (questionsResult.data as table_Questions[]) ?? []

  //----------------------------------------------------------------------------------------------
  //.  Filter out questions with no answers
  //----------------------------------------------------------------------------------------------
  questions = questions.filter(q => Array.isArray(q.qq_ans) && q.qq_ans.length > 0)

  //----------------------------------------------------------------------------------------------
  //.  Shuffle questions if session says so
  //----------------------------------------------------------------------------------------------
  questions.sort((a, b) => a.qq_qqid - b.qq_qqid)

  //----------------------------------------------------------------------------------------------
  //.  Limit to max number of questions
  //----------------------------------------------------------------------------------------------
  if (si_maxquestions && questions.length > si_maxquestions) {
    questions = questions.slice(0, si_maxquestions)
  }
  //----------------------------------------------------------------------------------------------
  //.  Return the client component with the props it actually expects
  //----------------------------------------------------------------------------------------------
  return <QuizClient questions={questions} rfid={uq_rfid} />
}
