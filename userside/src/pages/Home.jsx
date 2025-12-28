import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../componets/Hero'
import FeaturedDestination from '../componets/FeaturedDestination'
import ExclusiveOffers from '../componets/ExclusiveOffers'
import Testimonial from '../componets/Testimonial'
import Newsletter from '../componets/Newsletter'
import RecommendedHotels from '../componets/RecommendedHotels'

export const Home = () => {
  const location = useLocation()

  useEffect(() => {
    const id = location.state?.scrollTo
    if (id) {
      // small delay to ensure elements have mounted
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }, [location.state])

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
