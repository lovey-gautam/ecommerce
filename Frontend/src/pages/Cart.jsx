import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userLogo from '../assets/userLogo.webp'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, ShoppingCart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setCart } from '@/redux/productSlice'
import toast from 'react-hot-toast'
import {  CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from "@/components/ui/separator"

const Cart = () => {
  const navigate = useNavigate()
  const { cart= { items: [] } } = useSelector(store => store.product)
  console.log(cart)
  const dispatch = useDispatch()

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
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
console.log("CART API RESPONSE:", res.data)
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
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
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
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: { productId }
      })

      if (res.data.success) {
        dispatch(setCart(res.data.cart))
        toast.success('Product removed from cart')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadCart()
  }, [dispatch])

  return (
  <div className='pt-20 pb-24 bg-gray-50 min-h-screen'>

  <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-5'>

    {/* LEFT - CART ITEMS */}
    <div className='flex-1 flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-2'>
      {cart?.items?.map((product, index) => (
        <Card key={index} className="p-2">
          <div className='flex items-center justify-between gap-2'>

            {/* IMAGE + NAME */}
            <div className='flex items-center gap-3 flex-1 min-w-0'>
              <img
                src={product?.productId?.productImg?.[0]?.url || userLogo}
                className='w-12 h-12 object-cover rounded'
              />

              <div className='min-w-0'>
                <h1 className='font-medium text-sm truncate max-w-[120px]'>
                  {product?.productId?.productName}
                </h1>
                <p className='text-xs text-gray-500'>
                  ₹{product?.productId?.productPrice}
                </p>
              </div>
            </div>

            {/* QTY */}
            <div className='flex items-center gap-2'>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleUpdateQuantity(product.productId._id, 'decrease')
                }
              >
                -
              </Button>

              <span className="text-sm">{product.quantity}</span>

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

            {/* PRICE */}
            <p className='font-semibold text-sm w-[70px] text-right'>
              ₹{Number(
                product.price ||
                product?.productId?.productPrice ||
                0
              ).toLocaleString('en-IN')}
            </p>

            {/* REMOVE */}
            <Trash2
              onClick={() => handleRemove(product?.productId?._id)}
              className='w-4 h-4 text-red-500 cursor-pointer'
            />
          </div>
        </Card>
      ))}
    </div>

    {/* RIGHT - ORDER SUMMARY */}
    <div className='w-full lg:w-[400px]'>
      <Card>
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

        </CardContent>
      </Card>
    </div>

  </div>
</div>
);
}
export default Cart;
