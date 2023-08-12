import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const UserSideBar = () => {
    let {user} = useContext(AuthContext)
    let navigate = useNavigate()
  return (
    <div>
      <p>{user.name}</p>
      <p>Change password</p>
      {user.is_instructor ? <p onClick={()=>{navigate('/profile/my_courses')}}>My Courses</p> : <p>Apply as an Expert</p>}
    </div>
  )
}

export default UserSideBar
