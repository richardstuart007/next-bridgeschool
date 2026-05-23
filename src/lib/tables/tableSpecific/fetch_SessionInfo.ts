'use server'

import { sql } from 'nextjs-shared/db'
import { structure_SessionsInfo } from '@/src/lib/tables/structures'
import { write_Logging } from 'nextjs-shared/write_logging'
import { cache_get, cache_set } from 'nextjs-shared/userCache_store'
import { getAuthServer_au_ssid } from '@/src/lib/authServer_au_ssid'
//---------------------------------------------------------------------
//  Fetch structure_SessionsInfo data by ID
//---------------------------------------------------------------------
export type Props = {
  caller?: string
}
export async function fetch_SessionInfo({ caller = '' }: Props) {
  const functionName = 'fetch_SessionInfo'
  //
  //  Get the session id
  //
  const co_ssid = await getAuthServer_au_ssid()

  const cacheKey = `SELECT ss_ssid, us_usid, us_name, us_email, us_admin, us_skipcorrect, us_maxquestions FROM tss_sessions JOIN tus_users ON ss_usid = us_usid WHERE ss_ssid = ${co_ssid}`

  try {
    const cached = cache_get<structure_SessionsInfo[]>(cacheKey, caller)
    if (cached) {
      await write_Logging({ lg_caller: caller, lg_functionname: functionName, lg_msg: `CACHE_HIT | ${cacheKey}`, lg_severity: 'I' })
      return cached[0]
    }
    await write_Logging({ lg_caller: caller, lg_functionname: functionName, lg_msg: `CACHE_MISS | ${cacheKey}`, lg_severity: 'I' })

    const sqlQuery = `
    SELECT
        ss_ssid,
        us_usid,
        us_name,
        us_email,
        us_admin,
        us_skipcorrect,
        us_maxquestions
      FROM tss_sessions
      JOIN tus_users
      ON   ss_usid = us_usid
      WHERE ss_ssid = $1
    `
    const queryValues = [co_ssid]
    //
    //  Execute the sql
    //
    const db = await sql()
    const data = await db.query({
      query: sqlQuery,
      params: queryValues,
      functionName: functionName,
      caller: caller
    })
    const row = data.rows[0]
    //
    //  Return the session info
    //
    const structure_SessionsInfo: structure_SessionsInfo = {
      si_ssid: row.ss_ssid,
      si_usid: row.us_usid,
      si_name: row.us_name,
      si_email: row.us_email,
      si_admin: row.us_admin,
      si_skipcorrect: row.us_skipcorrect,
      si_maxquestions: row.us_maxquestions
    }
    await write_Logging({ lg_caller: caller, lg_functionname: functionName, lg_msg: `CACHE_SAV | ${cacheKey}`, lg_severity: 'I' })
    cache_set(cacheKey, [structure_SessionsInfo], caller)
    return structure_SessionsInfo
    //
    //  Errors
    //
  } catch (error) {
    const errorMessage = (error as Error).message
    write_Logging({
      lg_caller: caller,
      lg_functionname: functionName,
      lg_msg: errorMessage,
      lg_severity: 'E'
    })
    console.error('Error:', errorMessage)
    throw new Error(`${functionName}: Failed`)
  }
}
