import React from 'react'
import Header from '../components/Header'
import AdminSideBar from '../components/AdminSideBar'
import AdminInstructorRequest from '../components/AdminInstructorRequest'

const AdminInstructorApprovalPage = () => {
  return (
    <div>
      <Header/>
      <div className='flex h-screen'>
            <div className='w-1/4 p-4'>
            <AdminSideBar/>
            </div>
            <div className='w-3/4 p-4'>
            <AdminInstructorRequest/>
            </div>
        </div>
    </div>
  )
}

export default AdminInstructorApprovalPage
