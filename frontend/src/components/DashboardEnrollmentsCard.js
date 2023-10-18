import axios from 'axios'
import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { BsBook } from 'react-icons/bs'
import AuthContext from '../context/AuthContext'
import { useEffect } from 'react'

const DashboardEnrollmentsCard = () => {
    const [paidEnrollments, setPaidEnrollments] = useState([])
    const [freeEnrollments, setFreeEnrollments] = useState([])
    const enrollmentCount = paidEnrollments.length + freeEnrollments.length
    const {authToken} = useContext(AuthContext)
    const fetchPaidEnrollments = async () => {
        try{
            const response = await axios.get(
                "http://127.0.0.1:8000/admin_user/get_paid_enrollments/",
                {
                headers: {
                    // "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken.access}`,
                },
                }
            )
            setPaidEnrollments(response.data)
        }
        catch(error){
            console.error("error getting paid courses", error);
        }
    }
    const fetchFreeEnrollments = async () => {
        try{
            const response = await axios.get(
                "http://127.0.0.1:8000/admin_user/get_free_enrollments/",
                {
                headers: {
                    // "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken.access}`,
                },
                }
            )
            setFreeEnrollments(response.data)
        }
        catch(error){
            console.error("error getting free courses", error);
        }
    }

    useEffect(()=>{
        fetchFreeEnrollments()
        fetchPaidEnrollments()
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
          {enrollmentCount}
        </h4>
        <span className="text-sm font-thin text-gray-500">Total Enrollments</span>
      </div>

      <div className="flex items-center justify-end mt-4">
        {/* <span className="text-lg font-bold text-meta-5 mr-2">0.95%</span> */}
       
      </div>
      </div>
    </div>
  )
}

export default DashboardEnrollmentsCard
