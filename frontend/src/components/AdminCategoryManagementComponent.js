import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import config from '../config'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { useEffect } from 'react'

const AdminCategoryManagementComponent = () => {
    const [addCategory, setAddCategory] = useState(false)
    const [categoryName, setCategoryName] = useState('')
    const [categories, setCategories] = useState([])
    const {authToken} = useContext(AuthContext)

    const fetchCategory = async() => {
        try{
            const response = await axios.get(
                `${config.axios_url}admin_user/get_categories/`,
                {
                    headers: {
                      // "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${authToken.access}`,
                    },
                  }
            )
            setCategories(response.data)
        }
        catch(error){
            console.error(error)
        }
    }

    const handleCategoryAdd = async() => {
        try{
            const response = await axios.post(
                `${config.axios_url}admin_user/add_category/`,
                {"category_name": categoryName},
                {
                    headers: {
                      // "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${authToken.access}`,
                    },
                  }
            )
            setAddCategory(false)
            fetchCategory()
        }
        catch(error){
            console.error(error)
        }
    } 

    useEffect(()=>{
        fetchCategory()
    },[])
    console.log('name',categoryName)
  return (
    <div className="overflow-x-auto">
      {/* <div className="min-w-screen min-h-screen bg-gray-100 flex items-center justify-center bg-gray-100 font-sans overflow-hidden"> */}
        <div>
          <div className="bg-white shadow-md rounded my-6">
            <button onClick={()=>{setAddCategory(true)}} class="mb-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add Category</button>
            {addCategory && 
                <div>
                    <input
                    type='text'
                    value={categoryName}
                    onChange={(e)=>{setCategoryName(e.target.value)}}
                    />
                    <button onClick={handleCategoryAdd}>Submit</button>
                </div>
            }
            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
					<th className="py-3 px-4 text-center">Sl No.</th>
                  <th className="py-3 px-6 text-left">Category Name</th>
                  {/* <th className="py-3 px-6 text-left">Instructor</th>
                  <th className="py-3 px-6 text-center">Students</th>
                  <th className="py-3 px-6 text-center">Fee</th>
                  <th className="py-3 px-6 text-center">Status</th> */}
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                  {categories.map((category, index)=>{
                    return(
                        <tr className="border-b border-gray-200 hover:bg-gray-100">
                            <td key={index} className="py-3 px-6 text-left whitespace-nowrap">{index+1}</td>
                            <td key={index} className="py-3 px-6 text-left whitespace-nowrap">{category.name}</td>
                        </tr>
                        
                    )
                  })}
              </tbody>
              
            </table>
          </div>
        </div>
      {/* </div> */}
    </div>
  )
}

export default AdminCategoryManagementComponent
