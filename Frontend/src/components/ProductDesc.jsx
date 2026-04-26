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
  
  const [showFull, setShowFull] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false)
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()
const isLong = product.productDesc?.length > 120;
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
    <div className='flex flex-col gap-5 w-full max-w-xl'>
       <div className="space-y-1">
      <h1 className='font-bold text-xl sm:text-2xl md:text-3xl  break-words text-gray-800'>{product.productName}</h1>
      <p className='text-gray-500 text-sm'>{product.category} | {product.brand}</p>
       </div>
       
      <h2 className='text-pink-600 font-bold text-2xl sm:text-3xl'>₹{product.productPrice?.toLocaleString('en-IN')}</h2>
      <div className="space-y-2">
       <p className={`text-gray-600 text-sm sm:text-base leading-relaxed tracking-wide
       ${showFull ? '' : 'line-clamp-3 '}`}>
       {product.productDesc}
        </p>
      {isLong && (
      <button 
  onClick={() => setShowFull(!showFull)}
  className="text-pink-600 text-sm font-semibold"
>
  {showFull ? "Show Less" : "Read More"}</button>
      )}
        </div>
       <div className="space-y-1">
      <div className='flex gap-3 items-center'>
        <span className='font-semibold'>Quantity:</span>
        <Input   
          type='number'  
          min="1"
         className= 'w-20' 
          value={quantity} 
         onChange={(e) => {
    const value = e.target.value
  if (value === '') {
    setQuantity(1)
  } else {
    const num = Math.max(1, Number(value))
    setQuantity(num)
  }
  }}
         
/>
      </div>
      </div>
      <Button 
          disabled={loadingBtn}
        onClick={()=>addToCart(product._id)}
       className='bg-pink-600 hover:bg-pink-700 w-full md:w-max'>  {loadingBtn ? "Adding..." : "Add to Cart"}
</Button>
    </div>
  )
}

export default ProductDesc
