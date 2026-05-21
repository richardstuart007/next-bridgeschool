'use server'

import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/src/root/constants/constants_other'
// ----------------------------------------------------------------------
//  Update Cookie information
// ----------------------------------------------------------------------
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
