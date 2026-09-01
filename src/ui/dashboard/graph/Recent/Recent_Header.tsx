'use client'

//==============================================================================================
//  1) DESCRIPTION
//    Recent_Header — header row for the "Recent Averages" graph: two <MySelect>s (users
//    returned, users averaged) that each persist the choice to the user's graph preferences
//    and refresh the route.
//
//    Parameters:
//      initialUsersReturned — starting "users returned" value; defaults to
//                             Recent_usersReturned_Default
//      initialUsersAverage  — starting "users averaged" value; defaults to
//                             Recent_usersAverage_Default
//==============================================================================================

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import MySelect from 'nextjs-shared/MySelect'
import {
  Recent_usersReturned_Options,
  Recent_usersReturned_Default,
  Recent_usersAverage_Options,
  Recent_usersAverage_Default
} from '@/src/ui/dashboard/graph/Recent/Recent_constants'
import { update_tus_GraphPrefs } from '@/src/lib/tables/tableSpecific/update_tus_GraphPrefs'

interface Recent_HeaderProps {
  initialUsersReturned?: number
  initialUsersAverage?: number
}

export function Recent_Header({
  initialUsersReturned = Recent_usersReturned_Default,
  initialUsersAverage = Recent_usersAverage_Default
}: Recent_HeaderProps) {
  const functionName = 'Recent_Header'
  const router = useRouter()
  const [usersReturned, setUsersReturned] = useState(initialUsersReturned)
  const [usersAverage, setUsersAverage] = useState(initialUsersAverage)

  useEffect(() => {
    setUsersReturned(initialUsersReturned)
  }, [initialUsersReturned])

  useEffect(() => {
    setUsersAverage(initialUsersAverage)
  }, [initialUsersAverage])

  return (
    <div className='flex items-center flex-wrap gap-2'>
      <h2 className='text-sm whitespace-nowrap'>Recent Averages</h2>
      <MySelect
        id='users-returned'
        name='users-returned'
        options={Recent_usersReturned_Options.map(opt => ({
          value: String(opt.value),
          label: opt.label
        }))}
        value={usersReturned}
        onChange={e => handleUsersReturnedChange(e.target.value)}
        overrideClass='w-16 px-2 py-0.5 text-sm border-gray-300'
        includeBlank={false}
      />
      <span className='text-sm font-medium mr-2'>Users</span>
      <MySelect
        id='users-average'
        name='users-average'
        options={Recent_usersAverage_Options.map(opt => ({
          value: String(opt.value),
          label: opt.label
        }))}
        value={usersAverage}
        onChange={e => handleUsersAverageChange(e.target.value)}
        overrideClass='w-16 px-2 py-0.5 text-sm border-gray-300'
        includeBlank={false}
      />
      <span className='text-sm font-medium'>Results</span>
    </div>
  )
  //----------------------------------------------------------------------------------------------
  //  handleUsersReturnedChange — persist the chosen "users returned" value and refresh
  //----------------------------------------------------------------------------------------------
  async function handleUsersReturnedChange(value: string | number) {
    const numericValue = Number(value)
    setUsersReturned(numericValue)

    await update_tus_GraphPrefs(
      {
        us_graph_recent_users: numericValue
      },
      functionName
    )

    router.refresh()
  }
  //----------------------------------------------------------------------------------------------
  //  handleUsersAverageChange — persist the chosen "users averaged" value and refresh
  //----------------------------------------------------------------------------------------------
  async function handleUsersAverageChange(value: string | number) {
    const numericValue = Number(value)
    setUsersAverage(numericValue)

    await update_tus_GraphPrefs(
      {
        us_graph_recent_avg: numericValue
      },
      functionName
    )

    router.refresh()
  }
}
