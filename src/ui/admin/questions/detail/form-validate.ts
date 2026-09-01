//==============================================================================================
//  1) DESCRIPTION
//    validate — business-rule validation for the question detail form: for a new question checks tqq_questions for a duplicate owner/subject/seq, and that the referenced trf_reference row exists.
//
//    Parameters:
//      the form record (or bare field) to validate
//
//    Returns:
//      a StateSetup — { errors?, message } ; message is null when validation passes
//==============================================================================================

import { table_check } from 'nextjs-shared/table_check'
//
//  Errors and Messages
//
export type StateSetup = {
  errors?: {
    qq_subject?: string[]
    qq_owner?: string[]
    qq_detail?: string[]
    qq_rfid?: string[]
  }
  message?: string | null
}
//
//  Validation Parameters
//
type Table = {
  qq_qqid: number
  qq_owner: string
  qq_subject: string
  qq_seq: number
  qq_rfid: number
}
export default async function maint_detail_validate(record: Table): Promise<StateSetup> {
  const { qq_qqid, qq_owner, qq_subject, qq_seq, qq_rfid } = record
  //
  // Initialise errors return
  //
  let errors: StateSetup['errors'] = {}
  //
  //  Check for Add duplicate
  //
  if (qq_qqid === 0) {
    const tableColumnValuePairs = [
      {
        table: 'tqq_questions',
        whereColumnValuePairs: [
          { column: 'qq_owner', value: qq_owner },
          { column: 'qq_subject', value: qq_subject },
          { column: 'qq_seq', value: qq_seq }
        ]
      }
    ]
    const exists = await table_check(tableColumnValuePairs)
    if (!exists.ok) errors.qq_owner = [exists.error ?? 'Validation check failed']
    else if (exists.data.found) errors.qq_owner = ['questions must be unique']
  }
  //
  //  Check for Add duplicate
  //
  if (qq_rfid > 0) {
    const tableColumnValuePairs = [
      {
        table: 'trf_reference',
        whereColumnValuePairs: [{ column: 'rf_rfid', value: qq_rfid }]
      }
    ]
    const exists = await table_check(tableColumnValuePairs)
    if (!exists.ok) errors.qq_rfid = [exists.error ?? 'Validation check failed']
    else if (!exists.data.found) errors.qq_rfid = ['id must exist']
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
