import React from 'react'
import { Button } from './components/ui/button'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import AdminSales from './pages/admin/AdminSales'
import AddProduct from './pages/admin/AddProduct'
import AdminOrders from './pages/admin/AdminOrders'
import ShowUserOrder from './pages/admin/ShowUserOrder'
import AdminUser from './pages/admin/AdminUser'
import UserInfo from './pages/admin/UserInfo'
import ProtectedRoute from './components/ProtectedRoute'
import SingleProduct from './pages/SingleProduct'
import AdminProduct from './pages/admin/AdminProduct'
import AddressForm from './pages/AddressForm'
import OrderSuccess from './pages/OrderSuccess'
const router = createBrowserRouter([
  {
    path:'/',
    element:<><Navbar/><Home/><Footer/></>
  },
  {
    path:'/signup',
    element:<><Signup/></>
  },
  {
    
    path:'/login',
    element:<><Login/></>
  },
  {
    
    path:'/verify',
    element:<><Verify/></>
  },
  {
    
    path:'/verify-email/:token',
    element:<><VerifyEmail/></>
  }
  ,
  {
    
    path:'profile/:userId',
    element:<ProtectedRoute><Navbar/><Profile/></ProtectedRoute>
  },
  {
    
    path:'products',
    element:<><Navbar/><Products/></>
  },
  {
    
    path:'products/:id',
    element:<><Navbar/><SingleProduct/></>
  },
   {
    
    path:'cart',
    element:<ProtectedRoute><Navbar/><Cart/></ProtectedRoute>
  },
  {
    
    path:'address',
    element:<ProtectedRoute><AddressForm/></ProtectedRoute>
  },
  {
    
    path:'/order-success',
    element:<ProtectedRoute><OrderSuccess/></ProtectedRoute>
  },
  
 {
    path:'/dashboard',
    element:<ProtectedRoute adminOnly={true}><Navbar/><Dashboard/></ProtectedRoute>,
    children:[
      {
        path:"sales",
        element:<AdminSales/>
      },
      {
        path:"add-products",
        element:<AddProduct/>
      },
      {
        path:"products",
        element:<AdminProduct/>
      },
      {
        path:"orders",
        element:<AdminOrders/>
      }
      ,
      {
        path:"users/orders/:userId",
        element:<ShowUserOrder/>
      },
      {
        path:"users",
        element:<AdminUser/>
      },
      {
        path:"users/:id",
        element:<UserInfo/>
      },
    ]
  },

  

])
const App = () => {
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
