'use server'

import { table_query } from 'nextjs-shared/table_query'

//---------------------------------------------------------------------
//  Fetch average percentage for all results of a user within the last 'User_limitMonths_Average_Default' months
//---------------------------------------------------------------------
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
  const rows = await table_query({
    caller,
    query: `
      SELECT ROUND((SUM(hs_totalpoints)::NUMERIC / NULLIF(SUM(hs_maxpoints), 0)) * 100) AS avg_percentage
      FROM ths_history
      WHERE hs_usid = $1
        AND hs_datetime >= NOW() - ($2 || ' months')::interval;
    `,
    params: [userId, User_limitMonths_Average]
  })
  if (rows.length === 0) throw new Error(`${functionName}: Failed`)
  const avgPercentage = Number(rows[0]?.avg_percentage) || 0
  return avgPercentage
}
