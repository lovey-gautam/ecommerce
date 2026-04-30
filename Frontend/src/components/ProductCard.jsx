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

    try{ const res = await axios.post(`${import.meta.env.VITE_URL}/cart/add`,
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
    <div className='flex gap-3 p-2 border rounded-lg shadow-sm items-center bg-white'>
      <div className='w-24 h-24 flex-shrink-0 overflow-hidden rounded-md'>
        {
          loading? (<Skeleton className="w-full h-full"/>
                    ):(
          <img onClick={()=>navigate(`/products/${product._id}`)}
          src={productImg[0]?.url || '/placeholder.png' } alt="" 
            onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}

          className='w-full h-full object-cover '/>
)
        }
       </div>
       
      <div className='flex flex-col justify-between flex-1 h-full'>
        <h1 className='text-sm font-medium line-clamp-2'>{productName}</h1>
        <h2 className='text-pink-600 font-semibold text-sm'>₹{productPrice.toLocaleString('en-IN')}</h2> 
        <Button size="sm" disabled ={loadingBtn} onClick ={()=>addToCart(product._id)} className="bg-pink-600 hover:bg-blue-950 text-xs py-1 mt-1 w-fit">
          <ShoppingCart size={14}/>{loadingBtn? "Adding...":"Add"}</Button>
        </div>
    </div>
  )
}

export default ProductCard
