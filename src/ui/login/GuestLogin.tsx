'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { MyButton } from 'nextjs-shared/MyButton'
import { action_guest } from '@/src/ui/login/action_guest'
import { Routes_AfterLogin_redirect } from '@/src/root/constants/constants_validroutes'

interface GuestLoginProps {
  setSigningIn: (value: boolean) => void
}

export default function GuestLogin({ setSigningIn }: GuestLoginProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function handleGuestClick(guestType: 'richard' | 'nzbridge') {
    setErrorMessage(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append('guestType', guestType)
      const result = await action_guest(undefined, formData)
      if (result?.success) {
        setSigningIn(true)
        router.push(Routes_AfterLogin_redirect)
      } else {
        setErrorMessage(result?.message ?? 'Guest sign-in failed')
      }
    })
  }

  return (
    <>
      <label className='mb-0 mt-9 block text-xs font-medium text-gray-900'>Guest Access</label>
      <div className='flex items-center w-full pt-4 gap-x-4'>
        <MyButton
          overrideClass='w-full border border-blue-700 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-sm'
          disabled={isPending}
          onClick={function (event) {
            event.preventDefault()
            handleGuestClick('richard')
          }}
        >
          {isPending ? 'Signing in...' : 'Guest (International)'}
        </MyButton>
        <MyButton
          overrideClass='w-full border border-green-700 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center text-sm'
          disabled={isPending}
          onClick={function (event) {
            event.preventDefault()
            handleGuestClick('nzbridge')
          }}
        >
          {isPending ? 'Signing in...' : 'Guest (NZ Bridge)'}
        </MyButton>
      </div>
      {errorMessage && <p className='mt-2 text-sm text-red-500'>{errorMessage}</p>}
    </>
  )
}
