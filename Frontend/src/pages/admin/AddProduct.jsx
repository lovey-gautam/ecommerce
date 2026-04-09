import { CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Card ,CardHeader,CardTitle} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'
import toast  from 'react-hot-toast'
import axios from 'axios'
import { setProducts } from '@/redux/productSlice'


const AddProduct = () => {
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()
  const [loading,setLoading] = useState();
  const {products} = useSelector(store=>store.product)
  const [productData,setProductData] = useState({
    productName:"",
    productPrice:0,
    ProductDesc:"",
    productImg:[],
    brand:"",
    category:""
  });
  const handleChange=(e)=>{
    const {name,value} = e.target;
    setProductData((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  const submitHandler = async(e)=>{
    e.preventDefault()
    const formData = new FormData();
    formData.append("productName",productData.productName);
    formData.append("productPrice",productData.productPrice);
    formData.append("productDesc",productData.ProductDesc);
    formData.append("brand",productData.brand);
    formData.append("category",productData.category);

    if(productData.productImg.length === 0){
      toast.error("Please select at least one image")
      return;
    }
    productData.productImg.forEach((img)=>{
      formData.append("files",img)
    })
    try{
      setLoading(true)
      const res = await axios.post(`http://localhost:3000/api/v1/products/add`,formData,{
        headers:{
         Authorization:`Bearer ${accessToken}`        }
      })
      if(res.data.success){
          toast.success("Product added successfully 🎉"); 

        dispatch(setProducts([...products,res.data.product]))
      }
    }catch(error){
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  }
  return (
    <div className='pl-[350px] py-10 pr-20 mx-auto px-4 bg-gray-100'>
      <Card className= 'w-full my-20'>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Enter Product details below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-2'>
            <div className='grid gap-2'>
              <Label>Product Name</Label>
              <Input type = "text"
               name="productName" 
               value={productData.productName}
               onChange={handleChange}
               placeholder="Ex-Iphone" required/>
            </div>
          <div className='grid gap-2'>
             <Label>Price</Label>
              <Input type = "number"
               name="productPrice"
               value={productData.productPrice}
               onChange={handleChange}
                placeholder=''
                required/>
          </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
              <Label>Brand</Label>
              <Input type = "text" name="brand" 
              value={productData.brand}
              onChange={handleChange}
              placeholder='Ex-apple'required/>
           </div>
            </div>

             <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-2'>
                   <Label>Category</Label>
             <Input
                 name="category"
              value={productData.category}
               onChange={handleChange}
                 />
        </div>
           </div>

             <div className='grid gap-2'>
              <div className='flex items-center'>
              <Label>Description</Label>
           </div>
           <Textarea name="ProductDesc"
            value={productData.ProductDesc ||""}
              onChange={handleChange}
           placeholder="Enter breif description of product"/>
            </div>
            <ImageUpload productData={productData} setProductData={setProductData}/>
          </div>
          <form onSubmit = {submitHandler} className='fex flex-col gap-2'>
          <CardFooter className="flex-col gap-2">
         <Button 
         disabled={loading} 
         
         className="w-full mt-6 bg-pink-600 hover:bg-gray-700"type="submit">
          {
            loading ? <span className='flex gap-1 items-center'><Loader2 className='animate-spin'/>Please wait</span>:'Add Product'
          }
          </Button>
          </CardFooter>
          </form>
        </CardContent>
      </Card>
      
    </div>
  )
}

export default AddProduct
