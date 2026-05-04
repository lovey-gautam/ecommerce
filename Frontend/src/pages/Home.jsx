import Hero from '@/components/Hero'
import React from 'react'
import Features from '@/components/Features'
import  { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
   const [loading, setLoading] = useState(true)
 const [search, setSearch] = useState("")
  const navigate = useNavigate()

    const handleSearch = (e) => {
   if (e.key === "Enter" && search.trim() !== "") {
    navigate(`/products?search=${encodeURIComponent(search)}`)
    }
  }
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
     <div className="pt-20">

      {/* 🔍 SEARCH BAR */}
      <div className="px-4 mb-6 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* HERO */}
      <Hero />
      <Features />
    </div>
  )
}

export default Home
