import React, { useEffect } from 'react' 
import { useDispatch, useSelector } from 'react-redux'
  import userLogo from '../assets/userLogo.webp' 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card' 
import { Separator } from "@/components/ui/separator" 
import { Button } from '@/components/ui/button' 
import { Input } from '@/components/ui/input' 
import { Trash2 } from 'lucide-react' import { Link, useNavigate } from 'react-router-dom'
  import { ShoppingCart } from 'lucide-react' import axios from 'axios' 
import { setCart } from '@/redux/productSlice' import { useState } from 'react' 
import toast from 'react-hot-toast' 
// to add to kart 
const Cart = () => {
  const navigate = useNavigate()
    const {cart} = useSelector(store=>store.product) 
      console.log(cart) 
        const dispatch = useDispatch(); 
      const subtotal = cart?.items?.reduce((acc, product) => { 
        const price = Number(product.price || product?.productId?.productPrice || 0); 
        
        const quantity = product?.quantity || 1; return acc + price * quantity; }, 0); 
  const shipping = subtotal === 0 ? 0 : (subtotal > 299 ? 0 : 10);
  const tax = Math.round(subtotal * 0.05); const total = subtotal +shipping+tax 
    const API = ${import.meta.env.VITE_URL}/cart 
      const accessToken = localStorage.getItem("accessToken")
        const loadCart = async()=>{ try{ const res = await axios.get(API,{ headers:{ Authorization:Bearer ${accessToken } } }) 
          if(res.data.success){ 
            dispatch(setCart(res.data.cart)) } 
                                       }
        catch(error){
          console.log(error) } } 
          const handleUpdateQuantity = async(productId,type)=>{
            try{
              const res = await axios.put(${API}/update,{productId,type},{ 
              headers:{
                Authorization:Bearer ${accessToken} } })
            if(res.data.success){
              dispatch(setCart(res.data.cart)) } }
            catch(error){ console.log(error) } }
               const handleRemove = async(productId)=>{ 
                 try{
                   const res = await axios.delete(${API}/remove,
                   { headers:{ 
                     Authorization:Bearer ${accessToken}, }, data:{productId} })
                   if(res.data.success){ dispatch(setCart(res.data.cart)) toast.success('Product removed from cart') } }
                 catch(error){ console.log(error) }
               } 
                 useEffect(()=>{
                   loadCart() 
                 },[dispatch])
return (
  <div className='pt-20 pb-24 bg-gray-50 min-h-screen'>
    {
      cart?.items?.length > 0 ? (
        <div className='max-w-7xl mx-auto'>
          
          <h1 className='text-2xl font-bold text-gray-800 mb-7'>
            Shopping Cart
          </h1>

          <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-7'>

            {/* LEFT - CART ITEMS */}
            <div className='flex flex-col gap-5 flex-1 order-1 lg:order-none'>
              {cart?.items?.map((product, index) => (
                <Card key={index}>
                  <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 pr-4 lg:pr-7'>

                    <div className='flex items-center w-full lg:w-[350px]'>
                      <img
                        src={product?.productId?.productImg?.[0]?.url || userLogo}
                        className='w-25 h-25'
                      />

                      <div className='w-[280px]'>
                        <h1 className='font-semibold truncate'>
                          {product?.productId?.productName}
                        </h1>
                        <p>₹{product?.productId?.productPrice}</p>
                      </div>
                    </div>

                    <div className='flex gap-3 lg:gap-5 items-center'>
                      <Button
                        type='button'
                        onClick={() =>
                          handleUpdateQuantity(product.productId._id, 'decrease')
                        }
                        variant='outline'
                      >
                        -
                      </Button>

                      <span>{product.quantity}</span>

                      <Button
                        type='button'
                        onClick={() =>
                          handleUpdateQuantity(product.productId._id, 'increase')
                        }
                        variant='outline'
                      >
                        +
                      </Button>
                    </div>

                    <p className='font-semibold'>
                      ₹
                      {Number(
                        product.price ||
                        product?.productId?.productPrice ||
                        0
                      ).toLocaleString('en-IN')}
                    </p>

                    <p
                      onClick={() => handleRemove(product?.productId?._id)}
                      className='flex text-red-500 items-center gap-1 cursor-pointer'
                    >
                      <Trash2 className='w-4 h-4' />
                      Remove
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {/* RIGHT - ORDER SUMMARY */}
            <div className='order-2 lg:order-none'>
              <Card className='w-full lg:w-[400px]'>

                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className='space-y-4'>

                  <div className='flex justify-between'>
                    <span>Subtotal ({cart?.items?.length} items)</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className='flex justify-between'>
                    <span>Shipping</span>
                    <span>₹{shipping.toLocaleString('en-IN')}</span>
                  </div>

                  <div className='flex justify-between'>
                    <span>Tax (5%)</span>
                    <span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>

                  <Separator />

                  <div className='flex justify-between font-bold text-lg'>
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>

                  <div className='space-y-3 pt-4'>

                    <div className='flex space-x-2'>
                      <Input placeholder='Promo Code' />
                      <Button variant='outline'>Apply</Button>
                    </div>

                    <Button variant='outline' className='w-full bg-transparent'>
                      <Link to="/products">Continue Shopping</Link>
                    </Button>

                  </div>

                  <div className='text-sm text-muted-foreground pt-4'>
                    <p>*Free shipping on orders over 299</p>
                    <p>*30 days return policy</p>
                    <p>*Secure checkout with SSL encryption</p>
                  </div>

                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      ) : (

        <div className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-center'>
          <div className='bg-pink-100 p-6 rounded-full'>
            <ShoppingCart className='w-16 h-16 text-pink-600' />
          </div>

          <h2 className='mt-6 text-2xl font-bold text-gray-800'>
            Your Cart is Empty
          </h2>

          <p className='mt-2 text-gray-600'>
            Looks like you haven't added anything to your cart yet
          </p>

          <Button
            onClick={() => navigate('/products')}
            className='mt-6 bg-pink-600 text-white'
          >
            Start Shopping
          </Button>
        </div>
      )}

      {/* ✅ MOBILE ONLY FIXED PLACE ORDER BUTTON */}
      <div className='fixed bottom-0 left-0 right-0 p-3 bg-white border-t lg:hidden z-50'>
        <Button
          onClick={() => navigate('/address')}
          className='w-full bg-pink-600'
        >
          PLACE ORDER
        </Button>
      </div>

    </div>
);
