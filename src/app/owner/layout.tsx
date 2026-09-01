//==============================================================================================
//  1) DESCRIPTION
//    Layout — /owner layout: delegates entirely to nextjs-shared's <OwnerLayout>.
//
//    Parameters:
//      children — the routed /owner page
//==============================================================================================

import OwnerLayout from 'nextjs-shared/OwnerLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <OwnerLayout>{children}</OwnerLayout>
}
