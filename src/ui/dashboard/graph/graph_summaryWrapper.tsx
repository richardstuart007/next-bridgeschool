'use client'

//==============================================================================================
//  1) DESCRIPTION
//    GraphSummaryWrapper — client view for /dashboard/graphs: renders the User line chart plus
//    the Top and Recent bar charts, each under its own header (User_Header / Top_Header /
//    Recent_Header). Clicking a history point navigates to that quiz-review page.
//
//    Parameters:
//      UserLineGraph / TopGraphData / RecentGraphData — the three GraphStructure datasets
//      safeDataUserAverage — average % shown in the User header
//      userMonths / topMonths / recentUsers / recentAvg — current preference values for the
//        three headers
//==============================================================================================

import { useRouter } from 'next/navigation'
import { MyLineChart, MyBarChart } from './graph_charts'
import { GraphStructure } from './graph_types'
import { User_Header } from './User/User_Header'
import { Top_Header } from './Top/Top_Header'
import { Recent_Header } from './Recent/Recent_Header'

interface GraphSummaryWrapperProps {
  UserLineGraph: GraphStructure
  TopGraphData: GraphStructure
  RecentGraphData: GraphStructure
  safeDataUserAverage: number
  userMonths: number
  topMonths: number
  recentUsers: number
  recentAvg: number
}

export function GraphSummaryWrapper({
  UserLineGraph,
  TopGraphData,
  RecentGraphData,
  safeDataUserAverage,
  userMonths,
  topMonths,
  recentUsers,
  recentAvg
}: GraphSummaryWrapperProps) {
  const router = useRouter()

  return (
    <>
      {/* First Graph - User Results Line Chart */}
      <div className='flex-1 min-h-0 flex flex-col'>
        <div className='w-full max-w-2xl bg-gray-100 flex-1 min-h-0 p-3 flex flex-col justify-between'>
          <User_Header averagePercentage={safeDataUserAverage} initialMonths={userMonths} />
          <div className='flex-grow min-h-0 overflow-hidden'>
            <MyLineChart LineGraphData={UserLineGraph} onPointClick={handlePointClick} />
          </div>
        </div>
      </div>

      {/* Top Results Graph - Bar Chart */}
      <div className='flex-1 min-h-0 flex flex-col'>
        <div className='w-full max-w-2xl bg-gray-100 flex-1 min-h-0 p-3 flex flex-col justify-between'>
          <Top_Header initialMonths={topMonths} />
          <div className='flex-grow min-h-0 overflow-hidden'>
            <MyBarChart
              StackedGraphData={TopGraphData}
              onPointClick={handlePointClick} // Added click handler
            />
          </div>
        </div>
      </div>

      {/* Recent Results Graph - Bar Chart */}
      <div className='flex-1 min-h-0 flex flex-col'>
        <div className='w-full max-w-2xl bg-gray-100 flex-1 min-h-0 p-3 flex flex-col justify-between'>
          <Recent_Header initialUsersReturned={recentUsers} initialUsersAverage={recentAvg} />
          <div className='flex-grow min-h-0 overflow-hidden'>
            <MyBarChart
              StackedGraphData={RecentGraphData}
              onPointClick={handlePointClick} // Added click handler
            />
          </div>
        </div>
      </div>
    </>
  )
  //----------------------------------------------------------------------------------------------
  //  handlePointClick — navigate to the quiz-review page when a history point is clicked
  //----------------------------------------------------------------------------------------------
  function handlePointClick(clickData: { key: number; keyType: string }) {
    if (clickData.keyType === 'hsid') {
      router.push(`/dashboard/quiz-review/${clickData.key}`)
    }
  }
}
