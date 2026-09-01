//==============================================================================================
//  1) DESCRIPTION
//    QuizInfo — renders the "question N of total" line plus the question's info text.
//
//    Parameters:
//      question  — the table_Questions row
//      QuizInfo  — the current question number
//      quizTotal — the total number of questions
//==============================================================================================

import { table_Questions } from '@/src/lib/tables/definitions'

interface RadioSubjectProps {
  question: table_Questions
  QuizInfo: number
  quizTotal: number
}

export default function QuizInfo(props: RadioSubjectProps) {
  //...................................................................................
  //.  Main Line
  //...................................................................................
  //
  //  Deconstruct params
  //
  const { question, QuizInfo, quizTotal = 0 } = props
  //
  //  Deconstruct row
  //
  const { qq_owner, qq_subject, qq_qqid } = question
  //
  //  Question Info
  //
  const QuestionInfo = `${qq_owner}/${qq_subject}(${qq_qqid}) ${QuizInfo}/${quizTotal}`
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <div className='text-xs p-1 md:p-2'>
      <p>{QuestionInfo}</p>
    </div>
  )
}
