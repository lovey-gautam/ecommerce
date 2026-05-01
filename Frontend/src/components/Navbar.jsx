import React from 'react'
import { LogOut, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useDispatch,useSelector } from 'react-redux'
import { setUser } from '@/redux/userSlice'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Navbar = () => {
const {cart} = useSelector(store=>store.product)
const {user} = useSelector(store=>store.user)
  const [menuOpen, setMenuOpen] = React.useState(false)
  console.log("full state",user)  
  const admin = user?.role === "admin" ? true:false
  console.log(user?.role)
  const accessToken = localStorage.getItem('accessToken')
const dispatch = useDispatch();
const navigate = useNavigate();

  const logoutHandler = async()=>{
    try{
      const res = await axios.post(`${import.meta.env.VITE_URL}/user/logout`,{},{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      })
      if(res.data.success){
         dispatch(setUser(null))
        toast.success(res.data.message)
      }
    }
    catch(error){
      console.log(error);
    }
  }
  console.log(cart)
  return (
    <header className='bg-pink-50 fixed w-full top-0 border-b border-pink-200'>
     <div className='max-w-7xl mx-auto flex justify-between items-center py-3 px-4' >
      <div className='flex items-center gap-2'>
        <span className='text-xl  font-bold text-pink-700'>Kart</span>
       <img src="/ekart.jpg" alt="Kart" className='w-16 md:w-24'/>
        
      </div>
        <button  className="md:hidden text-2xl"
         onClick={() => setMenuOpen(!menuOpen)}>  
           {menuOpen ? "✕" : "☰"}
    </button>

      <nav className='hidden md:flex gap-6 items-center'>
        <ul className='flex gap-5 items-center text-base md:text-lg font-semibold'>
          <Link to={'/'}><li>Home</li></Link>
           <Link to={'/products'}><li>Products</li></Link>
   {
    user &&   ( <Link to={`/profile/${user._id}`}><li>Hello,{user.FirstName}</li></Link>)

   }
   {
    admin &&   ( <Link to={`/dashboard/sales`}><li>Dashboard</li></Link>)

   }
   
        </ul>
             <Link to={'/cart'} className='relative'>
             <ShoppingCart/>
             <span className='bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2'>{cart?.items?.length??0 }</span>
             </Link>
             {
              user ? <Button type="button" onClick={logoutHandler} className='bg-pink-600 text-white cursor-pointer'>Logout</Button>:<Button
              onClick={()=>navigate('/login')}
              className='bg-gradient-to-tl from-blue-600 to-purple-600 text-white cursor-pointer'>Login</Button>
             }
         
      </nav>
      
     </div>
      {menuOpen && (
  <div className="md:hidden flex flex-col gap-4 px-4 pb-4 bg-pink-50 border-t">
    
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
    <Link to="/products"  onClick={() => setMenuOpen(false)}>Products</Link>

    {user && (
      <Link to={`/profile/${user._id}`}  onClick={() => setMenuOpen(false)}>
        Hello, {user.FirstName}
      </Link>
    )}

    {admin && (
      <Link to="/dashboard/sales"  onClick={() => setMenuOpen(false)}>Dashboard</Link>
    )}

    <Link to="/cart"  onClick={() => setMenuOpen(false)}>
      Cart ({cart?.items?.length ?? 0})
    </Link>

    {user ? (
    <Button onClick={() => { logoutHandler(); setMenuOpen(false); }}>
  Logout
</Button>
    ) : (
    <Button onClick={() => { navigate('/login'); setMenuOpen(false); }}>
  Login
</Button>
    )}

  </div>
)}

    </header>
  )
}

export default Navbar
