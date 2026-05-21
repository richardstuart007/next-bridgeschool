import { getAuthSession } from '@/src/lib/dataAuth/getAuthSession'
//
//  Return Auth Session
//
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
