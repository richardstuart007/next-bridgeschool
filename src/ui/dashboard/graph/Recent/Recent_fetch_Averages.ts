'use server'

//==============================================================================================
//  1) DESCRIPTION
//    Recent_fetch_Averages — fetches the most recent uq_graph_recent_usersAverage ths_history rows for each of the given
//    userIds (window function, rn <= N).
//
//    Parameters:
//      userIds — the users to fetch history for
//      caller  — logging caller identity
//      uq_graph_recent_usersAverage — rows per user to include
//
//    Returns:
//      the rows (an empty array on a failed query, logged to the console)
//==============================================================================================

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

  const result = await table_query({
    caller,
    table: 'ths_history',
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
  if (!result.ok) {
    console.error('Recent_fetch_Averages failed:', result.error)
    return []
  }
  const rows = result.data
  return rows
}
