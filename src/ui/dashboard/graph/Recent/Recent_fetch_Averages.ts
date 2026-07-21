'use server'

import { table_query } from 'nextjs-shared/table_query'

interface AveragesProps {
  userIds: number[]
  caller: string
  uq_graph_recent_usersAverage: number
}

export async function Recent_fetch_Averages({
  userIds,
  caller,
  uq_graph_recent_usersAverage
}: AveragesProps) {
  //
  // Generate placeholders dynamically
  //
  const placeholders = userIds.map((_, index) => `$${index + 1}`).join(', ')
  const averagePlaceholderIndex = userIds.length + 1

  const rows = await table_query({
    caller,
    query: `
      SELECT hs_hsid, hs_usid, us_name, hs_totalpoints, hs_maxpoints, hs_correctpercent
      FROM (
        SELECT hs_hsid, hs_usid, us_name, hs_totalpoints, hs_maxpoints, hs_correctpercent,
          ROW_NUMBER() OVER (PARTITION BY hs_usid ORDER BY hs_hsid DESC) AS rn
        FROM ths_history
        JOIN tus_users ON hs_usid = us_usid
        WHERE hs_usid IN (${placeholders})
      ) AS ranked
      WHERE rn <= $${averagePlaceholderIndex}
      ORDER BY hs_usid;
    `,
    params: [...userIds, uq_graph_recent_usersAverage]
  })
  return rows
}
