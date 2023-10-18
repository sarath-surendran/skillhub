import React from 'react'
import CategoryWiseCourses from '../components/CategoryWiseCourses'
import Header from '../components/Header'
import { useParams } from 'react-router-dom'

const CategorywiseListingPage = () => {
    const {id} = useParams()
  return (
    <div>
        <Header/>
        <CategoryWiseCourses id = {id}/>
      
    </div>
  )
}

export default CategorywiseListingPage
