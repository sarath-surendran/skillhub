import React, { useContext, useEffect, useState } from 'react'
import VideoPlayer from '../components/VideoPlayer'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import AddReviewAndRating from '../components/AddReviewAndRating'
import AuthContext from '../context/AuthContext'
import ProgressBar from '../components/ProgressBar'
import Header from '../components/Header'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';


const EnrolledCoursePage = () => {
    const {id} = useParams()
   
    const [lessons, setLessons] = useState([])
    const [course, setCourse] = useState([])
    const [toPlay, setToPlay] =  useState('')
    const [completedCourses, setCompletedCourses] = useState([])
    const {authToken, user} = useContext(AuthContext)
    const [progress, setProgress] = useState()
    
    const navigate = useNavigate()
    
    const fetchLessons = async () => {
        const response = await axios.get(
            `http://127.0.0.1:8000/courses/view_courses/lessons/?id=${id}`
        )
        setLessons(response.data)
        // console.log("data",response.data[0].id)
        setToPlay(response.data[0].id)
    }
    // console.log("fetched lessons:",lessons);

    const fetchCourseDetails = async () => {
      try{
          const response = await axios.get(
              `http://127.0.0.1:8000/courses/get_course/?id=${id}`,
              {
                headers: {
                  //   "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${authToken.access}`,
                },
              }
          )
          
          setCourse(response.data)
          // console.log(response.data)
      }
      catch(error){
          console.error(error)
      }
  }

  const fetchProgress = async () => {
    console.log("called progress")
    const response = await axios.get(
      `http://127.0.0.1:8000/course_progress/get_progress/?id=${id}`,
      {
        headers: {
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken.access}`,
        },
      }
    )
    console.log(response.data.progress)
    setProgress(response.data.progress)
  }

    const fetchCompleted = async () => {
      console.log('called completed')
      // get completed courses from backend and update the state completedCourses
      try{
          const response = await axios.get(
              `http://127.0.0.1:8000/course_progress/get_completed_lessons/?id=${id}`,
              {
                headers: {
                  //   "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${authToken.access}`,
                },
              }
          )

          setCompletedCourses(response.data.data)
          // console.log(response.data.data)
      }
      catch(error){
          console.error(error)
      }
    }
    
    const handleLessonComplete = () => {
      fetchCompleted()
      fetchProgress()
    }

  
    useEffect(()=>{
        fetchLessons()
        fetchCourseDetails()
        fetchCompleted()
        fetchProgress()
    },[id])
    console.log('progress',progress)
    
    let room_name = ''
    if(course && course.length > 0){
       room_name = `chat_${user.id}_${course[1].instructor_id}`;
    }

    const handleCertificateDownload = () => {
      // Create a div for the certificate content
      const certificateContent = document.createElement('div');
      certificateContent.id = 'certificate-container';
      // certificateContent.innerHTML = `
      // <h1 class="text-2xl font-bold text-center">Certificate of Completion</h1>
      // <p class="mt-4 text-lg">This is to certify that</p>
      // <p class="text-2xl font-bold">${user.name}</p>
      // <p class="mt-4 text-lg">has successfully completed the course:</p>
      // <p class="text-2xl font-bold">${course[0].title}</p>
      // <p class="mt-4 text-lg">Completion Date:</p>
      // <p class="text-2xl font-bold">${new Date().toLocaleDateString()}</p>
      // `;
      certificateContent.innerHTML = `
      <head>
        <style type='text/css'>
        @import url('https://fonts.googleapis.com/css?family=Open+Sans|Pinyon+Script|Rochester');

        .cursive {
          font-family: 'Pinyon Script', cursive;
        }
        
        .sans {
          font-family: 'Open Sans', sans-serif;
        }
        
        .bold {
          font-weight: bold;
        }
        
        .block {
          display: block;
        }
        
        .underline {
          border-bottom: 1px solid #777;
          padding: 5px;
          margin-bottom: 15px;
        }
        
        .margin-0 {
          margin: 0;
        }
        
        .padding-0 {
          padding: 0;
        }
        
        .pm-empty-space {
          height: 40px;
          width: 100%;
        }
        
        body {
          padding: 20px 0;
          background: #ccc;
        }
        
        .pm-certificate-container {
          position: relative;
          width: 800px;
          height: 600px;
          background-color: #618597;
          padding: 30px;
          color: #333;
          font-family: 'Open Sans', sans-serif;
          box-shadow: 0 0 5px rgba(0, 0, 0, .5);
          /*background: -webkit-repeating-linear-gradient(
            45deg,
            #618597,
            #618597 1px,
            #b2cad6 1px,
            #b2cad6 2px
          );
          background: repeating-linear-gradient(
            90deg,
            #618597,
            #618597 1px,
            #b2cad6 1px,
            #b2cad6 2px
          );*/
          
          .outer-border {
            width: 794px;
            height: 594px;
            position: absolute;
            left: 50%;
            margin-left: -397px;
            top: 50%;
            margin-top:-297px;
            border: 2px solid #fff;
          }
          
          .inner-border {
            width: 730px;
            height: 530px;
            position: absolute;
            left: 50%;
            margin-left: -365px;
            top: 50%;
            margin-top:-265px;
            border: 2px solid #fff;
          }
        
          .pm-certificate-border {
            position: relative;
            width: 720px;
            height: 520px;
            padding: 0;
            border: 1px solid #E1E5F0;
            background-color: rgba(255, 255, 255, 1);
            background-image: none;
            left: 50%;
            margin-left: -360px;
            top: 50%;
            margin-top: -260px;
        
            .pm-certificate-block {
              width: 650px;
              height: 200px;
              position: relative;
              left: 50%;
              margin-left: -325px;
              top: 70px;
              margin-top: 0;
            }
        
            .pm-certificate-header {
              margin-bottom: 10px;
            }
        
            .pm-certificate-title {
              position: relative;
              top: 40px;
        
              h2 {
                font-size: 34px !important;
              }
            }
        
            .pm-certificate-body {
              padding: 20px;
        
              .pm-name-text {
                font-size: 20px;
              }
            }
        
            .pm-earned {
              margin: 15px 0 20px;
              .pm-earned-text {
                font-size: 20px;
              }
              .pm-credits-text {
                font-size: 15px;
              }
            }
        
            .pm-course-title {
              .pm-earned-text {
                font-size: 20px;
              }
              .pm-credits-text {
                font-size: 15px;
              }
            }
        
            .pm-certified {
              font-size: 12px;
        
              .underline {
                margin-bottom: 5px;
              }
            }
        
            .pm-certificate-footer {
              width: 650px;
              height: 100px;
              position: relative;
              left: 50%;
              margin-left: -325px;
              bottom: -105px;
            }
          }
        }
        
        </style>
    </head>
    <body>
  <div class="container pm-certificate-container">
    <div class="outer-border"></div>
    <div class="inner-border"></div>
    
    <div class="pm-certificate-border col-xs-12">
      <div class="row pm-certificate-header">
        <div class="pm-certificate-title cursive col-xs-12 text-center">
          <h2>Certificate of Completion</h2>
        </div>
      </div>

      <div class="row pm-certificate-body">
        
        <div class="pm-certificate-block">
            <div class="col-xs-12">
              <div class="row">
                <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
                <div class="pm-certificate-name underline margin-0 col-xs-8 text-center">
                  <span class="pm-name-text bold">${user.name}</span>
                </div>
                <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
              </div>
            </div>          

            
            
            <div class="col-xs-12">
              <div class="row">
                <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
                <div class="pm-course-title col-xs-8 text-center">
                  <span class="pm-earned-text block cursive">has completed the training course entitled</span>
                </div>
                <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
              </div>
            </div>

            <div class="col-xs-12">
              <div class="row">
                <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
                <div class="pm-course-title underline col-xs-8 text-center">
                  <span class="pm-credits-text block bold sans">${course[0].title}</span>
               
            </div>
        </div>       
        
        <div class="col-xs-12">
          <div class="row">
            <div class="pm-certificate-footer">
                <div class="col-xs-4 pm-certified col-xs-4 text-center">
                  <span class="pm-credits-text block sans">SkillHub</span>
                  <span class="pm-empty-space block underline"></span>
                  <span class="bold block"></span>
                </div>
                <div class="col-xs-4">
                  <!-- LEAVE EMPTY -->
                </div>
                <div class="col-xs-4 pm-certified col-xs-4 text-center">
                  <span class="pm-credits-text block sans">Date Completed : </span>
                  <span class="pm-empty-space block underline"></span>
                  
                </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</body>
      `
    
      // Append the certificate content to the body temporarily
      document.body.appendChild(certificateContent);
    
      // Convert HTML content to canvas
      html2canvas(certificateContent).then((canvas) => {
        const contentWidth = certificateContent.offsetWidth;
        const contentHeight = certificateContent.offsetHeight;
        // const aspectRatio = contentWidth / contentHeight;

        // Set the PDF dimensions based on the aspect ratio
        // const pdfWidth = 800; // You can adjust this based on your needs
        // const pdfHeight = pdfWidth / aspectRatio;
        // alert(contentWidth/2)
        const pdf = new jsPDF('p', 'px', [contentHeight,contentWidth/2]); // Set the dimensions to 1056px x 816px
        const imgData = canvas.toDataURL('image/png');
    
        // Add the image to the PDF at position (0, 0)
        pdf.addImage(imgData, 'PNG', 0, 0);
    
        pdf.save(`certificate_${user.name}_${course[0].title}.pdf`);
    
        // Remove the certificate content from the body
        document.body.removeChild(certificateContent);
      });
    };
    

  return (
    // <div>
    //   <p>lesson video playing</p>
    //   <VideoPlayer id={toPlay}/>
    //   {lessons.map((lesson)=>{
    //     return(
    //         <li onClick={()=>setToPlay(lesson.id)} className='cursor-pointer'>{lesson.title}</li>
    //     )
    //   })}
    //   <AddReviewAndRating course_id={id}/>
    // </div>
    <div>
      <Header/>
      <div>
      {/* Top section */}
      {course && course.length > 0 && course[0] && (
        
        <div className="bg-gray-800 py-4 px-6">
          <div className="flex justify-center items-center mb-4">
            {/* Conditional rendering of course title */}
            <h1 className="text-white text-2xl font-bold">{course[0].title}</h1>
          </div>
          <div className="flex mt-4 mb-2">
            {/* Course image */}
            <div className="w-1/2">
              {/* Uncomment the image code when you have the image URL */}
              {/* <img
                src={imageUrl}
                alt="Course"
                className="w-full h-auto"
              /> */}
              <VideoPlayer id={toPlay} onLessonComplete={handleLessonComplete}/>
            </div>
            <div className="w-2/3 p-8">
              {/* Instructor section */}
              <div className="flex items-center">
                {/* Uncomment the instructor image code when available */}
                {/* <img
                  src="instructor-photo.jpg"
                  alt="Instructor"
                  className="w-8 h-8 rounded-full mr-2"
                /> */}
                <span className="text-white">{course[1].instructor}</span>
              </div>
              {/* Course description */}
              <p className="text-white mt-2 font-bold">{course[0].description}</p>
              {/* Course price and enroll button */}
              <div className="flex items-center mt-4">
                {/* <p className="text-white font-bold mr-2">$99.99</p> */}
                {course[0].is_free ? <p className="text-white font-bold mr-2">Free</p> :<p className="text-white font-bold mr-2">$ {course[0].enrollment_fee}</p>}
                
              </div>
              {/* Course duration */}
              <p className="text-white mt-4 font-bold">Course Duration: {course[0].course_duration}</p>
              
              <div>
          {/* ... other content ... */}
          {progress !== 100 ? 
          (<div className="mt-4">
          <p className="text-white">Progress :</p>
          <ProgressBar progress={progress} /> {/* Pass the progress prop */}
        </div>) : (
          <div className='mt-4'>
            <button onClick={handleCertificateDownload} className="bg-green-500 text-white px-4 py-2 rounded-full">Certificate</button>
          </div>
        )}
            <div className='p-2 mt-2 space-y-4 space-x-6'>
              <button onClick={()=>{navigate(`chat`, { state: { recieverId: course[1].instructor_id, courseId: id } })}} className="bg-green-500 text-white px-4 py-2 rounded-full">Chat with Instructor</button>
              <button onClick={()=>{navigate(`community_chat`, { state: { courseId: id } })}} className="bg-green-500 text-white px-4 py-2 rounded-full">Community</button>
            </div>
          </div>
            </div>
          </div>
        </div>
      )}
    {/* Remaining sections */}
      {course && course.length > 0 && course[0] && (
        
      <div className="p-6">
      {/* Course Highlights */}
      {/* <div className='p-3'>
        <h2 className="text-2xl font-semibold">Course Highlights</h2>
        <p>
          {course[0].course_highlight}
        </p>
      </div> */}

      {/* What Will You Learn */}
      <div className="mt-6 p-3">
        <h2 className="text-2xl font-semibold">Lessons</h2>
        <ul className='mt-3'>
          {course[0].lessons.map((lesson,index)=>{
            const isLessonCompleted = completedCourses.includes(lesson.id);
            return(
                <li onClick={()=>setToPlay(lesson.id)} className={`cursor-pointer py-2 px-4 mb-2 rounded-lg ${
                  isLessonCompleted ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`} key={index}>{index+1}. {lesson.title}</li>
            )
          })}
          
        </ul>
      </div>

      {/* Prerequisites */}
      {/* <div className="mt-6 p-3">
        <h2 className="text-2xl font-semibold">Prerequisites</h2>
        <p>
          {course[0].prerequisites}
        </p>
      </div> */}

      
    </div>
      )}

      <AddReviewAndRating course_id={id}/>
    </div>
    </div>
    
  )
}

export default EnrolledCoursePage
