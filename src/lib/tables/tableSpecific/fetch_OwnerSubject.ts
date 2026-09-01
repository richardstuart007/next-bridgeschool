//==============================================================================================
//  1) DESCRIPTION
//    fetch_OwnerSubject — fetches the single tsb_subject row for a given owner + subject.
//
//    Parameters:
//      owner   — subject owner
//      subject — subject name
//      caller  — logging caller identity
//
//    Returns:
//      the matching subject row, or null when owner/subject is blank, no row matches, or the
//      fetch fails (the error is logged 'E')
//==============================================================================================

import { table_fetch, table_fetch_Props } from 'nextjs-shared/table_fetch'
import { write_logging } from 'nextjs-shared/write_logging'

export async function fetch_OwnerSubject(owner: string, subject: string, caller: string = '') {
  const functionName = 'fetch_OwnerSubject'
  //
  // Early return if owner or subject is not selected
  //
  if (owner === '' || subject === '') return null
  //
  //  Fetch row
  //
  try {
    const result = await table_fetch({
      caller: functionName,
      table: 'tsb_subject',
      whereColumnValuePairs: [
        { column: 'sb_owner', value: owner },
        { column: 'sb_subject', value: subject }
      ]
    } as table_fetch_Props)
    if (!result.ok) throw new Error(result.error ?? 'table_fetch failed')
    const rows = result.data
    //
    // Check if any rows were returned
    //
    if (!rows || rows.length === 0) return null
    //
    //  Return
    //
    const row = rows[0]
    return row
    //
    // Errors
    //
  } catch (error) {
    const errorMessage = `Error fetching subject: owner=(${owner}), subject=(${subject})`
    console.error(`${functionName}: ${errorMessage}`, error)
    write_logging({
      lg_caller: caller,
      lg_functionname: functionName,
      lg_msg: errorMessage,
      lg_severity: 'E'
    })
    return null
  }
}
