// src/ui/dashboard/friends/action.ts
'use server'

//==============================================================================================
//  1) DESCRIPTION
//    action — server action for the friends dialog: Zod-parses formData, deletes the user's
//    existing tuf_friends rows, then inserts one row per selected friend id.
//
//    Parameters:
//      _prevState — previous StateFriends from useActionState (unused)
//      formData   — the submitted form fields (uf_usid, uf_frid as a JSON array)
//
//    Returns:
//      a StateFriends — { errors?, message, databaseUpdated }
//==============================================================================================

import { z } from 'zod'
import { table_write } from 'nextjs-shared/table_write'
import { table_delete } from 'nextjs-shared/table_delete'
import { write_logging } from 'nextjs-shared/write_logging'
//
//  Form Schema for validation
//
const FormSchemaFriends = z.object({
  uf_usid: z.string(),
  uf_frid: z.string()
})
//
//  Errors and Messages
//
export type StateFriends = {
  errors?: {
    uf_usid?: string[]
    uf_frid?: string[]
  }
  message?: string | null
  databaseUpdated?: boolean
}

const Friends = FormSchemaFriends

export async function action(_prevState: StateFriends, formData: FormData) {
  const functionName = 'Action_Friends'
  //
  //  Validate form data
  //
  const validatedFields = Friends.safeParse({
    uf_usid: formData.get('uf_usid'),
    uf_frid: formData.get('uf_frid')
  })
  //
  // If form validation fails, return errors early. Otherwise, continue.
  //
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Friends.',
      databaseUpdated: false
    }
  }
  //
  // Unpack form data
  //
  const { uf_usid, uf_frid } = validatedFields.data
  const friendIds = JSON.parse(uf_frid) as Array<number>
  //
  // Update friends in the database
  //
  try {
    // -----------------
    // Delete existing friendships for this user
    // -----------------
    const deleteResult = await table_delete({
      caller: functionName,
      table: 'tuf_friends',
      whereColumnValuePairs: [{ column: 'uf_usid', value: uf_usid }]
    })
    if (!deleteResult.ok) throw new Error(deleteResult.error ?? 'table_delete failed')

    // -----------------
    // Insert new friendships
    // -----------------
    for (const friendId of friendIds) {
      const writeResult = await table_write({
        caller: functionName,
        table: 'tuf_friends',
        columnValuePairs: [
          { column: 'uf_usid', value: uf_usid },
          { column: 'uf_frid', value: friendId }
        ]
      })
      if (!writeResult.ok) throw new Error(writeResult.error ?? 'table_write failed')
    }

    //
    //  OK
    //
    return {
      message: 'Friends updated successfully.',
      errors: undefined,
      databaseUpdated: true
    }
    //
    //  Errors
    //
  } catch (error) {
    const errorMessage = 'Database Error: Failed to Update Friends.'
    write_logging({
      lg_caller: '',
      lg_functionname: functionName,
      lg_msg: `${errorMessage} ${(error as Error).message}`,
      lg_severity: 'E'
    })
    return {
      message: errorMessage,
      errors: undefined,
      databaseUpdated: false
    }
  }
}
