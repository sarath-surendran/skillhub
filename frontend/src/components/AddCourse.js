import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, Form, FieldArray } from "formik";
import storage from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import UserSideBar from "./UserSideBar";
import { v4 as uuidv4 } from "uuid";
import config from "../config";

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    is_free: false,
    enrollment_fee: "",
    course_duration: "",
    course_highlight: "",
    course_objective: "",
    prerequisites: "",
    category_id: "",
    thumbnail:null,
    lessons: [],
  });

  //   const durationFormat = (value) => {
  // 	const parsedDuration = moment.duration(value)
  // 	const formattedDuration = moment.utc(parsedDuration.asMilliseconds()).format('DD HH:mm:ss.SSSSSS')
  // 	return formattedDuration
  //   }

  const [categories, setCategories] = useState([]);
  const { authToken } = useContext(AuthContext);
  const [allUploadsComplete, setAllUploadsComplete] = useState(false);
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);


  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${config.axios_url}courses/view_categories/`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories : ", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [errorIndex, setErrorIndex] = useState(0);
  const [errorMessages, setErrorMessages] = useState([]);

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
    // enrollment_fee: Yup.number().when("is_free", {
    //   is: false,
    //   then: Yup.number().required(
    //     "Enrollment fee is required when the course is not free."
    //   ),
    // }),
    // thumbnail: Yup.mixed().test(
    //   'fileSize',
    //   'Thumbnail file size is too large',
    //   (value) => {
    //     if (!value) return true; 
    //     return value.size <= 102400; // 100 KB
    //   }
    // ),
    // lessons: Yup.array().of(
    //   Yup.object().shape({
    //     title: Yup.string().required("Lesson title is required."),
    //     content_video_url: Yup.string(),
    //   })
    // ),
    category_id: Yup.string().required("Category is required."),
  });

  const formikInitialValues = {
    title: "",
    description: "",
    course_duration: "",
    course_highlight: "",
    course_objective: "",
    prerequisites: "",
    is_free: false,
    enrollment_fee: "",
    category_id: "",
    // thumbnail: null,
    lessons: [{ title: "", content_video_url: "" }],
  };

  const handleCourseChange = (e) => {
    const { name, value } = e.target;

    // if(name === 'course_duration'){
    // 	const parsedDuration = moment.duration(value)
    // 	const formattedDuration = moment.utc(parsedDuration.asMilliseconds()).format('DD HH:mm:ss.SSSSSS')
    // 	setCourseData((prevData)=>({
    // 		...prevData,
    // 		[name]:formattedDuration,
    // 	}))
    // }
    // else{
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // }
  };
  //   const formatDurationForDisplay = (formattedDuration) => {
  // 	if (!formattedDuration) {
  // 	  return "No duration provided"; // or any appropriate message
  // 	}

  // 	const [days, time] = formattedDuration.split(" ");
  // 	const [hours, minutes, seconds] = time.split(":");
  // 	return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
  //   };

  //   console.log(formatDurationForDisplay(courseData.course_duration))
  // for(const [key, value] of formData.entries()){
  // 	console.log(`${key} : ${value}`)
  // }

  const handleLessonAdd = () => {
    setCourseData((prevData) => ({
      ...prevData,
      lessons: [...prevData.lessons, { title: "", content_video_url: null }],
      // the original line is---- lessons: [...prevData.lessons, { title: '', content_video: null }],
    }));
  };

  const handleLessonChange = (index, field, value) => {
    console.log("index : ", index);
    const updatedLessons = [...courseData.lessons];
    updatedLessons[index][field] = value;
    setCourseData((prevData) => ({
      ...prevData,
      lessons: updatedLessons,
    }));
  };

  // const handleLessonChange = (index, field, value) => {
  // 	const updatedLessons = [...courseData.lessons];

  // 	// Check if the lesson at the specified index exists
  // 	if (updatedLessons[index]) {
  // 	  updatedLessons[index][field] = value;
  // 	  setCourseData((prevData) => ({
  // 		...prevData,
  // 		lessons: updatedLessons,
  // 	  }));
  // 	}
  //   };

  useEffect(() => {
    if (
      uploadProgress.length > 0 &&
      uploadProgress.every((progress) => progress === 100)
    ) {
      setAllUploadsComplete(true);
    } else {
      setAllUploadsComplete(false);
    }
  }, [uploadProgress]);

  const handleLessonVideoChange = (index, event) => {
    const videoFile = event.target.files[0];
    if (videoFile) {
      console.log("Video file present");
      try {
        const uniqueId = uuidv4();
        const fileName = `${uniqueId}`;

        const storage = getStorage();
        const storageRef = ref(storage, `lesson_videos/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

            console.log(`Upload is ${progress}% done`);
            const updatedProgress = [...uploadProgress];
            updatedProgress[index] = progress;
            setUploadProgress(updatedProgress);
          },
          (error) => {
            console.error("Error uploading video : ", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(downloadURL);
            handleLessonChange(index, "content_video_url", downloadURL);
          }
        );
      } catch (error) {
        console.error("error handling video upload : ", error);
      }
    }

    // handleLessonChange(index, "content_video", videoFile); {only this line is there in originally worked code after defining the video file. total 2 lines in this function}
  };

  const handleThumbnailChange = (event) => {
    const thumbnailFile = event.target.files[0];
    setCourseData((prevData) => ({
      ...prevData,
      thumbnail: thumbnailFile,
    }));
    const reader = new FileReader()
    reader.onload = (e) => {
      const previewImage = e.target.result
      setThumbnailPreview(previewImage)
    }
    if (thumbnailFile){
      reader.readAsDataURL(thumbnailFile)
    }
  };

  console.log("with image", courseData);
  const handleSubmit = async () => {
    console.log("submitted");
    const formData = new FormData();
    formData.append("title", courseData.title);
    formData.append("description", courseData.description);
    formData.append("is_free", courseData.is_free);
    formData.append("enrollment_fee", courseData.enrollment_fee);
    formData.append("course_duration", courseData.course_duration);
    formData.append("course_highlight", courseData.course_highlight);
    formData.append("course_objective", courseData.course_objective);
    formData.append("prerequisites", courseData.prerequisites);
    formData.append("category_id", courseData.category_id);
    formData.append("thumbnail", courseData.thumbnail);
    console.log(formData.get("title"));
    // Append the lessons array to the form data
    formData.append("lessons", JSON.stringify(courseData.lessons));

    // Append video files for each lesson
    courseData.lessons.forEach((lesson, index) => {
      if (lesson.content_video_url) {
        formData.append(`lesson_videos[${index}]`, lesson.content_video_url);
      }
    });
    console.log("Submitted");
    console.log("lesson video : ", formData.get("lesson_videos[0]"));
    const uploadedThumbnail = formData.get("thumbnail");
    console.log("image : ", uploadedThumbnail);

    try {
      const response = await axios.post(
        `${config.axios_url}courses/add_course/`,
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

  return (
    <div className="flex min-h-screen">
      <div className="w-1/4 bg-gray-200 p-4">
        <UserSideBar />
      </div>
      {/* <div className="3/4 p-4"> */}
      <div className="w-3/4 p-4">
        <div className="p-4 w-full  shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Create a New Course</h2>
          <Formik
            initialValues={formikInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(formikProps) => (
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
                      value={courseData.title}
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
                      value={courseData.category_id}
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
                    checked={courseData.is_free}
                    onChange={() =>
                      setCourseData((prevData) => ({
                        ...prevData,
                        is_free: !prevData.is_free,
                      }))
                    }
                    className="w-5 h-5 mr-2 rounded-lg shadow"
                  />
                  <label className="font-semibold">Is Free</label>
                </div>
                {!courseData.is_free && (
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
                    <Field
                      id="thumbnail"
                      name="thumbnail"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      onChange={(e) => {
                        // formikProps.setFieldValue("thumbnail", e.currentTarget.files[0]);
                        handleThumbnailChange(e);
                      }}
                      // onChange={handleThumbnailChange}
                      className="block border-0 text-gray-900 focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <ErrorMessage
                      name="thumbnail"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="mt-2 max-w-xs"
                    />
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lessons"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Lessons
                  </label>
                  <div className="mt-2">
                    {/* <FieldArray name="lessons">
                      {(arrayHelpers) => (
                        <div>
                          {formikProps.values.lessons.map((lesson, index) => (
                            <div key={index} className="mb-4">
                              <div className="flex justify-between">
                                <div>
                                  <label
                                    htmlFor={`lessons.${index}.title`}
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                  >
                                    Lesson Title
                                  </label>
                                  <Field
                                    id={`lessons.${index}.title`}
                                    name={`lessons.${index}.title`}
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 px-1 py-1.5 pl-8 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(e) => {
                                      formikProps.setFieldValue(
                                        `lessons.${index}.title`,
                                        e.target.value
                                      );
                                      handleLessonChange(
                                        index,
                                        "title",
                                        e.target.value
                                      );
                                    }}
                                  />
                                  <ErrorMessage
                                    name={`lessons.${index}.title`}
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>
                                <div className="flex items-center">
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium leading-4 text-red-700 bg-red-100 border border-red-300 rounded-full hover:bg-red-200 focus:outline-none focus:ring focus:ring-red-200 active:bg-red-200"
                                  >
                                    Remove Lesson
                                  </button>
                                </div>
                              </div>
                              <div className="mt-4">
                                <label
                                  htmlFor={`lessons.${index}.content_video_url`}
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Video URL
                                </label>
                                <Field
                                  id={`lessons.${index}.content_video`}
                                  name={`lessons.${index}.content_video`}
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) =>
                                    handleLessonVideoChange(index, e)
                                  }
                                  className="w-full px-4 py-2 border rounded-lg shadow"
                                />
                                <ErrorMessage
                                  name={`lessons.${index}.content_video_url`}
                                  component="div"
                                  className="text-red-500"
                                />
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                            //   arrayHelpers.push({
                            //     title: "",
                            //     content_video_url: "",
                            //   })
							handleLessonAdd()
							  
                            }
                            className="mt-2 inline-flex items-center px-2 py-1 text-xs font-medium leading-4 text-indigo-700 bg-indigo-100 border border-indigo-300 rounded-full hover:bg-indigo-200 focus:outline-none focus:ring focus:ring-indigo-200 active:bg-indigo-200"
                          >
                            Add Lesson
                          </button>
                        </div>
                      )}
                    </FieldArray> */}
                    {courseData.lessons.map((lesson, index) => (
                      <div key={index}>
                        <h3>Lesson {index + 1}</h3>
                        <input
                          type="text"
                          name={`lessons[${index}].title`}
                          placeholder="Lesson Title"
                          value={lesson.title}
                          onChange={(e) =>
                            handleLessonChange(index, "title", e.target.value)
                          }
                          className="w-full px-4 py-2 border rounded-lg shadow"
                        />
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleLessonVideoChange(index, e)}
                          className="w-full px-4 py-2 border rounded-lg shadow"
                        />
                        {uploadProgress[index] < 100 && (
                          <span className="text-red-500">
                            Video uploading. {uploadProgress[index]} %
                          </span>
                        )}
                        {uploadProgress[index] == 100 && (
                          <span className="text-red-500">Video uploaded</span>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleLessonAdd}
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                      Add Lesson
                    </button>
                    <br />
                    <br />
                  </div>
                </div>
                {}
                <button
                  type="submit"
                  className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                    !allUploadsComplete && "cursor-not-allowed opacity-50"
                  }`}
                  disabled={!allUploadsComplete}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent the default form submission
                    handleSubmit(); // Call the handleSubmit function
                  }}
                >
                  Create Course
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default AddCourse;
