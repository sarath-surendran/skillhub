import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EmailVerified = (props) => {
    const {token} =  useParams()
    const navigate = useNavigate()
    console.log(token)
	const [isVerifying, setIsVerifying] = useState(false);
	
    const verfication = async (e) => {
		if (isVerifying) {
			return; // Prevent multiple clicks while verifying
		  }

	  
		  setIsVerifying(true);
        try{
			let response = await axios.get(`http://localhost:8000/users/register/verify_email/?token=${token}`)
			console.log(response)
			if(response.status === 200){
				navigate('/login')
			}
		}
		catch(error){
			console.error(error)
		}
		finally{
			setIsVerifying(false)
		}
    }
    useEffect(()=>{
        verfication()
    },[])
  return (
    <div>
        
    </div>
  )
}

export default EmailVerified
