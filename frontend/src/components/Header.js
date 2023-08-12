import React, { useContext } from 'react'
import '../skillhub-logo.png'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
  let {user} = useContext(AuthContext)
  let {logout} = useContext(AuthContext)
  let navigtate = useNavigate()
  
  return (
    <div>
        {/* <img src='../skillhub-logo.png' alt='skillhub'/> */}
        <Link to='/'>Home</Link>
        <span> | </span>
        {user ? <div><p onClick={()=>{navigtate('/profile')}}>Welcome {user.name}  </p> <p onClick={logout}>Logout</p></div> : <Link to='/login'>Login</Link>}
        {/* <Link to='/login'>Login</Link>
        {user && <p>{user.name}</p>} */}

    </div>
  )
}

export default Header
