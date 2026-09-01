'use server'

//==============================================================================================
//  1) DESCRIPTION
//    cookie_delete — deletes the named cookie from the request cookie store.
//
//    Parameters:
//      cookieName — cookie to delete; defaults to COOKIE_NAME
//==============================================================================================

import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/src/root/constants/constants_other'

export async function cookie_delete(cookieName: string = COOKIE_NAME) {
  const functionName = 'cookie_delete'
  try {
    const cookieStore = await cookies()
    cookieStore.delete(cookieName)
    //
    //  Errors
    //
  } catch (error) {
    console.error(`${functionName}:`, error)
    throw new Error(`${functionName}: Failed`)
  }
}
