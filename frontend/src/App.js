import './App.css';
import Header from './components/Header';
import Privateroute, { AdminRoute, InstuctorRoute, LoginCheck } from './utils/PrivateRoutes';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RegistrationPage from './pages/RegistrationPage';
import UserProfilePage from './pages/UserProfilePage';
import MyLearningPage from './pages/MyCoursesPage';


function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header/>
          <Routes>
            
            <Route element={<AdminRoute/>}>
              <Route exact path='/' element={<HomePage/>}/>
            </Route>
            <Route element={<Privateroute/>}>
              <Route path='/profile' element={<UserProfilePage/>}/>
            </Route>
            <Route element={<InstuctorRoute/>}>
              <Route path='/profile/my_courses' element={<MyLearningPage/>}/>
            </Route>
            <Route element={<LoginCheck/>}>
              <Route path='/login' element={<LoginPage/>}/>
              <Route path='/register' element={<RegistrationPage/>}/>
            </Route>


            
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
