'use server'

//==============================================================================================
//  1) DESCRIPTION
//    userCache_purge — clears every cache entry belonging to one user and logs the count.
//
//    Parameters:
//      userId — the user whose cache entries to clear
//      caller — logging caller identity
//
//    Returns:
//      { userId, clearedCount, timestamp? } — clearedCount is 0 when userId is missing/0
//==============================================================================================

import { cache_clearUser } from 'nextjs-shared/userCache_store'
import { write_logging } from 'nextjs-shared/write_logging'

const functionName = 'userCache_purge'

export async function userCache_purge(userId: number, caller: string = '') {
  if (!userId || userId === 0) {
    const msg = `No valid userId provided: ${userId}`
    write_logging({
      lg_caller: caller,
      lg_functionname: functionName,
      lg_msg: msg,
      lg_severity: 'I'
    })
    return { userId, clearedCount: 0 }
  }

  const clearedCount = cache_clearUser(userId, functionName)

  const msg = `CACHE CLR | ${clearedCount} entries for user ${userId}`
  write_logging({
    lg_caller: caller,
    lg_functionname: functionName,
    lg_msg: msg,
    lg_severity: 'I'
  })

  return {
    userId,
    clearedCount,
    timestamp: new Date().toISOString()
  }
}
