'use server'

import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/src/root/constants/constants_other'
// ----------------------------------------------------------------------
//  Get Cookie information
// ----------------------------------------------------------------------
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
