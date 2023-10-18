import React from 'react'

const ProgressBar = ({progress}) => {
  return (
    <div className="w-80 bg-gray-300 h-4 rounded-full">
      <div
        className="bg-green-500 h-full rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
      
    </div>
  )
}

export default ProgressBar
