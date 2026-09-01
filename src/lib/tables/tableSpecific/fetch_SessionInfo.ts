'use server'

//==============================================================================================
//  1) DESCRIPTION
//    fetch_SessionInfo — joins tss_sessions + tus_users for the current session cookie and
//    returns the user's session info.
//
//    Parameters:
//      caller — logging caller identity
//
//    Returns:
//      a structure_SessionsInfo (si_ssid, si_usid, si_name, si_email, si_admin,
//      si_skipcorrect, si_maxquestions); throws when the query fails or no row is found
//==============================================================================================

import { table_query } from 'nextjs-shared/table_query'
import { structure_SessionsInfo } from '@/src/lib/tables/structures'
import { getAuthServer_au_ssid } from '@/src/lib/authServer_au_ssid'

export type Props = {
  caller?: string
}
export async function fetch_SessionInfo({ caller = '' }: Props) {
  const functionName = 'fetch_SessionInfo'
  //
  //  Get the session id
  //
  const co_ssid = await getAuthServer_au_ssid()

  const queryResult = await table_query({
    caller,
    table: 'tss_sessions',
    query: `
      SELECT ss_ssid, us_usid, us_name, us_email, us_admin, us_skipcorrect, us_maxquestions
      FROM tss_sessions
      JOIN tus_users ON ss_usid = us_usid
      WHERE ss_ssid = $1
    `,
    params: [co_ssid]
  })
  if (!queryResult.ok) throw new Error(`${functionName}: ` + (queryResult.error ?? 'Failed'))
  const rows = queryResult.data
  if (rows.length === 0) throw new Error(`${functionName}: Failed`)
  const row = rows[0]
  //
  //  Return the session info
  //
  const result: structure_SessionsInfo = {
    si_ssid: row.ss_ssid,
    si_usid: row.us_usid,
    si_name: row.us_name,
    si_email: row.us_email,
    si_admin: row.us_admin,
    si_skipcorrect: row.us_skipcorrect,
    si_maxquestions: row.us_maxquestions
  }
  return result
}
