'use client'

//==============================================================================================
//  1) DESCRIPTION
//    User_Header — header row for the "Your Results" graph: shows the running average and a
//    month-window <MySelect> that persists the choice to the user's graph preferences and
//    refreshes the route.
//
//    Parameters:
//      averagePercentage — the average percentage shown in the heading text
//      initialMonths     — starting month window; falls back to User_limitMonths_Average_Default
//==============================================================================================

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import MySelect from 'nextjs-shared/MySelect'
import {
  User_limitMonths_Average_Options,
  User_limitMonths_Average_Default
} from '@/src/ui/dashboard/graph/User/User_constants'
import { update_tus_GraphPrefs } from '@/src/lib/tables/tableSpecific/update_tus_GraphPrefs'

interface User_HeaderProps {
  averagePercentage: number
  initialMonths?: number
}

export function User_Header({ averagePercentage, initialMonths }: User_HeaderProps) {
  const functionName = 'User_Header'
  const router = useRouter()
  const [months, setMonths] = useState(initialMonths ?? User_limitMonths_Average_Default)

  useEffect(() => {
    if (initialMonths !== undefined) {
      setMonths(initialMonths)
    }
  }, [initialMonths])

  return (
    <div className='flex items-center flex-wrap gap-2'>
      <h2 className='text-sm whitespace-nowrap'>
        {`Your Results: ${averagePercentage}% average over`}
      </h2>
      <MySelect
        id='user-months-selector'
        name='user-months-selector'
        options={User_limitMonths_Average_Options.map(opt => ({
          value: String(opt.value),
          label: opt.label
        }))}
        value={months}
        onChange={e => handleMonthsChange(e.target.value)}
        overrideClass='w-16 px-2 py-0.5 text-sm border-gray-300'
        includeBlank={false}
      />
      <span className='text-sm'>months</span>
      <div className='ml-auto text-xs text-orange-500 flex items-center gap-1'>
        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3'
          />
        </svg>
        <span>Click any point to review</span>
      </div>
    </div>
  )
  //----------------------------------------------------------------------------------------------
  //  handleMonthsChange — persist the chosen month window and refresh the route
  //----------------------------------------------------------------------------------------------
  async function handleMonthsChange(value: string | number) {
    const numericValue = Number(value)
    setMonths(numericValue)
    await update_tus_GraphPrefs(
      {
        us_graph_user_months: numericValue
      },
      functionName
    )

    router.refresh()
  }
}
