'use server'

//==============================================================================================
//  1) DESCRIPTION
//    Recent_fetch_1 — fetches the latest ths_history row per user (window function, rn = 1), newest first, limited to
//    uq_graph_recent_usersReturned users.
//
//    Parameters:
//      caller — logging caller identity
//      uq_graph_recent_usersReturned — max users to return
//
//    Returns:
//      the rows (an empty array on a failed query, logged to the console)
//==============================================================================================

import { table_query } from 'nextjs-shared/table_query'

interface Recent_fetch_1Props {
  caller: string
  uq_graph_recent_usersReturned: number
}

export async function Recent_fetch_1({
  caller,
  uq_graph_recent_usersReturned
}: Recent_fetch_1Props) {
  const result = await table_query({
    caller,
    table: 'ths_history',
    query: `
      SELECT hs_hsid, hs_usid, us_name, hs_totalpoints, hs_maxpoints, hs_correctpercent, hs_datetime
      FROM (
        SELECT hs_hsid, hs_usid, us_name, hs_totalpoints, hs_maxpoints, hs_correctpercent, hs_datetime,
          ROW_NUMBER() OVER (PARTITION BY hs_usid ORDER BY hs_hsid DESC) AS rn
        FROM ths_history
        JOIN tus_users ON hs_usid = us_usid
      ) AS ranked
      WHERE rn = 1
      ORDER BY hs_hsid DESC
      LIMIT $1
    `,
    params: [uq_graph_recent_usersReturned]
  })
  if (!result.ok) {
    console.error('Recent_fetch_1 failed:', result.error)
    return []
  }
  const rows = result.data
  return rows
}
