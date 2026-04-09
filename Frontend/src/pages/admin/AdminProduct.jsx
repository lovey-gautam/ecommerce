import { Input } from "@/components/ui/input";
import { Edit,Search,Trash2 } from "lucide-react";
import  { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { toast } from "sonner";
import { setProducts } from "@/redux/productSlice";
import axios from "axios";
import { useEffect } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const AdminProduct = () => {
  const {products} = useSelector(store=>store.product)
  const [editProduct,setEditProduct] = useState(null)
  const [open,setOpen]    = useState(false);
  const [searchTerm,setSearchTerm] = useState("")
  const [sortOrder,setSortOrder] = useState("")
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()
  
   const getAllProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/products/getallproducts");
      if (res.data.success) {
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }
  };

  useEffect(() => {
    //if (!products || products.length === 0) {
      getAllProducts();
    
  }, []);

  let filterdProducts = products.filter((product)=>
  product.productName.toLowerCase().includes(searchTerm.toLowerCase())||
product.brand.toLowerCase().includes(searchTerm.toLowerCase())||
product.category.toLowerCase().includes(searchTerm.toLowerCase))

if(sortOrder === "lowToHigh"){
  filterdProducts =[...filterdProducts].sort((a,b)=>a.productPrice-b.productPrice)
}
if(sortOrder === 'highToLow'){
  filterdProducts = [...filterdProducts].sort((a,b)=>b.productPrice-a.productPrice)
}
  const handleChange=(e)=>{
    const{name,value} = e.target
    setEditProduct(prev=>({
      ...prev,
      [name]:value
    }))
  }

  const handleSave=async (e)=>{
    e.preventDefault()
    const formData = new FormData()

    formData.append("productName",editProduct.productName)
    formData.append("productDesc",editProduct.productDesc)
    formData.append("productPrice",editProduct.productPrice)
    formData.append("category",editProduct.category)
    formData.append("brand",editProduct.brand)

const exisitingImages = editProduct.productImg
.filter((img)=>!(img instanceof File)&& img.public_id)
.map((img) =>img.public_id)

formData.append("exisitingImages",JSON.stringify(exisitingImages))

editProduct.productImg
.filter((img)=>img instanceof File)
.forEach((file)=>{
  formData.append("files",file)
})

try{
  const res = await axios.put(`http://localhost:3000/api/v1/products/update/${editProduct._id}`,formData,{
    headers:{
      Authorization:`Bearer ${accessToken}`
    }
  })
  if(res.data.success){
toast.success("Product updated successfully ")
const updateProducts = products.map((p)=>
p._id === editProduct._id? res.data.product:p)
dispatch(setProducts(updateProducts)) 
setOpen(false)
}
}catch(error){
  console.log(error)
}
  }
  const deleteProductHandler = async(productId)=>{
    try{
      const remainingProducts = products.filter((product)=>product._id !== productId)
  const res = await axios.delete(`http://localhost:3000/api/v1/products/delete/${productId}`,{
    headers:{
      Authorization:`Bearer ${accessToken}`
    }
  })
  if(res.data.success){
    toast.success(res.data.message)
    dispatch(setProducts(remainingProducts))
  }
    }catch(error){
      console.log(error)
    }
    console.log("Deleting:", productId);
  }


  return (
    <div className="pl-[350px] py-20 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100">
      <div className="flex justify-between">
        <div className="relative bg-white rounded-lg" >
          <Input 
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          type = 'text' placeholder="Search Product..." className="w-[400px] items-center"/>
          <Search 
          className="absolute right-3 top-1.5 text-gray-500"/>

        </div>
        <Select onValueChange={(value)=>setSortOrder(value)}>
          <SelectTrigger className="w-[180px] bg-white" >
          <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
           <SelectContent>
             <SelectItem value="lowToHigh">Price:Low to High</SelectItem>
           <SelectItem value="highToLow">Price:High to Low</SelectItem>
  </SelectContent>
</Select>
      </div>
      {
        filterdProducts.map((product,index)=>{
          return <Card key={product._id} className="px-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <img src ={product.productImg?.[0]?.url} alt=""className="w-25 h-25 object-cover"/>
                <h1 className="font-bold w-96 text-gray-700">{product.productName}</h1>
              </div>
              <h1 className="font-semibold text-gray-800">₹{product.productPrice}</h1>
              <div className="flex gap-3">
<Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
            <Edit onClick={()=>{setOpen(true),setEditProduct(product)}} className="text-green-500 cursor-pointer"/>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px] max-h-[740px] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to your product here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div className="grid gap-2">
              <Label >Product Name</Label>
              <Input type="text"
              value={editProduct?.productName}
              onChange={handleChange}
              name="productName" 
              placeholder = "Ex-Iphone"
              required  />
            </div>
           
            <div className="grid gap-2">
              <Label >Price</Label>
              <Input
               type="number"
              value={editProduct?.productPrice}
              onChange={handleChange}
              name="productPrice" 
              required  />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
              <Label >Brand</Label>
              <Input
               type="text"
               name="brand"
              value={editProduct?.brand}
              onChange={handleChange}
              placeholder = "Ex-Iphone"
              required  />
              </div>

              <div className="grid gap-2">
              <Label >Category</Label>
              <Input type="text"
              value={editProduct?.category}
              onChange={handleChange}
              name="category" 
              placeholder = "Ex-mobile"
              required  />
            </div>
            </div>

            <div className="grid gap-2">
            <div className="flex items-center">
              <Label >Description</Label>
              </div>
              <Textarea
              value={editProduct?.productDesc}
              onChange={handleChange}
              name="productDesc" 
              placeholder = "Enter brief description here"
              required  />
            </div>
        <ImageUpload productData= {editProduct} setProductData={setEditProduct}/>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>


    <AlertDialog>
  <AlertDialogTrigger asChild>
<Trash2 className="text-red-500 cursor-pointer"/>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete this product.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction  onClick={()=>deleteProductHandler(product._id)}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


              </div>
            </div>
          </Card>
          
        })
      }
    </div>
  )
}

export default AdminProduct
