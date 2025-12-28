import React, { useEffect, useState } from 'react'
import Title from '../../componets/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {
  
  const {currency,user,getToken,axios}= useAppContext();

  const [dashboardData,setDashboardData]=useState({
    bookings:[],
    totalBookings:0,
    totalRevenue:0,
  })
  
  // Api to fetch dashboard data
  const fetchDashboardData=async()=>{
    try {
      const {data}=await axios.get('/api/bookings/hotel',{headers:{Authorization:`Bearer ${await getToken()}`}});
      if(data.success){
        setDashboardData(data.dashboardData || { bookings: [], totalBookings: 0, totalRevenue: 0 });
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }


  // fetch dashboard data on component mount
  useEffect(()=>{
    if(user){
      fetchDashboardData();
    }
  },[user])

  return (
    <div>
        <Title align='left' font='outfit' title='Dashboard' subtitle='Moniter your room listings,
        track bookings and analyze revenue-all in one place.Stay updated with real-time insights to ensure smooth operations.'/>
        <div className='flex gap-4 my-8'>
            {/* Total Bookingd */}
            <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
               <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10' />
               <div className='flex flex-col sm:ml-4 font-medium'>
                <p className='text-blue-500 text-lg'>Total Bookings</p>
                <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
               </div>
            </div>
            {/* ---------------Total Revenue------------ */}
            <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
               <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10' />
               <div className='flex flex-col sm:ml-4 font-medium'>
                <p className='text-blue-500 text-lg'>Total Revenue</p>
                <p className='text-neutral-400 text-base'>{currency}  {dashboardData.totalRevenue}</p>
               </div>
            </div>
        </div>
        {/*------------------------ Recent Bookings------------------------ */}
        <h2 className='text-xl text-blue-950/60 font-medium md-5 mb-5'>Recent Bookings</h2>
        <div className='w-full max-w-3xl text-left border border-gray-300
        rounded-lg max-h-80 overflow-y-scroll'>

          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='py-3 px-4 text-gray-800 font-medium text-center'>User Name</th>
                <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
                <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
                <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>
              </tr>
            </thead>
            <tbody className='text-sm'>
              {dashboardData.bookings.map((item,index)=>(
                <tr key={index}>
                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                    {item.user.username}
                  </td>

                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                    {item.room.roomType}
                  </td>

                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                    {currency} {item.totalPrice}
                  </td>

                  <td className='py-3 px-4 border-t border-gray-300'>
                    <button className={`px-3 py-1 rounded-full text-sm font-medium
                    ${item.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.isPaid ?'completed':'pending'}
                    </button>
                  </td>
                </tr> 
              ))}
            </tbody>
          </table>

        </div>
    </div>
  )
}

export default Dashboard