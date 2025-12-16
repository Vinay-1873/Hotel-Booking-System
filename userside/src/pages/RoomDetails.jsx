import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { assets, roomsDummyData, facilityIcons, roomCommonData } from '../assets/assets';
import StarRating from '../componets/StarRating';

const RoomDetails = () => {
    const{id}=useParams();
    const[room,setRoom]=useState(null);
    const[mainImage,setMainImage]=useState(null);
    const[checkInDate,setCheckInDate]=useState('');
    const[checkOutDate,setCheckOutDate]=useState('');
    const[guests,setGuests]=useState('');
    useEffect(()=>{
        const room=roomsDummyData.find(room=>room._id===id);
        room && setRoom(room);
        room && setMainImage(room.images[0]);
    },[])


  return  room && (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
        {/* Room details **********************************/}
       <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
        <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.name}
            <span className='font-inter text-sm'>
                ({room.roomType})
            </span>
        </h1>
        <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>15% OFF</p>
       </div>

       {/* Room Rating ****************************/}
        <div className='flex items-center gap-1 mt-2'>
            <StarRating/>
            <p className='ml-2'>300+ reviews</p>
        </div>
        {/* Location  ****************************/}
        <div className='flex items-center gap-1 text-gray-500 mt-2'>
            <img src={assets.locationIcon} alt="location-icon" />
            <span>{room.hotel.address}, {room.hotel.city}</span>
        </div>

        {/* Room Images  ****************************/}
           <div className='flex flex-col lg:flex-row mt-6 gap-6'>
            <div className='lg:w-1/2 w-full'>
                <img src={mainImage} alt="Room Image" 
                className='w-full rounded-xl shadow-lg object-cover'/>
            </div>
            <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                {room?.images.length>1 && room.images.map((image,index)=>(
                    <img onClick={()=> setMainImage(image)}
                     key={index} src={image} alt="room-imgage "
                    className={`w-full rounded-xl shadow-md object-cover cursor-pointer
                        ${image===mainImage && 'outline-3 outline-orange-500'}`}/>
                ))}
            </div>
           </div>

        {/* Room Highlights    ***************************/}
        <div className='mt-12'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                <div>
                    <h2 className='text-2xl md:text-3xl font-playfair mb-3'>Experience Luxury Like Never Before</h2>
                    <div className='flex flex-wrap items-center gap-6'>
                        {room.amenities.slice(0, 3).map((item, index) => (
                            <div key={index} className='flex items-center gap-2'>
                                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                <span className='text-sm text-gray-700'>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='mt-6 md:mt-0 text-right'>
                    <p className='text-3xl md:text-4xl font-medium text-gray-800'>₹{room.pricePerNight}<span className='text-lg font-normal text-gray-600'>/night</span></p>
                </div>
            </div>
        </div>

        {/* CheckIn CheckOut form *************************/}
        <div className='mt-12 lg:ml-20 lg:mr-20 bg-white border border-gray-300/70 rounded-lg p-6 shadow-sm'>
            <div className='flex flex-col md:flex-row md:items-end gap-6'>
                {/* Check-In */}
                <div className='flex-1'>
                    <label className='block text-sm font-medium text-gray-700 mb-3'>Check-In</label>
                    <input 
                        type='date' 
                        value={checkInDate}
                        onChange={(e)=>setCheckInDate(e.target.value)}
                        placeholder='dd-mm-yyyy'
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
                <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                {/* Check-Out */}
                <div className='flex-1'>
                    <label className='block text-sm font-medium text-gray-700 mb-3'>Check-Out</label>
                    <input 
                        type='date'
                        value={checkOutDate}
                        onChange={(e)=>setCheckOutDate(e.target.value)}
                        placeholder='dd-mm-yyyy'
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
                <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                {/* Guests */}
                <div className='flex-1'>
                    <label className='block text-sm font-medium text-gray-700 mb-3'>Guests</label>
                    <input 
                        type='number'
                        value={guests}
                        onChange={(e)=>setGuests(e.target.value)}
                        placeholder='00'
                        min='1'
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
                <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                {/* Check  Availability */}
                <button className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 md:px-6 md:py-4 text-base rounded-lg transition duration-300 cursor-pointer'>
                    Check Availability
                </button>
            </div>
        </div>
        {/* Common Room Data  ***************************/}
        <div className='mt-25 space-y-4'>
            {roomCommonData.map((spec,index)=>(
                <div key={index} className='flex items-start gap-2'>
                    <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5' />
                    <div>
                        <p className='text-base'>{spec.title}</p>
                        <p className='text-gray-500'>{spec.description}</p>
                    </div>
                    </div>
            ))}
        </div>
         
       {/* discription******************/}
       <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
        <p >
            Guests will be allocated to the ground floor accorsing to Availability.
            You get a comfortable Two bedroom apartment with all modern amenities.
            The apartment is fully furnished with a well-equipped kitchen, 
            spacious living area, and cozy bedrooms to ensure a pleasant stay.
            Enjoy complimentary Wi-Fi, air conditioning, and access to on-site facilities such as a fitness center and swimming pool.
            Whether you're traveling for business or leisure, our apartment offers the perfect blend of comfort and convenience for your stay.
        </p>
       </div>
       
         {/* Hosted By ***************************/}
       <div className='flex flex-col items-start gap-4'>
         <div className='flex gap-4'>
            <img src={room.hotel.owner.image} alt="Host"  className='h-14 w-14
            md:h-18 md:w-18 rounded-full'/>
            <div>
                <p className='text-lg md:text-xl'>Hosted By {room.hotel.name}</p>
                <div className='flex items-center mt-1'>
                    <StarRating/>
                    <p className='ml-2'>300+ reviews</p>
                </div>
            </div>
         </div>
         <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary
         hover:bg-primary-dull transition-all cursor-pointer'>Contact Now</button>
       </div>

    </div>
  )
}

export default RoomDetails