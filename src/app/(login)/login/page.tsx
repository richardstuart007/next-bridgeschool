import Image from 'next/image'
import LoginForm from '@/src/ui/login/form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bridge School Login'
}

export default function LoginPage() {
  return (
    <main className='flex min-h-screen flex-col md:flex-row'>
      <div className='hidden md:flex md:w-1/2 flex-col items-center justify-center gap-6 p-12 bg-orange-500'>
        <Image src='/logos/bridgelogo.svg' width={270} height={270} priority alt='bridgecards' />
        <div className='text-center text-white'>
          <p className='mt-2 text-3xl font-bold text-blue-600'>Learn Bridge</p>
          <p className='mt-12 text-3xl font-bold text-green-600'>Quiz Your Knowledge</p>
        </div>
      </div>
      <div className='flex w-full md:w-1/2 items-center justify-center p-6'>
        <div className='w-full max-w-[400px]'>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
