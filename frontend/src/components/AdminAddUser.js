import React from 'react'
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import config from '../config';

const registraionSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed in Name")
      .required("Name is required."),
    phone: Yup.string()
      //   .matches(/^[0-9]$/, "Phone must be a number")
      .matches(/^\d{10}$/, "Phone number must be 10 digits ")
      .required("Phone is required."),
    email: Yup.string().email("Invalid email").required("Email is required."),
    password: Yup.string().required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Must confirm the Password"),
  });

const AdminAddUser = () => {

    
      let { setUser, setAuthToken } = useContext(AuthContext);
      const navigate = useNavigate();
      let [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirm_password: "",
      });

      const handleChange = (name, value) => {
        setFormData((prevdata) => ({
          ...prevdata,
          [name]: value,
        }));
      };

      const [errorIndex, setErrorIndex] = useState(0);
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        if (errorMessages.length > 0) {
        alert(errorMessages[errorIndex][0]);
        }
    }, [errorMessages, errorIndex]);

    const handleSubmit = async (e) => {
        // e.preventDefault();
        console.log("submit fuction called");
        try {
          let response = await axios.post(
            `${config.axios_url}users/register/`,
            formData
          );
          console.log("User registerd ", response);
          // navigate('/login')
          navigate("/admin/users");
        } catch (error) {
          if (error.response && error.response.data) {
            const errorData = error.response.data;
            setErrorMessages(Object.values(errorData));
            setErrorIndex(0);
          }
        }
      };



  return (
    <div>
      <div className='pt-8'>
        <div >
            <div className="flex min-h-full flex-1 flex-col justify-center px-2 py-4 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
               
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Register Here
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
                <Formik
                initialValues={{
                    name: "",
                    phone: "",
                    email: "",
                    password: "",
                    confirm_password: "",
                }}
                validationSchema={registraionSchema}
                //   onSubmit={(values) => handleSubmit(values)}
                onSubmit={handleSubmit}
                >
                {(formikProps) => (
                    <Form className="space-y-6">
                    <div>
                        <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                        >
                        Name
                        </label>
                        <div className="mt-2">
                        <Field
                            id="name"
                            name="name"
                            type="name"
                            autoComplete="current-name"
                            required
                            className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            // onChange={handleChange}
                            onChange={(e) => {
                            formikProps.setFieldValue("name", e.target.value);
                            handleChange("name", e.target.value);
                            }}
                        />
                        <ErrorMessage
                            name="name"
                            component="div"
                            className="text-red-500"
                        />
                        </div>
                    </div>
                    <div>
                        <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                        >
                        Phone
                        </label>
                        <div className="mt-2">
                        <Field
                            id="phone"
                            name="phone"
                            type="phone"
                            autoComplete="current-phone"
                            required
                            className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            // onChange={handleChange}
                            onChange={(e) => {
                            formikProps.setFieldValue("phone", e.target.value);
                            handleChange("phone", e.target.value);
                            }}
                        />
                        <ErrorMessage
                            name="phone"
                            component="div"
                            className="text-red-500"
                        />
                        </div>
                    </div>
                    <div>
                        <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                        >
                        Email address
                        </label>
                        <div className="mt-2">
                        <Field
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="block w-full rounded-md border-0  py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            // onChange={handleChange}
                            onChange={(e) => {
                            formikProps.setFieldValue("email", e.target.value);
                            handleChange("email", e.target.value);
                            }}
                        />
                        <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500"
                        />
                        </div>
                    </div>
                    <div>
                        <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                        >
                        Password
                        </label>
                        <div className="mt-2">
                        <Field
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            // onChange={handleChange}
                            onChange={(e) => {
                            formikProps.setFieldValue("password", e.target.value);
                            handleChange("password", e.target.value);
                            }}
                        />
                        <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500"
                        />
                        </div>
                    </div>
                    <div>
                        <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                        >
                        Confirm Your Password
                        </label>
                        <div className="mt-2">
                        <Field
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            autoComplete="current-confirm_password"
                            required
                            className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            // onChange={handleChange}
                            onChange={(e) => {
                            formikProps.setFieldValue(
                                "confirm_password",
                                e.target.value
                            );
                            handleChange("confirm_password", e.target.value);
                            }}
                        />
                        <ErrorMessage
                            name="confirm_password"
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
                        Register
                        </button>
                    </div>
                    </Form>
                )}
                </Formik>
                <p className="mt-3 text-center text-sm text-gray-500">
                Already a member?{" "}
                <a
                    href="/login"
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                    Login Now
                </a>
                </p>
            </div>
            </div>
            {/* Image Section
            <div className="flex-1  p-8 flex items-center justify-center">
            <img
                src={signupimage}
                alt="signup"
                className="max-h-96 md:max-h-full"
            />
            </div> */}
        </div>
      </div>
    </div>
  )
}

export default AdminAddUser
