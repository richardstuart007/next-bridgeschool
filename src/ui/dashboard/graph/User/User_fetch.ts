'use server'

import { table_query } from 'nextjs-shared/table_query'

//---------------------------------------------------------------------
//  Fetch latest results for the last 'RecentResults_usersReturned' users
//---------------------------------------------------------------------
interface User_fetchProps {
  userId: number
  caller: string
  months: number
  count: number
}

export async function User_fetch({ userId, caller, months, count }: User_fetchProps) {
  const rows = await table_query({
    caller,
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
  return rows
}
