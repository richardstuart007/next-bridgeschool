'use server'

import { auth } from '@/auth'
import { write_logging } from 'nextjs-shared/write_logging'
// ----------------------------------------------------------------------
//  Get Auth Session information
// ----------------------------------------------------------------------
export async function getAuthSession(caller: string = '') {
  const functionName = 'getAuthSession'
  try {
    const session = await auth()
    return session
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
