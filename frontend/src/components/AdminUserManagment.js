import axios from "axios";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import AuthContext from "../context/AuthContext";
import config from "../config";

const AdminUserManagment = () => {
  const [users, setUsers] = useState([]);
  const { authToken } = useContext(AuthContext);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        `${config.axios_url}admin_user/get_users/`,
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("error getting users : ", error);
    }
  };

  const blockUser = async (id) => {
	try{
		const response = await axios.patch(
			`${config.axios_url}admin_user/block_user/?id=${id}`,
			{},
			{
				headers: {
				  "Content-Type": "multipart/form-data",
				  Authorization: `Bearer ${authToken.access}`,
				},
			}
		)
		if (response.status === 204){
			fetchAllUsers()
		}
	}
	catch(error){
		console.error("error in blocking user",error)
	}
  }
  const makeAdmin = async (user_id) => {
    try{
      const response = await axios.post(
        `${config.axios_url}admin_user/make_admin/?id=${user_id}`,{},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      )
      if (response.status === 200){
        fetchAllUsers()
      }
    }
    catch(error){
      console.error('error making admin',error)
    }
  }
  const makeInstructor = async (user_id) => {
    try{
      const response = await axios.post(
        `${config.axios_url}admin_user/make_instructor/?id=${user_id}`,{},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      )
      if (response.status === 200){
        fetchAllUsers()
      }
    }
    catch(error){
      console.error('error making admin',error)
    }
  }
  const suspend = async (user_id) => {
    try{
      const response = await axios.post(
        `${config.axios_url}admin_user/suspend_instructor/?id=${user_id}`,{},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      )
      if (response.status === 200){
        fetchAllUsers()
      }
    }
    catch(error){
      console.error('error suspending user',error)
    }
  }

  useEffect(() => {
    fetchAllUsers();
  }, []);
  return (
    <div>
      <div className="pt-8">
        <p>User management</p>
        <table>
          <tr>
            <th className="p-4">Sl. No</th>
            <th className="p-4">User Id</th>
            <th className="p-4">Image</th>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Role</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>

          {users.map((user, index) => {
            const imageurl = `${config.media_url}${user.image}`;
            return (
              <tr>
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{user.id}</td>
                <td className="p-4">
                  <img
                    src={imageurl}
                    alt={user.name}
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                </td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.phone}</td>
                <td className="p-4">
                  {user.is_admin ? (
                    <span style={{ color: "red" }}>Admin</span>
                  ) : user.is_instructor ? (
                    <span style={{ color: "green" }}>Instructor</span>
                  ) : (
                    <span style={{ color: "blue" }}>Student</span>
                  )}
                </td>
                <td className="p-4 cursor-pointer" onClick={()=>{blockUser(user.id)}}>
                  {user.is_active ? (
                    <span className="text-blue-500 font-bold">Active</span>
                  ) : (
                    <span className="text-red-500 fond-bold">Blocked</span>
                  )}
                </td>
                <td className="p-4 cursor-pointer">
                  {!user.is_admin ? (
                    user.is_instructor ? (
                      <div className="flex space-x-3">
                        <button onClick={()=>{makeAdmin(user.id)}} className="bg-green-200 text-green-800 hover:bg-green-300 hover:text-green-900 px-8 py-2 rounded-md">
                          Make Admin
                        </button>
                        <button onClick={()=>{suspend(user.id)}} className="bg-red-200 text-red-800 hover:bg-red-300 hover:text-red-900 px-1 py-2 rounded-md">
                        Suspend
                      </button>
                      </div>
                    ) : (
                      <button onClick={()=>{makeInstructor(user.id)}} className="bg-green-200 text-green-800 hover:bg-green-300 hover:text-green-900 px-1 py-2 rounded-md">
                        Make Instructor
                      </button>
                    )
                  ) : null}
                </td>

              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagment;
