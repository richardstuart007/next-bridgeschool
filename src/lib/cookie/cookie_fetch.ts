'use server'

//==============================================================================================
//  1) DESCRIPTION
//    cookie_fetch — reads the named cookie, JSON-parses its value and returns it as a number.
//
//    Parameters:
//      cookieName — cookie to read; defaults to COOKIE_NAME
//
//    Returns:
//      the numeric session id, or null when the cookie is missing/empty/unparseable or on error
//==============================================================================================

import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/src/root/constants/constants_other'

export async function cookie_fetch(cookieName: string = COOKIE_NAME): Promise<number | null> {
  const functionName = 'cookie_fetch'
  try {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(cookieName)
    if (!cookie) return null
    //
    //  Get value
    //
    const decodedCookie = decodeURIComponent(cookie.value)
    if (!decodedCookie) return null
    //
    //  Convert to JSON
    //
    const JSON_cookie = JSON.parse(decodedCookie)
    if (!JSON_cookie) return null
    //
    //  Return JSON
    //
    const session = Number(JSON_cookie)
    return session
    //
    //  Errors
    //
  } catch (error) {
    console.error(`${functionName}:`, error)
    return null
  }
}
