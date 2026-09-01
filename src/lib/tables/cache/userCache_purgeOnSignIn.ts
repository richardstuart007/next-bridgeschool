'use server'

//==============================================================================================
//  1) DESCRIPTION
//    userCache_purgeOnSignIn — thin wrapper around userCache_purge for the sign-in path; clears
//    the user's cache entries and logs an 'I' sign-in note.
//
//    Parameters:
//      userId — the user signing in
//      caller — logging caller identity
//
//    Returns:
//      the userCache_purge result ({ userId, clearedCount, timestamp? })
//==============================================================================================

import { userCache_purge } from '@/src/lib/tables/cache/userCache_purge'
import { write_logging } from 'nextjs-shared/write_logging'

export async function userCache_purgeOnSignIn(userId: number, caller: string = '') {
  const functionName = 'userCache_purgeOnSignIn'

  const result = await userCache_purge(userId, functionName)

  const msg = `CACHE PUR | User ${userId} on sign-in`
  write_logging({
    lg_caller: caller,
    lg_functionname: functionName,
    lg_msg: msg,
    lg_severity: 'I'
  })

  return result
}
