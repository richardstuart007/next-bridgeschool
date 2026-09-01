'use server'

//==============================================================================================
//  1) DESCRIPTION
//    cookie_update — writes the session id into COOKIE_NAME as a JSON string (httpOnly false,
//    secure in production, sameSite lax, path '/').
//
//    Parameters:
//      co_ssid — the session id to store
//==============================================================================================

import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/src/root/constants/constants_other'

export async function cookie_update(co_ssid: number) {
  const functionName = 'cookie_update'
  try {
    const cookieName = COOKIE_NAME
    //
    // Write the cookie
    //
    const cookieValue = JSON.stringify(co_ssid)
    const cookieStore = await cookies()
    cookieStore.set(cookieName, cookieValue, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })
    //
    //  Errors
    //
  } catch (error) {
    console.error(`${functionName}:`, error)
    throw new Error(`${functionName}: Failed`)
  }
}
