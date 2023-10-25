import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import {useNavigate} from "react-router-dom"
import config from "../config";

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) => {

    let [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null)
    let [user,setUser] = useState(() => localStorage.getItem('authToken') ?jwt_decode(localStorage.getItem('authToken')) : null )
    // let [loading,setLoading] = useState(true)
    const navigate = useNavigate()

    let login = async (email, password ) => {
        console.log('email',email);
        console.log('password',password)
        let response = await fetch(`${config.axios_url}api/token/`, {
            method:'POST',
            headers:{
                "Content-type": "application/json"
            },
            body:JSON.stringify({'email':email,'password':password})
        })
        let data = await response.json()
        if (response.status === 200){
            let decoded = jwt_decode(data.access)
            console.log(decoded);
            if(decoded.email_verified){
                setAuthToken(data)
                setUser(jwt_decode(data.access))
                console.log(jwt_decode(data.access))
                localStorage.setItem('authToken', JSON.stringify(data))
                if(decoded.is_active){
                    if(decoded.is_admin){
                        navigate('/admin/dashboard')
                    }
                    else{
                        navigate('/')
                    }
                }
                else{
                    alert("You are blocked by the Admin.")
                }
            }else{
				alert("Please verify the email address.")
			}
            
        }else{
            alert("Please verify your credentials")
        }
        
    }

    let logout = () => {
        setAuthToken(null)
        setUser(null)
        localStorage.removeItem('authToken')
        navigate('/login')
    }

    let updateToken = async () =>{
        console.log("updated token");
        let response = await fetch(`${config.axios_url}api/token/refresh/`,{
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({'refresh':authToken?.refresh})
        })
        let data = await response.json()
        if (response.status === 200){
            let decoded = jwt_decode(data.access)

            if(decoded.is_active){
                setAuthToken(data)
                setUser(jwt_decode(data.access))
                localStorage.setItem('authToken', JSON.stringify(data))
            }
            else{
                logout()
            }
        }else{
            logout()
        }
        // if(loading){
        //     setLoading(false)
        // }
    }

    let ContextData = {
        user:user,
        authToken:authToken,
        setUser:setUser,
        setAuthToken:setAuthToken,
        login:login,
        logout:logout
    }

    useEffect(()=>{
        // if(loading){
        //     updateToken()
        // }
        let fourminutes = 1000*60*4
        let interval = setInterval(()=>{
            if(authToken){
                updateToken()
            }
        },fourminutes)
        return ()=>clearInterval(interval)
    // },[authToken,loading])
    },[authToken])

    return(
        <AuthContext.Provider value={ContextData}>
            {/* {loading ? null : children} */}
            {children}
        </AuthContext.Provider>
    )
}