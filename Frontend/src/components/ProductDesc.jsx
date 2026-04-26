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
  
  const [loadingBtn, setLoadingBtn] = useState(false)
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()

const [quantity, setQuantity] = useState(1);
  
  const addToCart = async(productId)=>{
    console.log("clicked")
     if (loadingBtn) return
    setLoadingBtn(true)

    try{
    const res = await axios.post(`${import.meta.env.VITE_URL}/cart/add`,{productId,quantity},{
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
    finally {
    setLoadingBtn(false) // ✅ IMPORTANT
  }
    console.log("HIT API");
  }
 

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='font-bold text-2xl sm:text-3xl md:text-4xl text-gray-800'>{product.productName}</h1>
      <p className='text-gray-800'>{product.category} | {product.brand}</p>
      <h2 className='text-pink-500 font-bold text-xl sm:text-2xl'>₹{product.productPrice}</h2>
      <p className='line-clamp-12 text-muted-foreground text-sm sm:text-base leading-relaxed'>{product.productDesc}</p>
      <div className='flex gap-2 items-center w-full max-w-xs'>
        <p className='text-gray-800 font-semibold'>Quantity :</p>
        <Input   
          type='number'  
          min="1"
         className= 'w-16 sm:w-20' value={quantity} 
         onChange={(e) => {
    const value = Math.max(1, Number(e.target.value))
    setQuantity(value)
  }}
         
/>
      </div>
      <Button 
          disabled={loadingBtn}
        onClick={()=>addToCart(product._id)}
       className='bg-pink-600 w-full sm:w-max'>  {loadingBtn ? "Adding..." : "Add to Cart"}
</Button>
    </div>
  )
}

export default ProductDesc
