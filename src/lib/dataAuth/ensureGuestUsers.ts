'use server';

//==============================================================================================
//  1) DESCRIPTION
//    ensureGuestUsers — for each configured guest (from GUEST_* env vars), creates the
//    tus_users / tup_userspwd / tuo_usersowner rows if the user does not already exist.
//
//    Returns:
//      void; throws on any failed fetch/insert. Guests with a missing email or password env
//      var are skipped.
//
//  2) NOTES
//    `ensureGuest` is the per-guest worker: it no-ops when a user row already exists for the
//    guest's email, otherwise inserts the three rows and bcrypt-hashes the password.
//==============================================================================================

import bcrypt from 'bcryptjs';
import { table_fetch, table_fetch_Props } from 'nextjs-shared/table_fetch';
import { table_write } from 'nextjs-shared/table_write';
import {
  Recent_usersReturned_Default,
  Recent_usersAverage_Default,
} from '@/src/ui/dashboard/graph/Recent/Recent_constants';
import { User_limitMonths_Average_Default } from '@/src/ui/dashboard/graph/User/User_constants';
import { Top_limitMonths_Default } from '@/src/ui/dashboard/graph/Top/Top_constants';
import { Default_fedcountry } from '@/src/root/constants/constants_other';

const GUESTS: {
  email: string;
  password: string;
  name: string;
  owner: string;
}[] = [
  {
    email: process.env.GUEST_RICHARD_EMAIL ?? '',
    password: process.env.GUEST_RICHARD_PASSWORD ?? '',
    name: 'International',
    owner: 'Richard',
  },
  {
    email: process.env.GUEST_NZBRIDGE_EMAIL ?? '',
    password: process.env.GUEST_NZBRIDGE_PASSWORD ?? '',
    name: 'NZ Bridge',
    owner: 'NZBridge',
  },
];

export async function ensureGuestUsers(): Promise<void> {
  const functionName = 'ensureGuestUsers';
  for (const guest of GUESTS) {
    if (!guest.email || !guest.password) continue;
    await ensureGuest(guest, functionName);
  }
}

//----------------------------------------------------------------------------------
//  ensureGuest — create one guest's tus_users / tup_userspwd / tuo_usersowner rows
//                if that email has no user row yet; no-op otherwise
//    Params:
//      guest  — { email, password, name, owner } for this guest
//      caller — logging caller identity
//----------------------------------------------------------------------------------
async function ensureGuest(
  guest: { email: string; password: string; name: string; owner: string },
  caller: string,
): Promise<void> {
  const fetchResult = await table_fetch({
    caller,
    table: 'tus_users',
    whereColumnValuePairs: [{ column: 'us_email', value: guest.email }],
  } as table_fetch_Props);
  if (!fetchResult.ok)
    throw new Error(`${caller}: ${fetchResult.error ?? 'table_fetch failed'}`);
  const rows = fetchResult.data;

  if (rows[0]) return;

  const UTC_datetime = new Date().toISOString();

  const writeResult = await table_write({
    caller,
    table: 'tus_users',
    columnValuePairs: [
      { column: 'us_email', value: guest.email },
      { column: 'us_name', value: guest.name },
      { column: 'us_joined', value: UTC_datetime },
      { column: 'us_fedid', value: '' },
      { column: 'us_admin', value: false },
      { column: 'us_fedcountry', value: Default_fedcountry },
      { column: 'us_provider', value: 'email' },
      {
        column: 'us_graph_user_months',
        value: User_limitMonths_Average_Default,
      },
      { column: 'us_graph_top_months', value: Top_limitMonths_Default },
      { column: 'us_graph_recent_users', value: Recent_usersReturned_Default },
      { column: 'us_graph_recent_avg', value: Recent_usersAverage_Default },
    ],
  });

  if (!writeResult.ok)
    throw new Error(`${caller}: ${writeResult.error ?? 'table_write failed'}`);
  const userRecord = writeResult.data[0];
  if (!userRecord)
    throw new Error(`${caller}: failed to create guest user ${guest.email}`);

  const us_usid = userRecord.us_usid;
  const hash = await bcrypt.hash(guest.password, 10);

  const pwdResult = await table_write({
    caller,
    table: 'tup_userspwd',
    columnValuePairs: [
      { column: 'up_usid', value: us_usid },
      { column: 'up_email', value: guest.email },
      { column: 'up_hash', value: hash },
    ],
  });
  if (!pwdResult.ok)
    throw new Error(`${caller}: ${pwdResult.error ?? 'table_write failed'}`);

  const ownerResult = await table_write({
    caller,
    table: 'tuo_usersowner',
    columnValuePairs: [
      { column: 'uo_usid', value: us_usid },
      { column: 'uo_owner', value: guest.owner },
    ],
  });
  if (!ownerResult.ok)
    throw new Error(`${caller}: ${ownerResult.error ?? 'table_write failed'}`);
}
