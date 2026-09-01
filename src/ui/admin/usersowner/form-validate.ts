//==============================================================================================
//  1) DESCRIPTION
//    validateUsersowner — business-rule validation for the user/owner-link form: checks tuo_usersowner for a duplicate user + owner combination.
//
//    Parameters:
//      the form record (or bare field) to validate
//
//    Returns:
//      a StateSetup — { errors?, message } ; message is null when validation passes
//==============================================================================================

import { table_Usersowner } from '@/src/lib/tables/definitions'
import { table_check } from 'nextjs-shared/table_check'
//
//  Errors and Messages
//
type StateSetup = {
  errors?: {
    uid?: string[]
    owner?: string[]
  }
  message?: string | null
}

export default async function validateUsersowner(record: table_Usersowner): Promise<StateSetup> {
  const { uo_usid, uo_owner } = record
  let errors: StateSetup['errors'] = {}
  //
  //  Check for Add duplicate
  //
  const tableColumnValuePairs = [
    {
      table: 'tuo_usersowner',
      whereColumnValuePairs: [
        { column: 'uo_usid', value: uo_usid },
        { column: 'uo_owner', value: uo_owner }
      ]
    }
  ]
  const exists = await table_check(tableColumnValuePairs)
  if (!exists.ok) errors.owner = [exists.error ?? 'Validation check failed']
  else if (exists.data.found) errors.owner = ['User/Owner combination already exists']
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
