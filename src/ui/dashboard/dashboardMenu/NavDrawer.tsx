'use client'
import { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import NavLinks from '@/src/ui/dashboard/dashboardMenu/nav-links'
import NavSession from '@/src/ui/dashboard/dashboardMenu/nav-session'
import { useUserContext } from '@/src/context/UserContext'
import { getAuthSession } from '@/src/lib/dataAuth/getAuthSession'
import { fetch_SessionInfo } from '@/src/lib/tables/tableSpecific/fetch_SessionInfo'
import { structure_SessionsInfo } from '@/src/lib/tables/structures'
import { user_Logout } from '@/src/lib/user_logout'
import { MyButton } from 'nextjs-shared/MyButton'
import { table_fetch, table_fetch_Props } from 'nextjs-shared/table_fetch'
import NavShrink from '@/src/ui/dashboard/dashboardMenu/nav-shrink'
import NavDetail from '@/src/ui/dashboard/dashboardMenu/nav-detail'

interface Props {
  baseURL: string
  isOpen: boolean
  onClose: () => void
}

export default function NavDrawer(props: Props) {
  const functionName = 'NavDrawer'
  const { baseURL, isOpen, onClose } = props
  //
  //  User context
  //
  const { sessionContext, setSessionContext } = useUserContext()
  //
  //  Session info
  //
  const [sessionInfo, setSessionInfo] = useState<structure_SessionsInfo | undefined>(undefined)
  const [dbName, setDbName] = useState<string>('')
  //
  //  Shrink
  //
  const [shrink, setShrink] = useState(false)

  useEffect(() => {
    getSessionInfo()
  }, [])

  //----------------------------------------------------------------------------------------------
  //  getSessionInfo — loads db name, auth session and user session row into state and context
  //----------------------------------------------------------------------------------------------
  async function getSessionInfo() {
    const rows = await table_fetch({
      caller: functionName,
      table: 'tdb_database',
      whereColumnValuePairs: [{ column: 'db_dbid', value: 1 }]
    } as table_fetch_Props)
    const row = rows[0]
    const tdb_database = row?.db_name ?? 'unknown'
    setDbName(tdb_database)

    const authSession = await getAuthSession()
    const au_ssid = authSession?.user?.au_ssid

    if (au_ssid) {
      const SessionInfo = await fetch_SessionInfo({ caller: functionName })
      setSessionContext(prev => ({
        ...prev,
        cx_usid: SessionInfo.si_usid,
        cx_ssid: SessionInfo.si_ssid,
        cx_dbName: tdb_database
      }))
      setSessionInfo(SessionInfo)
    }
  }

  useEffect(() => {
    setShrink(sessionContext.cx_shrink)
  }, [sessionContext])

  const overrideClass_logoff =
    'text-white h-10 md:h-10 text-sm bg-gray-700 hover:bg-gray-800 hover:text-red-600 w-full justify-center'

  return (
    <>
      {/* Backdrop — closes drawer on click */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Drawer panel — slides in from left */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-xl transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header row with close button */}
        <div className='flex items-center justify-end border-b border-gray-200 px-4 py-2'>
          <MyButton
            onClick={onClose}
            aria-label='Close menu'
            overrideClass='h-10 md:h-10 w-10 px-0 md:px-0 rounded bg-transparent hover:bg-gray-100'
          >
            <XMarkIcon className='h-5 w-5 text-gray-700' />
          </MyButton>
        </div>
        {/* Nav content — only rendered once session is loaded */}
        {sessionInfo && (
          <div className='flex flex-grow flex-col gap-3 overflow-y-auto p-4'>
            {/* Clicking any nav link also closes the drawer */}
            <div className='flex flex-col gap-2' onClick={onClose}>
              <NavLinks sessionInfo={sessionInfo} baseURL={baseURL} shrink={shrink} />
            </div>
            <NavSession sessionInfo={sessionInfo} dbName={dbName} shrink={shrink} />
            <NavShrink />
            <NavDetail />
            <div className='mt-auto'>
              <MyButton onClick={user_Logout} overrideClass={overrideClass_logoff}>
                Logoff
              </MyButton>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
