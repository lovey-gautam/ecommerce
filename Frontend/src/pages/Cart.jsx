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

const Cart = () => {
  const dispatch = useDispatch()
  const { cart = { items: [] } } = useSelector(store => store.product)

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
    <div className="pt-20 pb-24 bg-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* LEFT CART */}
        <div className="flex-1 flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1">

          {cart?.items?.map((product, index) => (
            <Card key={index} className="p-3">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                {/* IMAGE + NAME */}
                <div className="flex items-center gap-3 min-w-0">

                  <img
                    src={product?.productId?.productImg?.[0]?.url || userLogo}
                    className="w-14 h-14 object-cover rounded flex-shrink-0"
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

                {/* ACTIONS */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">

                  {/* QTY */}
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

                  {/* PRICE */}
                  <p className="font-semibold text-sm min-w-[70px] text-right">
                    ₹{Number(
                      product.price ||
                      product?.productId?.productPrice ||
                      0
                    ).toLocaleString('en-IN')}
                  </p>

                  {/* REMOVE */}
                  <Trash2
                    onClick={() => handleRemove(product?.productId?._id)}
                    className="w-5 h-5 text-red-500 cursor-pointer flex-shrink-0"
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
    </div>
  )
}

export default Cart
