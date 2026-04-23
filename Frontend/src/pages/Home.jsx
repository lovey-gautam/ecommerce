import Hero from '@/components/Hero'
import React from 'react'
import Features from '@/components/Features'
import  { useState, useEffect } from 'react'

const Home = () => {
   const [loading, setLoading] = useState(true)

  useEffect(() => {
    // simulate API load OR wait for child components
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

   if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  return (
    <div>
      <Hero/>
      <Features/>
    </div>
  )
}

export default Home
