import React from 'react'
import axios from 'axios'
import { useEffect,useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import OrderCart from '@/components/OrderCart'

const MyOrder = () => {

    const [userOrder,setUserOrder] = useState([])
const navigate = useNavigate()

    const getUserOrders = async()=>{

        try{
        const accessToken = localStorage.getItem("accessToken")
        const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/myorder`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
         console.log("API Response:", res.data);

        if(res.data.success){
            setUserOrder(res.data.orders)
        }
    }catch (error) {
        console.error("Error fetching orders:", error.response?.data || error.message);
    }
};

    useEffect(()=>{
        getUserOrders()
     } ,[])
  return (
   <OrderCart userOrder={userOrder}/>
  )
}

export default MyOrder
