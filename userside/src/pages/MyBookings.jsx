import React, { useState } from 'react'
import Title from '../componets/Title'
import { userBookingsDummyData, assets } from '../assets/assets'

const MyBookings = () => {

  const [bookings,setBookings]=useState(userBookingsDummyData)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }

  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
     <Title title='My Bookings' subtitle='Easily manage your past,current,and upcoming hotel reservations in one place.
     Plan your trips seamlessly with just a few clicks' align='left'/>
     
     <div className='max-w-6xl mt-8 w-full text-gray-800'>
        <div className='hidden md:grid md:grid-cols-[3fr_1fr_1fr_1fr] w-full border-b
        border-gray-300 font-medium text-base py-3'>
            <div>Hotels</div>
            <div>Check-In</div>
            <div>Check-Out</div>
            <div>Payment</div>
        </div>
        {bookings.map((booking)=>(
            <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_1fr] w-full border-b border-gray-200 py-4 gap-4'>
            
            { /*******************Hotel Details*********************/ }
            <div className='flex gap-4'>
              {/* Hotel Image */}
              <div className='w-24 h-24 md:w-32 md:h-24 flex-shrink-0 rounded-md overflow-hidden'>
                <img src={booking.room.images[0]} alt={booking.hotel.name} className='w-full h-full object-cover' />
              </div>
              
              {/* Hotel Info */}
              <div className='flex-1 flex flex-col justify-between'>
                <div>
                  <h3 className='font-semibold text-base md:text-lg'>{booking.hotel.name} <span className='text-xs text-gray-500 font-normal'>({booking.room.roomType})</span></h3>
                  <p className='text-sm text-gray-600 mt-1 flex items-center gap-2'>
                    <img src={assets.locationIcon} alt="location-icon" className='w-4 h-4' />
                    <span>{booking.hotel.address}</span>
                  </p>
                  <p className='text-sm md:text-base font-medium text-gray-700 mt-2'>₹{booking.room.pricePerNight} /night</p>
                </div>
                <p className='text-sm text-gray-600'>👥 Guests: {booking.guests}</p>
              </div>
            </div>
            
            {/* ********************Check-In Date ******************************/}
            <div className='flex flex-col justify-center'>
              <p className='text-xs text-gray-500 font-medium'>Check-In</p>
              <p className='text-sm font-medium'>{formatDate(booking.checkInDate)}</p>
            </div>
            
            {/* ********************Check-Out Date ******************************/}
            <div className='flex flex-col justify-center'>
              <p className='text-xs text-gray-500 font-medium'>Check-Out</p>
              <p className='text-sm font-medium'>{formatDate(booking.checkOutDate)}</p>
              
            </div>
            
            {/* ********************Payment  ******************************/}
            <div className='flex flex-col justify-center items-start gap-2'>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                booking.isPaid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {booking.isPaid ? '✓ Paid' : '✗ Unpaid'}
              </span>
              {!booking.isPaid && (
                <button className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition'>
                  Pay now
                </button>
              )}
            </div>
            </div>
        ))}
     </div>
    </div>
  )
}

export default MyBookings