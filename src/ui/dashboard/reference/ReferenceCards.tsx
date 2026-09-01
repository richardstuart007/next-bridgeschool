//==============================================================================================
//  1) DESCRIPTION
//    ReferenceCards — the /dashboard/reference_select view: a level-coloured heading for the
//    selected subject and a <ReferenceCard> per reference.
//
//    Parameters:
//      subjectInfo — the selected tsb_subject row (undefined when none)
//      references  — the trf_reference rows to list
//      uq_sbid     — the selected subject id from the URL (unused here, kept for parity)
//==============================================================================================

import { table_Reference, table_Subject } from '@/src/lib/tables/definitions'
import ReferenceCard from '@/src/ui/dashboard/reference/ReferenceCard'
import { getLevelColor, getLevelText } from '@/src/root/constants/colours'

interface Props {
  subjectInfo: table_Subject | undefined
  references: table_Reference[]
  uq_sbid: string
}

export default function ReferenceCards({ subjectInfo, references, uq_sbid: _uq_sbid }: Props) {
  const levelColor = getLevelColor(subjectInfo?.sb_level)
  const levelText  = getLevelText(subjectInfo?.sb_level)

  return (
    <div className='flex-1 min-h-0 flex flex-col p-4 md:p-6'>
      {/* Header */}
      <div className='flex items-center gap-4 mb-4 px-1'>
        <p className='text-xxs md:text-sm font-bold text-gray-800 truncate'>
          {subjectInfo?.sb_title ?? 'References'}
        </p>
      </div>

      {/* Cards list — scrollable, fills remaining height */}
      <div className='flex-1 overflow-y-auto flex flex-col gap-2'>
        {references.map(ref => (
          <ReferenceCard key={ref.rf_rfid} reference={ref} headerColor={levelColor} headerText={levelText} />
        ))}
      </div>
    </div>
  )
}
