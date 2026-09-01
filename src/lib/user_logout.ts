'use server'

//==============================================================================================
//  1) DESCRIPTION
//    user_Logout — clears the session cookie and signs the user out via NextAuth, redirecting
//    to /login.
//==============================================================================================

import { signOut } from '@/auth'
import { cookie_delete } from '@/src/lib/cookie/cookie_delete'

export async function user_Logout() {
  await cookie_delete()
  await signOut({ redirectTo: '/login' })
}
