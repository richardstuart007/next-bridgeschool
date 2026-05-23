'use client'

import { useState, useEffect, useRef } from 'react'
import { table_Reference, table_ReferenceSubject, table_Subject } from '@/src/lib/tables/definitions'
import { fetchFiltered } from 'nextjs-shared/fetchFiltered'
import { fetchTotalPages } from 'nextjs-shared/fetchTotalPages'
import type { Filter, JoinParams } from 'nextjs-shared/structures'
import MyPagination from 'nextjs-shared/MyPagination'
import MyDropdown from 'nextjs-shared/MyDropdown'
import { useUserContext } from '@/src/context/UserContext'
import { MyButton } from 'nextjs-shared/MyButton'
import { MyInput } from 'nextjs-shared/MyInput'
import { MyLink } from 'nextjs-shared/MyLink'
import { table_fetch, table_fetch_Props } from 'nextjs-shared/table_fetch'
import { getWidthNumber } from 'nextjs-shared/widthUtils'
import { ROWS_PER_PAGE } from '@/src/lib/tableUtils'

interface FormProps {
  uq_sbid?: string | undefined
  initialUsid?: number
  initialSubjectInfo?: table_Subject
  initialRows?: object[]
  initialTotalPages?: number
}

export default function Table_Reference({
  uq_sbid,
  initialUsid,
  initialSubjectInfo,
  initialRows,
  initialTotalPages
}: FormProps) {
  const functionName = 'Table_Reference'
  //
  //  User context
  //
  const { sessionContext } = useUserContext()
  const ref_selected_cx_usid = useRef(initialUsid ?? 0)
  const [initialisationCompleted, setinitialisationCompleted] = useState(false)
  //
  //  Parameter Selection
  //
  const ref_sb_owner = useRef(initialSubjectInfo?.sb_owner ?? '')
  const ref_sb_subject = useRef(initialSubjectInfo?.sb_subject ?? '')
  const ref_sb_cntreferences = useRef(String(initialSubjectInfo?.sb_cntreference ?? ''))
  const ref_sb_cntquestions = useRef(initialSubjectInfo?.sb_cntquestions ?? 0)
  //
  //  Input
  //
  const [owner, setowner] = useState<number | string>('')
  const [subject, setsubject] = useState<number | string>('')
  const [desc, setdesc] = useState('')
  const [who, setwho] = useState<number | string>('')
  const [ref, setref] = useState('')
  const [type, settype] = useState<number | string>('')
  const [questions, setquestions] = useState<number | string>(0)
  //
  //  Show columns
  //
  const [widthDesc, setwidthDesc] = useState(0)
  const [show_owner, setshow_owner] = useState(false)
  const [show_subject, setshow_subject] = useState(false)
  const [show_who, setshow_who] = useState(false)
  const [show_ref, setshow_ref] = useState(false)
  const [show_type, setshow_type] = useState(false)
  const [show_questions, setshow_questions] = useState(false)
  const [show_quiz, setshow_quiz] = useState(false)
  //
  //  Data
  //
  const [currentPage, setcurrentPage] = useState(1)
  const [tabledata, setTabledata] = useState<(table_Reference | table_ReferenceSubject)[]>(
    (initialRows ?? []) as (table_Reference | table_ReferenceSubject)[]
  )
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages ?? 0)
  //
  //  Initialisation
  //
  //
  //  Shrink/Detail
  //
  const [shrink, setshrink] = useState(false)
  const [shrink_Text, setshrink_Text] = useState('text-xxs md:text-xs')
  //......................................................................................
  //  Initilaisation - context
  //......................................................................................
  useEffect(() => {
    //
    //  No context
    //
    if (!sessionContext) return
    //
    //  Get user from context
    //
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
  }, [sessionContext])
  //......................................................................................
  //  Initilaisation - after context usid
  //......................................................................................
  useEffect(() => {
    //
    //  Initialisation
    //
    const initialize = async () => {
      //
      //  Set the selected values
      //
      if (uq_sbid && !initialSubjectInfo) await selectedOwnerSubject()
      //
      //  Update Columns and rows
      //
      updateColumns()
      //
      //  Allow fetch of data
      //
      setinitialisationCompleted(true)
    }
    //
    //  Initialise the data when USID set
    //
    if (ref_selected_cx_usid.current > 0) initialize()
  }, [ref_selected_cx_usid.current])
  //......................................................................................
  // Debounce selection
  //......................................................................................
  const prevFilters = useRef({
    owner: '' as string | number,
    subject: '' as string | number,
    ref: '',
    desc: '',
    who: '' as string | number,
    questions: 0,
    type: '' as string | number
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
      ref !== prev.ref ||
      desc !== prev.desc ||
      Number(questions) !== prev.questions
    //
    // Dropdown change
    //
    const dropdownChange =
      owner !== prev.owner ||
      subject !== prev.subject ||
      who !== prev.who ||
      type !== prev.type
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
        ref,
        desc,
        who,
        questions: Number(questions),
        type
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
    //
    //  Values to debounce
    //
  }, [owner, subject, ref, desc, who, questions, type, currentPage, initialisationCompleted])
  //----------------------------------------------------------------------------------------------
  //  Update the columns based on screen width
  //----------------------------------------------------------------------------------------------
  function updateColumns() {
    const w = getWidthNumber()
    setshow_quiz(false)
    setshow_owner(false)
    setshow_subject(false)
    setshow_questions(false)
    setshow_type(false)
    setshow_who(false)
    setshow_ref(false)
    setshow_quiz(true)
    if (w >= 2) {
      if (!uq_sbid) setshow_owner(true)
      if (!uq_sbid) setshow_subject(true)
      setshow_questions(true)
      setshow_type(true)
    }
    if (w >= 3) setshow_who(true)
    if (w >= 4) setshow_ref(true)
    setwidthDesc(w >= 4 ? 100 : w >= 3 ? 75 : w >= 2 ? 40 : 30)
  }
  //----------------------------------------------------------------------------------------------
  // Selected subject
  //----------------------------------------------------------------------------------------------
  async function selectedOwnerSubject() {
    //
    //  Continue to get data
    //
    try {
      //
      //  Get the subject id
      //
      const sb_sbid = Number(uq_sbid)
      const rows = await table_fetch({
        caller: functionName,
        table: 'tsb_subject',
        whereColumnValuePairs: [{ column: 'sb_sbid', value: sb_sbid }]
      } as table_fetch_Props)
      const row = rows[0]
      //
      //  Restrict to owner/subject
      //
      ref_sb_owner.current = row.sb_owner
      ref_sb_subject.current = row.sb_subject
      ref_sb_cntreferences.current = row.sb_cntreference
      ref_sb_cntquestions.current = row.sb_cntquestions
      //
      //  Errors
      //
    } catch (error) {
      console.error('Error fetching trf_reference:', error)
    }
  }
  //----------------------------------------------------------------------------------------------
  // fetchdata
  //----------------------------------------------------------------------------------------------
  async function fetchdata() {
    //
    //  Message uq_sbid
    //
    setMessage('Applying filters...')
    //
    // Construct filters dynamically from input fields
    //
    const filtersToUpdate: Filter[] = [
      { column: 'uo_usid', value: ref_selected_cx_usid.current, operator: '=' },
      { column: 'rf_who', value: who, operator: '=' },
      { column: 'rf_type', value: type, operator: '=' },
      { column: 'rf_ref', value: ref, operator: 'LIKE' },
      { column: 'rf_desc', value: desc, operator: 'LIKE' },
      { column: 'rf_cntquestions', value: questions, operator: '>=' }
    ]
    //
    //  Passed values
    //
    if (uq_sbid) {
      const additions: Filter[] = [
        {
          column: 'rf_sbid',
          value: uq_sbid,
          operator: '='
        }
      ]
      filtersToUpdate.push(...additions)
    }
    //
    //  Selected values
    //
    else {
      const additions: Filter[] = [
        { column: 'rf_owner', value: owner, operator: '=' },
        { column: 'rf_subject', value: subject, operator: '=' }
      ]
      filtersToUpdate.push(...additions)
    }
    //
    // Filter out any entries where `value` is not defined or empty
    //
    const filters = filtersToUpdate.filter(filter => filter.value)
    //
    //  Continue to get data
    //
    try {
      //
      //  Table
      //
      const table = 'trf_reference'
      //
      //  Distinct - no  usid selected
      //
      let distinctColumns: string[] = []
      //
      //  Joins
      //
      const joins: JoinParams[] = [
        { table: 'tuo_usersowner', on: 'rf_owner = uo_owner' },
        { table: 'tsb_subject', on: 'rf_sbid = sb_sbid' }
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
        orderBy: 'rf_owner, rf_subject, rf_ref',
        limit: ROWS_PER_PAGE,
        offset,
        distinctColumns
      })
      setTabledata(data)
      //
      //  Total number of pages
      //
      const fetchedTotalPages = await fetchTotalPages({
        caller: functionName,
        table,
        joins,
        filters,
        items_per_page: ROWS_PER_PAGE,
        distinctColumns
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
      console.error('Error fetching trf_reference:', error)
    }
  }
  //----------------------------------------------------------------------------------------------
  // Render selection
  //----------------------------------------------------------------------------------------------
  function render_selection() {
    return (
      <div
        className={`px-3 py-1 flex items-center justify-between bg-blue-200 border-b
              rounded-t-lg ${shrink_Text}`}
      >
        <div className='font-semibold text-red-600 tracking-wide'>Subject References</div>

        {uq_sbid && (
          <div className={`flex items-center gap-2 ${shrink_Text}`}>
            <span className='font-bold'>Owner: </span>
            <span className='text-green-500'>{ref_sb_owner.current}</span>
            <span className='pl-2 font-bold'> Subject: </span>
            <span className='text-green-500'>{ref_sb_subject.current}</span>
            <span className='pl-2 font-bold'> References: </span>
            <span className='text-green-500'>{ref_sb_cntreferences.current}</span>
            <span className='pl-2 font-bold'> Questions: </span>
            <span className='text-green-500'>{ref_sb_cntquestions.current}</span>
            {Number(ref_sb_cntquestions.current) > 0 && (
              <span>
                <div className='pl-2 inline-flex justify-center items-center'>
                  <MyLink
                    href={{
                      pathname: `/dashboard/quiz`,
                      query: {
                        uq_route: 'reference-select',
                        uq_column: 'qq_sbid',
                        uq_sbid: String(uq_sbid)
                      },
                      reference: 'quiz',
                      segment: String(uq_sbid)
                    }}
                    overrideClass={`bg-blue-500 text-white hover:bg-blue-600 ${
                      shrink ? 'h-5' : 'h-6'
                    } ${shrink_Text}`}
                    caller={functionName}
                  >
                    Quiz
                  </MyLink>
                </div>
              </span>
            )}
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
            Subject-name
          </th>
        )}

        {show_ref && (
          <th scope='col' className=' font-bold px-2'>
            Ref
          </th>
        )}
        <th scope='col' className=' font-bold px-2 '>
          Description
        </th>
        {show_who && (
          <th scope='col' className=' font-bold px-2'>
            Who
          </th>
        )}
        <th scope='col' className=' font-bold px-2'>
          Type
        </th>
        {show_questions && (
          <th scope='col' className=' font-bold px-2 text-center'>
            Questions
          </th>
        )}
        {show_quiz && (
          <th scope='col' className=' font-bold px-2 text-center'>
            Quiz
          </th>
        )}
      </tr>
    )
  }
  //----------------------------------------------------------------------------------------------
  // Render table header row 2
  //----------------------------------------------------------------------------------------------
  function render_tr2() {
    return (
      <tr className='text-xs align-bottom'>
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
              tableColumnValue={ref_selected_cx_usid.current}
              optionLabel='uo_owner'
              optionValue='uo_owner'
              overrideClass_Dropdown={
                shrink ? `h-5 w-24 ${shrink_Text}` : `h-6 w-28 ${shrink_Text}`
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
                  shrink ? `h-5 w-32 ${shrink_Text}` : `h-6 w-36 ${shrink_Text}`
                }
                includeBlank={true}
              />
            )}
          </th>
        )}
        {/* ................................................... */}
        {/* REF                                                 */}
        {/* ................................................... */}
        {show_ref && (
          <th scope='col' className=' px-2 '>
            <label htmlFor='ref' className='sr-only'>
              Reference
            </label>
            <MyInput
              id='ref'
              name='ref'
              overrideClass={shrink ? `h-5 w-32 ${shrink_Text}` : `h-6 w-40 ${shrink_Text}`}
              type='text'
              value={ref}
              onChange={e => {
                const value = e.target.value
                setref(value)
              }}
            />
          </th>
        )}
        {/* ................................................... */}
        {/* DESC                                                 */}
        {/* ................................................... */}
        <th scope='col' className='px-2'>
          <label htmlFor='desc' className='sr-only'>
            Description
          </label>
          <MyInput
            id='desc'
            name='desc'
            overrideClass={shrink ? `h-5 w-40 ${shrink_Text}` : `h-6 w-48 ${shrink_Text}`}
            type='text'
            value={desc}
            onChange={e => {
              const value = e.target.value
              setdesc(value)
            }}
          />
        </th>
        {/* ................................................... */}
        {/* WHO                                                 */}
        {/* ................................................... */}
        {show_who && (
          <th scope='col' className=' px-2'>
            <MyDropdown
              selectedOption={who}
              setSelectedOption={setwho}
              name='who'
              table='twh_who'
              optionLabel='wh_title'
              optionValue='wh_who'
              overrideClass_Dropdown={
                shrink ? `h-5 w-28 ${shrink_Text}` : `h-6 w-32 ${shrink_Text}`
              }
              includeBlank={true}
            />
          </th>
        )}

        {/* ................................................... */}
        {/* type                                                 */}
        {/* ................................................... */}
        {show_type && (
          <th scope='col' className=' px-2'>
            <MyDropdown
              selectedOption={type}
              setSelectedOption={settype}
              name='type'
              table='trt_reftype'
              optionLabel='rt_title'
              optionValue='rt_type'
              overrideClass_Dropdown={
                shrink ? `h-5 w-20 ${shrink_Text}` : `h-6 w-24 ${shrink_Text}`
              }
              includeBlank={true}
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
              overrideClass={`text-center ${shrink ? 'h-5 w-10' : 'h-6 w-12'} ${shrink_Text}`}
              type='text'
              value={questions}
              onChange={e => {
                const value = e.target.value
                const numValue = Number(value)
                const parsedValue = isNaN(numValue) ? '' : numValue
                setquestions(parsedValue)
              }}
            />
          </th>
        )}
        {/* ................................................... */}
        {/* Quiz                                       */}
        {/* ................................................... */}
        <th scope='col' className=' px-2'></th>
        {/* ................................................... */}
      </tr>
    )
  }
  //----------------------------------------------------------------------------------------------
  // Render table body
  //----------------------------------------------------------------------------------------------
  function render_body() {
    return (
      <tbody className='bg-white text-xs'>
        {tabledata?.map(tabledata => (
          <tr key={tabledata.rf_rfid} className='w-full border-b'>
            {/* ................................................... */}
            {/* Owner                                          */}
            {/* ................................................... */}
            {show_owner && (
              <td className={`px-2 ${shrink ? 'h-5' : 'h-6'} ${shrink_Text}`}>
                {tabledata.rf_owner}
              </td>
            )}
            {/* ................................................... */}
            {/* Subject                                          */}
            {/* ................................................... */}
            {show_subject && (
              <td className={`px-2 ${shrink ? 'h-5' : 'h-6'} ${shrink_Text}`}>
                {tabledata.rf_subject}
              </td>
            )}
            {/* ................................................... */}
            {/* Ref                                          */}
            {/* ................................................... */}
            {show_ref && (
              <td className={`px-2 ${shrink ? 'h-5' : 'h-6'} ${shrink_Text}`}>
                {tabledata.rf_ref}
              </td>
            )}
            {/* ................................................... */}
            {/* desc                                          */}
            {/* ................................................... */}
            <td className={`px-2 ${shrink ? 'h-5' : 'h-6'} ${shrink_Text}`}>
              {tabledata.rf_desc.length > widthDesc
                ? `${tabledata.rf_desc.slice(0, widthDesc - 3)}...`
                : tabledata.rf_desc}
            </td>
            {/* ................................................... */}
            {/* who                                          */}
            {/* ................................................... */}
            {show_who && (
              <td className={`px-2 ${shrink ? 'h-5' : 'h-6'} ${shrink_Text}`}>
                {tabledata.rf_who}
              </td>
            )}
            {/* ................................................... */}
            {/* Read/video                                                */}
            {/* ................................................... */}
            <td className={`px-2 ${shrink ? 'h-5' : 'h-6'} ${shrink_Text}`}>
              <div className='inline-flex justify-center items-center'>
                <MyButton
                  onClick={() => window.open(`${tabledata.rf_link}`, '_blank')}
                  overrideClass={`text-white ${shrink ? 'h-5' : 'h-6'} ${shrink_Text} ${
                    tabledata.rf_type === 'youtube'
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {tabledata.rf_type === 'youtube' ? 'Video' : 'Read'}
                </MyButton>
              </div>
            </td>
            {/* ................................................... */}
            {/* Questions                                            */}
            {/* ................................................... */}
            {show_questions && 'rf_cntquestions' in tabledata && (
              <td className={`px-2 text-center ${shrink ? 'h-5' : 'h-6'} ${shrink_Text}`}>
                {tabledata.rf_cntquestions > 0 ? tabledata.rf_cntquestions : ' '}
              </td>
            )}
            {/* ................................................... */}
            {/* Quiz                                                */}
            {/* ................................................... */}
            {show_quiz && (
              <td className='px-2 text-center'>
                <div className='inline-flex justify-center items-center'>
                  {'rf_cntquestions' in tabledata && tabledata.rf_cntquestions > 0 ? (
                    <MyLink
                      href={{
                        pathname: `/dashboard/quiz`,
                        query: {
                          uq_route: 'reference-select',
                          uq_column: 'qq_rfid',
                          uq_rfid: String(tabledata.rf_rfid)
                        },
                        reference: 'quiz',
                        segment: String(tabledata.rf_rfid)
                      }}
                      overrideClass={`text-white ${shrink ? 'h-5' : 'h-6'} ${shrink_Text}`}
                      caller={functionName}
                    >
                      Quiz
                    </MyLink>
                  ) : (
                    ' '
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    )
  }
  //----------------------------------------------------------------------------------------------
  // Render pagination
  //----------------------------------------------------------------------------------------------
  function render_pagination() {
    return (
      <div className='mt-5 flex w-full justify-center text-xxs md:text-xs'>
        <div className='flex justify-start'>
          <MyLink
            overrideClass={`bg-yellow-600 hover:bg-yellow-700 text-white ${shrink_Text} h-5 ${!shrink ? 'md:h-6' : ''}`}
            href={{
              pathname: '/dashboard/subject',
              reference: 'subject',
              query: {
                uq_route: 'reference-select'
              }
            }}
          >
            Back to Subject
          </MyLink>
        </div>
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
