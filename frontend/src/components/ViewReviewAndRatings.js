import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const ViewReviewAndRatings = ({course_id}) => {
    const [allReviews, setAllReviews] = useState([])
    const [displayReviews, setDisplayReviews] = useState([])
    const [showAll, setShowAll] = useState(false)

    const fetchAllReviews = async () => {
        try{
            const response = await axios.get(
                `http://127.0.0.1:8000/review&ratings/get_review/?id=${course_id}`
            )
            setAllReviews(response.data)
        }
        catch(error){
            console.log("error fetching reviews",error)
        }
    }

    const toggleShowAll = () => {
        setShowAll(!showAll)
    }

    useEffect(()=>{
        fetchAllReviews()
    },[])

    useEffect(()=>{
        if (showAll){
            setDisplayReviews(allReviews)
        }
        else{
            setDisplayReviews(allReviews.slice(0,3))
        }
    },[allReviews,showAll])


  return (
    <div className="container px-8 py-4">
      <h2 className="text-2xl font-bold mb-4">Reviews and Ratings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayReviews.map((review, index) => (
          <div key={index} className="bg-white shadow-lg p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{review.user_name}</h3>
            
            <p className="text-gray-800">{review.review}</p>
            {[1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                className={`cursor-pointer ${
                star <= review.rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
            >
                &#9733;
            </span>
            ))}
          </div>
        ))}
      </div>
      {!showAll && allReviews.length > 3 ? (
        <button
          onClick={toggleShowAll}
          className="block mx-auto mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          View More
        </button>
      ):(
        <button
          onClick={toggleShowAll}
          className="block mx-auto mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          View Less
        </button>
      )}
    </div>
  )
}

export default ViewReviewAndRatings
