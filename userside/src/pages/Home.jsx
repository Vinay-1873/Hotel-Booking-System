import React from 'react'
import Hero from '../componets/Hero'
import FeaturedDestination from '../componets/featuredDestination'
import ExclusiveOffers from '../componets/ExclusiveOffers'
import Testimonial from '../componets/Testimonial'
import Newsletter from '../componets/Newsletter'

export const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedDestination />
      <ExclusiveOffers />
      <Testimonial />
      <Newsletter/>
    </>
  )
}

export default Home;
