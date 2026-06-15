'use client'
import { MyLink } from 'nextjs-shared/MyLink'
import { fetch_IsAdmin } from '@/src/lib/tables/tableSpecific/fetch_IsAdmin'
import { user_Logout } from '@/src/lib/user_logout'
import { useEffect, useState } from 'react'

type MenuItem = { key: string; href: string; label: string } | null

const menuItems: MenuItem[] = [
  { key: 'owner',             href: '/admin/maint/owner',           label: 'Owner' },
  { key: 'subject',           href: '/admin/maint/subject',         label: 'Owner Subject' },
  null,
  null,
  // ----
  null,
  { key: 'reference',        href: '/admin/maint/reference',       label: 'Reference' },
  { key: 'who',              href: '/admin/maint/who',             label: 'Who' },
  { key: 'reftype',          href: '/admin/maint/reftype',         label: 'Reftype' },
  // ----
  null,
  { key: 'questions',        href: '/admin/maint/questions',       label: 'Questions' },
  null,
  null,
  // ----
  { key: 'users',            href: '/admin/maint/users',           label: 'Users' },
  { key: 'usersowner',       href: '/admin/maint/usersowner',      label: 'Users Owner' },
  null,
  null,
  // ----
  null,
  null,
  null,
  null,
  // ----
  { key: 'logging',          href: '/admin/maint/logging',         label: 'Logging' },
  { key: 'sessions',         href: '/admin/maint/sessions',        label: 'Sessions' },
]

export default function Page() {
  const functionName = 'Menu_Page'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await fetch_IsAdmin(functionName)
      if (!admin) {
        await user_Logout()
      } else {
        setLoading(false)
      }
    }
    checkAdmin()
  }, [])

  if (loading) return <p className='text-xs'>Loading....</p>

  return (
    <>
      <div className='bg-gray-100 p-3 w-max'>
        <div className='inline-grid grid-cols-4 gap-y-6 gap-x-8'>
          {menuItems.map((item, i) =>
            item ? (
              <MyLink
                key={item.key}
                href={{ pathname: item.href, reference: item.key }}
                overrideClass='w-36 justify-center'
                caller={functionName}
              >
                {item.label}
              </MyLink>
            ) : (
              <div key={i} className='w-36' />
            )
          )}
        </div>
      </div>
    </>
  )
}
