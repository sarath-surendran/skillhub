import React from "react";
import { useContext } from "react";
import { useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useEffect } from "react";

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const { authToken } = useContext(AuthContext);

  const fetchAllCourses = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/admin_user/get_courses/",
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      );
      setCourses(response.data);
    } catch (error) {
      console.error("error getting users : ", error);
    }
  };

  const blockCourse = async (id) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/admin_user/block_course/?id=${id}`,
        {},
        {
          headers: {
            //   "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      );
      if (response.status === 204) {
        fetchAllCourses();
      }
    } catch (error) {
      console.error("error blocking course", error);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  return (
    // <div>
    //     <div className='pt-8'>
    //         <p>Course management</p>
    //         <table>
    //             <tr>
    //                 <th className="p-4">Sl No</th>
    //                 <th className="p-4">Course ID</th>
    //                 <th className="p-4">Image</th>
    //                 <th className="p-4">Course Name</th>
    //                 <th className="p-4">Instructor</th>
    //                 <th className="p-4">Students</th>
    //                 <th className="p-4">Fee</th>
    //                 <th className="p-4">Status</th>
    //             </tr>

    //             {courses.map((course, index)=>{
    //                 const imageurl = `http://127.0.0.1:8000/${course.thumbnail}`
    //                 return(
    //                     <tr>
    //                         <td className="p-4">{index + 1}</td>
    //                         <td className="p-4">{course.id}</td>
    //                         <td className="p-4"><img src={imageurl} alt={course.title} style={{ maxWidth: "100px", maxHeight: "100px" }}/></td>
    //                         <td className="p-4">{course.title}</td>
    //                         <td className="p-4">{course.instructor_name}</td>
    //                         <td className="p-4"></td>
    //                         <td className="p-4">
    //                             {course.is_free ? (
    //                                 <span>Free</span>
    //                             ) : (
    //                                 <span>{course.enrollment_fee}</span>
    //                             )}
    //                         </td>
    //                         <td className="p-4">
    //                             {course.is_blocked ? (
    //                                 <button onClick={()=>{blockCourse(course.id)}} class="bg-red-200 text-red-800 hover:bg-red-300 hover:text-red-900 px-4 py-2 rounded-md">
    //                                 Blocked
    //                               </button>

    //                             ) : (
    //                                 <button onClick={()=>{blockCourse(course.id)}} class="bg-green-200 text-green-800 hover:bg-green-300 hover:text-green-900 px-4 py-2 rounded-md">
    //                                 Active
    //                               </button>

    //                             )}
    //                         </td>
    //                     </tr>
    //                 )
    //             })}
    //         </table>
    //     </div>

    // </div>

    <div className="overflow-x-auto">
      {/* <div className="min-w-screen min-h-screen bg-gray-100 flex items-center justify-center bg-gray-100 font-sans overflow-hidden"> */}
        <div>
          <div className="bg-white shadow-md rounded my-6">
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
					<th className="py-3 px-4 text-center">Sl No.</th>
                  <th className="py-3 px-6 text-left">Course</th>
                  <th className="py-3 px-6 text-left">Instructor</th>
                  <th className="py-3 px-6 text-center">Students</th>
                  <th className="py-3 px-6 text-center">Fee</th>
                  <th className="py-3 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {courses.map((course, index)=>{
					const imageUrl = `http://127.0.0.1:8000${course.thumbnail}`
					const instructor_image = `http://127.0.0.1:8000${course.instructor_image}`
					return(
						<tr className="border-b border-gray-200 hover:bg-gray-100">
							<td className="py-3 px-4 text-center">{index + 1}</td>
						<td className="py-3 px-6 text-left whitespace-nowrap">
							<div className="flex items-center">
							<div className="mr-2">
								
								<img src={imageUrl}  style={{ maxWidth: "60px", maxHeight: "60px" }}/>
							</div>
							<span className="font-medium">{course.title}</span>
							</div>
						</td>
						<td className="py-3 px-6 text-left">
							<div className="flex items-center">
							<div className="mr-2">
								<img
								className="w-10 h-8 rounded-full"
								src={instructor_image}
								/>
							</div>
							<span>{course.instructor_name}</span>
							</div>
						</td>
						<td className="py-3 px-6 text-center">
							<div className="flex items-center justify-center">
							{course.enrolled_students.slice(0,3).map((student,index)=>{
								const student_image = `http://127.0.0.1:8000/${student.student_image}`
								return(
									<img
										className="w-6 h-6 rounded-full border-gray-200 border transform hover:scale-125"
										src={student_image}
										alt={student.student_name}
										style={{ maxWidth: "60px", maxHeight: "60px" }}
									/>
								)
							})}
							
							</div>
						</td>
						<td className="py-3 px-6 text-center">
							{course.is_free ? (<span className="text-green-600 py-1 px-3 text-base font-bold">
							Free
							</span>) : (<span className="text-purple-600 py-1 px-3 text-base font-bold">
							{course.enrollment_fee}
							</span>)}
						</td>
						<td className="py-3 px-6 text-center">
							<div className="flex item-center justify-center">
							
							{course.is_blocked ? (
                                    <button onClick={()=>{blockCourse(course.id)}} class="bg-red-200 text-red-800 hover:bg-red-300 hover:text-red-900 px-4 py-2 rounded-md">
                                    Blocked
                                  </button>

                                ) : (
                                    <button onClick={()=>{blockCourse(course.id)}} class="bg-green-200 text-green-800 hover:bg-green-300 hover:text-green-900 px-4 py-2 rounded-md">
                                    Active
                                  </button>

                                )}
							</div>
						</td>
						</tr>
					)
				})}
                
              </tbody>
            </table>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};

export default AdminCourseManagement;
