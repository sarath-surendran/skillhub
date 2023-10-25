import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import loginimage from "../images/login.jpg";
import logo from "../images/skillhub.png";
import Header from "../components/Header";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import config from "../config";

const LoginPage = () => {
  let { login } = useContext(AuthContext);
  const [user, setUser] = useState([]);
  const[profile, setProfile] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess:  (codeResponse) => {
      setUser(codeResponse);
       axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          const registerResponse =  axios.post(
            `${config.axios_url}users/google_register/`,
            {
                "name":res.data.name,
                "email":res.data.email,
                "google_id":res.data.id
            }
          )
          .then(login(res.data.email, `googleAuth@${res.data.id}`))
        })
        .catch((err) => console.log(err));
    },

    onError: (error) => console.log("Login Failed:", error),
  });

  console.log("profile",profile)

  const normalLogin = (e)=>{
    e.preventDefault()
    login(email, password)
  }

  return (
    <div>
      <Header />
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
                Log in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
              <div className="text-center flex justify-center pb-4">
                {/* <button onClick={() => login()}>Sign in with Google 🚀 </button> */}
                <button
                  className="flex items-center justify-center bg-white-200 text-black font-semibold py-2 px-4 rounded-full"
                  onClick={() => googleLogin()}
                >
                  <img
                    src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" // Replace with your Google logo image URL
                    alt="Google Logo"
                    className="w-6 h-6 mr-2"
                  />
                  Login with Google
                </button>
                {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage}  /> */}
              </div>
              <form className="space-y-6" onSubmit={(e)=>normalLogin(e)}>
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
                      autoComplete="email"
                      value={email}
                      onChange={(e)=>setEmail(e.target.value)}
                      required
                      className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div
                      className="text-sm"
                      onClick={() => navigate("/forgot-password")}
                    >
                      <a
                        href=""
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e)=>setPassword(e.target.value)}
                      required
                      // className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
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

export default LoginPage;
