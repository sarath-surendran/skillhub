import React, { useContext, useEffect, useState } from "react";
import UserSideBar from "../components/UserSideBar";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import Header from "../components/Header";
import config from "../config";

const UserProfilePage = () => {
  const { user, authToken } = useContext(AuthContext);
  const [profile, setProfile] = useState([]);
  const [editing, setEditing] = useState(false)
  const [editingData, setEditingData] = useState([])

  const fetchProfile = async () => {
    try{
		const response = await axios.get(`${config.axios_url}profile/`, {
				headers: {
					Authorization: `Bearer ${authToken.access}`,
				},
			});
			setProfile(response.data);
			setEditingData(response.data)
	}
	catch(error){
		console.error("error fetching profile ",error)
	}
  };
  
  const handleChange = (e) =>{
	const {name, value} = e.target
	setEditingData((prevData)=>({
		...prevData,
		[name]:value,
	}))
	// console.log("onchange",editingData)

  }

  const handleSubmit = async ()=>{
	// console.log("editingData",editingData)
	try{
		const response = await axios.post(
			`${config.axios_url}profile/`,
			{
				'qualification':editingData.qualification,
				'employement': editingData.employement
			},
			{
				headers:{
					Authorization: `Bearer ${authToken.access}`
				}
			}

		)
		if (response.status === 202){
			fetchProfile()
			setEditing(false)
		}
	}
	catch(error){
		console.error("error submitting",error)
	}
  }
  
  useEffect(() => {
    fetchProfile();
  }, [editing]);

  return (
    <div>
		<Header/>
		<div className="flex h-screen">
      <div className="w-1/4 bg-gray-200 p-4">
        <UserSideBar />
      </div>

      <div className="w-3/4 p-4">
        <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
        <div className="mb-4 flex space-x-4 border border-gray-300 rounded-md p-4 shadow-lg">
          <label className="block font-semibold w-32">Email:</label>
          <p>{profile.email}</p>
        </div>
        <div className="mb-4 flex space-x-4 border border-gray-300 rounded-md p-4 shadow-lg">
          <label className="block font-semibold w-32">Phone:</label>
          <p>{profile.phone}</p>
        </div>
		<div className="mb-4 flex space-x-4 border border-gray-300 rounded-md p-4 shadow-lg">
          <label className="block font-semibold w-32">Qualification:</label>
          {editing ? (
			<input
			name="qualification"
			type="text"
			placeholder="qualification"
			className="w-100 px-4  border border-gray-400 rounded-md focus:outline-none focus:border-blue-600"
			value={editingData.qualification}
			onChange={(e)=>{handleChange(e)}}
			/>
		  ) : (
			<p>{profile.qualification}</p>
		  )}
        </div>
		<div className="mb-4 flex space-x-4 border border-gray-300 rounded-md p-4 shadow-lg">
          <label className="block font-semibold w-32">Employment:</label>
          {editing ? (
			<input
			name="employement"
			type="text"
			placeholder="Employement"
			className="w-100 px-4  border border-gray-400 rounded-md focus:outline-none focus:border-blue-600"
			value={editingData.employement}
			onChange={(e)=>{handleChange(e)}}
			/>
		  ) : (
			<p>{profile.employement}</p>
		  )}
        </div>
        {/* Other user details go here */}

        {editing ? (
			<button className="bg-blue-500 text-white py-2 px-4" onClick={handleSubmit}>
			Save Details
		  </button>
		) : (
			<button className="bg-blue-500 text-white py-2 px-4" onClick={()=>{setEditing(true)}}>
          Edit Details
        </button>
		)}
      </div>
    </div>
	</div>
  );
};

export default UserProfilePage;
