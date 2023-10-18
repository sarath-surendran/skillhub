import React, { useEffect, useState } from "react";
import banner from "../images/Banner.jpg";
import course from "../images/pexels-christina-morillo-1181671.jpg";
import axios from "axios";
import { json, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate()


  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        // "http://127.0.0.1:8000/courses/view_categories/"
		"http://127.0.0.1:8000/courses/view_courses_by_category/"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories : ", error);
    }
  };

//   const fetchCourseData = async () => {
// 	try{

// 	}
// 	catch(error){
// 		console.error(error)
// 	}
//   } 

  useEffect(() => {
    fetchCategories();
  }, []);
  // const [ws,setws] = useState(null)
  // const [recieved,setRecieved] = useState("")
  // useEffect(()=>{
  //   const socket = new WebSocket("ws://127.0.0.1:8000/ws/instructor_application/")
  //   socket.onopen = ()=>{
  // //     alert('on')
  //     console.log("socket connection established");
  //     setws(socket)
  //     socket.onmessage = (e)=>{
  //       console.log("message received");
  //       let message = JSON.parse(e.data)
  // //       console.log(message.message);
  //       console.log(message);
  //       setRecieved(message.message)
  //     }
  //   }
  //   socket.onclose = ()=> {
  //     alert('close')
  //   }
  // },[])
  // const [message,setMessage] = useState("")
  // const sendchat = ()=>{
  //   if(ws && ws.readyState ===  WebSocket.OPEN){
  //     ws.send(JSON.stringify({message}))
  //   }
  // }

  return (
    <div>
      <Header/>
      {/* <input value={message} onChange={(e)=>{setMessage(e.target.value)}} type="text"/>
      <button onClick={sendchat}>ok</button> */}
      
      {/* <p>{recieved}</p> */}
      <div className="min-h-screen">
        <div className="pb-8">
          <img src={banner} alt="Banner" className="w-full h-auto mx-auto" />
        </div>
        {/* Category 1 */}
        {categories.map((category) => {
          return (
            <div className="container mx-auto py-8 ">
              <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
                {category.courses.filter((course) => !course.is_blocked).slice(0,3).map((course)=>{
          const imageUrl = `http://localhost:8000${course.thumbnail}`
          return(
            <div
                  key=""
                  className="bg-white p-4 shadow-md transform transition-transform hover:scale-105 cursor-pointer"
          onClick={()=>{navigate(`/course/${course.id}`)}}
                >
                  <img
                    src={imageUrl}
                    alt={course.thumbnail}
                    className="w-full h-48 object-cover mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  {course.is_free ? <p className="text-gray-600 mb-2">Free</p> :<p className="text-gray-600 mb-2">$ {course.enrollment_fee}</p>}
                  <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 rounded transition-colors duration-300" onClick={()=>{navigate(`/course/${course.id}`)}}>
                    View Course
                  </button>
                </div>
          )
          })}
              </div>
              <div className="text-center mt-4" onClick={()=>navigate(`/category/${category.id}`)}>
                <a href="" className="text-blue-500 hover:underline">
                  Explore More
                </a>
              </div>
            </div>
          );
        })}
        {/* Category 2 */}
        {/* <div className="container mx-auto py-8">
          <h2 className="text-2xl font-bold mb-4">Top Free Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div
              key=""
              className="bg-white p-4 shadow-md transform transition-transform hover:scale-105"
            >
              <img
                src={course}
                alt=""
                className="w-full h-48 object-cover mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">"course_name"</h3>
              <p className="text-gray-600 mb-2">Price: $</p>
              <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 rounded transition-colors duration-300">
                Enroll
              </button>
            </div>
            <div
              key=""
              className="bg-white p-4 shadow-md transform transition-transform hover:scale-105"
            >
              <img
                src={course}
                alt=""
                className="w-full h-48 object-cover mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">"course_name"</h3>
              <p className="text-gray-600 mb-2">Price: $</p>
              <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 rounded transition-colors duration-300">
                Enroll
              </button>
            </div>
            <div
              key=""
              className="bg-white p-4 shadow-md transform transition-transform hover:scale-105"
            >
              <img
                src={course}
                alt=""
                className="w-full h-48 object-cover mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">"course_name"</h3>
              <p className="text-gray-600 mb-2">Price: $</p>
              <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 rounded transition-colors duration-300">
                Enroll
              </button>
            </div>
          </div>
          <div className="text-center mt-4">
            <a href="" className="text-blue-500 hover:underline">
              Explore More
            </a>
          </div>
        </div> */}

        <div className="py-4 bg-gray-800 text-white text-center">
          <div className="flex justify-between items-center px-4">
            <p className="text-gray-300">© Skillhub. inc 2023</p>
            {/* <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="hover:text-pink-400">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-blue-400">
                <i className="fab fa-twitter"></i>
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
