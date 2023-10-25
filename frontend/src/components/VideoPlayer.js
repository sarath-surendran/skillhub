    import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
    import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import config from '../config'
    
    const VideoPlayer = ({id, onLessonComplete}) => {

        // const {id} = useParams()

        const [played, setPlayed] = useState(0)
        const [lesson, setLesson] = useState([])
        const {authToken} = useContext(AuthContext)

        const fetchLesson = async () => {
            if (id != ''){
                const response = await axios.get(
                    `${config.axios_url}courses/view_courses/lessons/update_lesson/?id=${id}`
                )
                setLesson(response.data)
            }
        }

        const fetchPlayed = async () => {
            try{
                const response = await axios.get(
                    "the url with lesson id"
                )
                setPlayed(response.data.progress)
            }
            catch(error){
                console.error("Error fetching played details : ",error)
            }
        }

        const handleProgress = (progress) => {
                // axios.post(
                //     "send played time with lesson id"
                // )
                console.log(progress.played)
                // setPlayed(progress.played)
        }
        const handleVideoEnded = () => {
            axios.post(
                `${config.axios_url}course_progress/mark_lesson_as_complete/?id=${id}`,
                {progress:1.0},
                {
                    headers: {
                      //   "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${authToken.access}`,
                    },
                  }
            ).then(()=>{
                if (typeof onLessonComplete === 'function'){
                    onLessonComplete()
                }
            })
        }

        useEffect(()=>{
            // fetchPlayed()
            
            fetchLesson()
            // setPlayed(0.65)
        },[id])
      return (
        <div>
            <p>{id}</p>
            <p>{played}</p>
            
          <ReactPlayer
          url={lesson.content_video_url}
          controls
          onProgress={handleProgress}
          onEnded={handleVideoEnded}
          
        //   played={played}

          />
        </div>
      )
    }
    
    export default VideoPlayer
    