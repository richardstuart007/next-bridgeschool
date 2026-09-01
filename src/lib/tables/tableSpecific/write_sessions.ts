'use server'

//==============================================================================================
//  1) DESCRIPTION
//    write_sessions — inserts a new tss_sessions row for a user, writes the session cookie, and
//    returns the new session id.
//
//    Parameters:
//      ss_usid — the user id the session belongs to
//
//    Returns:
//      ss_ssid — the new session id; throws when the insert fails or returns no row
//==============================================================================================

import { table_write } from 'nextjs-shared/table_write'
import { cookie_update } from '@/src/lib/cookie/cookie_update'

export async function write_sessions(ss_usid: number) {
  const functionName = 'write_sessions'
  //
  //  Get date in UTC
  //
  const currentDate = new Date()
  const UTC_datetime = currentDate.toISOString()
  //
  //  Write Session
  //
  const sessionsResult = await table_write({
    caller: functionName,
    table: 'tss_sessions',
    columnValuePairs: [
      { column: 'ss_datetime', value: UTC_datetime },
      { column: 'ss_usid', value: ss_usid }
    ]
  })
  if (!sessionsResult.ok) throw new Error(sessionsResult.error ?? 'table_write failed')
  //
  //  Get the ss_ssid
  //
  const sessionsRecord = sessionsResult.data[0]
  if (!sessionsRecord) throw new Error('providerSignIn: Write Session Error')
  const ss_ssid = sessionsRecord.ss_ssid
  //
  // Write cookie ss_ssid
  //
  await cookie_update(ss_ssid)
  //
  //  Return Session ID
  //
  return ss_ssid
}
