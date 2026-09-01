// src/ui/login/socials_signin.ts

//==============================================================================================
//  1) DESCRIPTION
//    socials_signin — client helper that calls NextAuth signIn(provider) with the post-login
//    redirect, toggling the caller's "signing in" state around the call.
//
//    Parameters:
//      provider    — 'google' | 'github' | 'facebook'
//      setSigningIn — setter for the caller's "signing in" state
//==============================================================================================

import { signIn } from 'next-auth/react'
import { Routes_AfterLogin_redirect } from '@/src/root/constants/constants_validroutes'

export function socials_signin(
  provider: 'google' | 'github' | 'facebook',
  setSigningIn: (signingIn: boolean) => void
) {
  setSigningIn(true)
  signIn(provider, {
    callbackUrl: Routes_AfterLogin_redirect
  })
}
