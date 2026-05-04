import Breadcrums from '@/components/Breadcrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const SingleProduct = () => {
  const { id: productId } = useParams()
  const { products = [] } = useSelector(store => store.product)

  const [product, setProduct] = useState(null)

  useEffect(() => {
    // 1. Try Redux first
    const existingProduct = products.find(
      (item) => String(item._id) === String(productId)
    )

    if (existingProduct) {
      setProduct(existingProduct)
      return
    }

    // 2. Fetch if not found (THIS FIXES YOUR ISSUE)
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/products/${productId}`
        )

        if (res.data.success) {
          setProduct(res.data.product)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchProduct()
  }, [productId, products])

  if (!product) return <p>Loading product...</p>

  return (
    <div className='pt-20 py-10 max-w-7xl mx-auto px-4'>
      <Breadcrums product={product} />

      <div className='mt-10 flex flex-col md:flex-row gap-8 items-start'>
        <div className="w-full md:w-1/2">
          <ProductImg images={product.productImg} product={product} />
        </div>

        <div className="w-full md:w-1/2">
          <ProductDesc product={product} />
        </div>
      </div>
    </div>
  )
}

export default SingleProduct
