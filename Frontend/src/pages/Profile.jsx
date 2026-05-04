import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import userLogo from "../assets/userLogo.webp"
import { setUser } from "@/redux/userSlice"
import { useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import MyOrder from "./MyOrder"


export const Profile = () => {
  const {user} = useSelector(store=>store.user)
  const params = useParams();
  const userId =  user?._id //params.userId
  const [loading ,setLoading] = useState(false);
  const [updateUser ,setUpdateUser] = useState({
    FirstName:user?.FirstName || "",
    lastName:user?.lastName || "",
    email:user?.email || "",
    phoneNo:user?.phoneNo || "",      
    address:user?.address || "",
    city:user?.city || "",
    zipCode:user?.zipCode || "",
    profilePic:user?.profilePic || "", 
    role:user?.role || ""

  })
  const [file,setFile] = useState(null)
  const dispatch = useDispatch();

  const handleChange = (e)=>{
    setUpdateUser({...updateUser,[e.target.name]:e.target.value})
  }
  
  const handleFileChange = (e)=>{
const selectedFile = e.target.files[0];
setFile(selectedFile)
setUpdateUser({...updateUser,profilePic:URL.createObjectURL(selectedFile)})
  } 

  const  handleSubmit = async(e)=>{
    e.preventDefault()
    setLoading(true);
  console.log(updateUser)
    const accessToken = localStorage.getItem("accessToken")
    try{
         
      const formData = new FormData()
      formData.append("FirstName",updateUser.FirstName)
      formData.append("lastName",updateUser.lastName)
      formData.append("email",updateUser.email)
      formData.append("phoneNo",updateUser.phoneNo)
      formData.append("address",updateUser.address)
      formData.append("city",updateUser.city)
      formData.append("zipCode",updateUser.zipCode)
      formData.append("role",updateUser.role)

      if(file){
        formData.append("file",file)
      }
    
      const res = await axios.put(`${import.meta.env.VITE_URL}/user/update/${userId}`,formData,{
        headers:{
          Authorization:`Bearer ${accessToken}`,
          "Content-Type":"multipart/form-data"
        }
      })
      if(res.data.success){
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }
    }
    catch(error){
      console.log(error);
      toast.error("Failed to update profile")
    }finally{
      setLoading(false)
    }
    }
  
  return (
    <div className="pt-20 min-h-screen bg-gray-100 flex justify-center items-center">
      <Tabs defaultValue="profile" className='max-w-7xl mx-auto items-center'>
        <TabsList>
          <TabsTrigger value ="profile">Profile</TabsTrigger>
           <TabsTrigger value ="orders">Orders</TabsTrigger>
         
        </TabsList>
        <TabsContent value ="profile">
          <div>
            <div className="flex flex-col justify-center items-center bg-gray-100">
              <h1 className="font-bold mb-7 text-2xl text-gray-800">Update Profile</h1>
              <div className="w-full flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start px-4 md:px-7 max-w-2xl">
                <div className="flex flex-col items-center md:items-start">
                  <img src={updateUser?.profilePic || userLogo}
                   alt="profile" 
                   className="w-36 h-34 rounded-full object-cover object-top border-4 border-pink-800"/>
                  <Label className='mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg
                  hover:bg-pink-700'>Change Picture
                  <input type="file" accept='image/*'
                   className="hidden"
                   onChange={handleFileChange}
                   />
                  </Label>

                </div>
                {/**profile form */}
                <form onSubmit={handleSubmit} className="space-y-4 shadow-lg p-5 rounded-lg bg-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className='block text-sm font-medium'>FirstName </Label>
                      <Input type='text'
                       name="FirstName"
                       placeholder="John"
                       value = {updateUser.FirstName}
                       onChange={handleChange}
                        className='w-full border rounded-lg px-3 py-2 mt-1'
                      />
                    </div>
                   <div>
                      <Label className='block text-sm font-medium'>Last Name </Label>
                      <Input type='text'
                       name="lastName"
                       placeholder="Doe"
                       value = {updateUser.lastName}
                       onChange={handleChange}
                        className='w-full border rounded-lg px-3 py-2 mt-1'
                      />
                    </div>
                  </div>
                  <div>
                      <Label className='block text-sm font-medium'>Email </Label>
                      <Input type='email'
                       name="email"
                       placeholder="Doe"
                       value = {updateUser.email}
                       onChange={handleChange}
                        className='w-full border rounded-lg px-3 py-2 mt-1'
                      />
                    </div>
                  <div>
                    <Label className='block text-sm font-medium'>Phone Number</Label>
                    <Input 
                    type='text'
                     name="phoneNo"
                     placeholder="Enter your Contact No"
                     value = {updateUser.phoneNo}
                       onChange={handleChange}
                     className='w-full border rounded-lg
                    px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed'
                   
                   />
                  </div>
                  <div>
                   <Label className='block text-sm font-medium'>Address</Label>
                    <Input 
                    type='text'
                     name="address"
                     placeholder="Enter your address"
                     value = {updateUser.address}
                       onChange={handleChange}
                     className='w-full border rounded-lg
                    px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed'
                    />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                     <Label className='block text-sm font-medium'>City</Label>
                    <Input 
                    type='text'
                     name="city"
                     placeholder="Enter your City"
                     value = {updateUser.city}
                       onChange={handleChange}
                     className='w-full border rounded-lg
                    px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed'
                    />
                    </div>
                    <div>
                     <Label className='block text-sm font-medium'>Zip Code</Label>
                    <Input 
                    type='text'
                     name="zipCode"
                     placeholder="Enter your ZipCode"
                     value = {updateUser.zipCode}
                       onChange={handleChange}
                     className='w-full border rounded-lg
                    px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed'
                    />
                    </div>
                    </div>
                    
                    <Button
                    
                     className='w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white
                    font-semibold py-2 rounded-lg'>
                      {loading ?"Updating...":"Update Profile"}
                    </Button>
                </form>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="orders">
          <MyOrder/>
        </TabsContent>

      </Tabs>
    </div>
  )
}

export default Profile
