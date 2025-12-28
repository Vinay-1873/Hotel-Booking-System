import React, { useEffect, useState } from 'react'
import Title from '../componets/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'


const MyBookings = () => {

  const {axios, getToken, user} = useAppContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const d = new Date(dateString)
    if (isNaN(d)) return '—'
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }


  const fetchUserBookings =async ()=>{
    try {
      setFetchError(null)
      setLoading(true)
      console.log('fetchUserBookings: calling /api/bookings/user')
      const {data} =await axios.get('/api/bookings/user', {headers: {
        Authorization: `Bearer ${await getToken()}`}})
        console.log('fetchUserBookings: response ->', data)
        if(data && data.success){
          setBookings(Array.isArray(data.bookings) ? data.bookings : [])
        }else{
          setBookings([])
          setFetchError(data?.message || 'Failed to fetch bookings')
          toast.error(data?.message || 'Failed to fetch bookings')
        }
    } catch (error) {
      console.error('fetchUserBookings: error ->', error)
      setFetchError(error.message)
      toast.error(error.message)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(()=>{
    if(user){
      fetchUserBookings()
    }
  },[user])

  // If Stripe redirected back with a session_id, confirm payment and refresh bookings
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if(!sessionId) return;

    const confirm = async ()=>{
      try{
        const token = await getToken();
        await axios.post('/api/bookings/confirm-payment', { sessionId }, { headers: { Authorization: `Bearer ${token}` } });
        // refresh bookings after confirmation
        fetchUserBookings();
        // remove session_id from URL
        params.delete('session_id');
        const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
        window.history.replaceState({}, '', newUrl);
      }catch(err){
        console.error('confirm payment failed', err);
      }
    }
    confirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // handle payment
  const handlePayment = async (bookingId)=>{
    try {
      const {data} = await axios.post('/api/bookings/stripe-payment', {bookingId}, {headers: {Authorization: `Bearer ${await getToken()}`}})
      if(data.success) {
        window.location.href = data.url
      }else{
        toast.error(data.error)
      }
    } catch (error) {
      toast.error(error.message)
    }
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
        {bookings?.map((booking)=>(
            <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_1fr] w-full border-b border-gray-200 py-4 gap-4'>
            
            { /*******************Hotel Details*********************/ }
            <div className='flex gap-4'>
              {/* Hotel Image */}
              <div className='w-24 h-24 md:w-32 md:h-24 shrink-0 rounded-md overflow-hidden'>
                <img src={booking?.room?.images?.[0] || assets.roomImage1} alt={booking?.hotel?.name || 'hotel'} className='w-full h-full object-cover' />
              </div>
              
              {/* Hotel Info */}
              <div className='flex-1 flex flex-col justify-between'>
                <div>
                  <h3 className='font-semibold text-base md:text-lg'>{booking?.hotel?.name || 'Hotel'} <span className='text-xs text-gray-500 font-normal'>({booking?.room?.roomType || '-'})</span></h3>
                  <p className='text-sm text-gray-600 mt-1 flex items-center gap-2'>
                    <img src={assets.locationIcon} alt="location-icon" className='w-4 h-4' />
                    <span>{booking?.hotel?.address || '-'}</span>
                  </p>
                  <p className='text-sm md:text-base font-medium text-gray-700 mt-2'>₹{booking?.room?.pricePerNight ?? booking?.room?.price ?? '-'} /night</p>
                </div>
                <p className='text-sm text-gray-600'>👥 Guests: {booking?.guests ?? '-'}</p>
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
                <button onClick={()=>handlePayment(booking._id)} className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition'>
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