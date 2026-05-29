'use client'

import { table_Reference } from '@/src/lib/tables/definitions'
import { MyButton } from 'nextjs-shared/MyButton'
import { MyLink } from 'nextjs-shared/MyLink'
import { QUIZ_COLOR, VIDEO_COLOR, READ_COLOR } from '@/src/root/constants/colours'

interface Props {
  reference: table_Reference
  headerColor?: string  // when set: renders as coloured card (header + buttons); otherwise just buttons
  headerText?: string   // explicit text colour class for the header title
}

export default function ReferenceCard({ reference, headerColor, headerText = 'text-black' }: Props) {
  const isVideo = reference.rf_type === 'youtube'

  const buttons = (
    <div className='flex gap-2 w-full'>
      <MyButton
        onClick={() => window.open(reference.rf_link, '_blank')}
        overrideClass={`h-7 text-xs flex-1 justify-center ${isVideo ? VIDEO_COLOR : READ_COLOR}`}
      >
        {isVideo ? 'Video' : 'Read'}
      </MyButton>

      {reference.rf_cntquestions > 0 && (
        <MyLink
          href={{
            pathname: '/dashboard/quiz',
            query: {
              uq_route: 'reference-select',
              uq_column: 'qq_rfid',
              uq_rfid: String(reference.rf_rfid)
            },
            reference: 'quiz',
            segment: String(reference.rf_rfid)
          }}
          overrideClass={`h-7 text-xs flex-1 justify-center ${QUIZ_COLOR}`}
        >
          Quiz
        </MyLink>
      )}
    </div>
  )

  if (headerColor) {
    return (
      <div className={`h-24 rounded-lg shadow-sm flex flex-col justify-between p-2 ${headerColor}`}>
        <p className={`text-sm font-semibold text-center flex-1 flex items-center justify-center px-1 leading-tight ${headerText}`}>
          {reference.rf_desc}
        </p>
        {buttons}
      </div>
    )
  }

  return <div className='w-full'>{buttons}</div>
}
