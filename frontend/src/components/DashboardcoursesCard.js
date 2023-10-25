import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import {BsBook} from 'react-icons/bs'
import AuthContext from '../context/AuthContext'
import axios from 'axios'
import { useEffect } from 'react'
import config from '../config'

const DashboardcoursesCard = () => {
  const [allCourse, setAllCourses] = useState([])
  const courseCount = allCourse.length
  const {authToken} = useContext(AuthContext)
  const fetchAllCourses = async () => {
    try {
      const response = await axios.get(
        `${config.axios_url}admin_user/get_courses/`,
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      );
      setAllCourses(response.data);
    } catch (error) {
      console.error("error getting users : ", error);
    }
  };
  useEffect(()=>{
    fetchAllCourses()
  },[])
  return (
    <div className="rounded-sm border border-stroke bg-white py-2 px-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="bg-card p-4 rounded-full text-center">
      <div className="w-16 h-16 flex items-center justify-center bg-gray-300 rounded-full">
        <BsBook size={32} className="text-blue-500 stroke-current dark:text-white" />
        </div>

      </div>
      <div className='flex justify-between'>
      <div className=" mt-3">
        <h4 className="text-2xl font-bold text-black dark:text-white">
          {courseCount}
        </h4>
        <span className="text-sm font-thin text-gray-500">Total Courses</span>
      </div>

      <div className="flex items-center justify-end mt-4">
        {/* <span className="text-lg font-bold text-meta-5 mr-2">0.95%</span> */}
       
      </div>
      </div>
    </div>
  )
}

export default DashboardcoursesCard
