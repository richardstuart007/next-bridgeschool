import '@/src/root/global.css'

import { inter } from '@/src/root/constants/constants_fonts'
import { Metadata } from 'next'
import { UserProvider } from '@/src/context/UserContext'
import { URL_current } from '@/src/root/constants/constants_URL'

//
//  Metadata
//
export const metadata: Metadata = {
  title: {
    template: '%s | Bridge School Dashboard',
    default: 'Bridge School Dashboard'
  },
  description: 'nextjs15 Bridge School.',
  metadataBase: new URL(URL_current)
}

//
//  Environment flags
//
const NEXT_PUBLIC_APPENV_ISDEV = process.env.NEXT_PUBLIC_APPENV_ISDEV === 'true'

const DB_LOCATION = process.env.POSTGRES_DATABASE_LOCATION ?? 'unknown'

//
//  Root Layout (MUST remain static with cacheComponents)
//
export default function RootLayout({ children }: { children: React.ReactNode }) {
  //
  // Map DB location to colours
  //
  type Database = 'prod' | 'dev' | 'local' | 'unknown'

  const DatabaseColors: Record<Database, string> = {
    prod: 'bg-blue-100',
    dev: 'bg-yellow-100',
    local: 'bg-green-100',
    unknown: 'bg-red-100'
  }

  const DatabaseBadgeColors: Record<Database, string> = {
    prod: 'bg-blue-200 text-blue-800',
    dev: 'bg-yellow-200 text-yellow-800',
    local: 'bg-green-200 text-green-800',
    unknown: 'bg-red-200 text-red-800'
  }

  const backgroundColor = DatabaseColors[DB_LOCATION as Database] ?? 'bg-red-100'
  const badgeColor = DatabaseBadgeColors[DB_LOCATION as Database] ?? 'bg-red-200 text-red-800'

  const classNameColour = `${inter.className} antialiased ${backgroundColor}`

  return (
    <html lang='en'>
      <body className={`${classNameColour} px-2 py-1 overflow-hidden max-w-full`}>
        {NEXT_PUBLIC_APPENV_ISDEV && (
          <div className={`fixed top-2 right-2 z-50 rounded ${badgeColor} px-2 py-0.5 text-xxs font-bold opacity-70`}>
            {DB_LOCATION}
          </div>
        )}

        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
