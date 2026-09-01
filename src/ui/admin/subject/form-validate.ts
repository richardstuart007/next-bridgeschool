//==============================================================================================
//  1) DESCRIPTION
//    validate — business-rule validation for the subject form: for a new subject checks tsb_subject for a duplicate owner + subject.
//
//    Parameters:
//      the form record (or bare field) to validate
//
//    Returns:
//      a StateSetup — { errors?, message } ; message is null when validation passes
//==============================================================================================

import { table_Subject } from '@/src/lib/tables/definitions'
import { table_check } from 'nextjs-shared/table_check'
//
//  Errors and Messages
//
export type StateSetup = {
  errors?: {
    sb_owner?: string[]
    sb_subject?: string[]
    sb_title?: string[]
    sb_level?: string[]
  }
  message?: string | null
}

export default async function validateSubject(record: table_Subject): Promise<StateSetup> {
  const { sb_sbid, sb_owner, sb_subject } = record
  //
  // Initialise errors return
  //
  let errors: StateSetup['errors'] = {}
  //
  //  Check for Add duplicate
  //
  if (sb_sbid === 0) {
    const tableColumnValuePairs = [
      {
        table: 'tsb_subject',
        whereColumnValuePairs: [
          { column: 'sb_owner', value: sb_owner },
          { column: 'sb_subject', value: sb_subject }
        ]
      }
    ]
    const exists = await table_check(tableColumnValuePairs)
    if (!exists.ok) errors.sb_subject = [exists.error ?? 'Validation check failed']
    else if (exists.data.found) errors.sb_subject = ['Owner/Subject must be unique']
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
