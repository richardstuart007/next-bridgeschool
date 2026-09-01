//==============================================================================================
//  1) DESCRIPTION
//    auth.ts — NextAuth v5 configuration. Exports the route handlers (GET/POST) plus `auth`,
//    `signIn` and `signOut` used across the app.
//
//    Providers: Credentials (email + bcrypt hash from tup_userspwd), GitHub, Google, Facebook.
//
//    Returns (exports):
//      handlers.GET / handlers.POST — the NextAuth route handlers
//      auth                         — server helper to read the session
//      signIn / signOut             — the NextAuth sign-in / sign-out actions
//
//  2) NOTES
//    The `authorize`, `signIn`, `jwt` and `session` callbacks below are NextAuth config
//    callbacks (passed as object properties) and stay as arrow functions. `popUserData` is the
//    one plain helper — it maps a DB user row to the au_UserData shape NextAuth stores.
//==============================================================================================

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from '@/src/root/auth.config'
import { z } from 'zod'
import type { au_UserData, structure_ProviderSignInParams } from '@/src/lib/tables/structures'
import bcrypt from 'bcryptjs'
import { providerSignIn } from '@/src/lib/dataAuth/providerSignIn'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import { table_fetch } from 'nextjs-shared/table_fetch'
import { userCache_purgeOnSignIn } from '@/src/lib/tables/cache/userCache_purgeOnSignIn'
import { write_logging } from 'nextjs-shared/write_logging'

const functionName = 'auth'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  trustHost: true,
  ...authConfig,
  //-----------------------------------------------------------------------
  //  Providers
  //-----------------------------------------------------------------------
  providers: [
    //..............................
    //  Github
    //..............................
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    //..............................
    // Google
    //..............................
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    //..............................
    // Facebook
    //..............................
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
    //..............................
    //  Email & password
    //..............................
    Credentials({
      async authorize(credentials) {
        //
        //  Validate input format
        //
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials)
        //
        //  Fail credentials then return
        //
        if (!parsedCredentials.success) return null
        //
        //  Get userpwd from database
        //
        try {
          const { email, password } = parsedCredentials.data
          //
          //  Get Password record
          //
          const pwdParams = {
            caller: functionName,
            table: 'tup_userspwd',
            whereColumnValuePairs: [{ column: 'up_email', value: email }]
          }
          const pwdResult = await table_fetch(pwdParams)
          if (!pwdResult.ok) throw new Error(pwdResult.error ?? 'table_fetch failed')
          const pwdRows = pwdResult.data
          const userPwd = pwdRows[0]
          if (!userPwd) return null
          //
          //  Check password if exists
          //
          const passwordsMatch = await bcrypt.compare(password, userPwd.up_hash)
          if (!passwordsMatch) return null
          //
          //  Get User record
          //
          const fetchParams = {
            caller: functionName,
            table: 'tus_users',
            whereColumnValuePairs: [{ column: 'us_email', value: email }]
          }
          const result = await table_fetch(fetchParams)
          if (!result.ok) throw new Error(result.error ?? 'table_fetch failed')
          const rows = result.data
          const userRecord = rows[0]
          if (!userRecord) return null
          //
          //  Return in correct format
          //
          const rtnData = popUserData(userRecord)
          return rtnData
          //
          //  Errors
          //
        } catch (error) {
          write_logging({
            lg_caller: functionName,
            lg_functionname: 'authorize',
            lg_msg: `Authorization error: ${(error as Error).message}`,
            lg_severity: 'E'
          })
          return null
        }
      }
    })
  ],
  //-----------------------------------------------------------------------
  //  Callback functions
  //-----------------------------------------------------------------------
  callbacks: {
    //-----------------------------------------------------------------------
    //  1) JWT - Runs first to create/update token
    //-----------------------------------------------------------------------
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as au_UserData
        //
        // NextAuth fields
        //
        token.sub = customUser.id
        token.name = customUser.name
        token.email = customUser.email
        token.emailVerified = customUser.emailVerified
        //
        // Your custom fields
        //
        token.au_usid = customUser.au_usid
        token.au_name = customUser.au_name
        token.au_email = customUser.au_email
        token.au_ssid = customUser.au_ssid
      }
      return token
    },
    //-----------------------------------------------------------------------
    //  2) Session - Runs second using token data
    //-----------------------------------------------------------------------
    async session({ token, session }) {
      if (session.user) {
        session.user = {
          //
          // NextAuth required fields
          //
          id: token.sub as string,
          name: token.name as string,
          email: token.email as string,
          emailVerified: token.emailVerified as Date | null,
          //
          // Your custom fields
          //
          au_ssid: token.au_ssid as string,
          au_usid: token.au_usid as string,
          au_name: token.au_name as string,
          au_email: token.au_email as string
        } as au_UserData
      }
      return session
    },
    //-----------------------------------------------------------------------
    //  3) SignIn - Runs when user first authenticates
    //-----------------------------------------------------------------------
    async signIn({ user, account }) {
      const { email, name } = user
      const provider = account?.provider
      //
      //  Errors
      //
      if (!provider || !email || !name) return false
      //
      //  googlemail.com is the same account as gmail.com — normalise before lookup
      //
      const lookupEmail = email.toLowerCase().endsWith('@googlemail.com')
        ? email.slice(0, email.toLowerCase().indexOf('@googlemail.com')) + '@gmail.com'
        : email
      //
      //  Gmail addresses belong to Google regardless of which social provider was used to sign in
      //
      const effectiveProvider =
        provider !== 'credentials' && lookupEmail.toLowerCase().endsWith('@gmail.com')
          ? 'google'
          : provider
      //
      //  Write session information
      //
      const signInData: structure_ProviderSignInParams = {
        provider: effectiveProvider,
        email: lookupEmail,
        name: name
      }
      try {
        //
        // Fetch the user from the database
        //
        const fetchParams = {
          caller: functionName,
          table: 'tus_users',
          whereColumnValuePairs: [{ column: 'us_email', value: lookupEmail }]
        }
        const result = await table_fetch(fetchParams)
        if (!result.ok) throw new Error(result.error ?? 'table_fetch failed')
        const rows = result.data
        let userRecord = rows[0]
        //
        //  providerSignIn auto-creates the user if not found, then writes a session
        //
        const newAuSsid = await providerSignIn(signInData, functionName)
        //
        //  Re-fetch if the user was just created
        //
        if (!userRecord) {
          const newResult = await table_fetch(fetchParams)
          if (!newResult.ok) throw new Error(newResult.error ?? 'table_fetch failed')
          const newRows = newResult.data
          userRecord = newRows[0]
        }
        if (!userRecord) return false
        //
        //  Extend user
        //
        Object.assign(user, popUserData(userRecord))
        //
        //  Set au_ssid
        //
        const stringAuSsid = newAuSsid.toString()
        const userTyped = user as au_UserData
        userTyped.au_ssid = stringAuSsid
        //
        //  Clear cache for this user
        //
        await userCache_purgeOnSignIn(userRecord.us_usid, functionName)
        //
        //  All OK
        //
        return true
        //
        //  Errors
        //
      } catch (error) {
        write_logging({
          lg_caller: functionName,
          lg_functionname: 'signIn',
          lg_msg: `Provider signIn error: ${(error as Error).message}`,
          lg_severity: 'E'
        })
        return false
      }
    }
  }
})
interface UserRecord {
  us_usid: number | string
  us_name: string
  us_email: string
}

//----------------------------------------------------------------------------------
//  popUserData — build the au_UserData object NextAuth stores from a DB user row
//    Params:
//      userRecord — { us_usid, us_name, us_email } from tus_users
//    Returns:
//      au_UserData with NextAuth fields (id/name/email/emailVerified) and custom
//      au_* fields; au_ssid starts blank and is filled in later by the signIn flow
//----------------------------------------------------------------------------------
function popUserData(userRecord: UserRecord): au_UserData {
  return {
    //
    // NextAuth fields
    //
    id: userRecord.us_usid.toString(),
    name: userRecord.us_name,
    email: userRecord.us_email,
    emailVerified: null, // Always null, not used or stored
    //
    // Custom fields
    //
    au_usid: userRecord.us_usid.toString(),
    au_name: userRecord.us_name,
    au_email: userRecord.us_email,
    au_ssid: ''
  }
}
