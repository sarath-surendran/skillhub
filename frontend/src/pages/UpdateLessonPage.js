import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserSideBar from "../components/UserSideBar";
import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import AuthContext from "../context/AuthContext";
import Header from "../components/Header";
import config from "../config";

const UpdateLessonPage = () => {
  const { id, course_id } = useParams();
  const [lesson, setLesson] = useState({});
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  // const [formData, setFormData] = useState({})

  const [errorIndex, setErrorIndex] = useState(0);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    if (errorMessages.length > 0) {
      alert(errorMessages[errorIndex][0]);
    }
  }, [errorMessages, errorIndex]);

  const fetchLessonData = async () => {
    try {
      const response = await axios.get(
        `${config.axios_url}courses/view_courses/lessons/update_lesson/?id=${id}`
      );
      setLesson(response.data);
      // setFormData(response.data)
    } catch (error) {
      console.error("error fetching lesson data : ", error);
    }
  };

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setLesson({ ...lesson, [name]: value });
  };

  const handleLessonVideoChange = (event) => {
    const videoFile = event.target.files[0];
    if (videoFile) {
      console.log("Video file present");
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `lesson_videos/${videoFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

            console.log(`Upload is ${progress}% done`);
            console.log(lesson);
          },
          (error) => {
            console.error("Error uploading video : ", error);
          },
          async (e) => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(downloadURL);
            setLesson((prevlesson) => ({
              ...prevlesson,
              content_video_url: downloadURL,
            }));
          }
        );
      } catch (error) {
        console.error("error handling video upload : ", error);
      }
    }

    // handleLessonChange(index, "content_video", videoFile); {only this line is there in originally worked code after defining the video file. total 2 lines in this function}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", lesson.title);
    formData.append("content_video_url", lesson.content_video_url);
    formData.append("course", lesson.course);

    try {
      const response = await axios.put(
        `${config.axios_url}courses/view_courses/lessons/update_lesson/?id=${id}`,
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
      navigate(`/profile/my_courses/lessons/${course_id}`);
    } catch (error) {
      console.error("Error creating course:", error.response);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        setErrorMessages(Object.values(errorData));
        setErrorIndex(0);
      }
    }
  };

  useEffect(() => {
    fetchLessonData();
  }, [id]);

  return (
    <div>
      <Header/>
      <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200 p-4">
        <UserSideBar />
      </div>
      <div className="w-3/4 p-4">
        <form className="space-y-4">
          <div key={lesson.id}>
            <h3>{lesson.title}</h3>
            <input
              type="text"
              name="title"
              placeholder="Lesson Title"
              value={lesson.title || ""}
              onChange={(e) => handleLessonChange(e)}
              className="w-full px-4 py-2 border rounded-lg shadow"
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleLessonVideoChange(e)}
              className="w-full px-4 py-2 border rounded-lg shadow"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Update Lesson
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default UpdateLessonPage;
