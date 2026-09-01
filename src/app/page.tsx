//==============================================================================================
//  1) DESCRIPTION
//    Page — the site root '/': immediately redirects to /login.
//==============================================================================================

import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/login')
}
