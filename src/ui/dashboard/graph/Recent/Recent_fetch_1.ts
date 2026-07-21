'use server'

import { table_query } from 'nextjs-shared/table_query'

interface Recent_fetch_1Props {
  caller: string
  uq_graph_recent_usersReturned: number
}

export async function Recent_fetch_1({
  caller,
  uq_graph_recent_usersReturned
}: Recent_fetch_1Props) {
  const rows = await table_query({
    caller,
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
  return rows
}
