'use server'

//==============================================================================================
//  1) DESCRIPTION
//    User_fetch — fetches one user's last `count` ths_history results within the last `months` months, newest first.
//
//    Parameters:
//      userId — the user
//      caller — logging caller identity
//      months — month window
//      count  — max rows
//
//    Returns:
//      the rows (an empty array on a failed query, logged to the console)
//==============================================================================================

import { table_query } from 'nextjs-shared/table_query'

interface User_fetchProps {
  userId: number
  caller: string
  months: number
  count: number
}

export async function User_fetch({ userId, caller, months, count }: User_fetchProps) {
  const result = await table_query({
    caller,
    table: 'ths_history',
    query: `
      SELECT hs_hsid, hs_datetime, hs_correctpercent
      FROM ths_history
      WHERE hs_usid = $1
        AND hs_datetime >= NOW() - ($2 || ' months')::interval
      ORDER BY hs_hsid DESC
      LIMIT $3;
    `,
    params: [userId, months, count]
  })
  if (!result.ok) {
    console.error('User_fetch failed:', result.error)
    return []
  }
  const rows = result.data
  return rows
}
