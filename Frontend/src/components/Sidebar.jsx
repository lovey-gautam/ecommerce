import Dashboard from '@/pages/Dashboard'
import { LayoutDashboard, Users ,PackagePlus} from 'lucide-react'
import React from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { PackageSearch } from 'lucide-react'
import { NavLink } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className='hidden md:block fixed top-0 left-0 h-screen w-64 bg-pink-50 border-r border-pink-200 p-6 overflow-y-auto'>
        <div className=' pt-10  space-y-2'>
            <NavLink to = '/dashboard/sales' className={({isActive})=> `text-lg ${isActive? "bg-pink-600 text-gray-200":"bg-transparent"}
            flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
            <LayoutDashboard/><span>Dashboard</span></NavLink>

            <NavLink to = '/dashboard/add-products' className={({isActive})=> `text-lg ${isActive? "bg-pink-600 text-gray-200":"bg-transparent"}
                flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
            <PackagePlus/><span>Add Product</span></NavLink>

            <NavLink to = '/dashboard/products' className={({isActive})=>  `text-lg ${isActive? "bg-pink-600 text-gray-200":"bg-transparent"}
                flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
            <PackageSearch/><span>Product</span></NavLink>

             <NavLink to = '/dashboard/users' className={({isActive})=>  `text-lg ${isActive? "bg-pink-600 text-gray-200":"bg-transparent"}
                flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
            <Users/><span>Users</span></NavLink>

             <NavLink to = '/dashboard/orders' className={({isActive})=>  `text-lg ${isActive? "bg-pink-600 text-gray-200":"bg-transparent"}
                flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
            <FaRegEdit/><span>Orders</span></NavLink>
        </div>
      
    </div>
    
  )
}

export default Sidebar
