import React from 'react'
import Header from '../components/Header'
import AdminSideBar from '../components/AdminSideBar'
import AdminCourseManagement from '../components/AdminCourseManagement'

const AdminCourseManagementPage = () => {
  return (
    <div>
      <Header/>
      <div className='flex h-screen'>
            <div className='w-1/4 p-4'>
            <AdminSideBar/>
            </div>
            <div className='w-3/4 p-4'>
            <AdminCourseManagement/>
            </div>
        </div>
    </div>
  )
}

export default AdminCourseManagementPage
