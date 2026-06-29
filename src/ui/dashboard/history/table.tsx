'use client'

import { useState, useEffect, useRef } from 'react'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'
import type { Filter, JoinParams } from 'nextjs-shared/structures'
import MyPagination from 'nextjs-shared/MyPagination'
import MyDropdown from 'nextjs-shared/MyDropdown'
import { useUserContext } from '@/src/context/UserContext'
import { MyLink } from 'nextjs-shared/MyLink'
import { MyInput } from 'nextjs-shared/MyInput'
import { convertUTCtoLocal } from '@/src/lib/convertUTCtoLocal'
import { table_fetch, table_fetch_Props } from 'nextjs-shared/table_fetch'
import { table_UsershistorySubjectUser } from '@/src/lib/tables/definitions'
import { getWidthNumber } from 'nextjs-shared/widthUtils'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'

interface TableProps {
  fixedUsid?: number
  fixedUserName?: string
  initialUsid?: number
  initialCountryCode?: string
  initialOwners?: { uo_owner: string }[]
  initialRows?: table_UsershistorySubjectUser[]
  initialTotalPages?: number
}

export default function Table_History({
  fixedUsid,
  fixedUserName,
  initialUsid,
  initialCountryCode,
  initialOwners,
  initialRows,
  initialTotalPages
}: TableProps = {}) {
  const functionName = 'Table_History'
  //
  //  User context
  //
  const { sessionContext } = useUserContext()
  const initOwner = initialOwners?.length === 1 ? initialOwners[0].uo_owner : ''
  const ref_selected_uoowner = useRef(initOwner)
  const ref_selected_cx_usid = useRef(initialUsid ?? 0)
  const [countryCode, setcountryCode] = useState(initialCountryCode ?? '')
  const [initialisationCompleted, setinitialisationCompleted] = useState(false)
  //
  //  Input selection
  //
  const [usid, setusid] = useState<number | string>(fixedUsid ?? initialUsid ?? '')
  const [owner, setowner] = useState<string | number>(initOwner)
  const [subject, setsubject] = useState<string | number>('')
  const [title, settitle] = useState('')
  const [hsid, sethsid] = useState<number | string>('')
  const [name, setname] = useState('')
  const [questions, setquestions] = useState<number | string>('')
  const [correct, setcorrect] = useState<number | string>('')
  const [sbid, setsbid] = useState<number | string>('')
  const [rfid, setrfid] = useState<number | string>('')
  //
  //  Header show
  //
  const [show_h_owner, setshow_h_owner] = useState(false)
  //
  //  Table show
  //
  const [show_sbid, setshow_sbid] = useState(false)
  const [show_rfid, setshow_rfid] = useState(false)
  const [show_owner, setshow_owner] = useState(false)
  const [show_subject, setshow_subject] = useState(false)
  const [show_hsid, setshow_hsid] = useState(false)
  const [show_usid, setshow_usid] = useState(false)
  const [show_title, setshow_title] = useState(false)
  const [show_name, setshow_name] = useState(false)
  const [show_questions, setshow_questions] = useState(false)
  const [show_correct, setshow_correct] = useState(false)
  const [show_datetime, setshow_datetime] = useState(false)
  const [ref_to_dateFormat, setref_to_dateFormat] = useState('MMM-dd')
  //
  //  Other state
  //
  const [currentPage, setcurrentPage] = useState(1)
  const [tabledata, settabledata] = useState<table_UsershistorySubjectUser[]>(initialRows ?? [])
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages ?? 0)
  //
  //  Shrink/Detail
  //
  const [shrink, setshrink] = useState(false)
  const [shrink_Text, setshrink_Text] = useState('text-xxs md:text-xs')
  //......................................................................................
  //  cx_usid - Mandatory to continue
  //......................................................................................
  useEffect(() => {
    //
    //  Initialisation
    //
    const initialiseData = async () => {
      //
      //  Get user from context
      //
      if (sessionContext?.cx_usid) {
        ref_selected_cx_usid.current = sessionContext.cx_usid
        //
        //  Set Shrink
        //
        const cx_shrink = sessionContext.cx_shrink
        setshrink(cx_shrink)
        if (cx_shrink) {
          setshrink_Text('text-xxs')
        } else {
          setshrink_Text('text-xxs md:text-xs')
        }
        //
        //  Get users country code
        //
        if (!initialisationCompleted) {
          if (!initialCountryCode) {
            const rows = await table_fetch({
              caller: functionName,
              table: 'tus_users',
              whereColumnValuePairs: [{ column: 'us_usid', value: ref_selected_cx_usid.current }]
            } as table_fetch_Props)
            const userRecord = rows[0]
            setcountryCode(userRecord.us_fedcountry)
          }
          if (!initialOwners?.length) {
            await fetchUserOwner()
          }
        }
        //
        //  Header info
        //
        const cx_detail = sessionContext.cx_detail
        const shouldShowHeaderOwner = !!(ref_selected_uoowner.current && cx_detail)
        setshow_h_owner(shouldShowHeaderOwner)
        //
        //  Update Columns and rows
        //
        updateColumns(cx_detail, !!fixedUsid)
        //
        //  Allow fetch of data
        //
        setinitialisationCompleted(true)
      }
    }
    //
    //  Call the async function
    //
    initialiseData()
  }, [sessionContext])
  //......................................................................................
  // Debounce selection
  //......................................................................................
  const prevFilters = useRef({
    owner: '' as string | number,
    subject: '' as string | number,
    hsid: 0,
    sbid: 0,
    rfid: 0,
    title: '',
    usid: 0,
    name: '',
    questions: 0,
    correct: 0
  })
  //
  //  Debounce message
  //
  const [message, setMessage] = useState('')
  //
  //  First render do not debounce
  //
  const firstRender = useRef(true)
  //
  // Debounce the state
  //
  useEffect(() => {
    //
    //  Initialisation not complete
    //
    if (!initialisationCompleted) return
    //
    // Adjust currentPage if it exceeds totalPages
    //
    if (currentPage > totalPages && totalPages > 0) setcurrentPage(totalPages)
    //
    //  Reset subject if Owner changes
    //
    if (owner !== prevFilters.current.owner && subject) setsubject('')
    //
    //  Debounce Message
    //
    setMessage('Debouncing...')
    //
    const prev = prevFilters.current
    // Input change
    //
    const inputChange =
      subject !== prev.subject ||
      Number(sbid) !== prev.sbid ||
      Number(rfid) !== prev.rfid ||
      Number(hsid) !== prev.hsid ||
      title !== prev.title ||
      Number(usid) !== prev.usid ||
      name !== prev.name ||
      Number(questions) !== prev.questions ||
      Number(correct) !== prev.correct
    //
    // Dropdown change
    //
    const dropdownChange = owner !== prev.owner || subject !== prev.subject
    //
    // Determine debounce time
    //
    const timeout = firstRender.current ? 1 : inputChange ? 1000 : dropdownChange ? 200 : 1
    //
    //  Debounce
    //
    const handler = setTimeout(() => {
      prevFilters.current = {
        owner,
        subject,
        hsid: Number(hsid),
        sbid: Number(sbid),
        rfid: Number(rfid),
        title,
        usid: Number(usid),
        name,
        questions: Number(questions),
        correct: Number(correct)
      }
      //
      //  Default timeout after first render
      //
      firstRender.current = false
      //
      //  Fetch the data
      //
      fetchdata()
    }, timeout)
    //
    // Cleanup the timeout on change
    //
    return () => {
      clearTimeout(handler)
    }
  }, [
    usid,
    name,
    owner,
    subject,
    questions,
    title,
    hsid,
    sbid,
    rfid,
    correct,
    currentPage,
    initialisationCompleted
  ])
  //----------------------------------------------------------------------------------------------
  // fetch Owner for a user
  //----------------------------------------------------------------------------------------------
  async function fetchUserOwner() {
    //
    //  Already set
    //
    if (initialisationCompleted) return
    //
    //  Continue
    //
    try {
      //
      //  Set the owner if only 1
      //
      const rows = await table_fetch({
        caller: functionName,
        table: 'tuo_usersowner',
        whereColumnValuePairs: [{ column: 'uo_usid', value: ref_selected_cx_usid.current }]
      } as table_fetch_Props)
      if (rows.length === 1) {
        const uo_owner = rows[0].uo_owner
        ref_selected_uoowner.current = uo_owner
        setowner(uo_owner)
      }
      //
      //  Errors
      //
    } catch (error) {
      console.error('Error fetching tuo_usersowner:', error)
    }
  }
  //----------------------------------------------------------------------------------------------
  // fetchdata
  //----------------------------------------------------------------------------------------------
  async function fetchdata() {
    //
    //  Message
    //
    setMessage('Applying filters...')
    //
    // Construct filters dynamically from input fields
    //
    const filtersToUpdate: Filter[] = [
      { column: 'hs_usid', value: usid, operator: '=' },
      { column: 'hs_owner', value: owner, operator: '=' },
      { column: 'hs_subject', value: subject, operator: '=' },
      { column: 'sb_title', value: title, operator: 'LIKE' },
      { column: 'hs_hsid', value: hsid, operator: '=' },
      { column: 'hs_questions', value: questions, operator: '>=' },
      { column: 'hs_correctpercent', value: correct, operator: '>=' },
      { column: 'us_name', value: name, operator: 'LIKE' },
      { column: 'hs_sbid', value: sbid, operator: '=' },
      { column: 'hs_rfid', value: rfid, operator: '=' }
    ]
    //
    // Filter out any entries where `value` is not defined or empty
    //
    const filters = filtersToUpdate.filter(filter => filter.value)

    try {
      //
      //  Table
      //
      const table = 'ths_history'
      //
      //  Joins
      //
      const joins: JoinParams[] = [
        { table: 'tsb_subject', on: 'hs_sbid = sb_sbid' },
        { table: 'tus_users', on: 'hs_usid = us_usid' }
      ]
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
        joins,
        filters,
        orderBy: 'hs_hsid DESC',
        limit: ROWS_PER_PAGE,
        offset
      })
      settabledata(data)
      //
      //  Total number of pages
      //
      const fetchedTotalPages = await fetchTotalPages({
        caller: functionName,
        table,
        joins,
        filters,
        items_per_page: ROWS_PER_PAGE
      })
      setTotalPages(fetchedTotalPages)
      //
      // Reset message after debounce completes
      //
      setMessage('')
      //
      //  Errors
      //
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }
  //----------------------------------------------------------------------------------------------
  //  Width - update columns
  //----------------------------------------------------------------------------------------------
  function updateColumns(cx_detail: boolean, isFixedUser: boolean) {
    const w = getWidthNumber()
    setshow_title(false)
    setshow_datetime(false)
    setshow_correct(false)
    setshow_name(false)
    setshow_owner(false)
    setshow_subject(false)
    setshow_questions(false)
    setshow_hsid(false)
    setshow_sbid(false)
    setshow_rfid(false)
    setshow_usid(false)
    setref_to_dateFormat('MMM-dd')
    if (w >= 1) {
      setshow_title(true)
      setshow_datetime(true)
    }
    if (w >= 2) {
      setshow_correct(true)
      setref_to_dateFormat('yy-MMM-dd HH:mm')
    }
    if (w >= 3 && cx_detail && !isFixedUser) setshow_name(true)
    if (w >= 4) {
      if (!ref_selected_uoowner.current) setshow_owner(true)
      if (cx_detail) setshow_subject(true)
    }
    if (w >= 5 && cx_detail) {
      setshow_questions(true)
      if (!isFixedUser) {
        setshow_hsid(true)
        setshow_sbid(true)
        setshow_rfid(true)
        setshow_usid(true)
      }
    }
  }
  //----------------------------------------------------------------------------------------------
  // Render selection
  //----------------------------------------------------------------------------------------------
  function render_selection() {
    return (
      <div
        className={`px-4 py-2 flex items-center justify-between bg-blue-200 border-b
              rounded-t-lg ${shrink_Text}`}
      >
        <div className='font-semibold text-red-600 tracking-wide'>
          Quiz History{fixedUserName ? ` — ${fixedUserName}` : ''}
        </div>

        {show_h_owner && (
          <div>
            <span className='font-semibold'>Owner: </span>
            <span className='font-medium'>{owner}</span>
          </div>
        )}
      </div>
    )
  }
  //----------------------------------------------------------------------------------------------
  // Render table header row 1
  //----------------------------------------------------------------------------------------------
  function render_tr1() {
    return (
      <tr className={`${shrink_Text}`}>
        {show_owner && (
          <th scope='col' className=' font-bold px-2'>
            Owner
          </th>
        )}
        {show_subject && (
          <th scope='col' className=' font-bold px-2'>
            Subject
          </th>
        )}
        {show_sbid && (
          <th scope='col' className=' font-bold px-2 text-center'>
            sbid
          </th>
        )}
        {show_rfid && (
          <th scope='col' className=' font-bold px-2 text-center'>
            rfid
          </th>
        )}
        {show_hsid && (
          <th scope='col' className=' font-bold px-2 text-center'>
            hsid
          </th>
        )}
        {show_datetime && (
          <th scope='col' className=' font-bold px-2'>
            Date
          </th>
        )}
        {show_title && (
          <th scope='col' className=' font-bold px-2'>
            Title
          </th>
        )}
        {show_usid && (
          <th scope='col' className=' font-bold px-2 text-center'>
            usid
          </th>
        )}
        {show_name && (
          <th scope='col' className=' font-bold px-2'>
            User-Name
          </th>
        )}
        {show_questions && (
          <th scope='col' className=' font-bold px-2 text-center'>
            Questions
          </th>
        )}
        {show_correct && (
          <th scope='col' className=' font-bold px-2 text-center'>
            %
          </th>
        )}
        <th scope='col' className=' font-bold px-2 text-center'>
          Review
        </th>
        <th scope='col' className=' font-bold px-2 text-center'>
          Quiz
        </th>
      </tr>
    )
  }
  //----------------------------------------------------------------------------------------------
  // Render table header row 2
  //----------------------------------------------------------------------------------------------
  function render_tr2() {
    return (
      <tr className={`align-bottom ${shrink_Text}`}>
        {/* ................................................... */}
        {/* OWNER                                                 */}
        {/* ................................................... */}
        {show_owner && (
          <th scope='col' className='px-2'>
            <MyDropdown
              selectedOption={owner}
              setSelectedOption={setowner}
              searchEnabled={false}
              name='owner'
              table='tuo_usersowner'
              tableColumn='uo_usid'
              tableColumnValue={sessionContext.cx_usid}
              optionLabel='uo_owner'
              optionValue='uo_owner'
              overrideClass_Dropdown={
                shrink ? `h-5 w-24 ${shrink_Text}` : `h-6 md:h-6 w-28 ${shrink_Text}`
              }
              includeBlank={true}
            />
          </th>
        )}
        {/* ................................................... */}
        {/* SUBJECT                                                 */}
        {/* ................................................... */}
        {show_subject && (
          <th scope='col' className=' px-2'>
            {owner === undefined || owner === '' ? null : (
              <MyDropdown
                selectedOption={subject}
                setSelectedOption={setsubject}
                name='subject'
                table='tsb_subject'
                tableColumn='sb_owner'
                tableColumnValue={owner}
                optionLabel='sb_title'
                optionValue='sb_subject'
                overrideClass_Dropdown={
                  shrink ? `h-5 w-28 ${shrink_Text}` : `h-6 md:h-6 w-36 ${shrink_Text}`
                }
                includeBlank={true}
              />
            )}
          </th>
        )}
        {/* ................................................... */}
        {/* sbid                                                 */}
        {/* ................................................... */}
        {show_sbid && (
          <th scope='col' className='px-2 text-center'>
            <MyInput
              id='sbid'
              name='sbid'
              overrideClass={`rounded-md border border-blue-500  px-2 font-normal text-center  ${shrink_Text} ${shrink ? `h-5 w-10` : `h-6 md:h-6 w-12 md:w-12`}`}
              type='text'
              value={sbid}
              onChange={e => {
                const value = e.target.value
                const numValue = Number(value)
                const parsedValue = isNaN(numValue) || numValue === 0 ? '' : numValue
                setsbid(parsedValue)
              }}
            />
          </th>
        )}
        {/* ................................................... */}
        {/* rfid                                                 */}
        {/* ................................................... */}
        {show_rfid && (
          <th scope='col' className='px-2 text-center'>
            <MyInput
              id='rfid'
              name='rfid'
              overrideClass={`rounded-md border border-blue-500  px-2 font-normal text-center  ${shrink_Text} ${shrink ? `h-5 w-10` : `h-6 md:h-6 w-12 md:w-12`}`}
              type='text'
              value={rfid}
              onChange={e => {
                const value = e.target.value
                const numValue = Number(value)
                const parsedValue = isNaN(numValue) || numValue === 0 ? '' : numValue
                setrfid(parsedValue)
              }}
            />
          </th>
        )}
        {/* ................................................... */}
        {/* hsid                                                 */}
        {/* ................................................... */}
        {show_hsid && (
          <th scope='col' className='px-2 text-center'>
            <MyInput
              id='hsid'
              name='hsid'
              overrideClass={`rounded-md border border-blue-500  px-2 font-normal text-center  ${shrink_Text} ${shrink ? `h-5 w-10` : `h-6 md:h-6 w-12 md:w-12`}`}
              type='text'
              value={hsid}
              onChange={e => {
                const value = e.target.value
                const numValue = Number(value)
                const parsedValue = isNaN(numValue) || numValue === 0 ? '' : numValue
                sethsid(parsedValue)
              }}
            />
          </th>
        )}
        {/* ................................................... */}
        {/* DateTime                                          */}
        {/* ................................................... */}
        {show_datetime && <th scope='col' className={`px-2 ${shrink_Text}`}></th>}
        {/* ................................................... */}
        {/* Title                                                 */}
        {/* ................................................... */}
        {show_title && (
          <th scope='col' className='px-2'>
            <MyInput
              id='title'
              name='title'
              overrideClass={`rounded-md border border-blue-500  px-2 font-normal text-center  ${shrink_Text} ${shrink ? `h-5 w-28` : `h-6 md:h-6 w-28 md:w-36`}`}
              type='text'
              value={title}
              onChange={e => {
                const value = e.target.value
                settitle(value)
              }}
            />
          </th>
        )}
        {/* ................................................... */}
        {/* usid                                                 */}
        {/* ................................................... */}
        {show_usid && (
          <th scope='col' className='px-2 text-center'>
            <MyInput
              id='usid'
              name='usid'
              overrideClass={`rounded-md border border-blue-500  px-2 font-normal text-center  ${shrink_Text} ${shrink ? `h-5 w-10` : `h-6 md:h-6 w-12 md:w-12`}`}
              type='text'
              value={usid}
              onChange={e => {
                const value = e.target.value
                const numValue = Number(value)
                const parsedValue = isNaN(numValue) || numValue === 0 ? '' : numValue
                setusid(parsedValue)
                setname('')
              }}
            />
          </th>
        )}
        {/* ................................................... */}
        {/* Name                                                 */}
        {/* ................................................... */}
        {show_name && (
          <th scope='col' className='px-2'>
            <MyInput
              id='name'
              name='name'
              overrideClass={`rounded-md border border-blue-500  px-2 font-normal text-center  ${shrink_Text} ${shrink ? `h-5 w-28` : `h-6 md:h-6 w-28 md:w-36`}`}
              type='text'
              value={name}
              onChange={e => {
                const value = e.target.value
                setname(value)
                setusid('')
              }}
            />
          </th>
        )}
        {/* ................................................... */}
        {/* Questions                                           */}
        {/* ................................................... */}
        {show_questions && (
          <th scope='col' className='px-2 text-center'>
            <MyInput
              id='questions'
              name='questions'
              overrideClass={`rounded-md border border-blue-500  px-2 font-normal text-center  ${shrink_Text} ${shrink ? `h-5 w-10` : `h-6 md:h-6 w-12 md:w-12`}`}
              type='text'
              value={questions}
              onChange={e => {
                const value = e.target.value
                const numValue = Number(value)
                const parsedValue = isNaN(numValue) || numValue === 0 ? '' : numValue
                setquestions(parsedValue)
              }}
            />
          </th>
        )}
        {/* ................................................... */}
        {/* correct                                           */}
        {/* ................................................... */}
        {show_correct && (
          <th scope='col' className='px-2 text-center'>
            <MyInput
              id='correct'
              name='correct'
              overrideClass={`rounded-md border border-blue-500  px-2 font-normal text-center  ${shrink_Text} ${shrink ? `h-5 w-10` : `h-6 md:h-6 w-12 md:w-12`}`}
              type='text'
              value={correct}
              onChange={e => {
                const value = e.target.value
                const numValue = Number(value)
                const parsedValue = isNaN(numValue) ? '' : numValue
                setcorrect(parsedValue)
              }}
            />
          </th>
        )}
        {/* ................................................... */}
        {/* Review/Quiz                                          */}
        {/* ................................................... */}
        <th scope='col' className=' px-2'></th>
        <th scope='col' className=' px-2'></th>
      </tr>
    )
  }
  //----------------------------------------------------------------------------------------------
  // Render table body
  //----------------------------------------------------------------------------------------------
  function render_body() {
    return (
      <tbody className='bg-white text-xxs md:text-xs'>
        {tabledata && tabledata.length > 0 ? (
          tabledata?.map((tabledata, index) => (
            <tr key={`${tabledata.hs_hsid}-${index}`} className='w-full'>
              {show_owner && <td className={`px-2 py-1 ${shrink_Text}`}>{tabledata.hs_owner}</td>}
              {show_subject && <td className={`px-2 py-1 ${shrink_Text}`}>{tabledata.hs_subject}</td>}
              {show_sbid && (
                <td className={`px-2 py-1 text-center ${shrink_Text}`}>
                  {tabledata.sb_sbid > 0 ? tabledata.sb_sbid : ' '}
                </td>
              )}
              {show_rfid && (
                <td className={`px-2 py-1 text-center ${shrink_Text}`}>
                  {tabledata.hs_rfid > 0 ? tabledata.hs_rfid : ' '}
                </td>
              )}
              {show_hsid && (
                <td className={`px-2 py-1 text-center ${shrink_Text}`}>{tabledata.hs_hsid}</td>
              )}
              {show_datetime && (
                <td className={`px-2 py-1 text-left ${shrink_Text}`}>
                  {convertUTCtoLocal({
                    datetimeUTC: tabledata.hs_datetime,
                    to_localcountryCode: countryCode,
                    to_dateFormat: ref_to_dateFormat
                  })}
                </td>
              )}
              {show_title && (
                <td className={`px-2 py-1 ${shrink_Text}`}>
                  {tabledata.sb_title
                    ? tabledata.sb_title.length > 35
                      ? `${tabledata.sb_title.slice(0, 30)}...`
                      : tabledata.sb_title
                    : ' '}
                </td>
              )}
              {show_usid && (
                <td className={`px-2 py-1 text-center ${shrink_Text}`}>{tabledata.hs_usid}</td>
              )}
              {show_name && <td className={`px-2 py-1 ${shrink_Text}`}>{tabledata.us_name}</td>}
              {show_questions && (
                <td className={`px-2 py-1 text-center ${shrink_Text}`}>{tabledata.hs_questions}</td>
              )}
              {show_correct && (
                <td className={`px-2 py-1 text-center ${shrink_Text}`}>
                  {tabledata.hs_correctpercent}
                </td>
              )}
              {/* ................................................... */}
              {/* Review                                          */}
              {/* ................................................... */}
              <td className='px-2 py-1 text-center'>
                <div className='inline-flex justify-center items-center'>
                  <MyLink
                    href={{
                      pathname: `/dashboard/quiz-review/${tabledata.hs_hsid}`,
                      reference: 'quiz-review',
                      segment: String(tabledata.hs_hsid)
                    }}
                    overrideClass={`bg-green-500 hover:bg-green-600 text-white justify-center  ${shrink_Text} ${shrink ? `h-4 md:h-4 w-10` : `h-5 md:h-5 w-12 md:w-16`}`}
                    caller={functionName}
                  >
                    Review
                  </MyLink>
                </div>
              </td>
              {/* ................................................... */}
              {/* Quiz                                             */}
              {/* ................................................... */}
              <td className='px-2 py-1 text-center'>
                <div className='inline-flex justify-center items-center'>
                  <MyLink
                    href={
                      tabledata.hs_rfid > 0
                        ? {
                            pathname: `/dashboard/quiz`,
                            query: {
                              uq_column: 'qq_rfid',
                              uq_rfid: String(tabledata.hs_rfid)
                            },
                            reference: 'quiz',
                            segment: String(tabledata.hs_rfid)
                          }
                        : {
                            pathname: `/dashboard/quiz`,
                            query: {
                              uq_column: 'qq_sbid',
                              uq_sbid: String(tabledata.hs_sbid)
                            },
                            reference: 'quiz',
                            segment: String(tabledata.hs_sbid)
                          }
                    }
                    overrideClass={`text-white justify-center  ${shrink_Text} ${shrink ? `h-4 md:h-4 w-10` : `h-5 md:h-5 w-12 md:w-16`}`}
                    caller={functionName}
                  >
                    Quiz
                  </MyLink>
                </div>
              </td>
              {/* ---------------------------------------------------------------------------------- */}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={8}>No data available</td>
          </tr>
        )}
      </tbody>
    )
  }
  //----------------------------------------------------------------------------------------------
  // Render pagination
  //----------------------------------------------------------------------------------------------
  function render_pagination() {
    return (
      <div className='mt-5 flex w-full justify-center text-xxs md:text-xs'>
        <div className='flex grow justify-center'>
          <MyPagination
            totalPages={totalPages}
            statecurrentPage={currentPage}
            setStateCurrentPage={setcurrentPage}
          />
        </div>
      </div>
    )
  }
  //----------------------------------------------------------------------------------------------
  return (
    <>
      <div className='mt-4 bg-gray-50 rounded-lg shadow-md max-w-full'>
        {render_selection()}
        <div className='overflow-x-auto overflow-y-auto max-h-[70vh]'>
          <table className='min-w-full text-gray-900 table-auto'>
            <thead className='sticky top-0 z-10 bg-gray-50 text-left'>
              {render_tr1()}
              {render_tr2()}
            </thead>
            {render_body()}
          </table>
        </div>
      </div>
      {render_pagination()}
      <p className='text-red-600 text-xxs md:text-xs'>{message}</p>
    </>
  )
}
