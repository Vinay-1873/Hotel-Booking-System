import React from 'react'
import NavBar from './componets/NavBar'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
import Footer from './componets/Footer'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'
import HotelRegi from './componets/HotelRegi'
import Layout from './pages/hotelOwner/Layout'
import Dashboard from './pages/hotelOwner/Dashboard'
import Addroom from './pages/hotelOwner/Addroom'
import ListRoom from './pages/hotelOwner/ListRoom'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import Loader from './componets/Loader'

const App = () => {

   const isOwnerPath=useLocation().pathname.includes("owner");
   const {showHotelReg}=useAppContext();
  return (
    <div>
      <Toaster/>
      {!isOwnerPath && <NavBar />}
      {showHotelReg && <HotelRegi/>}
      <div className='min-h-[70vh]'>
      <Routes>
        <Route path='/'  element={<Home/>}/>
        <Route path='/rooms'  element={<AllRooms/>}/>
        <Route path='/rooms/:id'  element={<RoomDetails/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
        <Route path='/loader/:nextUrl' element={<Loader/>}/>
       
        <Route path='/owner' element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path='add-rooms' element={<Addroom/>}/>
        <Route path='list-room' element={<ListRoom/>}/>

        </Route>
      </Routes>
      </div>
      <Footer/>
    </div>
  )
}

export default App
