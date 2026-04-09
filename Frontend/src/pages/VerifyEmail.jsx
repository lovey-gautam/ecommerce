import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

const VerifyEmail = () => {
    const[token] = useParams()
    const [status,setStatus] = useState("verifying...")
    const navigate = useNavigate()
    const VerifyEmail= async()=>{
        try{
            const res = await axios.post(`http://localhost:3000/api/v1/user/verify`,{},{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            if(res.data.success){
                setStatus('✅Email Verified Successfully')
                setTimeout(()=>{
                    navigate('/login')
                },2000);
            }
        }
        catch(error){
            console.log(error)
            setStatus("❌ Verification failed . Please try again")
        }
    }
    useEffect(()=>{
        VerifyEmail()
    },[token])
  return (
    <div className='relative w-full h-[760] bg-pink-100 overflow-hidden' >
        <div className='min-h-screen flex items-center justify-center'>
            <div className='bg-white p-6 rounded-2xl shadow-md text-center w-[90%] maxw-md'>
                <h2 className='text-xl font-semihold text-gray-800'>{status}</h2>
            </div>
        </div>
      verifyemail
    </div>
  )
}

export default VerifyEmail
