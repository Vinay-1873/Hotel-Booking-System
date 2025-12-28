import React from 'react'
import Hero from '../componets/Hero'
import FeaturedDestination from '../componets/FeaturedDestination'
import ExclusiveOffers from '../componets/ExclusiveOffers'
import Testimonial from '../componets/Testimonial'
import Newsletter from '../componets/Newsletter'
import RecommendedHotels from '../componets/RecommendedHotels'

export const Home = () => {
  return (
    <>
      <Hero />
      <RecommendedHotels/>
      <FeaturedDestination/>
      <ExclusiveOffers />
      <Testimonial />
      <Newsletter/>
    </>
  )
}

export default Home;
