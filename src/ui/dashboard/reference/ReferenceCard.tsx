'use client'

import { table_Reference } from '@/src/lib/tables/definitions'
import { MyLink } from 'nextjs-shared/MyLink'
import { QUIZ_COLOR, VIDEO_COLOR, READ_COLOR, DEFAULT_COLOR, DEFAULT_TEXT } from '@/src/root/constants/colours'

interface Props {
  reference: table_Reference
  headerColor?: string
  headerText?: string
}

export default function ReferenceCard({ reference, headerColor, headerText = DEFAULT_TEXT }: Props) {
  const isVideo = reference.rf_type === 'youtube'
  const isSolution = reference.rf_pubtype === 'Solution'
  const resourceColor = isVideo ? VIDEO_COLOR : READ_COLOR
  const rowColor = headerColor ?? DEFAULT_COLOR

  const resourceLink = (
    <a
      href={reference.rf_link}
      target='_blank'
      rel='noopener noreferrer'
      className={`inline-flex flex-none items-center justify-center h-6 md:h-8 w-14 md:w-20 rounded text-xxs md:text-xs font-medium ${resourceColor}`}
    >
      {reference.rf_pubtype}
    </a>
  )

  const quizLink = reference.rf_cntquestions > 0 ? (
    <MyLink
      href={{
        pathname: '/dashboard/quiz',
        query: {
          uq_column: 'qq_rfid',
          uq_rfid: String(reference.rf_rfid)
        },
        reference: 'quiz',
        segment: String(reference.rf_rfid)
      }}
      overrideClass={`h-6 md:h-8 w-14 md:w-20 text-xxs md:text-xs justify-center flex-none ${QUIZ_COLOR}`}
    >
      Quiz
    </MyLink>
  ) : null

  return (
    <div className={`flex flex-row items-center rounded-lg h-12 shrink-0 px-3 gap-2 ${rowColor}`}>
      <span className={`flex-1 text-xxs md:text-sm font-semibold truncate ${headerText}`}>
        {reference.rf_desc}
      </span>
      {isSolution && quizLink}
      {resourceLink}
      {!isSolution && quizLink}
    </div>
  )
}
