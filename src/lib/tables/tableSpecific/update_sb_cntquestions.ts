'use server'

//==============================================================================================
//  1) DESCRIPTION
//    update_sb_cntquestions — recounts tqq_questions for a subject and writes the count to
//    tsb_subject.sb_cntquestions.
//
//    Parameters:
//      sbid   — the subject id
//      caller — logging caller identity
//
//    Returns:
//      the new count; logs 'E' and throws on failure
//==============================================================================================

import { write_logging } from 'nextjs-shared/write_logging'
import { table_count } from 'nextjs-shared/table_count'
import { table_update } from 'nextjs-shared/table_update'

export async function update_sb_cntquestions(sbid: number, caller: string = '') {
  const functionName = 'update_sb_cntquestions'

  try {
    const countResult = await table_count({
      table: 'tqq_questions',
      whereColumnValuePairs: [{ column: 'qq_sbid', value: sbid }],
      caller: functionName
    })
    if (!countResult.ok) throw new Error(`${functionName}: ` + (countResult.error ?? 'table_count failed'))
    const rowCount = countResult.data
    //
    //  update Subject
    //
    const updateParams = {
      caller: functionName,
      table: 'tsb_subject',
      columnValuePairs: [{ column: 'sb_cntquestions', value: rowCount }],
      whereColumnValuePairs: [{ column: 'sb_sbid', value: sbid }]
    }
    const updateResult = await table_update(updateParams)
    if (!updateResult.ok) throw new Error(`${functionName}: ` + (updateResult.error ?? 'table_update failed'))
    //
    //  Updated value
    //
    return rowCount
    //
    //  Errors
    //
  } catch (error) {
    const errorMessage = (error as Error).message
    write_logging({
      lg_caller: caller,
      lg_functionname: functionName,
      lg_msg: errorMessage,
      lg_severity: 'E'
    })
    console.error('Error:', errorMessage)
    throw new Error(`${functionName}: Failed`)
  }
}
