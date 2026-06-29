'use client'
import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { MyLink } from 'nextjs-shared/MyLink'
import { QUIZ_COLOR, VIDEO_COLOR, READ_COLOR, REFS_COLOR } from '@/src/root/constants/colours'
import { REFS_DIRECT_MAX } from '@/src/lib/tableUtils'
import { table_Subject, table_Reference } from '@/src/lib/tables/definitions'

interface Level {
  key: string
  label: string
  color: string
  text: string
}

interface Props {
  level: Level
  subjects: table_Subject[]
  refs: Record<number, table_Reference[]>
}

export default function SubjectSection(props: Props) {
  const functionName = 'SubjectSection'
  const { level, subjects, refs } = props
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className='flex items-center gap-1 mb-2 w-full text-left'
      >
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
        />
        <h2 className='text-xxs md:text-sm font-bold text-gray-600 uppercase tracking-wide'>
          {level.label}
        </h2>
      </button>
      {isOpen && (
        <div className='flex flex-col gap-2'>
          {subjects.map(subject => {
            const subjectRefs = refs[subject.sb_sbid] ?? []
            const isQuizOnly = subject.sb_cntreference === 0 && subject.sb_cntquestions > 0
            const isSingleRef = subject.sb_cntreference <= REFS_DIRECT_MAX && subjectRefs.length === 1

            if (isQuizOnly) {
              return (
                <div
                  key={subject.sb_sbid}
                  className={`flex flex-row items-center rounded-lg h-12 px-3 gap-2 ${level.color}`}
                >
                  <span className={`flex-1 text-xxs md:text-sm font-semibold truncate ${level.text}`}>
                    {subject.sb_title}
                  </span>
                  <MyLink
                    href={{
                      pathname: '/dashboard/quiz',
                      query: {
                        uq_column: 'qq_sbid',
                        uq_sbid: String(subject.sb_sbid)
                      },
                      reference: 'quiz',
                      segment: String(subject.sb_sbid)
                    }}
                    overrideClass={`h-6 md:h-8 w-14 md:w-20 text-xxs md:text-xs justify-center flex-none ${QUIZ_COLOR}`}
                    caller={functionName}
                  >
                    Quiz
                  </MyLink>
                </div>
              )
            }

            if (isSingleRef) {
              const ref = subjectRefs[0]
              const resourceColor = ref.rf_type === 'youtube' ? VIDEO_COLOR : READ_COLOR
              const hasQuiz = ref.rf_cntquestions > 0
              return (
                <div
                  key={subject.sb_sbid}
                  className={`flex flex-row items-center rounded-lg h-12 px-3 gap-2 ${level.color}`}
                >
                  <span className={`flex-1 text-xxs md:text-sm font-semibold truncate ${level.text}`}>
                    {subject.sb_title}
                  </span>
                  <a
                    href={ref.rf_link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`inline-flex flex-none items-center justify-center h-6 md:h-8 w-14 md:w-20 rounded text-xxs md:text-xs font-medium ${resourceColor}`}
                  >
                    {ref.rf_pubtype}
                  </a>
                  {hasQuiz && (
                    <MyLink
                      href={{
                        pathname: '/dashboard/quiz',
                        query: {
                          uq_column: 'qq_rfid',
                          uq_rfid: String(ref.rf_rfid)
                        },
                        reference: 'quiz',
                        segment: String(ref.rf_rfid)
                      }}
                      overrideClass={`h-6 md:h-8 w-14 md:w-20 text-xxs md:text-xs justify-center flex-none ${QUIZ_COLOR}`}
                      caller={functionName}
                    >
                      Quiz
                    </MyLink>
                  )}
                </div>
              )
            }

            return (
              <div
                key={subject.sb_sbid}
                className={`flex flex-row items-center rounded-lg h-12 px-3 gap-2 ${level.color}`}
              >
                <span className={`flex-1 text-xxs md:text-sm font-semibold truncate ${level.text}`}>
                  {subject.sb_title}
                </span>
                <MyLink
                  href={{
                    pathname: '/dashboard/reference_select',
                    reference: 'reference_select',
                    segment: String(subject.sb_sbid),
                    query: {
                      uq_sbid: JSON.stringify(subject.sb_sbid)
                    }
                  }}
                  overrideClass={`h-6 md:h-8 w-14 md:w-20 text-xxs md:text-xs justify-center flex-none ${REFS_COLOR}`}
                  caller={functionName}
                >
                  Refs
                </MyLink>
                {subject.sb_cntquestions > 0 && (
                  <MyLink
                    href={{
                      pathname: '/dashboard/quiz',
                      query: {
                        uq_column: 'qq_sbid',
                        uq_sbid: String(subject.sb_sbid)
                      },
                      reference: 'quiz',
                      segment: String(subject.sb_sbid)
                    }}
                    overrideClass={`h-6 md:h-8 w-14 md:w-20 text-xxs md:text-xs justify-center flex-none ${QUIZ_COLOR}`}
                    caller={functionName}
                  >
                    Quiz
                  </MyLink>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
