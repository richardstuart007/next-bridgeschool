//==============================================================================================
//  1) DESCRIPTION
//    validateOwner — business-rule validation for the owner form: checks tow_owner for a
//    duplicate ow_owner name.
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
    ow_owner?: string[]
  }
  message?: string | null
}
export default async function validateOwner(ow_owner: string): Promise<StateSetup> {
  //
  // Initialise errors return
  //
  let errors: StateSetup['errors'] = {}
  //
  //  Check for Add duplicate
  //
  const tableColumnValuePairs = [
    {
      table: 'tow_owner',
      whereColumnValuePairs: [{ column: 'ow_owner', value: ow_owner }]
    }
  ]
  const exists = await table_check(tableColumnValuePairs)
  if (!exists.ok) errors.ow_owner = [exists.error ?? 'Validation check failed']
  else if (exists.data.found) errors.ow_owner = ['Owner must be unique']
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
