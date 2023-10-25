import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import loginimage from "../images/login.jpg";
import logo from "../images/skillhub.png";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import config from "../config";

const forgotPasswordSchema = Yup.object().shape({
    new_password: Yup.string().required("Password is required"),
    confirm_new_password: Yup.string()
    .oneOf([Yup.ref("new_password"), null], "Passwords must match")
    .required("Must confirm the Password"),
})

const ForgotPasswordConfirmationPage = () => {
  let { login } = useContext(AuthContext);
  const navigate = useNavigate()
  const {token} = useParams()
  let [formData, setFormData] = useState({
    token : token,
    new_password: "",
    confirm_new_password: "",
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
      alert(errorMessages);
    }
  }, [errorMessages, errorIndex]);

  const handleSubmit = async (e) => {
    // e.preventDefault();
    console.log("submit fuction called");
    try {
      let response = await axios.post(
        `${config.axios_url}users/forgot_password_confirm/`,
        formData
      );
      // console.log("User registerd ", response);
      // navigate('/login')
      navigate("/login");
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
      <Header/>
      <div>
      
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
            {/* <form className="space-y-6" onSubmit={login}>
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
                  <div className="text-sm">
                    <a
                      href="#"
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
            </form> */}
            <Formik
              initialValues={{
                name: "",
                phone: "",
                email: "",
                new_password: "",
                confirm_new_password: "",
              }}
              validationSchema={forgotPasswordSchema}
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
                      Password
                    </label>
                    <div className="mt-2">
                      <Field
                        id="new_password"
                        name="new_password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        // onChange={handleChange}
                        onChange={(e) => {
                          formikProps.setFieldValue("new_password", e.target.value);
                          handleChange("new_password", e.target.value);
                        }}
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
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Confirm Your Password
                    </label>
                    <div className="mt-2">
                      <Field
                        id="confirm_new_password"
                        name="confirm_new_password"
                        type="password"
                        autoComplete="current-confirm_password"
                        required
                        className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        // onChange={handleChange}
                        onChange={(e) => {
                          formikProps.setFieldValue(
                            "confirm_new_password",
                            e.target.value
                          );
                          handleChange("confirm_new_password", e.target.value);
                        }}
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
                      Register
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

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

export default ForgotPasswordConfirmationPage;
