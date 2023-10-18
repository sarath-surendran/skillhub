import React, { useContext, useState, useEffect } from 'react'
import AuthContext from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import profile from '../images/images.png'
import axios from 'axios'

const UserSideBar = () => {
    let {user,logout, authToken} = useContext(AuthContext)
    let navigate = useNavigate()
    const [profile, setProfile] = useState([])

    const fetchProfile = async () => {
      const response = await axios.get(`http://127.0.0.1:8000/profile/`, {
        headers: {
          Authorization: `Bearer ${authToken.access}`,
        },
      });
      setProfile(response.data);
    };

    const applyForInstructor = async () => {
      try{
        const response = await axios.post(
          'http://127.0.0.1:8000/profile/apply_for_instructor/',{},
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken.access}`,
            },
          }
        )
        alert(response.data.message)
      }
      catch(error){
        console.error("error applying for instructor", error);
      }
    }
    
    // console.log(profile);
  //   console.log(profile.image)
    let imageUrl = '';
    if (profile ) {
      imageUrl = `http://localhost:8000${profile.image}`;
    }
    // console.log(imageUrl);
    useEffect(() => {
      fetchProfile();
    }, []);


  return (
    <div className='flex-col justify-between'>
      {/* <p>{user.name}</p>
      <p>Change password</p>
      {user.is_instructor ? <p onClick={()=>{navigate('/profile/my_courses')}}>My Courses</p> : <p>Apply as an Expert</p>} */}
      
        <div className="flex flex-col items-center">
          <img src={imageUrl} alt="Profile" className="w-20 h-20 rounded-full mb-2" />
          <p className="text-center font-semibold">{profile.name}</p>
        </div>

        {/* <p onClick={""}>Change Photo</p> */}
        <p className='cursor-pointer text-gray-800 hover:text-red-800 my-3 px-5' onClick={()=>{navigate('/profile')}}>Profile</p>
        
        <p className='cursor-pointer text-gray-800 hover:text-red-800 my-3 px-5' onClick={()=>{navigate('/profile/my_learnings')}}>My Learnings</p>
        
        <p className='cursor-pointer text-gray-800 hover:text-red-800 my-3 px-5' onClick={()=>{navigate('/profile/change_password')}}>Change password</p>

        {user.is_admin && <p className='cursor-pointer text-gray-800 hover:text-red-800 my-3 px-5' onClick={()=>{navigate('/admin/dashboard')}}>Admin Dashboard</p>}
        
        {user.is_instructor && <p className='cursor-pointer text-gray-800 hover:text-red-800 my-3 px-5' onClick={()=>{navigate('/profile/chats')}} >Chats</p>}
      
        <div>
          <button className='w-full bg-blue-500 text-white py-2 px-4 mb-2'>
          {user.is_instructor ? <p onClick={()=>{navigate('/profile/my_courses')}}>My Courses</p> : <p onClick={applyForInstructor}>Apply as an Expert</p>}
          </button>
          <button
            className='w-full bg-red-500 text-white py-2 px-4'
            onClick={() => {
              logout()
            }}
          >
            Logout
          </button>
        </div>
      
    </div>
  )
}

export default UserSideBar
