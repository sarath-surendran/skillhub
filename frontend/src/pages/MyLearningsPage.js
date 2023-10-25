import React, { useContext } from 'react'
import UserSideBar from '../components/UserSideBar'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import Header from '../components/Header'
import config from '../config'


const MyLearningsPage = () => {
    const [enrolled_courses, setEnrolledCourses] =  useState([])
    const navigate = useNavigate()
    const {authToken} = useContext(AuthContext)

    const fetchEnrolledCourses = async () => {
        try{
            const response = await axios.get(
                `${config.axios_url}enrollments/enrolled_courses/`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken.access}`,
                    },
                }
            )
            setEnrolledCourses(response.data)
            console.log(response.data)
        }
        catch(error){
            console.error("error fetching enrolled courses", error)
        }
    }
    

    useEffect(()=>{
        fetchEnrolledCourses()
    },[])
    console.log(enrolled_courses)

  return (
    <div>
        <Header/>
        <div className='flex h-screen'>
        <div className="w-1/4 bg-gray-200 p-4">
            <UserSideBar />
        </div>
        <div className='w-3/4 p-4'>
            <h2 className='text-2xl font-semibold mb-4'>My Learnings</h2>
            <ul className='space-y-4 mb-6'>
                {enrolled_courses.map((course)=>{
                    let imageUrl = '';
                    if (course ) {
                      imageUrl = `${config.media_url}${course.thumbnail}`;
                    }
                    return(
                        <li
                            key={course.id}
                            className="flex items-center border-b border-gray-300 hover:bg-gray-100 p-2"
                        >
                            
                            <div className="w-20 h-20 mr-8">
                            <img
                                src={imageUrl} 
                                alt={course.title}
                                className="w-full h-full object-cover rounded"
                            />
                            </div>

                            
                            <div className="flex-grow">
                            <p
                                onClick={() => navigate(`/enrolled_courses/${course.id}`)}
                                className="cursor-pointer font-semibold hover:underline"
                            >
                                {course.title}
                            </p>
                            {/* <div className="flex space-x-6 mt-2">
                                <button
                                onClick={() => navigate(`/profile/my_courses/update_course/${item.id}`)}
                                className="text-blue-500 hover:text-blue-700"
                                >
                                <BsPencilFill className="text-xl" />
                                </button>
                                <button
                                onClick={() => deleteCourse(item.id)}
                                className="text-red-500 hover:text-red-700"
                                >
                                <MdDelete className="text-xl" />
                                </button>
                            </div> */}
                            </div>
                        </li>
                    )
                })}

            </ul>
        </div>
      
    </div>
    </div>
  )
}

export default MyLearningsPage
