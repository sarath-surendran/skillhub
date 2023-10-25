import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import config from "../config";

const AdminInstructorRequest = () => {
  const [ws, setws] = useState(null);
  const [requests, setRequests] = useState([]);
  const {authToken, user} = useContext(AuthContext)
  const fetchPendingRequests = async () => {
    try{
      const response = await axios.get(
        `${config.axios_url}admin_user/pending_requests/`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      )
      if (response.status === 200){
        setRequests(response.data)
      }
    }
    catch(error){
      console.error("error getting pending request",error)
    }
  }

  useEffect(() => {
    fetchPendingRequests()
    const socket = new WebSocket(
      `${config.socket_url}/ws/instructor_application/${user.id}/`
    );
    socket.onopen = () => {
      //     alert('on')
      console.log("socket connection established");
      setws(socket);
      socket.onmessage = (e) => {
        console.log("message received");
        let application = JSON.parse(e.data);
        //       console.log(message.message);
        console.log(application);
        if (!requests.some((appli) => appli.applicant_id === application.applicant_id)) {
          setRequests((prevreq) => [...prevreq, application]);
        }
        // setRequests((prevreq) => [...prevreq, application]);
      };
    };
    socket.onclose = () => {
      console.log("socket closed");
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const request_reject = async (id) => {
    try{
      const response = await axios.post(
        `${config.axios_url}admin_user/pending_requests/reject/?id=${id}`,{},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      )
      if(response.status === 200){
        fetchPendingRequests()
      }
    }
    catch(error){
      console.error("error rejecting : ",error)
    }
  }

  const request_accept = async (id) => {
    try{
      const response = await axios.post(
        `${config.axios_url}admin_user/pending_requests/accept/?id=${id}`,{},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken.access}`,
          },
        }
      )
      if(response.status === 200){
        fetchPendingRequests()
      }
    }
    catch(error){
      console.error("error rejecting : ",error)
    }
  }
  return (
    <div>
      <div className="pt-8">
        <table>
          <tr>
            <th className="p-4">Sl. No</th>
            <th className="p-4">User Id</th>
            <th className="p-4">Name</th>
            <th className="p-4">Actions</th>
          </tr>

          {requests.map((application, index) => {
            if (application.application_status === "pending") {
              return (
                <tr key={index}>
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{application.applicant_id}</td>
                  <td className="p-4">{application.applicant_name}</td>
                  <td className="p-4">
                  <div className="flex space-x-3">
                        <button onClick={()=>request_accept(application.applicant_id)} className="bg-green-200 text-green-800 hover:bg-green-300 hover:text-green-900 px-8 py-2 rounded-md">
                          Approve
                        </button>
                        <button onClick={()=>request_reject(application.applicant_id)} className="bg-red-200 text-red-800 hover:bg-red-300 hover:text-red-900 px-8 py-2 rounded-md">
                        Reject
                      </button>
                      </div>
                  </td>
                </tr>
              );
            }
          })}
        </table>
      </div>
    </div>
  );
};

export default AdminInstructorRequest;
