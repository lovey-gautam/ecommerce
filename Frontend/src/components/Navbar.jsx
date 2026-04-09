import React from 'react'
import { LogOut, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useDispatch,useSelector } from 'react-redux'
import { setUser } from '@/redux/userSlice'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
const {cart} = useSelector(store=>store.product)
const {user} = useSelector(store=>store.user)
  console.log("full state",user)  
  const admin = user?.role === "admin" ? true:false
  console.log(user?.role)
  const accessToken = localStorage.getItem('accessToken')
const dispatch = useDispatch();
const navigate = useNavigate();

  const logoutHandler = async()=>{
    try{
      const res = await axios.post(`http://localhost:3000/api/v1/user/logout`,{},{
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
     <div className='max-w-7xl mx-auto flex justify-between items-center py-3' >
      <div className='flex items-center gap-2'>
        <span className='text-xl  font-bold text-pink-700'>Kart</span>
        <img src="/ekart.jpg"alt ="Kart" className='w-[100px]'/>
        
      </div>
      <nav className='flex gap-10 justify-between items-center'>
        <ul className='flex gap-7 items-center text-xl font-semibold'>
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
    </header>
  )
}

export default Navbar
