'use client'
import NavTop from '@/src/ui/dashboard/dashboardMenu/NavTop'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-1 min-h-0 flex-col pb-6'>
      <NavTop baseURL='dashboard' />
      <main className='flex-grow flex flex-col overflow-hidden m-2'>{children}</main>
    </div>
  )
}
