import { useContext } from "react";
import { Navigate, Outlet, Route} from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AdminDashboard from "../pages/AdminDashboard";

const Privateroute = () => {
    let {user} = useContext(AuthContext)
    return(
        user ? <Outlet/> : <Navigate to='/login'/>
    )
}

export default Privateroute

export const AdminRoute = () => {
    let {user} = useContext(AuthContext)

    return(
       user && user.is_admin ? <AdminDashboard/> : <Outlet/>
    )
}
export const InstuctorRoute = () => {
    let {user} = useContext(AuthContext)

    return(
       user && user.is_instructor ? <Outlet/> : <Navigate to='/login'/>
    )
}
export const LoginCheck = () => {
    let {user} = useContext(AuthContext)

    return(
       user ? <Navigate to='/'/> : <Outlet/>
    )
}