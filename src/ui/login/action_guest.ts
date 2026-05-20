'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { ensureGuestUsers } from '@/src/lib/dataAuth/ensureGuestUsers'

export type StateGuestLogin = {
  message: string | null
  success?: boolean
}

export async function action_guest(
  _prevState: StateGuestLogin | undefined,
  formData: FormData
): Promise<StateGuestLogin> {
  const guestType = formData.get('guestType') as string

  const email =
    guestType === 'nzbridge'
      ? process.env.GUEST_NZBRIDGE_EMAIL
      : process.env.GUEST_RICHARD_EMAIL
  const password =
    guestType === 'nzbridge'
      ? process.env.GUEST_NZBRIDGE_PASSWORD
      : process.env.GUEST_RICHARD_PASSWORD

  if (!email || !password) {
    return { message: 'Guest login is not configured' }
  }

  try {
    await ensureGuestUsers()
    await signIn('credentials', { email, password, redirect: false })
    return { success: true, message: '' }
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: 'Guest sign-in failed. Please try again.' }
    }
    throw error
  }
}
