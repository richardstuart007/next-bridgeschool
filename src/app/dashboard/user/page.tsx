import Form from '@/src/ui/dashboard/users/form'
import { Metadata } from 'next'
import { fetch_SessionInfo } from '@/src/lib/tables/tableSpecific/fetch_SessionInfo'
import { table_fetch, table_fetch_Props } from 'nextjs-shared/table_fetch'
import { table_Users } from '@/src/lib/tables/definitions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'User'
}

export default async function Page() {
  const functionName = 'UserPage'

  let si_usid = 0
  let initialUserData: table_Users | undefined
  let initialOwner = ''

  try {
    const sessionInfo = await fetch_SessionInfo({ caller: functionName })
    si_usid = sessionInfo?.si_usid ?? 0

    if (si_usid) {
      const [userRows, ownerRows] = await Promise.all([
        table_fetch({
          caller: functionName,
          table: 'tus_users',
          whereColumnValuePairs: [{ column: 'us_usid', value: si_usid }]
        } as table_fetch_Props),
        table_fetch({
          caller: functionName,
          table: 'tuo_usersowner',
          whereColumnValuePairs: [{ column: 'uo_usid', value: si_usid }]
        } as table_fetch_Props)
      ])
      initialUserData = userRows[0] as table_Users | undefined
      initialOwner = ownerRows[0]?.uo_owner ?? ''
    }
  } catch (error) {
    console.error(`${functionName}: Error fetching initial data`, error)
  }

  const guestEmails = [process.env.GUEST_RICHARD_EMAIL, process.env.GUEST_NZBRIDGE_EMAIL]
  const isGuest = guestEmails.includes(initialUserData?.us_email)

  return (
    <div className='w-full md:p-6'>
      <Form
        initialUsid={si_usid}
        initialUserData={initialUserData}
        initialOwner={initialOwner}
        isGuest={isGuest}
      />
    </div>
  )
}
