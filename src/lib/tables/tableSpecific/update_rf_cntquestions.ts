'use server'

//==============================================================================================
//  1) DESCRIPTION
//    update_rf_cntquestions — recounts tqq_questions for a reference and writes the count to
//    trf_reference.rf_cntquestions.
//
//    Parameters:
//      rfid   — the reference id
//      caller — logging caller identity
//
//    Returns:
//      the new count; logs 'E' and throws on failure
//==============================================================================================

import { write_logging } from 'nextjs-shared/write_logging'
import { table_count } from 'nextjs-shared/table_count'
import { table_update } from 'nextjs-shared/table_update'

export async function update_rf_cntquestions(rfid: number, caller: string = '') {
  const functionName = 'update_rf_cntquestions'

  try {
    const countResult = await table_count({
      table: 'tqq_questions',
      whereColumnValuePairs: [{ column: 'qq_rfid', value: rfid }],
      caller: functionName
    })
    if (!countResult.ok) throw new Error(`${functionName}: ` + (countResult.error ?? 'table_count failed'))
    const rowCount = countResult.data
    //
    //  update Subject
    //
    const updateParams = {
      caller: functionName,
      table: 'trf_reference',
      columnValuePairs: [{ column: 'rf_cntquestions', value: rowCount }],
      whereColumnValuePairs: [{ column: 'rf_rfid', value: rfid }]
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
