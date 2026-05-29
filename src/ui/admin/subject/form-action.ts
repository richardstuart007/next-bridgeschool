'use server'

import { z } from 'zod'
import Validate from '@/src/ui/admin/subject/form-validate'
import { table_update } from 'nextjs-shared/table_update'
import { table_write } from 'nextjs-shared/table_write'
import { write_Logging } from 'nextjs-shared/write_logging'
// ----------------------------------------------------------------------
//  Update Owner Setup
// ----------------------------------------------------------------------
const FormSchemaSetup = z.object({
  sb_owner: z.string(),
  sb_subject: z.string(),
  sb_title: z.string(),
  sb_level: z.string()
})

export type StateSetup = {
  errors?: {
    sb_owner?: string[]
    sb_subject?: string[]
    sb_title?: string[]
    sb_level?: string[]
  }
  message?: string | null
  databaseUpdated?: boolean
}

const Setup = FormSchemaSetup

export async function Action(_prevState: StateSetup, formData: FormData): Promise<StateSetup> {
  const functionName = 'Action_MaintOwnerSubject'

  const validatedFields = Setup.safeParse({
    sb_owner: formData.get('sb_owner'),
    sb_subject: formData.get('sb_subject'),
    sb_title: formData.get('sb_title'),
    sb_level: formData.get('sb_level')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid or missing fields'
    }
  }

  const { sb_owner, sb_subject, sb_title, sb_level } = validatedFields.data
  const sb_sbid = Number(formData.get('sb_sbid'))

  const table_Subject = {
    sb_sbid,
    sb_owner,
    sb_subject,
    sb_title,
    sb_level,
    sb_cntquestions: 0,
    sb_cntreference: 0
  }
  const errorMessages = await Validate(table_Subject)
  if (errorMessages.message) {
    return {
      errors: errorMessages.errors,
      message: errorMessages.message,
      databaseUpdated: false
    }
  }

  try {
    const updateParams = {
      caller: functionName,
      table: 'tsb_subject',
      columnValuePairs: [
        { column: 'sb_title', value: sb_title },
        { column: 'sb_level', value: sb_level }
      ],
      whereColumnValuePairs: [{ column: 'sb_sbid', value: sb_sbid }]
    }
    const writeParams = {
      caller: functionName,
      table: 'tsb_subject',
      columnValuePairs: [
        { column: 'sb_owner', value: sb_owner },
        { column: 'sb_subject', value: sb_subject },
        { column: 'sb_title', value: sb_title },
        { column: 'sb_level', value: sb_level }
      ]
    }
    await (sb_sbid === 0 ? table_write(writeParams) : table_update(updateParams))

    return { message: 'Database updated successfully.', errors: undefined, databaseUpdated: true }
  } catch (error) {
    const errorMessage = 'Database Error: Failed to Update Subject.'
    write_Logging({
      lg_caller: '',
      lg_functionname: functionName,
      lg_msg: `${errorMessage} ${(error as Error).message}`,
      lg_severity: 'E'
    })
    return { message: errorMessage, errors: undefined, databaseUpdated: false }
  }
}
