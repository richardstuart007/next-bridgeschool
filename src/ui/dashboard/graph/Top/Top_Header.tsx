'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import MySelect from 'nextjs-shared/MySelect'
import {
  Top_limitMonths_Options,
  Top_limitMonths_Default
} from '@/src/ui/dashboard/graph/Top/Top_constants'
import { update_tus_GraphPrefs } from '@/src/lib/tables/tableSpecific/update_tus_GraphPrefs'

interface Top_HeaderProps {
  initialMonths?: number
}

export function Top_Header({ initialMonths = Top_limitMonths_Default }: Top_HeaderProps) {
  const functionName = 'Top_Header'
  const router = useRouter()
  const [months, setMonths] = useState(initialMonths)

  useEffect(() => {
    setMonths(initialMonths)
  }, [initialMonths])

  const handleMonthsChange = async (value: string | number) => {
    const numericValue = Number(value)
    setMonths(numericValue)
    await update_tus_GraphPrefs(
      {
        us_graph_top_months: numericValue
      },
      functionName
    )

    router.refresh()
  }

  return (
    <div className='flex items-center flex-wrap gap-2'>
      <h2 className='text-sm whitespace-nowrap'>Top Results over</h2>
      <MySelect
        id='top-months-selector'
        name='top-months-selector'
        options={Top_limitMonths_Options.map(opt => ({
          value: String(opt.value),
          label: opt.label
        }))}
        value={months}
        onChange={e => handleMonthsChange(e.target.value)}
        overrideClass='w-16 px-2 py-0.5 text-sm border-gray-300'
        includeBlank={false}
      />
      <span className='text-sm'>months</span>
    </div>
  )
}
