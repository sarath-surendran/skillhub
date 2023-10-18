import React from 'react'
import Header from '../components/Header'
import AdminSideBar from '../components/AdminSideBar'
import AdminUserManagment from '../components/AdminUserManagment'

const AdminUserManagementPage = () => {
  return (
    <div>
      <Header/>
      <div className='flex h-screen'>
            <div className='w-1/4 p-4'>
            <AdminSideBar/>
            </div>
            <div className='w-3/4 p-4'>
            <AdminUserManagment/>
            </div>
        </div>
    </div>
  )
}

export default AdminUserManagementPage
