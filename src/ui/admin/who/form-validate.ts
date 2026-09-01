//==============================================================================================
//  1) DESCRIPTION
//    validate — business-rule validation for the who form: for a new who (wh_whid === 0) checks twh_who for a duplicate wh_who.
//
//    Parameters:
//      the form record (or bare field) to validate
//
//    Returns:
//      a StateSetup — { errors?, message } ; message is null when validation passes
//==============================================================================================

import { table_Who } from '@/src/lib/tables/definitions'
import { table_check } from 'nextjs-shared/table_check'
//
//  Errors and Messages
//
export type StateSetup = {
  errors?: {
    wh_title?: string[]
    wh_who?: string[]
  }
  message?: string | null
}
export default async function validate(record: table_Who): Promise<StateSetup> {
  const { wh_whid, wh_who } = record
  //
  // Initialise errors return
  //
  let errors: StateSetup['errors'] = {}
  //
  //  Check for Add duplicate
  //
  if (wh_whid === 0) {
    const tableColumnValuePairs = [
      {
        table: 'twh_who',
        whereColumnValuePairs: [{ column: 'wh_who', value: wh_who }]
      }
    ]
    const exists = await table_check(tableColumnValuePairs)
    if (!exists.ok) errors.wh_who = [exists.error ?? 'Validation check failed']
    else if (exists.data.found) errors.wh_who = ['Who must be unique']
  }
  //
  // Return error messages
  //
  if (Object.keys(errors).length > 0) {
    return {
      errors,
      message: 'Form validation failed.'
    }
  }
  //
  //  No errors
  //
  return {
    message: null
  }
}
