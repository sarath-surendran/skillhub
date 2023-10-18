import React, { useContext, useEffect, useState } from "react";
import UserSideBar from "../components/UserSideBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, Form } from "formik";
import Header from "../components/Header";

const UpdateCoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [thumbnailChange, setThumbnailChange] = useState(false);

  const [errorIndex, setErrorIndex] = useState(0);
  const [errorMessages, setErrorMessages] = useState([]);

  const [newThumbnailUrl, setNewThumbnailUrl] = useState("");

  useEffect(() => {
    if (errorMessages.length > 0) {
      alert(errorMessages[errorIndex][0]);
    }
  }, [errorMessages, errorIndex]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    course_duration: Yup.string().required("Duration is required."),
    course_highlight: Yup.string().required("Highlights are required"),
    course_objective: Yup.string().required("Objectives are required"),
    prerequisites: Yup.string().required("Prerequisites is required"),
    is_free: Yup.boolean(),
    enrollment_fee: Yup.number().test(
      "is-non-negative",
      "Enrollment fee must be a non-negative value",
      (value) => value >= 0
    ),
    thumbnail: Yup.mixed().test(
      "fileSize",
      "Thumbnail file size is too large",
      (value) => {
        if (!value) return true;
        return value.size <= 102400;
      }
    ),
    category_id: Yup.string().required("Category is required."),
  });

  const formikInitialValues = {
    title: course.title,
    description: course.description,
    course_duration: course.course_duration,
    course_highlight: course.course_highlight,
    course_objective: course.course_objective,
    prerequisites: course.prerequisites,
    is_free: course.is_free,
    enrollment_fee: course.enrollment_fee,
    category_id: categories.category_id,
    thumbnail: course.thumbnail,
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/courses/view_categories/"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories : ", error);
    }
  };

  const fetchCourseData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/courses/view_courses/update_course/?id=${id}`
      );
      setCourse(response.data);
    } catch (error) {
      console.error("error fetching course", error);
    }
  };

  useEffect(() => {
    fetchCourseData();
    fetchCategories();
  }, [id]);
  console.log(course)

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourse((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (event) => {
    const thumbnailFile = event.target.files[0];
    setThumbnailChange(true);
    setCourse((prevData) => ({
      ...prevData,
      thumbnail: thumbnailFile,
    }));
    let imageUrl = URL.createObjectURL(thumbnailFile);
    setNewThumbnailUrl(imageUrl);
  };

  const handleSubmit = async () => {
    console.log("submitted");
    console.log(course);
    const formData = new FormData();
    formData.append("title", course.title);
    formData.append("description", course.description);
    formData.append("is_free", course.is_free);
    
    formData.append("course_duration", course.course_duration);
    formData.append("course_highlight", course.course_highlight);
    formData.append("course_objective", course.course_objective);
    formData.append("prerequisites", course.prerequisites);
    formData.append("category_id", course.category_id);
    formData.append("category_id", course.category_id);
    formData.append("instructor_id", course.instructor_id);

    if (course.enrollment_fee == null){
      formData.append('enrollment_fee',0)
    }
    else{
      formData.append("enrollment_fee",course.enrollment_fee)
    }

    if (thumbnailChange) {
      formData.append("thumbnail", course.thumbnail);
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/courses/view_courses/update_course/?id=${id}`,
        // courseData,
        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      );
      console.log("Course and lessons created:", response.data);
      navigate("/profile/my_courses");
    } catch (error) {
      console.error("Error creating course:", error.response);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        setErrorMessages(Object.values(errorData));
        setErrorIndex(0);
      }
    }
  };
  let imageUrl = ''
  if (!thumbnailChange){
        
        imageUrl = `http://localhost:8000${course.thumbnail}`
        
  }
  console.log("imageurl:",newThumbnailUrl)

  return (
    <div>
      <Header/>
      <div className="flex min-h-screen">
      <div className="w-1/4 bg-gray-200 p-4">
        <UserSideBar />
      </div>
      <div className="w-3/4 p-4">
        <div className="flex justify-center items-center min-h-screen">
          <div className="p-4 w-full  shadow-lg rounded-lg">
            <Formik
              initialValues={formikInitialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {(formikProps)=>(
                <Form className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Title
                  </label>
                  <div className="mt-2">
                    <Field
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Title"
                      value={course.title}
                      required
                      onChange={(e) => {
                        formikProps.setFieldValue("title", e.target.value);
                        handleCourseChange(e);
                      }}
                      className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Description
                  </label>
                  <div className="mt-2">
                    <Field
                      id="description"
                      name="description"
                      type="text"
                      placeholder="Description"
                      value={course.description}
                      onChange={(e) => {
                        formikProps.setFieldValue(
                          "description",
                          e.target.value
                        );
                        handleCourseChange(e);
                      }}
                      required
                      className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="category_id"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Category
                  </label>
                  <div className="mt-2">
                    <Field
                      as="select"
                      id="category_id"
                      name="category_id"
                      value={course.category_id}
                      onChange={(e) => {
                        formikProps.handleChange(e); // Handle Formik field change
                        handleCourseChange(e); // Handle courseData change
                      }}
                      onBlur={formikProps.handleBlur} // Handle field blur
                      className="w-full px-4 py-2 border rounded-lg shadow"
                    >
                      <option value="">Select a Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category_id"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                  <Field
                    type="checkbox"
                    id="is_free"
                    name="is_free"
                    checked={course.is_free}
                    onChange={() =>
                      setCourse((prevData) => ({
                        ...prevData,
                        is_free: !prevData.is_free,
                      }))
                    }
                    className="w-5 h-5 mr-2 rounded-lg shadow"
                  />
                  <label className="font-semibold">Is Free</label>
                </div>
                {!course.is_free && (
                  <div>
                    <label
                      htmlFor="enrollment_fee"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Enrollment Fee
                    </label>
                    <div className="mt-2">
                      <Field
                        id="enrollment_fee"
                        name="enrollment_fee"
                        type="number"
                        placeholder="Enrollment fee"
                        value = {course.enrollment_fee}
                        required={!formikProps.values.is_free}
                        className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e) => {
                          formikProps.setFieldValue(
                            "enrollment_fee",
                            e.target.value
                          );
                          handleCourseChange(e);
                        }}
                      />
                      <ErrorMessage
                        name="enrollment_fee"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label
                    htmlFor="course_duration"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Course Duration
                  </label>
                  <div className="mt-2">
                    <Field
                      id="course_duration"
                      name="course_duration"
                      type="text"
                      value={course.course_duration}
                      required
                      className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(e) => {
                        formikProps.setFieldValue(
                          "course_duration",
                          e.target.value
                        );
                        handleCourseChange(e);
                      }}
                    />
                    <ErrorMessage
                      name="course_duration"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="course_highlight"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Course Highlight
                  </label>
                  <div className="mt-2">
                    <Field
                      id="course_highlight"
                      name="course_highlight"
                      type="text"
                      value={course.course_highlight}
                      className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(e) => {
                        formikProps.setFieldValue(
                          "course_highlight",
                          e.target.value
                        );
                        handleCourseChange(e);
                      }}
                    />
                    <ErrorMessage
                      name="course_highlight"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="course_objective"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Course Objective
                  </label>
                  <div className="mt-2">
                    <Field
                      id="course_objective"
                      name="course_objective"
                      type="text"
                      value={course.course_objective}
                      className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(e) => {
                        formikProps.setFieldValue(
                          "course_objective",
                          e.target.value
                        );
                        handleCourseChange(e);
                      }}
                    />
                    <ErrorMessage
                      name="course_objective"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="prerequisites"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Prerequisites
                  </label>
                  <div className="mt-2">
                    <Field
                      id="prerequisites"
                      name="prerequisites"
                      value={course.prerequisites}
                      type="text"
                      className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(e) => {
                        formikProps.setFieldValue(
                          "prerequisites",
                          e.target.value
                        );
                        handleCourseChange(e);
                      }}
                    />
                    <ErrorMessage
                      name="prerequisites"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="thumbnail"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Thumbnail
                  </label>
                  <div className="mt-2">
                  {thumbnailChange ? (
                    <img
                    src={newThumbnailUrl}
                    alt="Course Thumbnail"
                    className="max-w-xs max-h-xs"
                  />
                  ) : (
                    <img
                    src={imageUrl}
                    alt="Course Thumbnail"
                    className="max-w-xs max-h-xs"
                  />
                  )}
                    <Field
                      id="thumbnail"
                      name="thumbnail"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      onChange={(e) => {
                        //   formikProps.setFieldValue("thumbnail", e.target.files[0]);
                        handleThumbnailChange(e);
                      }}
                      className="block border-0 text-gray-900 focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <ErrorMessage
                      name="thumbnail"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>

                <button
                type="button"
                onClick={(e) => { 
                  e.preventDefault()// Prevent the default form submission
                  handleSubmit(); // Call the handleSubmit function
                  }}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Update Course
              </button>
              </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UpdateCoursePage;
