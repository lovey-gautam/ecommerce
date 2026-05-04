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
  <div className="bg-white rounded-lg shadow-sm p-3 flex flex-col h-full hover:shadow-md transition">

    {/* IMAGE */}
    <div
      className="w-full h-40 overflow-hidden rounded-md cursor-pointer"
      onClick={() =>
        navigate(`/products/${product._id}`, {
          state: { product }
        })
      }
    >
      {loading ? (
        <Skeleton className="w-full h-full" />
      ) : (
        <img
          src={productImg[0]?.url || '/placeholder.png'}
          alt={productName}
          onError={(e) => (e.currentTarget.src = '/placeholder.png')}
          className="w-full h-full object-cover"
        />
      )}
    </div>

    {/* CONTENT */}
    <div className="mt-2 flex flex-col flex-1">

      <h1 className="text-sm font-medium line-clamp-2">
        {productName}
      </h1>

      <p className="text-pink-600 font-semibold text-sm mt-1">
        ₹{productPrice.toLocaleString('en-IN')}
      </p>

      <Button
        size="sm"
        disabled={loadingBtn}
        onClick={() => addToCart(product._id)}
        className="bg-pink-600 hover:bg-pink-700 text-xs mt-auto"
      >
        <ShoppingCart size={14} className="mr-1" />
        {loadingBtn ? "Adding..." : "Add"}
      </Button>

    </div>
  </div>
)
    
}

export default ProductCard
