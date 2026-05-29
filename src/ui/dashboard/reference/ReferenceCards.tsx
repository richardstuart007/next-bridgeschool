import { table_Reference, table_Subject } from '@/src/lib/tables/definitions'
import { MyLink } from 'nextjs-shared/MyLink'
import ReferenceCard from '@/src/ui/dashboard/reference/ReferenceCard'
import { getLevelColor, getLevelText, QUIZ_COLOR } from '@/src/root/constants/colours'

interface Props {
  subjectInfo: table_Subject | undefined
  references: table_Reference[]
  uq_sbid: string
}

export default function ReferenceCards({ subjectInfo, references, uq_sbid }: Props) {
  const hasSbidQuiz = (subjectInfo?.sb_cntquestions ?? 0) > 0
  const levelColor = getLevelColor(subjectInfo?.sb_level)
  const levelText  = getLevelText(subjectInfo?.sb_level)

  return (
    <div className='p-4 md:p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4 px-1'>
        <div className='flex items-center gap-4'>
          <p className='text-sm font-bold text-gray-800'>
            {subjectInfo?.sb_title ?? 'References'}
          </p>
          {hasSbidQuiz && (
            <MyLink
              href={{
                pathname: '/dashboard/quiz',
                query: {
                  uq_route: 'reference-select',
                  uq_column: 'qq_sbid',
                  uq_sbid
                },
                reference: 'quiz',
                segment: uq_sbid
              }}
              overrideClass={`h-7 px-3 text-xs ${QUIZ_COLOR}`}
            >
              Quiz All
            </MyLink>
          )}
        </div>
        <MyLink
          href={{
            pathname: '/dashboard',
            reference: 'dashboard'
          }}
          overrideClass='h-7 px-3 text-xs bg-yellow-600 hover:bg-yellow-700 text-white'
        >
          Back to Subjects
        </MyLink>
      </div>

      {/* Cards grid — scrollable for large reference lists */}
      <div className='overflow-y-auto max-h-[75vh] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
        {references.map(ref => (
          <ReferenceCard key={ref.rf_rfid} reference={ref} headerColor={levelColor} headerText={levelText} />
        ))}
      </div>
    </div>
  )
}
