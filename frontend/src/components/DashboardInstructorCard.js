import axios from 'axios'
import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import {GiTeacher} from 'react-icons/gi'
import AuthContext from '../context/AuthContext'
import { useEffect } from 'react'
import config from '../config'

const DashboardInstructorCard = () => {
    const [allInstructors, setAllInstructors] = useState([])
    const instructorCount = allInstructors.length
    const {authToken} = useContext(AuthContext)
    const fetchAllInstructors = async () => {
        const response = await axios.get(
            `${config.axios_url}admin_user/get_instructors/`,
            {
                headers: {
                  // "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${authToken.access}`,
                },
            }
        )
        if(response.status === 200){
            setAllInstructors(response.data)
            console.log('instructor ',response.data)
        }
    }
    useEffect(()=>{
        fetchAllInstructors()
    },[])
  return (
    <div className="rounded-sm border border-stroke bg-white py-2 px-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="bg-card p-4 rounded-full text-center">
      <div className="w-16 h-16 flex items-center justify-center bg-gray-300 rounded-full">
        <GiTeacher size={32} className="text-blue-500 stroke-current dark:text-white" />
        </div>

      </div>
      <div className='flex justify-between'>
      <div className=" mt-3">
        <h4 className="text-2xl font-bold text-black dark:text-white">
          {instructorCount}
        </h4>
        <span className="text-sm font-thin text-gray-500">Total Instructors</span>
      </div>

      <div className="flex items-center justify-end mt-4">
        {/* <span className="text-lg font-bold text-meta-5 mr-2">0.95%</span> */}
       
      </div>
      </div>
    </div>
  )
}

export default DashboardInstructorCard
