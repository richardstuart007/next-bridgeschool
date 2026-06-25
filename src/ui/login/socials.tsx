// src/ui/login/socials.tsx
'use client'
import { MyButton } from 'nextjs-shared/MyButton'
import { socials_signin } from './socials_signin'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox='0 0 24 24' className={className} xmlns='http://www.w3.org/2000/svg'>
      <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/>
      <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
      <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/>
      <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' className={className} xmlns='http://www.w3.org/2000/svg'>
      <path d='M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.929.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z'/>
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' className={className} xmlns='http://www.w3.org/2000/svg'>
      <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
    </svg>
  )
}

interface SocialsProps {
  setSigningIn: (signingIn: boolean) => void
}

export default function Socials({ setSigningIn }: SocialsProps) {
  const NEXT_PUBLIC_APPENV_ISDEV = process.env.NEXT_PUBLIC_APPENV_ISDEV === 'true'

  return (
    <div className='bg-teal-50 rounded-lg p-4 mt-6 border border-teal-200'>
      <p className='text-xs font-semibold text-white bg-teal-600 -mx-4 -mt-4 px-4 py-2 mb-3 rounded-t-lg'>Socials</p>
      <div className='flex justify-evenly'>
        <MyButton
          overrideClass='h-16 md:h-16 w-16 border border-amber-300 rounded-lg bg-amber-100 hover:bg-amber-200 text-gray-700 flex items-center justify-center'
          onClick={function (event) {
            event.preventDefault()
            socials_signin('google', setSigningIn)
          }}
        >
          <GoogleIcon className='h-10 w-10' />
        </MyButton>
        <MyButton
          overrideClass='h-16 md:h-16 w-16 border border-[#1877F2] rounded-lg bg-[#1877F2] hover:bg-[#166FE5] text-white flex items-center justify-center'
          onClick={function (event) {
            event.preventDefault()
            socials_signin('facebook', setSigningIn)
          }}
        >
          <FacebookIcon className='h-10 w-10' />
        </MyButton>
        {NEXT_PUBLIC_APPENV_ISDEV && (
          <MyButton
            overrideClass='h-16 md:h-16 w-16 border border-gray-900 rounded-lg bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center'
            onClick={function (event) {
              event.preventDefault()
              socials_signin('github', setSigningIn)
            }}
          >
            <GitHubIcon className='h-10 w-10' />
          </MyButton>
        )}
      </div>
    </div>
  )
}
