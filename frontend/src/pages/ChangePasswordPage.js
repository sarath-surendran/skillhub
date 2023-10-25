import React from 'react'
import UserSideBar from '../components/UserSideBar'
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { useState } from 'react';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import config from '../config';

const ChangePasswordPage = () => {

    const [errorIndex, setErrorIndex] = useState(0);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    if (errorMessages.length > 0) {
      alert(errorMessages);
    }
  }, [errorMessages, errorIndex]);

    const [passwordData, setPasswordData] = useState({
        current_password:"",
        new_password: "",
        confirm_new_password: "",
    })

    const {authToken} = useContext(AuthContext)
    const navigate = useNavigate()

    const validationSchema = Yup.object().shape({
        current_password: Yup.string().required("Current Password is Required"),
        new_password: Yup.string().required("New Password is required").notOneOf([Yup.ref("current_password"), null], "Current Password and New Password Cannot be same."),
        confirm_new_password: Yup.string()
          .oneOf([Yup.ref("new_password"), null], "New Passwords must match")
          .required("Must confirm the Password"),
    })

    const formikInitialValues = {
        current_password: '',
        new_password: '',
        confirm_new_password: '',
    }

    const handleSubmit = async ()=>{
        try{
            const response = await axios.post(
                `${config.axios_url}users/change_password/`,
                {
                    "current_password": passwordData.current_password,
                    "new_password": passwordData.new_password
                },
                {
                    headers: {
                    //   "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${authToken.access}`,
                    },
                  }
            )
            if (response.status === 200){
                navigate("/profile")
            }
        }
        catch(error){
            console.error("error changing password : ",error.response.data)
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setErrorMessages(Object.values(errorData));
                console.log(errorMessages)
                setErrorIndex(0);
              }
        }
    }
  return (
    <div>
        <Header/>
        <div className='flex h-screen'>
        <div className='w-1/4 bg-gray-200 p-4'>
            <UserSideBar/>
        </div>
        <div className='w-3/4 p-4'>
            <div className='p-4 w-full  shadow-lg rounded-lg'>
                <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
                <Formik
                    initialValues={formikInitialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {(formikProps)=>(
                        <Form className='space-y-6'>
                            <div>
                                <label
                                    htmlFor="current_password"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Enter Current Password
                                </label>
                                <div className="mt-2">
                                    <Field
                                        id="current_password"
                                        name="current_password"
                                        type="password"
                                        placeholder="Enter Current Password"
                                        value={passwordData.current_password}
                                        required
                                        onChange={(e) => {
                                            formikProps.setFieldValue("current_password", e.target.value);
                                            setPasswordData((prevData)=>({
                                                ...prevData,
                                                [e.target.name]:e.target.value
                                            }))
                                        }}
                                        className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    <ErrorMessage
                                        name="current_password"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="new_password"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Enter New Password
                                </label>
                                <div className="mt-2">
                                    <Field
                                        id="new_password"
                                        name="new_password"
                                        type="password"
                                        placeholder="Enter New Password"
                                        value={passwordData.new_password}
                                        required
                                        onChange={(e) => {
                                            formikProps.setFieldValue("new_password", e.target.value);
                                            setPasswordData((prevData)=>({
                                                ...prevData,
                                                [e.target.name]:e.target.value
                                            }))
                                        }}
                                        className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    <ErrorMessage
                                        name="new_password"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirm_new_password"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Confirm New Password
                                </label>
                                <div className="mt-2">
                                    <Field
                                        id="confirm_new_password"
                                        name="confirm_new_password"
                                        type="text"
                                        placeholder="Confirm New Password"
                                        value={passwordData.confirm_new_password}
                                        required
                                        onChange={(e) => {
                                            formikProps.setFieldValue("confirm_new_password", e.target.value);
                                            setPasswordData((prevData)=>({
                                                ...prevData,
                                                [e.target.name]:e.target.value
                                            }))
                                        }}
                                        className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    <ErrorMessage
                                        name="confirm_new_password"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                    Change password
                                </button>
                            </div>
                        </Form>
                    )}

                </Formik>

            </div>

        </div>
      
    </div>
    </div>
  )
}

export default ChangePasswordPage
