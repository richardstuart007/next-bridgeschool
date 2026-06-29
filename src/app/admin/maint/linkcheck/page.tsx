'use client'

import { useEffect, useState } from 'react'
import { table_fetch, table_fetch_Props } from 'nextjs-shared/table_fetch'
import { MyButton } from 'nextjs-shared/MyButton'

const STORAGE_KEY = 'linkcheck-status'

type RowStatus = 'ok' | 'bad'
type Filter = 'all' | 'unchecked' | 'ok' | 'bad'

type RefRow = {
  rf_rfid: number
  rf_owner: string
  rf_subject: string
  rf_ref: string
  rf_desc: string
  rf_link: string
}

export default function Page() {
  const functionName = 'AdminLinkCheckPage'
  const [rows, setRows] = useState<RefRow[]>([])
  const [status, setStatus] = useState<Record<number, RowStatus>>({})
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await table_fetch({
        caller: functionName,
        table: 'trf_reference'
      } as table_fetch_Props)
      setRows(data as RefRow[])
      //
      //  Restore progress from localStorage
      //
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setStatus(JSON.parse(stored))
        } catch {}
      }
      setLoading(false)
    }
    load()
  }, [])

  //----------------------------------------------------------------------------------------------
  //  setRowStatus — toggle ok/bad; clicking same status again clears back to unchecked
  //----------------------------------------------------------------------------------------------
  function setRowStatus(rfid: number, s: RowStatus) {
    const updated = { ...status }
    if (updated[rfid] === s) {
      delete updated[rfid]
    } else {
      updated[rfid] = s
    }
    setStatus(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }
  //----------------------------------------------------------------------------------------------
  //  handleReset — clear all stored progress
  //----------------------------------------------------------------------------------------------
  function handleReset() {
    localStorage.removeItem(STORAGE_KEY)
    setStatus({})
  }
  //----------------------------------------------------------------------------------------------
  //  openLink — open URL in a named popup window so only one is ever open at a time
  //----------------------------------------------------------------------------------------------
  function openLink(url: string) {
    window.open(url, 'linkpreview', 'width=1000,height=800,left=700,top=50')
  }

  if (loading) return <p className='p-4 text-xxs'>Loading...</p>

  const total = rows.length
  const okCount = rows.filter(r => status[r.rf_rfid] === 'ok').length
  const badCount = rows.filter(r => status[r.rf_rfid] === 'bad').length
  const uncheckedCount = total - okCount - badCount

  const visibleRows = rows.filter(r => {
    const s = status[r.rf_rfid]
    if (filter === 'unchecked') return !s
    if (filter === 'ok') return s === 'ok'
    if (filter === 'bad') return s === 'bad'
    return true
  })

  return (
    <div className='w-full md:p-6'>
      <div className='mt-4 bg-gray-50 rounded-lg shadow-md max-w-full'>
        {/* ................................................... */}
        {/* Header                                            */}
        {/* ................................................... */}
        <div className='px-3 py-1 flex items-center gap-3 bg-blue-200 border-b rounded-t-lg text-xxs'>
          <span className='font-semibold text-red-600 tracking-wide'>Link Check</span>
          <span>Total: {total}</span>
          <span className='text-gray-600'>Unchecked: {uncheckedCount}</span>
          <span className='text-red-600 font-semibold'>Bad: {badCount}</span>
          <span className='text-green-600 font-semibold'>OK: {okCount}</span>
          {/* ................................................... */}
          {/* Filter buttons                                   */}
          {/* ................................................... */}
          <div className='flex gap-1 ml-4'>
            <MyButton
              onClick={() => setFilter('all')}
              overrideClass={`h-5 md:h-5 px-2 text-xxs ${filter === 'all' ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-400 hover:bg-blue-500'}`}
            >
              All
            </MyButton>
            <MyButton
              onClick={() => setFilter('unchecked')}
              overrideClass={`h-5 md:h-5 px-2 text-xxs ${filter === 'unchecked' ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-400 hover:bg-gray-500'}`}
            >
              Unchecked
            </MyButton>
            <MyButton
              onClick={() => setFilter('bad')}
              overrideClass={`h-5 md:h-5 px-2 text-xxs ${filter === 'bad' ? 'bg-red-700 hover:bg-red-800' : 'bg-red-400 hover:bg-red-500'}`}
            >
              Bad
            </MyButton>
            <MyButton
              onClick={() => setFilter('ok')}
              overrideClass={`h-5 md:h-5 px-2 text-xxs ${filter === 'ok' ? 'bg-green-700 hover:bg-green-800' : 'bg-green-400 hover:bg-green-500'}`}
            >
              OK
            </MyButton>
          </div>
          <div className='ml-auto'>
            <MyButton
              onClick={handleReset}
              overrideClass='h-5 md:h-5 px-2 text-xxs bg-gray-500 hover:bg-gray-600'
            >
              Reset
            </MyButton>
          </div>
        </div>
        {/* ................................................... */}
        {/* Table                                             */}
        {/* ................................................... */}
        <div className='overflow-x-auto overflow-y-auto max-h-[75vh]'>
          <table className='min-w-full text-gray-900 table-auto'>
            <thead className='sticky top-0 z-10 bg-gray-50 text-left'>
              <tr className='text-xxs'>
                <th className='px-2 py-1 font-bold'>Owner</th>
                <th className='px-2 py-1 font-bold'>Subject</th>
                <th className='px-2 py-1 font-bold'>Ref</th>
                <th className='px-2 py-1 font-bold'>Description</th>
                <th className='px-2 py-1 font-bold'>Link</th>
                <th className='px-2 py-1 font-bold'></th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {visibleRows.map(r => {
                const s = status[r.rf_rfid]
                const rowClass = s === 'ok' ? 'bg-green-50' : s === 'bad' ? 'bg-red-50' : ''
                const textClass = s === 'ok' ? 'text-green-700' : s === 'bad' ? 'text-red-700' : ''
                return (
                  <tr key={r.rf_rfid} className={`w-full ${rowClass}`}>
                    <td className={`text-xxs px-2 py-1 ${textClass}`}>{r.rf_owner}</td>
                    <td className={`text-xxs px-2 py-1 ${textClass}`}>{r.rf_subject}</td>
                    <td className={`text-xxs px-2 py-1 ${textClass}`}>{r.rf_ref}</td>
                    <td className={`text-xxs px-2 py-1 ${textClass}`}>
                      {r.rf_desc.length > 50 ? r.rf_desc.slice(0, 47) + '...' : r.rf_desc}
                    </td>
                    <td className={`text-xxs px-2 py-1 break-all ${s ? textClass : 'text-blue-700'}`}>
                      {r.rf_link}
                    </td>
                    <td className='px-2 py-1'>
                      <div className='flex gap-1'>
                        <MyButton
                          onClick={() => openLink(r.rf_link)}
                          overrideClass='h-5 md:h-5 px-2 text-xxs bg-blue-500 hover:bg-blue-600'
                        >
                          Open
                        </MyButton>
                        <MyButton
                          onClick={() => setRowStatus(r.rf_rfid, 'ok')}
                          overrideClass={`h-5 md:h-5 px-2 text-xxs ${s === 'ok' ? 'bg-green-700 hover:bg-green-800' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                          OK
                        </MyButton>
                        <MyButton
                          onClick={() => setRowStatus(r.rf_rfid, 'bad')}
                          overrideClass={`h-5 md:h-5 px-2 text-xxs ${s === 'bad' ? 'bg-red-700 hover:bg-red-800' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                          Bad
                        </MyButton>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
