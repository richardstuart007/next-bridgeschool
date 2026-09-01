'use server'

//==============================================================================================
//  1) DESCRIPTION
//    providerSignIn — signs a user in from an OAuth provider: finds (or creates via
//    write_users) the tus_users row, then writes a session via write_sessions.
//
//    Parameters:
//      { provider, email, name } — the provider sign-in details
//      caller                    — logging caller identity
//
//    Returns:
//      ss_ssid — the new session id; logs 'E' and throws `providerSignIn: Failed` on any error
//==============================================================================================

import { table_Users } from '@/src/lib/tables/definitions'
import { structure_ProviderSignInParams } from '@/src/lib/tables/structures'
import { table_fetch, table_fetch_Props } from 'nextjs-shared/table_fetch'
import { write_users } from '@/src/lib/tables/tableSpecific/write_users'
import { write_sessions } from '@/src/lib/tables/tableSpecific/write_sessions'
import { write_logging } from 'nextjs-shared/write_logging'

export async function providerSignIn(
  { provider, email, name }: structure_ProviderSignInParams,
  caller: string = ''
) {
  const functionName = 'providerSignIn'
  try {
    const result = await table_fetch({
      caller: functionName,
      table: 'tus_users',
      whereColumnValuePairs: [{ column: 'us_email', value: email }]
    } as table_fetch_Props)
    if (!result.ok) throw new Error(result.error ?? 'table_fetch failed')
    const rows = result.data

    let userRecord: table_Users | undefined = rows[0]

    if (!userRecord) userRecord = await write_users(provider, email, name)
    if (!userRecord) throw Error('providerSignIn: Write Users Error')

    const ss_usid = userRecord.us_usid
    const ss_ssid = await write_sessions(ss_usid)

    return ss_ssid
  } catch (error) {
    const errorMessage = (error as Error).message
    write_logging({
      lg_caller: caller,
      lg_functionname: functionName,
      lg_msg: errorMessage,
      lg_severity: 'E'
    })
    console.error('Error:', errorMessage)
    throw new Error(`${functionName}: Failed`)
  }
}
