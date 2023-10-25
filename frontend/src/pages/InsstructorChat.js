import React, { useContext, useState } from "react";
import UserSideBar from "../components/UserSideBar";
import axios from "axios";
import { useEffect } from "react";
import ChatComponent from "../components/ChatComponent";
import AuthContext from "../context/AuthContext";
import Header from "../components/Header";
import config from "../config";

const InsstructorChat = () => {
  const [chatList, setChatList] = useState([]);
  const [nowChatting, setNowChatting] = useState(null)
  const [openChatReciever, setopenChatReciever] = useState(null)
  const [openChatCourse, setOpenChatCourse] = useState(null)
  const {authToken} = useContext(AuthContext)

  const fetchChatList = async () => {
    try {
      const response = await axios.get(
        `${config.axios_url}chats/get_chat_list/`,
        {
            headers: {
              Authorization: `Bearer ${authToken.access}`,
            },
          }
      );
      if (response.status === 200) {
        setChatList(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("error getting chat list", error);
    }
  };

  const setChat = (index, user_id, course_id) => {
    setNowChatting(index)
    setopenChatReciever(user_id)
    setOpenChatCourse(course_id)
  }

  useEffect(()=>{
    fetchChatList()
  },[])

  const normalChatStyle = "flex flex-row py-4 px-2 items-center border-b-2"
  const selectedChatStyle = "flex flex-row py-4 px-2 items-center border-b-2 border-l-8 border-blue-400"

  return (
    <div>
      <Header/>
      <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200 p-4">
        <UserSideBar />
      </div>
      <div className="w-3/4 p-4 flex">
        <div className="w-1/4 border-r-2 border-gray-200 pr-4 pt-4">
          
          {chatList.map((user, index)=>{
           const imageUrl = `${config.media_url}${user.image}`;
           const chatStyle = index === nowChatting ? selectedChatStyle : normalChatStyle;
          
            return(
                <div className={chatStyle} 
                    onClick={()=>{setChat(index, user.id, user.course_id)}}>
                    <div className="w-1/4 mr-4">
                    <img
                        src={imageUrl}
                        className="object-cover h-12 w-12 rounded-full"
                        alt={user.name}
                    />
                    </div>
                    <div className="w-full">
                    <div className="text-lg font-semibold">{user.name}</div>
                    <span>
                        <span className="text-gray-500">{user.course}</span>
                    </span>
                    </div>
                </div>
              
            )
          })}
          {/* <div className={selectedChatStyle}>
            <div class="w-1/4">
              <img
                src="https://source.unsplash.com/L2cxSuKWbpo/600x600"
                class="object-cover h-12 w-12 rounded-full"
                alt=""
              />
            </div>
            <div class="w-full">
              <div class="text-lg font-semibold">MERN Stack</div>
              <span class="text-gray-500">Lusi : Thanks Everyone</span>
            </div>
          </div> */}
          
        </div>
        <div className="w-3/4">
            {openChatReciever !== null && openChatCourse !== null && <ChatComponent reciever_id={openChatReciever} course_id={openChatCourse}/>}
        </div>

      </div>
    </div>
    </div>
  );
};

export default InsstructorChat;
