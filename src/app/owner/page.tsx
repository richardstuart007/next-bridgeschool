'use client'
import { useState, Suspense } from 'react'
import OwnerTableCache from 'nextjs-shared/OwnerTableCache'
import OwnerTableLogging from 'nextjs-shared/OwnerTableLogging'

const TABS = ['Logging', 'Cache'] as const
type Tab = typeof TABS[number]

export default function OwnerPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Logging')

  return (
    <div>
      <nav className='flex gap-6 px-8 pt-6 pb-0 border-b border-gray-200 text-sm'>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? 'pb-2 border-b-2 border-gray-900 text-gray-900 font-medium'
                : 'pb-2 text-gray-500 hover:text-gray-700'
            }
          >
            {tab}
          </button>
        ))}
      </nav>
      <Suspense>
        {activeTab === 'Logging' && <OwnerTableLogging />}
        {activeTab === 'Cache' && <OwnerTableCache />}
      </Suspense>
    </div>
  )
}
