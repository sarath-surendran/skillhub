import React, { useContext, useEffect, useState } from 'react'
import course from "../images/pexels-christina-morillo-1181671.jpg";
import { useNavigate, useParams } from 'react-router-dom';
import axios, { Axios } from 'axios';
import AuthContext from '../context/AuthContext';
import ViewReviewAndRatings from '../components/ViewReviewAndRatings';
import Header from '../components/Header';
import config from '../config';

const CourseDetailsPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [course, setCourse] = useState([])
    const { user, authToken } = useContext(AuthContext)
    const [enrollment, setEnrollment] = useState(false)

    const fetchEnrollment = async () => {
      try{
        const response = await axios.get(
          `${config.axios_url}enrollments/get_enrollment/?id=${id}`,
          {
            headers: {
              // Accept: "application/json",
              // "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken.access}`,
            },
          }
        )
        console.log("response : ",response.data.enrollment)
        setEnrollment(response.data.enrollment)
      }
      catch(error){
        console.error("error getting enrollment ",error)
      }
    }
    // alert("instructor",course[1].instructor_id)
    // alert('user',user.id)
    const fetchCourseDetails = async () => {
        try{
            const response = await axios.get(
                `${config.axios_url}courses/get_course/?id=${id}`
            )
            setCourse(response.data)
            console.log(response.data)
        }
        catch(error){
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchCourseDetails()
        fetchEnrollment()
},[])

    const loadScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
    };

    const handlePaymentSuccess = async (response) => {
      try{
        let bodyData = new FormData()
        bodyData.append("response", JSON.stringify(response));

        await axios.post(
          `${config.axios_url}enrollments/add_enrollment/success/?id=${id}`,
          bodyData,
          {
            headers: {
              Accept: "application/json",
              // "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken.access}`,
            },
          }
        ).then((res)=>{
          console.log("Everything is ok")
          console.log('res :',res)
          fetchEnrollment()
        })
      }
      catch(error){
        console.error(error)
      }
    }

    const showRazorPay = async () => {
      const res = await loadScript()

      let bodyData = new FormData()

      bodyData.append("amount", course[0].enrollment_fee.toString())

      console.log(bodyData.get('amount'))
      const data = await axios.post(
        `${config.axios_url}enrollments/add_enrollment/?id=${id}`,
        bodyData,
        {
          headers: {
            Accept: "application/json",
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      ).then((res)=>{
        return res
      })
      console.log(data)

      var options = {
        key_id: process.env.REACT_APP_PUBLIC_KEY, // in react your environment variable must start with REACT_APP_
        key_secret: process.env.REACT_APP_SECRET_KEY,
        amount: data.data.payment.amount,
        currency: "INR",
        name: "Skillhub",
        description: "Test teansaction",
        image: "", // add image url
        order_id: data.data.payment.id,
        handler: function (response) {
          // we will handle success by calling handlePaymentSuccess method and
          // will pass the response that we've got from razorpay
          handlePaymentSuccess(response);
          console.log("response : ",response)
        },
        prefill: {  
          name: "User's name",
          email: "User's email",
          contact: "User's phone",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    };

    const enroll = async () => {
      try{
        if(course[0].is_free){
          const response = await axios.post(
            `${config.axios_url}enrollments/add_enrollment/?id=${id}`,
            {},
            {
              headers: {
                // "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${authToken.access}`,
              },
            }
          )
  
          if(response.status === 200){
            fetchEnrollment()
          }
        }
        else{
          showRazorPay()
          
        }

      }
      catch(error){
        console.error("error enrolling : ",error)
      }
    }
    

    


    // console.log("user",user.id)
    // const imageUrl = `${config.media_url}${course[0].thumbnail}`
    let imageUrl = ''
    if (course && course.length>0 && course[0]){
         imageUrl = `${config.media_url}${course[0].thumbnail}`
    }
  return (
    <div>
      <Header/>
      <div>
      {/* Top section */}
      {course && course.length > 0 && course[0] && (
        <div className="bg-gray-800 py-4 px-6">
          <div className="flex justify-center items-center mb-4">
            {/* Conditional rendering of course title */}
            <h1 className="text-white text-2xl font-bold">{course[0].title}</h1>
          </div>
          <div className="flex mt-4 mb-2">
            {/* Course image */}
            <div className="w-1/2">
              {/* Uncomment the image code when you have the image URL */}
              <img
                src={imageUrl}
                alt="Course"
                className="w-full h-auto"
              />
            </div>
            <div className="w-2/3 p-8">
              {/* Instructor section */}
              <div className="flex items-center">
                {/* Uncomment the instructor image code when available */}
                {/* <img
                  src="instructor-photo.jpg"
                  alt="Instructor"
                  className="w-8 h-8 rounded-full mr-2"
                /> */}
                <span className="text-white">{course[1].instructor}</span>
              </div>
              {/* Course description */}
              <p className="text-white mt-2 font-bold">{course[0].description}</p>
              {/* Course price and enroll button */}
              <div className="flex items-center mt-4">
                {/* <p className="text-white font-bold mr-2">$99.99</p> */}
                {course[0].is_free ? <p className="text-white font-bold mr-2">Free</p> :<p className="text-white font-bold mr-2">$ {course[0].enrollment_fee}</p>}
                {!enrollment && course[1].instructor_id != user.id &&<button className="bg-blue-500 text-white px-4 py-2 rounded-full" onClick={enroll}>
                  Enroll
                </button>}
                {enrollment && <button onClick={()=>navigate(`/enrolled_courses/${course[0].id}`)} className="bg-blue-500 text-white px-4 py-2 rounded-full">Go to Course</button>}
              </div>
              {/* Course duration */}
              <p className="text-white mt-4 font-bold">Course Duration: {course[0].course_duration}</p>
            </div>
          </div>
        </div>
      )}
    {/* Remaining sections */}
      {course && course.length > 0 && course[0] && (
        
      <div className="p-6">
      {/* Course Highlights */}
      <div className='p-3'>
        <h2 className="text-2xl font-semibold">Course Highlights</h2>
        <p>
          {course[0].course_highlight}
        </p>
      </div>

      {/* What Will You Learn */}
      <div className="mt-6 p-3">
        <h2 className="text-2xl font-semibold">What Will You Learn</h2>
        <ul>
          {course[0].lessons.map((lesson,index)=>{
            return(
                <li key={index}>{index+1}. {lesson.title}</li>
            )
          })}
          
        </ul>
      </div>

      {/* Prerequisites */}
      <div className="mt-6 p-3">
        <h2 className="text-2xl font-semibold">Prerequisites</h2>
        <p>
          {course[0].prerequisites}
        </p>
      </div>

      {/* Enroll button */}
      <div className="flex justify-center mt-8">
      {!enrollment && course[1].instructor_id != user.id &&<button className="bg-blue-500 text-white px-4 py-2 rounded-full" onClick={enroll}>
                  Enroll Now
                </button>}
                {enrollment && <button className="bg-blue-500 text-white px-4 py-2 rounded-full">Go to Course</button>}
      </div>
    </div>
      )}

      <ViewReviewAndRatings course_id={id}/>
    </div>
    </div>
  )
}

export default CourseDetailsPage
