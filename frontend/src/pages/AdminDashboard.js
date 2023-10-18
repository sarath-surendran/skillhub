import React from 'react'
import AdminSideBar from '../components/AdminSideBar'
import Header from '../components/Header'
import DashboardViewUsersCard from '../components/DashboardViewUsersCard'
import DashboardcoursesCard from '../components/DashboardcoursesCard'
import DashboardInstructorCard from '../components/DashboardInstructorCard'
import DashboardEnrollmentsCard from '../components/DashboardEnrollmentsCard'
import DashboardEnrollmentsChart from '../components/DashboardEnrollmentsChart'

const AdminDashboard = () => {
  return (
    <div>
      <Header/>
      <div className='flex h-screen'>
        <div className='w-1/4 p-4'>
          <AdminSideBar/>
        </div>
        <div className='w-3/4 p-4'>
        <div className="bg-gray-100   grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 p-3 ">
          
          <DashboardViewUsersCard/>
          <DashboardInstructorCard/>
          <DashboardcoursesCard/>
          <DashboardEnrollmentsCard/>
        </div>
        <DashboardEnrollmentsChart/>
        </div>
      
    </div>
    </div>
  )
}

export default AdminDashboard
