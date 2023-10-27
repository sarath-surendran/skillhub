import './App.css';
import Header from './components/Header';
import Privateroute, { AdminRoute, InstuctorRoute, LoginCheck } from './utils/PrivateRoutes';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RegistrationPage from './pages/RegistrationPage';
import UserProfilePage from './pages/UserProfilePage';
import MyCoursesPage from './pages/MyCoursesPage';
import AddCoursePage from './pages/AddCoursePage';
import EmailNotVerified from './pages/EmailNotVerified';
import EmailVerified from './components/EmailVerified';
import ListLessonsPage from './pages/ListLessonsPage';
import UpdateLessonPage from './pages/UpdateLessonPage';
import UpdateCoursePage from './pages/UpdateCoursePage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import { Toaster } from 'react-hot-toast';
import EnrolledCoursePage from './pages/EnrolledCoursePage';
import MyLearningsPage from './pages/MyLearningsPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import AdminCourseManagementPage from './pages/AdminCourseManagementPage'
import AdminInstructorManagementPage from './pages/AdminInstructorManagementPage';
import AdminAddUserPage from './pages/AdminAddUserPage';
import ChatPage from './pages/ChatPage';
import InsstructorChat from './pages/InsstructorChat';
import CommunityChatPage from './pages/CommunityChatPage';
import AdminInstructorApprovalPage from './pages/AdminInstructorApprovalPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ForgotPasswordConfirmationPage from './pages/ForgotPasswordConfirmationPage';
import CategorywiseListingPage from './pages/CategorywiseListingPage';
import AdminCatagoryManagement from './pages/AdminCatagoryManagement';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          {/* <Header/> */}
          <Toaster/>
          <Routes>
            <Route exact path='/' element={<HomePage/>}/>
            <Route path='/category/:id' element={<CategorywiseListingPage/>}/>
            <Route element={<AdminRoute/>}>
              <Route exact path='/admin/dashboard' element={<AdminDashboard/>}/>
              <Route path='/admin/users' element={<AdminUserManagementPage/>}/>
              <Route path='/admin/add_user'element={<AdminAddUserPage/>}/>
              <Route path='/admin/courses' element={<AdminCourseManagementPage/>}/>
              <Route path='/admin/categories' element={<AdminCatagoryManagement/>}/>
              <Route path='/admin/instructors' element={<AdminInstructorManagementPage/>}/>
              <Route path='/admin/instructor_requests' element={<AdminInstructorApprovalPage/>}/>
            </Route>
            <Route element={<Privateroute/>}>
              <Route path='/profile' element={<UserProfilePage/>}/>
              <Route path='/profile/my_learnings' element={<MyLearningsPage/>}/>
              <Route path='/profile/change_password' element={<ChangePasswordPage/>}/>
              <Route path='/course/:id' element={<CourseDetailsPage/>}/>
              <Route path='/enrolled_courses/:id' element={<EnrolledCoursePage/>}/>
              {/* <Route path='enrolled_courses/:id/chat' element={<ChatPage/>}/> */}
              <Route path='enrolled_courses/:id/chat' element={<ChatPage/>}/>
              <Route path='enrolled_courses/:id/community_chat' element={<CommunityChatPage/>}/>

            </Route>
            <Route element={<InstuctorRoute/>}>
              <Route path='/profile/my_courses' element={<MyCoursesPage/>}/>
              <Route path='/profile/my_courses/lessons/:id' element={<ListLessonsPage/>}/>
              <Route path='/profile/my_courses/lessons/update_lesson/:course_id/:id' element={<UpdateLessonPage/>}/>
              <Route path='/profile/my_courses/update_course/:id' element={<UpdateCoursePage/>}/>
              <Route path='/profile/my_courses/add_course' element={<AddCoursePage/>}/>
              <Route path='/profile/chats' element={<InsstructorChat/>}/>
            </Route>
            <Route element={<LoginCheck/>}>
              <Route path='/login' element={<LoginPage/>}/>
              <Route path='/register' element={<RegistrationPage/>}/>
              <Route path='/register/email_not_verified' element={<EmailNotVerified/>}/>
              <Route path='/register/email_verified/:token' element={<EmailVerified/>}/>
              <Route path='/forgot-password' element={<ForgotPasswordPage/>}/>
              <Route path='/forgot-password/token/:token' element={<ForgotPasswordConfirmationPage/>}/>
            </Route>
           
            


            
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
