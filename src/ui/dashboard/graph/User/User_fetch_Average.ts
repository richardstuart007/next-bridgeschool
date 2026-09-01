'use server'

//==============================================================================================
//  1) DESCRIPTION
//    User_fetch_Average — fetches one user's average correct-percentage over the last User_limitMonths_Average months.
//
//    Parameters:
//      userId — the user
//      caller — logging caller identity
//      User_limitMonths_Average — month window
//
//    Returns:
//      the average percentage (0 when there is no data); throws on a failed query
//==============================================================================================

import { table_query } from 'nextjs-shared/table_query'

interface UserAverageProps {
  userId: number
  caller: string
  User_limitMonths_Average: number
}

export async function User_fetch_Average({
  userId,
  caller,
  User_limitMonths_Average
}: UserAverageProps) {
  const functionName = 'User_fetch_Average'
  const result = await table_query({
    caller,
    table: 'ths_history',
    query: `
      SELECT ROUND((SUM(hs_totalpoints)::NUMERIC / NULLIF(SUM(hs_maxpoints), 0)) * 100) AS avg_percentage
      FROM ths_history
      WHERE hs_usid = $1
        AND hs_datetime >= NOW() - ($2 || ' months')::interval;
    `,
    params: [userId, User_limitMonths_Average]
  })
  if (!result.ok) throw new Error(`${functionName}: ` + (result.error ?? 'Failed'))
  const rows = result.data
  if (rows.length === 0) throw new Error(`${functionName}: Failed`)
  const avgPercentage = Number(rows[0]?.avg_percentage) || 0
  return avgPercentage
}
