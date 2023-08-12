import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

const LoginPage = () => {
    let {login} = useContext(AuthContext)
  return (
    <div>
      <form onSubmit={login}>
        <input type='email' name='email' placeholder='Enter your email'/><br/>
        <input type='password' name='password' placeholder='Enter your password'/><br/>
        <input type='submit'/>
      </form>
        <Link to = '/register'>Signup Here</Link>
    </div>
  )
}

export default LoginPage
