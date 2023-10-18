import React, { useContext } from 'react'
import {RiDashboardLine} from 'react-icons/ri'
import {LiaUsersCogSolid} from 'react-icons/lia'
import {GiTeacher} from 'react-icons/gi'
import {BsBook, BsPersonFillAdd} from 'react-icons/bs'
import {VscGraphLine} from 'react-icons/vsc'
import {BiLogOut} from 'react-icons/bi'
import {BsChevronCompactDown, BsChevronCompactUp} from 'react-icons/bs'
import AuthContext from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const AdminSideBar = () => {
    const {logout} = useContext(AuthContext)
    const navigate = useNavigate()
    const [showAddUser, setShowAddUser] = useState(false)
    const [showPendingInstructors, setShowPendingInstructors] = useState(false)
    
  return (
    <div className='flex-col px-6'>
        <div className='space-y-7 pt-8'>
            <p onClick={()=>{navigate('/admin/dashboard/')}} className='cursor-pointer' style={{ display: 'flex', alignItems: 'center', fontSize: '1.2rem' }}><RiDashboardLine style={{ marginRight: '10px', width: '1.5em', height: '1.5em' }}/>Dashboard</p>
            <div className='cursor-pointer' style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Aligns contents to both ends
                    fontSize: '1.2rem',
                }}
            >
                <p onClick={()=>{navigate('/admin/users')}} style={{ display: 'flex', alignItems: 'center' }}><LiaUsersCogSolid style={{marginRight: '10px',width: '1.5em',height: '1.5em',color: 'blue',}}/>Users</p>{showAddUser ? (<BsChevronCompactUp onClick={()=>{setShowAddUser(!showAddUser)}} className='ml-2' />) : (<BsChevronCompactDown onClick={()=>{setShowAddUser(!showAddUser)}} className='ml-2' />)}
            </div>
            {/* Add user drop dowm */}
            {showAddUser && (
                <p onClick={()=>{navigate('/admin/add_user')}} className='cursor-pointer ml-10 ' style={{ display: 'flex', alignItems: 'center', fontSize: '1rem' }}><BsPersonFillAdd style={{ marginRight: '10px', width: '1.2em', height: '1.2em' }}/>Add user</p>
            )}
            {/* ******** */}
            <div className='cursor-pointer' style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Aligns contents to both ends
                    fontSize: '1.2rem',
                }}
            >
                <p onClick={()=>{navigate('/admin/instructors')}} style={{ display: 'flex', alignItems: 'center' }}><GiTeacher style={{marginRight: '10px',width: '1.5em',height: '1.5em',}}/>Instructors</p>{showPendingInstructors ? (<BsChevronCompactUp onClick={()=>{setShowPendingInstructors(!showPendingInstructors)}} className='ml-2' />) : (<BsChevronCompactDown onClick={()=>{setShowPendingInstructors(!showPendingInstructors)}} className='ml-2' />)}
            </div>
            {/* Add user drop dowm */}
            {showPendingInstructors && (
                <div className='flex space-x-6'>
                    <p onClick={()=>{navigate('/admin/instructor_requests')}} className='cursor-pointer ml-10 ' style={{ display: 'flex', alignItems: 'center', fontSize: '1rem' }}><BsPersonFillAdd style={{ marginRight: '10px', width: '1.2em', height: '1.2em' }}/>Pending Requests</p>
                    {/* <span className="bg-red-500 text-white px-2 rounded-full ">
                    5 
                    </span> */}
                    </div>
            )}
            {/* ********* */}
            {/* <p onClick={()=>{navigate('/admin/instructors')}} className='cursor-pointer' style={{ display: 'flex', alignItems: 'center', fontSize: '1.2rem' }}><GiTeacher style={{ marginRight: '10px', width: '1.5em', height: '1.5em' }}/>Instructors</p> */}
            <p onClick={()=>{navigate('/admin/courses')}} className='cursor-pointer' style={{ display: 'flex', alignItems: 'center', fontSize: '1.2rem' }}><BsBook style={{ marginRight: '10px', width: '1.5em', height: '1.5em' }}/>Courses</p>
            {/* <p  className='cursor-pointer' style={{ display: 'flex', alignItems: 'center', fontSize: '1.2rem' }}><VscGraphLine style={{ marginRight: '10px', width: '1.5em', height: '1.5em', color:'yellow' }}/>Sales</p> */}
            <p className='cursor-pointer' onClick={logout} style={{ display: 'flex', alignItems: 'center', fontSize: '1.2rem' }}><BiLogOut style={{ marginRight: '10px', width: '1.5em', height: '1.5em', color:'red' }}/>Sign out</p>
        </div>
      
    </div>
  )
}

export default AdminSideBar
