import axios from 'axios';
import React, { useContext } from 'react'
import { useState } from 'react';
import AuthContext from '../context/AuthContext';
import config from '../config';

const AddReviewAndRating = ({course_id}) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const {user, authToken} = useContext(AuthContext)

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleSubmit = async () => {
    console.log('Rating:', rating);
    console.log('Review:', review);
    try{
        const response = await axios.post(
            `${config.axios_url}review&ratings/add_review/`,
            {
                "user":user.id,
                "course":course_id,
                "review":review,
                "rating":rating

            }
        )
        if (response.status === 201){
            setRating(0)
            setReview('')
        }
    }
    catch(error){
        console.error("error in rating : ",error)
    }
  };

  return (
    
    <div className="p-4  mx-10 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Rate and Review</h2>
      <div className="flex space-x-2 text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
            onClick={() => handleRatingChange(star)}
          >
            &#9733;
          </span>
        ))}
      </div>
      <textarea
        className="w-full h-32 px-3 py-2 mt-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Write your review here..."
        value={review}
        onChange={handleReviewChange}
      ></textarea>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  )
}

export default AddReviewAndRating
