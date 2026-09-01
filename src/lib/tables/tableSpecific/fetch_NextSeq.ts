'use server'

//==============================================================================================
//  1) DESCRIPTION
//    fetch_NextSeq — returns the next qq_seq for an owner/subject (MAX(qq_seq) + 1, or 1).
//
//    Parameters:
//      qq_owner   — question owner
//      qq_subject — question subject
//      caller     — logging caller identity
//
//    Returns:
//      the next sequence number; throws on a failed fetch or a null result
//==============================================================================================

import { table_fetch } from 'nextjs-shared/table_fetch'

export async function fetch_NextSeq(qq_owner: string, qq_subject: string, caller: string = '') {
  const functionName = 'fetch_NextSeq'
  const result = await table_fetch({
    caller,
    table: 'tqq_questions',
    columns: ['COALESCE(MAX(qq_seq) + 1, 1) AS next_qq_seq'],
    whereColumnValuePairs: [
      { column: 'qq_owner', value: qq_owner },
      { column: 'qq_subject', value: qq_subject }
    ],
    skipCache: true
  })
  if (!result.ok) throw new Error(`${functionName}: ` + (result.error ?? 'Failed'))
  const rows = result.data
  const next_qq_seq = rows[0]?.next_qq_seq ?? null
  if (next_qq_seq === null) throw new Error(`${functionName}: Failed`)
  return next_qq_seq
}
