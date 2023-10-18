import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { FaUsers } from 'react-icons/fa'
import AuthContext from '../context/AuthContext';

const DashboardViewUsersCard = () => {
  const [allUsers, setAllUsers] = useState([])
  const userCount = allUsers.length
  const {authToken} = useContext(AuthContext)
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/admin_user/get_users/",
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      );
      setAllUsers(response.data);
    } catch (error) {
      console.error("error getting users : ", error);
    }
  };
  useEffect(()=>{
    fetchAllUsers()
  },[])
  return (
    <div className="rounded-sm border border-stroke bg-white py-2 px-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="bg-card p-4 rounded-full text-center">
      <div className="w-16 h-16 flex items-center justify-center bg-gray-300 rounded-full">
        <FaUsers size={32} className="text-blue-500 stroke-current dark:text-white" />
        </div>

      </div>
      <div className='flex justify-between'>
      <div className=" mt-3">
        <h4 className="text-2xl font-bold text-black dark:text-white">
          {userCount}
        </h4>
        <span className="text-sm font-thin text-gray-500">Total Users</span>
      </div>

      <div className="flex items-center justify-end mt-4">
        {/* <span className="text-lg font-bold text-meta-5 mr-2">0.95%</span> */}
       
      </div>
      </div>
    </div>
  )
}

export default DashboardViewUsersCard
