//==============================================================================================
//  1) DESCRIPTION
//    MySchoolLogo — the branded "Bridge School" logo block shown on the register page (hidden
//    on mobile).
//==============================================================================================

import Image from 'next/image'
import { lusitana } from '@/src/root/constants/constants_fonts'

export default function MySchoolLogo() {
  return (
    <div className='mb-2 flex items-center justify-center rounded-md bg-blue-600 p-2 hidden md:flex h-30'>
      <div className={`${lusitana.className} `}>
        <Image src='/logos/bridgelogo.svg' width={270} height={270} priority alt='bridgecards' />
      </div>
    </div>
  )
}
