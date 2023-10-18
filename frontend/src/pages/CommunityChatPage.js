import React from 'react'
import { useLocation } from 'react-router-dom'
import CommunityChat from '../components/CommunityChat'
import Header from '../components/Header'

const CommunityChatPage = () => {
    const {state} = useLocation()
    const courseId = state ? state.courseId : null
  return (
    <div>
      <Header/>
      <CommunityChat course_id={courseId}/>
    </div>
  )
}

export default CommunityChatPage
