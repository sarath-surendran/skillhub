import React, { useContext, useEffect, useState } from "react";
import UserSideBar from "../components/UserSideBar";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import AuthContext from "../context/AuthContext";
import Swal from 'sweetalert2'
import config from "../config";

const MyCoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const { authToken } = useContext(AuthContext);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        `${config.axios_url}courses/view_courses/`
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching course : ", error);
    }
  };

  const deleteCourse = async (course_id) => {
    // try {
      // const response = await axios.delete(
      //   `${config.axios_url}courses/view_courses/delete/?id=${course_id}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${authToken.access}`,
      //     },
      //   }
      // );

      // if (response.status === 204) {
      //   fetchCourses();
      // }
    // } catch (error) {
    //   console.error("Error deleting course : ", error);
    // }
    try{
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(
            `${config.axios_url}courses/view_courses/delete/?id=${course_id}`,
            {
              headers: {
                Authorization: `Bearer ${authToken.access}`,
              },
            }
          );
    
          if (response.status === 204) {
            fetchCourses();
          }

          // Swal.fire(
          //   'Deleted!',
          //   'Your file has been deleted.',
          //   'success'
          // )
        }
      })
    }
    catch(error){
      console.error("error deleting course ",error)
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  console.log(courses);

  return (
    <div>
      <Header/>
      <div className="flex h-screen">
      {/* <UserSideBar/>
      <p>My Courses List</p>
      <button onClick={()=>{navigate('/profile/my_courses/add_course')}}>Add Course</button> */}
      <div className="w-1/4 bg-gray-200 p-4">
        <UserSideBar />
      </div>
      <div className="w-3/4 p-4">
        <div>
          <p className="text-2x1 font-bold mb-4">My Courses List</p>
          <ul className="space-y-4 mb-6">
		  {courses.map((item) => {
			const imageUrl = `${config.media_url}${item.thumbnail}`
            return (
            //   <div className="flex justify-between">
            //     <li
            //       key={item.id}
            //       onClick={() =>
            //         navigate(`/profile/my_courses/lessons/${item.id}`)
            //       }
            //       className="cursor-pointer border-b border-gray-300 hover:bg-gray-100 p-2"
            //     >
            //       {item.title}
            //     </li>
            //     <div className="flex space-x-6">
            //       <button
            //         onClick={() =>
            //           navigate(`/profile/my_courses/update_course/${item.id}`)
            //         }
			// 		className="text-blue-500 hover:text-blue-700"
            //       >
            //         <BsPencilFill />
            //       </button>
            //       <button
            //         onClick={() => {
            //           deleteCourse(item.id);
            //         }}
			// 		className="text-red-500 hover:text-red-700"
            //       >
            //         <MdDelete />
            //       </button>
            //     </div>
            //   </div>

			<li
                key={item.id}
                className="flex items-center border-b border-gray-300 hover:bg-gray-100 p-2"
              >
                
                <div className="w-20 h-20 mr-8">
                  <img
                    src={imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                
                <div className="flex-grow">
                  <p
                    onClick={() => navigate(`/profile/my_courses/lessons/${item.id}`)}
                    className="cursor-pointer font-semibold hover:underline"
                  >
                    {item.title}
                  </p>
                  <div className="flex space-x-6 mt-2">
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
                  </div>
                </div>
              </li>

            );
          })}
		  </ul>
          <button
            className="w-50 bg-blue-500 text-white py-2 px-4 mb-2"
            onClick={() => {
              navigate("/profile/my_courses/add_course");
            }}
          >
            Add Course
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MyCoursesPage;
