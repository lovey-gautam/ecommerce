import Breadcrums from '@/components/Breadcrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Footer from '@/components/Footer'
const SingleProduct = () => {
  const {id: productId } = useParams();
    const params = useParams()
    //const productId = params.id;
    const {products =[]} = useSelector(store=>store.product)
    const product = products.find((item)=>item._id=== productId)
    if (!products || products.length === 0) {
  return <p>Loading products...</p>;
}

if (!product) {
  return <p>Product not found</p>;
}
  return (
    <div className='pt-20 py-10 max-w-7xl mx-auto px-4'>
      <Breadcrums product={product}/>
      <div className='mt-6 flex flex-col md:flex-row gap-3 md:gap-8 items-start'>
        <div  className="w-full md:w-1/2" >
        <ProductImg images={product.productImg} product={product}/>
      </div>
        <div  className="w-full md:w-1/2">
        <ProductDesc  product={product}/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default SingleProduct
