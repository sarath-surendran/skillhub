import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryWiseCourses = ({ id }) => {
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState([])
  const navigate = useNavigate();

  const fetchCategory = async () => {
    try{
        const response = await axios.get(
            `http://127.0.0.1:8000/courses/get_category/?id=${id}`
        )
        setCategory(response.data)
    }
    catch(error){
        console.error(error);
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/courses/view_full_courses_by_category/?id=${id}`
      );
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategory()
    fetchCourses();
  }, [id]);

  return (
    <div className='min-h-screen'>
      <div className="container mx-auto py-8 ">
        <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => {
            const imageUrl = `http://localhost:8000${course.thumbnail}`;
            return (
              <div
                key={course.id} // Add a unique key for each mapped element
                className="bg-white p-4 shadow-md transform transition-transform hover:scale-105 cursor-pointer"
                onClick={() => {
                  navigate(`/course/${course.id}`);
                }}
              >
                <img
                  src={imageUrl}
                  alt={course.thumbnail}
                  className="w-full h-48 object-cover mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                {course.is_free ? (
                  <p className="text-gray-600 mb-2">Free</p>
                ) : (
                  <p className="text-gray-600 mb-2">$ {course.enrollment_fee}</p>
                )}
                <button
                  className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 rounded transition-colors duration-300"
                  onClick={() => {
                    navigate(`/course/${course.id}`);
                  }}
                >
                  View Course
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseCourses;
