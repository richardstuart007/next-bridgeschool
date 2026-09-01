'use server'

//==============================================================================================
//  1) DESCRIPTION
//    getAuthSession — returns the current NextAuth session; logs 'E' and throws on failure.
//
//    Parameters:
//      caller — logging caller identity
//
//    Returns:
//      the NextAuth session object (or null when there is no session)
//==============================================================================================

import { auth } from '@/auth'
import { write_logging } from 'nextjs-shared/write_logging'

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
