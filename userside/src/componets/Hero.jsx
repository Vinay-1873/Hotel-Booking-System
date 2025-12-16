import React from 'react'
import { assets, cities } from '../assets/assets'

export const Hero = () => {
  return (
    <div className='flex flex-col items-start justify-center px-6 
    md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/hero.png")] bg-no-repeat bg-cover bg-center h-screen opacity-100'>
    <p className='bg-[#FDF6D3]/85 px-3.5 py-1 rounded-full text-black mt-20'>Seamless Booking Experience</p>
    <h1 className='font playfair text-xl md:text-2xl md:text-[35px] md:leading-8.75 font-bold md:font-extrabold max-w-xl mt-4 '>Explore Your Perfect Retreat and Enjoy a Truly Memorable Getaway</h1>
    <p className='max-w-130 mt-2 text-sm md:text-base'>Enjoy competitive prices with instant confirmation and a hassle-free process.Reserve your stay in just a few clicks with our user-friendly platform.</p>
    <form className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

            <div>
                <div className='flex items-center gap-2'>
                    <img src={assets.calenderIcon} alt="" className='h-4' />
                    <label htmlFor="destinationInput">Destination</label>
                </div>
                <input list='destinations' id="destinationInput" type="text" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" placeholder="Type here" required />
                <datalist id='destinations'>
                  {cities.map((city,index)=>(
                    <option value={city} key={index}/>
                  ))}
                </datalist>
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <img src={assets.calenderIcon} alt="" className='h-4' />
                    <label htmlFor="checkIn">Check in</label>
                </div>
                <input id="checkIn" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <img src={assets.calenderIcon} alt="" className='h-4' />
                    <label htmlFor="checkOut">Check out</label>
                </div>
                <input id="checkOut" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
            </div>

            <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                <label htmlFor="guests">Guests</label>
                <input min={1} max={10} id="guests" type="number" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0" />
            </div>

            <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1' >
                <img src={assets.searchIcon} alt="searchIcon" className='h-4' />
                <span>Search</span>
            </button>
        </form>
    </div>
  )
}
  
export default Hero