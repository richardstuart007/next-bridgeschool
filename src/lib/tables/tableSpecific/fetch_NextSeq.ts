'use server'

import { table_fetch } from 'nextjs-shared/table_fetch'
//---------------------------------------------------------------------
//  Get next qq_seq
//---------------------------------------------------------------------
export async function fetch_NextSeq(qq_owner: string, qq_subject: string, caller: string = '') {
  const functionName = 'fetch_NextSeq'
  const rows = await table_fetch({
    caller,
    table: 'tqq_questions',
    columns: ['COALESCE(MAX(qq_seq) + 1, 1) AS next_qq_seq'],
    whereColumnValuePairs: [
      { column: 'qq_owner', value: qq_owner },
      { column: 'qq_subject', value: qq_subject }
    ],
    skipCache: true
  })
  const next_qq_seq = rows[0]?.next_qq_seq ?? null
  if (next_qq_seq === null) throw new Error(`${functionName}: Failed`)
  return next_qq_seq
}
