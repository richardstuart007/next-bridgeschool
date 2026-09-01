//==============================================================================================
//  1) DESCRIPTION
//    getAuthServer_au_ssid — reads the NextAuth session and returns the user's au_ssid,
//    or 0 when there is no session or the lookup throws.
//
//    Returns:
//      au_ssid — the session id number, or 0
//==============================================================================================

import { getAuthSession } from '@/src/lib/dataAuth/getAuthSession'

export async function getAuthServer_au_ssid() {
  const functionName = 'getAuthServer_au_ssid'
  try {
    const authSession = await getAuthSession(functionName)
    const au_ssid = authSession?.user?.au_ssid || 0
    return au_ssid
  } catch (error) {
    console.error('Failed to fetch au_ssid:', error)
    return 0
  }
}
