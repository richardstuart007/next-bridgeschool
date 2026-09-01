'use server'

//==============================================================================================
//  1) DESCRIPTION
//    fetch_IsAdmin — returns whether the currently signed-in user is an admin, from their
//    session row.
//
//    Parameters:
//      caller — logging caller identity
//
//    Returns:
//      true when the session user has si_admin set; false when not logged in; logs 'E' and
//      throws on error
//==============================================================================================

import { write_logging } from 'nextjs-shared/write_logging'
import { cookie_fetch } from '@/src/lib/cookie/cookie_fetch'
import { fetch_SessionInfo } from '@/src/lib/tables/tableSpecific/fetch_SessionInfo'

export async function fetch_IsAdmin(caller = '') {
  const functionName = 'fetch_IsAdmin'
  try {
    //
    //  Get session id
    //
    const co_ssid = await cookie_fetch()
    //
    //  No session then not logged in
    //
    if (!co_ssid) return false
    //
    //  Session info
    //
    const sessionInfo = await fetch_SessionInfo({ caller: functionName })
    //
    //  Return admin flag
    //
    return sessionInfo.si_admin
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
