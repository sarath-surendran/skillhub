import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import AuthContext from '../context/AuthContext'
import axios from 'axios'

const CommunityChat = ({course_id}) => {

    const [ws,setWs] = useState(null)
	const [message, setMessage] = useState("")
	const [chatLog, setChatLog] = useState([])
	const {user, authToken} = useContext(AuthContext)
  const [courseDetails, setCourseDetails] = useState([])

  const fetchMessages = async () => {
    try{
      const response = await axios.get(
        `http://127.0.0.1:8000/chats/get_community_messages/?id=${course_id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      )
      if(response.status === 200){
        setChatLog(response.data)
      }
    } 
    catch(error){
      console.error("error getting communty messages", error);
    }
  }

  const fetchCourseDetails = async () => {
    try{
      const response = await axios.get(
        `http://127.0.0.1:8000/chats/get_course_details/?id=${course_id}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      )
      if(response.status === 200){
        setCourseDetails(response.data)
      }
    }
    catch(error){
      console.error("error fetching course details",error);
    }
  }

	useEffect(()=>{
    fetchCourseDetails()
    fetchMessages()
		const socket = new WebSocket(
			`ws://127.0.0.1:8000/ws/community_chat/${course_id}/${user.id}/`
		)
		socket.onopen = () => {
			console.log("Socket connection established")
			setWs(socket)
		}
		socket.onmessage = (event) => {
			let received_message = JSON.parse(event.data)
			if (!chatLog.some((msg) => msg.id === received_message.id)) {
				setChatLog((prevChatLog) => [...prevChatLog, received_message]);
			  }
		}
		socket.onclose = () => {
			console.log("Socket closed")
		}

		return () => {
			if (ws){
				ws.close()
			}
		}
	},[course_id])
	console.log(chatLog);
	const sendMessage = () => {
		if(message && ws && ws.readyState === WebSocket.OPEN){
			const newMessage = {message}
			ws.send(JSON.stringify(newMessage))
			setMessage("")
		}
	}
	
	let prevSenderId = null
  
  return (
    <div>
      <div class="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
        <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div class="relative flex items-center space-x-4">
            <div class="relative">
              <span class="absolute text-green-500 right-0 bottom-0">
                <svg width="20" height="20">
                  {/* <circle cx="8" cy="8" r="8" fill="currentColor"></circle> */}
                </svg>
              </span>
              <img
                src={`http://127.0.0.1:8000${courseDetails.thumbnail}`}
                alt=""
                class="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
              />
            </div>
            <div class="flex flex-col leading-tight">
              <div class="text-2xl mt-1 flex items-center">
                <span class="text-gray-700 mr-3">{courseDetails.title}</span>
              </div>
              <span class="text-lg text-gray-600">Instructor : {courseDetails.instructor_name}</span>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            
          </div>
        </div>
        {chatLog.map((msg, index) => {
          return (
            <div
              id="messages"
              class="flex flex-col overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
            >
              <div class="chat-message">
                {msg.user_id == user.id ? (
                  <div class="flex items-end justify-end">
                  <div class="flex flex-col  text-xs max-w-xs mx-2 order-1 items-end">
                    <div>
                      <span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                        {msg.message}
                      </span>
                    </div>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                    alt="My profile"
                    class="w-6 h-6 rounded-full order-2"
                  />
                </div>
                ) : (
                  <div class="flex items-end">
                    <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
						<div>
							<span class="text-red-600 text-base">
								{msg.user_name}
							</span>
						</div>
                      <div>
                        <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                          {msg.message}
                        </span>
                      </div>
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                      alt="My profile"
                      class="w-6 h-6 rounded-full order-1"
                    />
                  </div>
                )}
              </div>

              
            </div>
          );
        })}
        <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div class="relative flex">
            
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Write your message!"
              class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
            />
            <div class="absolute right-0 items-center inset-y-0 hidden sm:flex">
              
              <button
                type="button"
                onClick={sendMessage}
                class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
              >
                <span class="font-bold">Send</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-6 w-6 ml-2 transform rotate-90"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default CommunityChat
