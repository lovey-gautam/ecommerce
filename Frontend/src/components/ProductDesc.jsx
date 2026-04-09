import React from 'react'
import ProductImg from './ProductImg'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-hot-toast' 
import  { useState } from 'react';
import { setCart } from '@/redux/productSlice'
// or whichever toast library you use
const ProductDesc = ({product}) => {
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()

const [quantity, setQuantity] = useState(1);
  const addToCart = async(productId)=>{
    console.log("clicked")
    try{
    const res = await axios.post(`http://localhost:3000/api/v1/cart/add`,{productId,quantity},{
      headers:{
        Authorization:`Bearer ${accessToken}`
      }
    })
    if(res.data.success){
      toast.success('Product added to cart')
      dispatch(setCart(res.data.cart))
    }

    }catch(error){
 console.log(error)
   toast.error(error?.response?.data?.message || "Failed to add to cart")

    }
    console.log("HIT API");
  }
 

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='font-bold text-4xl text-gray-800'>{product.productName}</h1>
      <p className='text-gray-800'>{product.category} | {product.brand}</p>
      <h2 className='text-pink-500 font-bold text-2xl'>₹{product.productPrice}</h2>
      <p className='line-clamp-12 text-muted-foreground'>{product.productDesc}</p>
      <div className='flex gap-2 items-center w-[300px]'>
        <p className='text-gray-800 font-semibold'>Quantity :</p>
        <Input type='number' className='w-14' value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))} 
/>
      </div>
      <Button onClick={()=>addToCart(product._id)}
       className='bg-pink-600 w-max'>Add to Cart</Button>
    </div>
  )
}

export default ProductDesc
