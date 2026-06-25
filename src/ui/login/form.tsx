'use client';

import { lusitana } from '@/src/root/constants/constants_fonts';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { MyButton } from 'nextjs-shared/MyButton';
import { action, StateLogin } from '@/src/ui/login/action';
import { useRouter } from 'next/navigation';
import { cookie_delete } from '@/src/lib/cookie/cookie_delete';
import Socials from '@/src/ui/login/socials';
import { useState, useEffect, useActionState, useRef } from 'react';
import { MyInput } from 'nextjs-shared/MyInput';
import { MyLoadingMessage } from 'nextjs-shared/MyLoadingMessage';
import { table_fetch, table_fetch_Props } from 'nextjs-shared/table_fetch';
import { table_Users } from '@/src/lib/tables/definitions';
import { ProviderType } from '@/src/root/constants/constants_other';
import { socials_signin } from '@/src/ui/login/socials_signin';
import { Routes_AfterLogin_redirect } from '@/src/root/constants/constants_validroutes';
import GuestLogin from '@/src/ui/login/GuestLogin';

export default function LoginForm() {
  // -------------------------------------------------------------------------
  //  FUNCTION NAME - MUST BE FIRST
  // -------------------------------------------------------------------------
  const functionName = 'Login_Form';

  // -------------------------------------------------------------------------
  //  HOOKS & STATE DECLARATIONS
  // -------------------------------------------------------------------------
  const router = useRouter();

  const initialState: StateLogin = {
    errors: {},
    message: null,
    success: false,
  };
  const [formState, formAction] = useActionState(action, initialState);

  const errorMessage = formState?.message || null;
  const [signingIn, setSigningIn] = useState(false);

  // New state for email check
  const [email, setEmail] = useState('');
  const [userInfo, setUserInfo] = useState<{
    exists: boolean;
    provider?: ProviderType;
  }>({
    exists: false,
  });
  //
  // Track previous email to avoid clearing errors unnecessarily
  //
  const previousEmailRef = useRef('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------------------------------------------------------------------------
  //  EFFECTS
  // -------------------------------------------------------------------------
  // ...............................................................
  // Handle successful login - show loading message then redirect
  // ...............................................................
  useEffect(
    function () {
      if (formState?.success === true) {
        setSigningIn(true);
        router.push(Routes_AfterLogin_redirect);
      }
    },
    [formState, router],
  );
  // ...............................................................
  // Handle error message - ensure signingIn is false
  // ...............................................................
  useEffect(
    function () {
      if (errorMessage) {
        setSigningIn(false);
      }
    },
    [errorMessage],
  );
  // ...............................................................
  // Delete any existing cookies
  // ...............................................................
  useEffect(function () {
    cookie_delete();
  }, []);
  // ...............................................................
  // Only clear form errors when the email actually changes
  // ...............................................................
  useEffect(
    function () {
      if (formState?.message && formState.message !== 'LOGIN_SUCCESS') {
        formState.message = null;
      }
    },
    [email, formState],
  );
  // -------------------------------------------------------------------------
  //  FINAL RETURN
  // -------------------------------------------------------------------------
  return renderForm();

  // -------------------------------------------------------------------------
  //  renderForm - Returns the complete form JSX (TOP LEVEL)
  // -------------------------------------------------------------------------
  function renderForm() {
    return (
      <form action={formAction} className="space-y-3" onSubmit={onSubmit_login}>
        <div className="flex-1 rounded-lg px-4 pb-4 pt-6">
          <div className='mb-6'>
            <h1 className={`${lusitana.className} text-2xl text-orange-500`}>
              {signingIn ? 'Signing In...' : 'Login'}
            </h1>
          </div>
          {renderContent()}
        </div>
      </form>
    );
  }
  // -------------------------------------------------------------------------
  //  renderContent - Returns the main content based on signing in state using JSX conditional rendering
  // -------------------------------------------------------------------------
  function renderContent() {
    return (
      <>
        {signingIn && (
          <MyLoadingMessage
            message1="Please wait.."
            message2="Signin in progress"
          />
        )}
        {!signingIn && (
          <>
            {showSocialButtons() && <Socials setSigningIn={setSigningIn} />}
            <GuestLogin setSigningIn={setSigningIn} />
            {renderCredentials()}
          </>
        )}
      </>
    );
  }

  // -------------------------------------------------------------------------
  //  renderCredentials - Returns credentials form JSX
  // -------------------------------------------------------------------------
  function renderCredentials() {
    const accountMessage = getAccountMessage();
    const showPassword = showPasswordField();

    return (
      <div className="bg-teal-50 rounded-lg p-4 mt-6 border border-teal-200">
        <div>
          <p className='text-xs font-semibold text-white bg-teal-600 -mx-4 -mt-4 px-4 py-2 mb-3 rounded-t-lg'>Registered Email</p>
          <label
            className="mb-1 mt-1 block text-xs font-medium text-gray-900"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <MyInput
              overrideClass="peer block w-full"
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              disabled={signingIn}
            />
          </div>

          {/* Show account type message */}
          {accountMessage && (
            <div
              className={`mt-2 rounded-md p-3 ${
                accountMessage.type === 'warning'
                  ? 'bg-amber-50'
                  : accountMessage.type === 'success'
                    ? 'bg-green-50'
                    : 'bg-blue-50'
              }`}
            >
              <p
                className={`text-sm ${
                  accountMessage.type === 'warning'
                    ? 'text-amber-800'
                    : accountMessage.type === 'success'
                      ? 'text-green-800'
                      : 'text-blue-800'
                }`}
              >
                {accountMessage.text}
              </p>
            </div>
          )}

          {/* Manual social login button — shown when email matches a social account */}
          {userInfo.exists &&
            userInfo.provider &&
            userInfo.provider !== 'email' &&
            !signingIn && (
              <MyButton
                overrideClass="mt-3 w-full flex justify-center"
                type="button"
                onClick={function () {
                  setSigningIn(true);
                  socials_signin(
                    userInfo.provider as 'google' | 'github' | 'facebook',
                    setSigningIn,
                  );
                }}
              >
                {`Continue with ${userInfo.provider === 'google' ? 'Google' : userInfo.provider === 'github' ? 'GitHub' : 'Facebook'}`}
              </MyButton>
            )}
        </div>

        {/* Only show password field for email accounts or new users */}
        {showPassword && (
          <div className="mt-2">
            <label
              className="mb-1 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <MyInput
                overrideClass="peer block w-full"
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                disabled={signingIn}
              />
            </div>
          </div>
        )}

        <div
          className="flex h-4 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && !signingIn && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>

        {/* Only show login button for email accounts, hide for social accounts */}
        {showPassword && (
          <MyButton
            overrideClass="mt-1 w-full flex justify-center"
            type="submit"
            disabled={signingIn}
          >
            Login
          </MyButton>
        )}
        {!signingIn && (
          <div className='mt-4 flex justify-center'>
            <button
              type='button'
              onClick={function () { router.push('/register') }}
              className='text-xs italic font-bold text-black hover:text-gray-700'
            >
              not Registered click here
            </button>
          </div>
        )}
      </div>
    );
  }


  // -------------------------------------------------------------------------
  // Clear any existing error message
  // -------------------------------------------------------------------------
  function onSubmit_login() {
    if (formState) formState.message = null;
  }
  // -------------------------------------------------------------------------
  // Handle email change and check account type
  // -------------------------------------------------------------------------
  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newEmail = e.target.value;
    setEmail(newEmail);
    //
    // Clear user info if email is empty or missing @
    //
    if (!newEmail || !newEmail.includes('@')) {
      setUserInfo({ exists: false });
      previousEmailRef.current = newEmail;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }
    //
    // Only check if email has changed
    //
    if (newEmail === previousEmailRef.current) {
      return;
    }
    previousEmailRef.current = newEmail;
    //
    // Debounce: wait 300 ms after typing stops before querying
    //
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const rows = await table_fetch({
          caller: functionName,
          table: 'tus_users',
          whereColumnValuePairs: [{ column: 'us_email', value: newEmail }],
        } as table_fetch_Props);

        const userRecord: table_Users | undefined = rows[0];

        if (!userRecord) {
          setUserInfo({ exists: false });
        } else {
          const provider = userRecord.us_provider as ProviderType;
          setUserInfo({ exists: true, provider });
        }
      } catch (error) {
        console.error('Error checking email:', error);
        setUserInfo({ exists: false });
      }
    }, 300);
  }
  // -------------------------------------------------------------------------
  // Determine if password field should be shown (only for email accounts)
  // -------------------------------------------------------------------------
  function showPasswordField(): boolean {
    if (!userInfo.exists) return true;
    return userInfo.provider === 'email';
  }
  // -------------------------------------------------------------------------
  // Determine if social buttons should be shown
  // -------------------------------------------------------------------------
  function showSocialButtons(): boolean {
    if (!userInfo.exists) return true;
    return userInfo.provider !== 'email';
  }

  // -------------------------------------------------------------------------
  // Get the appropriate message based on account type
  // -------------------------------------------------------------------------
  function getAccountMessage(): {
    type: 'warning' | 'success' | 'info';
    text: string;
  } | null {
    if (!userInfo.exists) return null;

    switch (userInfo.provider) {
      case 'email':
        return {
          type: 'success',
          text: '✓ Email found. Enter your password to login.',
        };
      case 'google':
        return {
          type: 'info',
          text: 'This account uses Google sign-in.',
        };
      case 'github':
        return {
          type: 'info',
          text: 'This account uses GitHub sign-in.',
        };
      case 'facebook':
        return {
          type: 'info',
          text: 'This account uses Facebook sign-in.',
        };
      default:
        console.error(`Unexpected provider type: ${userInfo.provider}`);
        return {
          type: 'warning',
          text: 'Unable to authenticate. Please contact support.',
        };
    }
  }
}
