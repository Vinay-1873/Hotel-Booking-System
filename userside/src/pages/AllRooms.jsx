import React, { useMemo, useState } from 'react'
import { assets, facilityIcons, roomsDummyData } from '../assets/assets'
import { useNavigate, useSearchParams } from 'react-router-dom';
import StarRating from '../componets/StarRating';
import { useAppContext } from '../context/AppContext';

const CheckBox=({label,selected=false,onChange=()=>{}})=>{
    return(
        <label className="flex items-center gap-2">
            <input type="checkbox" checked={selected} onChange={(e)=>onChange(e.target.checked,label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const RadioButton=({label,selected=false,onChange=()=>{}})=>{
    return(
        <label className="flex items-center gap-2">
            <input type="radio"  name="sortOption" checked={selected} onChange={(e)=>onChange(label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const AllRooms = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const{rooms,navigate,currency} = useAppContext();

    const[openFilters,setOpenFilters]=useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        roomType:[],
        priceRange:[],
    })

    const [selectedSort,setSelectedSort] = useState('')
    const roomTypes=[
        "Single Bed",
        "Double Bed",
        "Luxury Room",
        "Family Suite",
    ]
    const priceRange=[
        "1000 - 1500",
        "1500 - 2500", 
        "2500 - 3500",
        "3500 - 5000",
    ]

    const sortOptions=[
        "Price: Low to High",
        "Price: High to Low",
        "Newest first",
    ]
     

    // handle changes for filters ans sorting
    const handleFilterChange = (checked,value,type) =>{
             setSelectedFilters((prevFilters)=>{
                    const updatedFilters = {...prevFilters};
                    if(checked){
                        updatedFilters[type] = [...(prevFilters[type] || []), value];
                    }else{
                        updatedFilters[type] = (prevFilters[type] || []).filter(item => item !== value);
                    }
                    return updatedFilters;
             })
    }

    const handleSortChange =(sortOptions) =>{
        setSelectedSort (sortOptions);
    }

    // Function to check if a room matches the selected room type
    const matchesRoomType = (room)=>{
        if (selectedFilters.roomType.length === 0) return true;
        const roomType = (room.roomType || '').toString().trim().toLowerCase();
        return selectedFilters.roomType.some(rt => rt.toString().trim().toLowerCase() === roomType);
    }

    // function to check if a room matches the selected price range
    const matchesPriceRange = (room)=>{
        if (selectedFilters.priceRange.length === 0) return true;
        return selectedFilters.priceRange.some(range => {
            // range format: "1000 - 1500". Parse numbers robustly.
            const parts = range.split('-').map(s => s.replace(/[^0-9.]/g, '').trim());
            const min = parseFloat(parts[0] || 0);
            const max = parseFloat(parts[1] || Infinity);
            const price = parseFloat(room.pricePerNight) || 0;
            return price >= min && price <= max;
        })
    }

    // function to sort rooms based on the selected sort option
    const sortRooms =(a,b) =>{
        const key = (selectedSort || '').toLowerCase();
        if (key.includes('low to high') || key.includes('low') && key.includes('high')) {
            return (parseFloat(a.pricePerNight) || 0) - (parseFloat(b.pricePerNight) || 0);
        }
        if (key.includes('high to low') || key.includes('high') && key.includes('low')) {
            return (parseFloat(b.pricePerNight) || 0) - (parseFloat(a.pricePerNight) || 0);
        }
        if (key.includes('newest')) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    }

    // filter Destination
    const filterDestination = (room) =>{
        const destination =searchParams.get('destination');
        if(!destination) return true;
        return room.hotel.city.toLowerCase().includes(destination.toLowerCase())
    }
    
    // Filter and sort  rooms based on the selected filters and sort option
    const filteredRooms =useMemo (()=>{
        return rooms.filter(room =>  matchesRoomType(room) && matchesPriceRange(room) && filterDestination(room)).sort(sortRooms);
    },[rooms ,selectedFilters, selectedSort, searchParams])


    // clear all filter
    const clearFIlters = () =>{
        setSelectedFilters({
            roomType:[],
            priceRange:[],
        });
        setSelectedSort('');
        setSearchParams({});
    }

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start
    justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
        <div>
            <div className='flex flex-col items-start text-left'>
                <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
                <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Take adavantage of our limited-time offres and special 
                discounts to experience luxury stays at unbeatable prices. Book now and
                 make your travel dreams a reality!</p> 
            </div>
            {filteredRooms.map((room)=>(
                <div key={room._id} className='flex flex-col lg:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'>
                    <div className='lg:w-1/2 w-full shrink-0'>
                        <img onClick={()=>{navigate(`/rooms/${room._id}`); scrollTo(0,0)}} src={room.images[0]} alt="hotel-img" title='view room Details'
                            className='w-full h-72 lg:h-80 rounded-xl shadow-xl object-cover cursor-pointer shrink-0' />
                    </div>

                    <div className='lg:w-1/2 w-full flex flex-col justify-between h-72 lg:h-80'>
                        <div>
                            <p className='text-sm text-gray-500 mb-1'>{room.hotel.city}</p>
                            <p onClick={()=>{navigate(`/rooms/${room._id}`); scrollTo(0,0)}} className='text-3xl font-playfair text-gray-900 cursor-pointer leading-tight'>{room.hotel.name}</p>
                            <div className='flex items-center gap-3 mt-3'>
                                <StarRating/>
                                <p className='text-sm text-gray-600'>300+ reviews</p>
                            </div>

                            <div className='flex items-center gap-2 text-gray-600 mt-3'>
                                <img src={assets.locationIcon} alt="location-icon" className='w-4 h-4' />
                                <span className='text-sm'>{room.hotel.address}</span>
                            </div>

                            <div className='grid grid-cols-2 gap-3 mt-6'>
                                {room.amenities.map((item,index)=>{
                                    const key = (item || '').toString();
                                    const icon = facilityIcons[key] || facilityIcons[key.toLowerCase()];
                                    return (
                                        <div key={index} className='inline-flex items-center gap-3 px-4 py-2 bg-[#F7F6FF] rounded-2xl shadow-sm'>
                                            {icon && <img src={icon} alt={item} className='w-5 h-5' />}
                                            <span className='text-sm text-gray-700'>{item}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className='mt-4'>
                            <p className='text-3xl font-medium text-gray-800'>₹{room.pricePerNight} <span className='text-lg font-normal text-gray-600'>/night</span></p>
                        </div>
                    </div>
                </div>
            ))}

        </div>
        {/* Filters  part*/}
        <div className='bg-white w-80 border border-gray-300 text-gray-600 rounded-xl shadow-md h-2/3
        max-lg:mb-8 lg:mb-28 lg:ml-10 lg:mt-8 p-6 sticky top-28 z-20'>
            <div className={`flex items-center justify-between px-2 py-3 border-b border-gray-200 ${openFilters && "border-b"}`}> 
                <p className='text-base font-medium text-gray-800'>FILTERS</p>
                <div className='text-xs'>
                    <span onClick={()=>setOpenFilters(!openFilters)} 
                    className='lg:hidden cursor-pointer'>
                        {openFilters ? 'HIDE':'SHOW'}</span>
                    <span onClick={() => { clearFIlters(); setOpenFilters(false); }}
                          className='hidden lg:block cursor-pointer'>CLEAR</span>
                </div>
            </div>
                        <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}> 
                            <div className='py-5 border-b border-gray-100'>
                                <p className='font-medium text-gray-800 pb-2'>Populer filters</p>
                                <div className="flex flex-col gap-2">
                                    {roomTypes.map((room,index)=>(
                                            <CheckBox key={index} label={room} selected={selectedFilters.roomType.includes(room)} onChange={(checked)=>handleFilterChange(checked,room,'roomType')}/>
                                    ))}
                                </div>
                            </div>
                            <div className='py-5 border-b border-gray-100'>
                                <p className='font-medium text-gray-800 pb-2'>Price Range</p>
                                <div className="flex flex-col gap-2">
                                    {priceRange.map((range,index)=>(
                                            <CheckBox key={index} label={`${currency} ${range}`} 
                                            selected={selectedFilters.priceRange.includes(range)} onChange={(checked)=>handleFilterChange(checked,range,'priceRange')}/>
                                    ))}
                                </div>
                            </div>
                            <div className='py-5'>
                                <p className='font-medium text-gray-800 pb-2'>Sort By</p>
                                <div className="flex flex-col gap-2">
                                        {sortOptions.map((option,index)=>(
                                            <RadioButton key={index} label={option}
                                            selected={selectedSort === option} onChange={handleSortChange}/>
                                        ))}
                                </div>
                            </div>
                        </div>
        </div>
    </div>
  )
}

export default AllRooms