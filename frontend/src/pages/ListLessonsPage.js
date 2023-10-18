import React from 'react'
import UserSideBar from '../components/UserSideBar'
import ListLessons from '../components/ListLessons'
import Header from '../components/Header'

const ListLessonsPage = () => {
  return (
    <div>
      <Header/>
      <div className='flex h-screen'>
      <div className='w-1/4 bg-gray-200 p-4'>
        <UserSideBar/>
      </div>
      <div className='w-3/4 p-4'>
        <ListLessons/>
      </div>
    </div>
    </div>
  )
}

export default ListLessonsPage
