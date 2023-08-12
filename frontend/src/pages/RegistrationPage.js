import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode"
import AuthContext from '../context/AuthContext'

const RegistrationPage = () => {

    let {setUser,setAuthToken} = useContext(AuthContext)
    const navigate = useNavigate()
    let [formData, setFormData] = useState({
        name:'',
        phone:'',
        email:'',
        password:'',
        confirm_password:'',
    })

    const handleChange = (e) =>{
        const {name, value} = e.target
        setFormData((prevdata)=>({
            ...prevdata,
            [name]:value,
        }))
    }
    // console.log(formData);

    const [errorIndex, setErrorIndex] = useState(0);
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        if (errorMessages.length > 0) {
        alert(errorMessages[errorIndex][0]);
        }
    }, [errorMessages, errorIndex]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            let response = await axios.post('http://localhost:8000/users/register/', formData)
            console.log('User registerd ', response);
            // navigate('/login')

            let loginresponse = await axios.post('http://localhost:8000/api/token/',{
                email:formData.email,
                password:formData.password
            })
            // console.log(loginresponse);
            if(loginresponse.status === 200){
                let loginData = loginresponse.data
                // console.log(loginData);
                setAuthToken(loginData);
                setUser(jwt_decode(loginData.access));
                localStorage.setItem('authToken', JSON.stringify(loginData));
                navigate('/');
            }
        }
        catch(error){
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setErrorMessages(Object.values(errorData));
                setErrorIndex(0);
            }
        }
    }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
            type='text'
            name='name'
            placeholder='Enter Your Name'
            onChange={handleChange}

        />
        <input
            type='text'
            name='phone'
            placeholder='Enter Your phone'
            onChange={handleChange}
        />
        <input
            type='text'
            name='email'
            placeholder='Enter Your email'
            onChange={handleChange}
        />
        <input
            type='text'
            name='password'
            placeholder='Enter Your password'
            onChange={handleChange}
        />
        <input
            type='text'
            name='confirm_password'
            placeholder='Confirm Your Password'
            onChange={handleChange}
        />
        <input
        type='submit'
        />
      </form>
    </div>
  )
}

export default RegistrationPage
