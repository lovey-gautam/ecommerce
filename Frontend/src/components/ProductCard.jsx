import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { setCart } from '@/redux/productSlice'
import axios from 'axios'
const ProductCard = ({product,loading}) => {
  const [loadingBtn, setLoadingBtn] = React.useState(false);
    const {productImg=[],productPrice,productName} = product
  const accessToken = localStorage.getItem('accessToken')
  const dispatch = useDispatch()
  const navigate = useNavigate()


   const addToCart = async(productId) =>{ 
    
    if (loadingBtn) return; // Prevent multiple clicks
    setLoadingBtn(true);

    try{ const res = await axios.post(`http://localhost:3000/api/v1/cart/add`,
      {productId},{ 
        headers:{ Authorization:`Bearer ${accessToken}`, 
        'Content-Type': 'application/json', // ✅ ensures Express parses req.body
      
      }


        })
        if(res.data.success){
          toast.success('Product added to Cart')
          dispatch(setCart(res.data.cart))
        }
        else{
          toast.error('Failed to add product')
        }
      }catch(error){
        console.log(error)
      }finally{
        setLoadingBtn(false)
      }
    }
   console.log("Product images:", productImg);
  return (
    <div className='shadow-lg rounded-lg overflow-hidden h-max'>
      <div className='w-full h-full aspect-square overflow-hidden'>
        {
          loading?<Skeleton className="w-full h-full rounded-lg"/>:
          <img onClick={()=>navigate(`/products/${product._id}`)}
          src={productImg[0]?.url || '/placeholder.png' } alt="" 
            onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}

          className='w-full h-full transition-transform duration-300 hover:scale-105'/>

        }
       </div>
       
      <div className='px-2 space-y-1'>
        <h1 className='font-semibold h-12 line-clamp-2'>{productName}</h1>
        <h2 className='font-bold'>₹{productPrice.toLocaleString('en-IN')}</h2> 
        <Button disabled ={loadingBtn} onClick ={()=>addToCart(product._id)} className="bg-pink-600 hover:bg-blue-950 mb-3 w-full">
          <ShoppingCart/>{loadingBtn? "Adding...":"Add to Cart"}t</Button>
        </div>
    </div>
  )
}

export default ProductCard
