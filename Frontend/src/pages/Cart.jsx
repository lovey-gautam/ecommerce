import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userLogo from '../assets/userLogo.webp'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import axios from 'axios'
import { setCart } from '@/redux/productSlice'
import toast from 'react-hot-toast'
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"

const Cart = () => {
  const dispatch = useDispatch()
  const { cart = { items: [] } } = useSelector(store => store.product)
const navigate = useNavigate()
  const subtotal = cart?.items?.reduce((acc, product) => {
    const price = Number(product.price || product?.productId?.productPrice || 0)
    const quantity = product?.quantity || 1
    return acc + price * quantity
  }, 0)

  const shipping = subtotal === 0 ? 0 : (subtotal > 299 ? 0 : 10)
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + shipping + tax

  const API = `${import.meta.env.VITE_URL}/cart`
  const accessToken = localStorage.getItem("accessToken")

  const loadCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      if (res.data.success) {
        dispatch(setCart(res.data.cart || { items: [] }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(`${API}/update`,
        { productId, type },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )

      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { productId }
      })

      if (res.data.success) {
        dispatch(setCart(res.data.cart))
        toast.success("Product removed")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  return (
    <div className="pt-20 pb-24 bg-gray-50 min-h-screen px-3 sm:px-6">

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-5">

        {/* LEFT CART */}
        <div className="flex-1 flex flex-col gap-3 px-2 sm:px-0">

          {cart?.items?.map((product, index) => (
            <Card key={index} className="p-3 mx-1 sm:mx-0">

              <div className="flex flex-col   sm:flex-row sm:items-center sm:justify-between gap-3">

                {/* LEFT */}
                <div className="flex items-center gap-3 flex-1 min-w-0">

                  <img
                      onClick={() => navigate(`/products/${product?.productId?._id}`)}

                    src={product?.productId?.productImg?.[0]?.url || userLogo}
                    className="w-14 h-14 object-cover rounded"
                  />

                  <div className="min-w-0">
                    <h1 className="font-medium text-sm truncate max-w-[150px]">
                      {product?.productId?.productName}
                    </h1>
                    <p className="text-xs text-gray-500">
                      ₹{product?.productId?.productPrice}
                    </p>
                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">

                  <div className="flex items-center gap-2">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleUpdateQuantity(product.productId._id, 'decrease')
                      }
                    >
                      -
                    </Button>

                    <span className="text-sm w-6 text-center">
                      {product.quantity}
                    </span>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleUpdateQuantity(product.productId._id, 'increase')
                      }
                    >
                      +
                    </Button>

                  </div>

                  <p className="font-semibold text-sm min-w-[70px] text-right">
                    ₹{Number(
                      product.price ||
                      product?.productId?.productPrice ||
                      0
                    ).toLocaleString('en-IN')}
                  </p>

                  <Trash2
                    onClick={() => handleRemove(product?.productId?._id)}
                    className="w-5 h-5 text-red-500 cursor-pointer"
                  />

                </div>

              </div>
            </Card>
          ))}

        </div>

        {/* RIGHT SUMMARY */}
        <div className="w-full lg:w-[400px]">

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="flex justify-between">
                <span>Subtotal ({cart?.items?.length})</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

            </CardContent>
          </Card>

        </div>

      </div>
  
    <div className='fixed bottom-0 left-0 right-0 p-3 bg-white border-t  z-50'> 
    <Button onClick={() => navigate('/address')} className='w-full bg-pink-600 mt-4  lg:block' >
      PLACE ORDER 
    </Button> </div> 
    </div>
    
    
  )
}

export default Cart
                
