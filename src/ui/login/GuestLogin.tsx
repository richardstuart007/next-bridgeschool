'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MyButton } from 'nextjs-shared/MyButton';
import { action_guest } from '@/src/ui/login/action_guest';
import { Routes_AfterLogin_redirect } from '@/src/root/constants/constants_validroutes';

interface GuestLoginProps {
  setSigningIn: (value: boolean) => void;
}

export default function GuestLogin({ setSigningIn }: GuestLoginProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleGuestClick(guestType: 'richard' | 'nzbridge') {
    setErrorMessage(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('guestType', guestType);
      const result = await action_guest(undefined, formData);
      if (result?.success) {
        setSigningIn(true);
        router.push(Routes_AfterLogin_redirect);
      } else {
        setErrorMessage(result?.message ?? 'Guest sign-in failed');
      }
    });
  }

  return (
    <div className="bg-teal-50 rounded-lg p-4 mt-6 border border-teal-200">
      <p className='text-xs font-semibold text-white bg-teal-600 -mx-4 -mt-4 px-4 py-2 mb-3 rounded-t-lg'>Guest Access</p>
      <div className="flex items-center w-full gap-x-4">
        <MyButton
          overrideClass="w-full border border-amber-900 rounded-lg bg-amber-800 hover:bg-amber-900 text-white flex items-center justify-center text-sm cursor-pointer"
          disabled={isPending}
          onClick={function (event) {
            event.preventDefault();
            handleGuestClick('richard');
          }}
        >
          {isPending ? 'Signing in...' : 'International'}
        </MyButton>
        <MyButton
          overrideClass="w-full border border-orange-500 rounded-lg bg-orange-400 hover:bg-orange-500 text-white flex items-center justify-center text-sm cursor-pointer"
          disabled={isPending}
          onClick={function (event) {
            event.preventDefault();
            handleGuestClick('nzbridge');
          }}
        >
          {isPending ? 'Signing in...' : 'NZ Bridge'}
        </MyButton>
      </div>
      {errorMessage && (
        <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
