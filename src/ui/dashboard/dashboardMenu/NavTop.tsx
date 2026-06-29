'use client'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import NavDrawer from '@/src/ui/dashboard/dashboardMenu/NavDrawer'

interface Props {
  baseURL: string
}

const BACK_ROUTES: Record<string, string> = {
  '/dashboard/reference_select': '/dashboard',
  '/dashboard/quiz-review':      '/dashboard/history',
  '/dashboard/quiz':             '/dashboard',
  '/dashboard/history':          '/dashboard',
  '/dashboard/graphs':           '/dashboard',
  '/dashboard/user':             '/dashboard',
  '/dashboard/colourtest':       '/dashboard',
}

export default function NavTop(props: Props) {
  const { baseURL } = props
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const backDestination = Object.entries(BACK_ROUTES).find(([r]) => pathname.startsWith(r))?.[1]

  useEffect(() => {
    //
    //  Close drawer on Escape key
    //
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <div className='flex items-center border-b border-gray-200 px-4 py-2'>
        <button
          onClick={() => setDrawerOpen(true)}
          className='flex h-10 w-10 items-center justify-center rounded hover:bg-gray-100'
          aria-label='Open menu'
        >
          <Bars3Icon className='h-6 w-6 text-gray-700' />
        </button>
        {backDestination && (
          <button
            onClick={() => router.push(backDestination)}
            className='flex h-10 w-10 items-center justify-center rounded hover:bg-gray-100'
            aria-label='Go back'
          >
            <ArrowLeftIcon className='h-5 w-5 text-gray-700' />
          </button>
        )}
        <span className='ml-3 text-sm font-semibold text-gray-700'>Bridge School</span>
      </div>
      <NavDrawer baseURL={baseURL} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
