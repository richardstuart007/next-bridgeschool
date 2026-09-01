//==============================================================================================
//  1) DESCRIPTION
//    convertUTCtoLocal — converts a UTC Date to a formatted local date/time string, using the
//    timezone looked up from the given country code.
//
//    Parameters:
//      datetimeUTC         — the UTC Date to convert
//      to_localcountryCode — ISO country code used to look up the timezone; defaults to 'GB'
//      to_dateFormat       — date-fns format string; defaults to 'yy-MMM-dd HH:mm'
//
//    Returns:
//      the formatted local date/time string
//==============================================================================================

import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { COUNTRIES } from '@/src/root/constants/constants_Countries'
import { structure_Country } from '@/src/lib/tables/structures'

interface Params {
  datetimeUTC: Date
  to_localcountryCode?: string
  to_dateFormat?: string
}
export function convertUTCtoLocal({
  datetimeUTC,
  to_localcountryCode = 'GB',
  to_dateFormat = 'yy-MMM-dd HH:mm'
}: Params): string {
  //
  //  Get the users time zone
  //
  const userTimeZone =
    COUNTRIES.find((country: structure_Country) => country.code === to_localcountryCode)
      ?.timezone || 'UTC'
  //
  // Convert the stored GMT datetime string to a Date object in UTC
  //
  const localDate = toZonedTime(datetimeUTC, userTimeZone)
  //
  // Format the local datetime
  //
  const formattedDate = format(localDate, to_dateFormat)
  return formattedDate
}
