import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import loginimage from "../images/login.jpg";
import logo from "../images/skillhub.png";

import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Header from "../components/Header";
import config from "../config";



const ForgotPasswordPage = () => {
  let { authToken } = useContext(AuthContext);
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  

//   const [errorIndex, setErrorIndex] = useState(0);
//   const [errorMessages, setErrorMessages] = useState("");

//   useEffect(() => {
//     if (errorMessages.length > 0) {
//       alert(errorMessages);
//     }
//   }, [errorMessages, errorIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
         await axios.post(
            `${config.axios_url}users/forgot_password/`,
            {
                "email":email
            },
            {
                headers: {
                  "Content-Type": "application/json",
                //   Authorization: `Bearer ${authToken.access}`,
                },
              }
        )
        navigate('/register/email_not_verified')
        
        
    }
    catch(error){
        console.error("error submitting forgot password",error);
    }
}

  console.log(email)
  return (
    <div>
      <Header/>
      <div>
      {/* <form onSubmit={login}>
        <input type='email' name='email' placeholder='Enter your email'/><br/>
        <input type='password' name='password' placeholder='Enter your password'/><br/>
        <input type='submit'/>
      </form>
        <Link to = '/register'>Signup Here</Link> */}
      <div className="flex h-screen">
        {/* Image Section */}
        <div className="flex-1  p-8 flex items-center justify-center">
          <img
            src={loginimage}
            alt="Login"
            className="max-h-96 md:max-h-full"
          />
        </div>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            {/* <img
                className="mx-auto h-10 w-auto"
                src={logo}
                alt="Your Company"
              /> */}
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Forgot Password
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              

              <div>
                <button
                  type="submit"
                  onClick={(e)=>handleSubmit(e)}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Send mail
                </button>
              </div>
            </form>

            <p className="mt-3 text-center text-sm text-gray-500">
              Not a member?{" "}
              <a
                href="/register"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Signup Now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ForgotPasswordPage;
