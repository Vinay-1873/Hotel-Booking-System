import React, { useEffect, useState } from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useAppContext } from '../context/AppContext'

const RecommendedHotels = () => {
  const {rooms, searchedCities} =useAppContext();
  const [recommended, setRecommended] = useState([]);

  const filterHotels = ()=>{
    // normalize searchedCities to array of trimmed lowercase strings
    const searchList = Array.isArray(searchedCities) ? searchedCities : (searchedCities ? [searchedCities] : []);
    const normalizedSearch = searchList.map(s => (s || '').toString().trim().toLowerCase());
    if (normalizedSearch.length === 0) {
      setRecommended([]);
      return;
    }
    const filteredHotels = rooms.slice().filter(room => {
      const city = (room?.hotel?.city || '').toString().trim().toLowerCase();
      return normalizedSearch.includes(city);
    });
    setRecommended(filteredHotels);
  }

  useEffect(()=>{
     filterHotels()
  },[rooms,searchedCities]);

  return recommended.length > 0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>

      <Title title='Recommended Hotels' subtitle='Discover our curated collection of global properties, where refined luxury, cultural richness, and exceptional comfort come together to create unforgettable experiences and timeless memories at every destination.'/>
        <div className='flex items-center justify-center gap-4 mt-15'>
            {recommended.slice(0,4).map((room,index)=>(
              <HotelCard 
              key={room._id} 
              room={room} 
              index={index}
              />))}
        </div>
    </div>
  )
}

export default RecommendedHotels