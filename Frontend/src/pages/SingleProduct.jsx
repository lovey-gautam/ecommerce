import Breadcrums from '@/components/Breadcrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingleProduct = () => {
  const {id} = useParams();
    const params = useParams()
    const productId = params.id;
    const {products} = useSelector(store=>store.product)
    const product = products.find((item)=>item._id=== productId)
    if (!products || products.length === 0) {
  return <p>Loading products...</p>;
}

if (!product) {
  return <p>Product not found</p>;
}
  return (
    <div className='pt-20 py-10 max-w-7xl mx-auto'>
      <Breadcrums product={product}/>
      <div className='mt-10 grid grid-cols-2 items-start'>
        <ProductImg images={product.productImg} product={product}/>
        <ProductDesc  product={product}/>
      </div>
    </div>
  )
}

export default SingleProduct
 