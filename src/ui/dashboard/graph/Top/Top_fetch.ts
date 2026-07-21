'use server'

import { table_query } from 'nextjs-shared/table_query'
import {
  Top_count_min,
  Top_count_max,
  Top_usersReturned
} from '@/src/ui/dashboard/graph/Top/Top_constants'

interface Top_fetchProps {
  caller: string
  TopResults_limitMonths: number // This now comes from user preferences
}

export async function Top_fetch({ caller, TopResults_limitMonths }: Top_fetchProps) {
  const rows = await table_query({
    caller,
    query: `
      SELECT
        hs_usid, us_name,
        COUNT(*) AS record_count,
        SUM(hs_totalpoints) AS total_points,
        SUM(hs_maxpoints) AS total_maxpoints,
        CASE WHEN SUM(hs_maxpoints) > 0
          THEN ROUND((SUM(hs_totalpoints) / CAST(SUM(hs_maxpoints) AS NUMERIC)) * 100)::INTEGER
          ELSE 0
        END AS percentage
      FROM (
        SELECT hs_usid, hs_totalpoints, hs_maxpoints,
          ROW_NUMBER() OVER (PARTITION BY hs_usid ORDER BY hs_hsid DESC) AS rn
        FROM ths_history
        WHERE hs_datetime >= NOW() - ($4 || ' months')::interval
      ) AS ranked
      JOIN tus_users ON hs_usid = us_usid
      WHERE rn <= $2
      GROUP BY hs_usid, us_name
      HAVING COUNT(*) >= $1
      ORDER BY percentage DESC
      LIMIT $3
    `,
    params: [Top_count_min, Top_count_max, Top_usersReturned, TopResults_limitMonths]
  })
  return rows
}
