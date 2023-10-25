import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import AuthContext from '../context/AuthContext'
import config from '../config'

const AdminInstructorManagement = () => {

    const [instructors, setInstructors] = useState([])
    const {authToken} =  useContext(AuthContext)

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
            setInstructors(response.data)
            console.log('instructor ',response.data)
        }
    }
    const [expandedCourseId, setExpandedCourseId] = useState(null);

    const toggleCourseDetails = (courseId) => {
        if (expandedCourseId === courseId) {
            setExpandedCourseId(null);
        } else {
            setExpandedCourseId(courseId);
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
                fetchAllInstructors()
            }
        }
        catch(error){
            console.error("error in blocking user",error)
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
            fetchAllInstructors()
          }
        }
        catch(error){
          console.error('error suspending user',error)
        }
      }

    useEffect(()=>{
        fetchAllInstructors()
    },[])

  return (
    <div>
      <div className='pt-8'>
        <p>Instructor management</p>
        <table>
            <tr>
                <th className="p-4">Sl. No</th>
                <th className="p-4">Instructor Id</th>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Status</th>
                <th className='p-4'>Courses</th>
                <th className='p-4'>Enrolled Students</th>
                <th className="p-4">Actions</th>
          </tr>
          {instructors.map((instructor,index)=>{
            const instructor_image = `${config.media_url}${instructor.image}`;
            return(
                <tr>
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{instructor.id}</td>
                    <td className="p-4"><img src={instructor_image} alt={instructor.name} style={{ maxWidth: "100px", maxHeight: "100px" }}/></td>
                    <td className="p-4">{instructor.name}</td>
                    <td className='p-4 cursor-pointer' onClick={()=>{blockUser(instructor.id)}}>
                        {instructor.is_active ? (
                        <span className="text-blue-500 font-bold">Active</span>
                    ) : (
                        <span className="text-red-500 fond-bold">Blocked</span>
                    )}
                        </td>
                        <td className='p-4'>
                            <ul>
                                {instructor.courses.map((course) => {
                                    return(
                                    <li className='mb-4 border rounded-lg' key={course.id}>{course.title}</li>
                                )})}
                            </ul>
                        </td>
                        <td className='p-4'>
                            <ul>
                                {instructor.courses.map((course) => {
                                    const course_image =  `${config.media_url}${course.thumbnail}`
                                    return(
                                    <li className=' text-center mb-4 border rounded-lg' onClick={() => toggleCourseDetails(course.id)} key={course.id}>
                                        {/* <img src={course_image} alt={course.name} style={{ maxWidth: "100px", maxHeight: "100px" }}/> */}
                                        {course.enrolled_students_count}
                                        {expandedCourseId === course.id && (
                                                        <ul>
                                                            {course.enrolled_students.map((student) => (
                                                                <li key={student.student_name}>
                                                                    Student Name: {student.student_name}, Progress: {student.student_progress}%
                                                                </li>
                                                            ))}
                                                        </ul>)}
                                    </li>
                                )})}
                            </ul>
                        </td>
                        <td className='p-4'>
                        <div className="flex space-x-3">
                            
                            <button onClick={()=>{suspend(instructor.id)}} className="bg-red-200 text-red-800 hover:bg-red-300 hover:text-red-900 px-1 py-2 rounded-md">
                            Suspend
                        </button>
                        </div>
                        </td>
                </tr>
            )
          })}

        </table>
      </div>
    </div>
  )
}

export default AdminInstructorManagement
