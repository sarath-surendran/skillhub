import React from 'react'
import ChatComponent from '../components/ChatComponent'
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';

const ChatPage = () => {
    const { state } = useLocation();
    const reciever_id = state ? state.recieverId : null;
    const course_id = state ? state.courseId : null
  return (
    <div>
      <Header/>
      <ChatComponent reciever_id={reciever_id} course_id={course_id}/>
    </div>
  )
}

export default ChatPage
