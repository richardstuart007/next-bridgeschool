'use client'

import { useState, useEffect, useRef } from 'react'
import { table_Logging } from '@/src/lib/tables/definitions'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'
import { Filter } from 'nextjs-shared/tableFetchUtils'
import MyPagination from 'nextjs-shared/MyPagination'
import { MyInput } from 'nextjs-shared/MyInput'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'
import { convertUTCtoLocal } from '@/src/lib/convertUTCtoLocal'

interface TableProps {
  initialRows?: table_Logging[]
  initialTotalPages?: number
}
export default function Table({ initialRows, initialTotalPages }: TableProps = {}) {
  const functionName = 'Table_Logging'
  //
  //  Input selection
  //
  const [msg, setmsg] = useState('')
  const [functionname, setfunctionname] = useState('')
  const [severity, setseverity] = useState('')
  //
  //  Show flags
  //
  //
  //  Other state
  //
  const [currentPage, setcurrentPage] = useState(1)
  const [tabledata, settabledata] = useState<table_Logging[]>(initialRows ?? [])
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages ?? 0)
  //......................................................................................
  // Debounce selection
  //......................................................................................
  const prevFilters = useRef({ msg: '', functionname: '', severity: '' })
  //
  //  Debounce message
  //
  const [message, setMessage] = useState('')
  //
  // Adjust currentPage if it exceeds totalPages
  //
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setcurrentPage(totalPages)
  }, [currentPage, totalPages])
  //
  // Debounce filter changes (2 s); page changes are immediate
  //
  useEffect(() => {
    const filtersChanged =
      msg !== prevFilters.current.msg ||
      functionname !== prevFilters.current.functionname ||
      severity !== prevFilters.current.severity
    setMessage(filtersChanged ? 'Applying filters...' : '')
    const timeout = filtersChanged ? 2000 : 1
    const handler = setTimeout(() => {
      prevFilters.current = { msg, functionname, severity }
      fetchdata()
      setMessage('')
    }, timeout)
    return () => clearTimeout(handler)
  }, [msg, functionname, severity, currentPage])
  //----------------------------------------------------------------------------------------------
  // fetchdata
  //----------------------------------------------------------------------------------------------
  async function fetchdata() {
    //
    // Construct filters dynamically from input fields
    //
    const filtersToUpdate: Filter[] = [
      { column: 'lg_msg', value: msg, operator: 'LIKE' },
      { column: 'lg_functionname', value: functionname, operator: 'LIKE' },
      { column: 'lg_severity', value: severity, operator: '=' }
    ]
    //
    // Filter out any entries where `value` is not defined or empty
    //
    const filters = filtersToUpdate.filter(filter => filter.value)

    try {
      //
      //  Table
      //
      const table = 'tlg_logging'
      //
      // Calculate the offset for pagination
      //
      const offset = (currentPage - 1) * ROWS_PER_PAGE
      //
      //  Get data
      //
      const data = await fetchFiltered({
        caller: functionName,
        table,
        filters,
        orderBy: 'lg_lgid DESC',
        limit: ROWS_PER_PAGE,
        offset,
        skipCache: true
      })
      settabledata(data)
      //
      //  Total number of pages
      //
      const fetchedTotalPages = await fetchTotalPages({
        caller: functionName,
        table,
        filters,
        items_per_page: ROWS_PER_PAGE,
        skipCache: true
      })
      setTotalPages(fetchedTotalPages)
      //
      //  Errors
      //
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }
  //----------------------------------------------------------------------------------------------
  // Data loaded
  //----------------------------------------------------------------------------------------------
  return (
    <>
      {/** -------------------------------------------------------------------- */}
      {/** TABLE                                                                */}
      {/** -------------------------------------------------------------------- */}
      <div className='mt-4 bg-gray-50 rounded-lg shadow-md max-w-full'>
        <div className='overflow-x-auto overflow-y-auto max-h-[70vh]'>
        <table className='min-w-full text-gray-900 table-auto'>
          <thead className='sticky top-0 z-10 bg-gray-50 text-left font-normal text-xxs'>
            {/* ---------------------------------------------------------------------------------- */}
            {/** HEADINGS                                                                */}
            {/** -------------------------------------------------------------------- */}
            <tr className=''>
              <th scope='col' className=' font-medium px-2'>
                ID
              </th>
              <th scope='col' className=' font-medium px-2 whitespace-nowrap'>
                Date
              </th>
              <th scope='col' className=' font-medium px-2'>
                Function Name
              </th>
              <th scope='col' className=' font-medium px-2 text-center'>
                Severity
              </th>
              <th scope='col' className=' font-medium px-2'>
                Message
              </th>
            </tr>
            {/* ---------------------------------------------------------------------------------- */}
            {/* DROPDOWN & SEARCHES             */}
            {/* ---------------------------------------------------------------------------------- */}
            <tr className='text-xxs align-bottom'>
              <th scope='col' className='px-2'></th>
              <th scope='col' className='px-2'></th>
              {/* ................................................... */}
              {/* functionname                                                 */}
              {/* ................................................... */}
              <th scope='col' className='px-2'>
                <MyInput
                  id='functionname'
                  name='functionname'
                  overrideClass={`w-28  rounded-md border border-blue-500   font-normal text-xxs`}
                  type='text'
                  value={functionname}
                  onChange={e => {
                    const value = e.target.value
                    setfunctionname(value)
                  }}
                />
              </th>

              {/* ................................................... */}
              {/* severity                                                 */}
              {/* ................................................... */}
              <th scope='col' className='px-2'>
                <div className='text-center'>
                  <MyInput
                    id='severity'
                    name='severity'
                    overrideClass={`w-16  rounded-md border border-blue-500   font-normal text-xxs text-center `}
                    type='text'
                    value={severity}
                    onChange={e => {
                      const value = e.target.value
                      setseverity(value)
                    }}
                  />
                </div>
              </th>
              {/* ................................................... */}
              {/* msg                                                 */}
              {/* ................................................... */}
              <th scope='col' className='px-2'>
                <MyInput
                  id='msg'
                  name='msg'
                  overrideClass={`w-[950px]  rounded-md border border-blue-500   font-normal text-xxs`}
                  type='text'
                  value={msg}
                  onChange={e => {
                    const value = e.target.value
                    setmsg(value)
                  }}
                />
              </th>
            </tr>
          </thead>
          {/* ---------------------------------------------------------------------------------- */}
          {/* BODY                                 */}
          {/* ---------------------------------------------------------------------------------- */}
          <tbody className='bg-white text-xxs'>
            {tabledata && tabledata.length > 0 ? (
              tabledata?.map(tabledata => (
                <tr key={tabledata.lg_lgid} className='w-full border-b'>
                  <td className='px-2 text-xxs '>{tabledata.lg_lgid}</td>
                  <td className='px-2 text-xxs whitespace-nowrap'>
                    {convertUTCtoLocal({ datetimeUTC: tabledata.lg_datetime, to_dateFormat: 'yyyy-MM-dd HH:mm' })}
                  </td>
                  <td className='px-2 text-xxs '>{tabledata.lg_functionname}</td>
                  <td className='px-2 text-center text-xxs  '>{tabledata.lg_severity}</td>
                  <td className='px-2 text-xxs '>{tabledata.lg_msg}</td>
                  {/* ---------------------------------------------------------------------------------- */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No data available</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
      {/* ---------------------------------------------------------------------------------- */}
      {/* Message               */}
      {/* ---------------------------------------------------------------------------------- */}
      <p className='text-red-600'>{message}</p>
      {/* ---------------------------------------------------------------------------------- */}
      {/* MyPagination                */}
      {/* ---------------------------------------------------------------------------------- */}
      <div className='mt-5 flex w-full justify-center'>
        <MyPagination
          totalPages={totalPages}
          statecurrentPage={currentPage}
          setStateCurrentPage={setcurrentPage}
        />
      </div>
      {/* ---------------------------------------------------------------------------------- */}
    </>
  )
}
