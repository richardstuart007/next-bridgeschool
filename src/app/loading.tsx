//==============================================================================================
//  1) DESCRIPTION
//    Loading — Next.js route-level loading fallback: a centred "Loading..." line.
//==============================================================================================

export default function Loading() {
  return (
    <div className='flex h-full items-center justify-center'>
      <p className='text-xs text-gray-500'>Loading...</p>
    </div>
  )
}
