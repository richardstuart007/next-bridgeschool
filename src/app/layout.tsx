import '@/src/root/global.css'

import { inter } from '@/src/root/constants/constants_fonts'
import { DevHeader } from '@/src/ui/DevHeader'
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

  const backgroundColor = DatabaseColors[DB_LOCATION as Database] ?? 'bg-red-100'

  const classNameColour = `${inter.className} antialiased ${backgroundColor}`

  return (
    <html lang='en'>
      <body className={`${classNameColour} px-2 py-1 overflow-hidden max-w-full`}>
        {NEXT_PUBLIC_APPENV_ISDEV && <DevHeader dbLocation={DB_LOCATION} />}

        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
