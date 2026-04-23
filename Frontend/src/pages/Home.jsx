import Hero from '@/components/Hero'
import React from 'react'
import Features from '@/components/Features'
const Home = () => {
   const [loading, setLoading] = useState(true)

  useEffect(() => {
    // simulate API load OR wait for child components
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading)
  return (
    <div>
      <Hero/>
      <Features/>
    </div>
  )
}

export default Home
