import React from 'react'
import { assets } from '../assets/assets'

const StarRating = ({ rating = 4 }) => {
  const filled = assets?.starIconFilled
  const outlined = assets?.starIconOutlined

  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <img
          key={index}
          src={rating > index ? filled : outlined}
          alt={`star-${index}`}
          className="w-4 h-4 inline-block"
        />
      ))}
    </div>
  )
}

export default StarRating