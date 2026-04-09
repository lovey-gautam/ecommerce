import {User} from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { verifyEmail } from "../emailVerify/verifyEmail.js"
import { Session } from "../models/sessionModel.js"
import { sendOTPMail } from "../emailVerify/sendOTPMail.js"
import cloudinary from "../utils/cloudinary.js"
export const register= async(req,res)=>{
try{
    const{FirstName,lastName,email,password} = req.body;
    if(!FirstName||!lastName||!email ||!password){
      return  res.status(400).json({
            success:false,
            message:"All feilds are required"
        })
    }
    const user = await User.findOne({email})
    if(user){
       return res.status(400).json({
            success:false,
            message:'user already exists'
        })
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = await User.create({
        FirstName,
        lastName,
        email,
        password:hashedPassword
    })
const token = jwt.sign({
    id:newUser._id},process.env.JWT_SECRET,{expiresIn:'10m'});
    await verifyEmail(token,email) //send email here 
    newUser.token = token
    await newUser.save()
     res.status(201).json({
        success: true,
        message:"User registered sucessfully ",
        user : newUser
    })
}
catch(error){
    res.status(500).json({
        success:false,
        message:error.message
    })

}
}

export const verify = async(req,res)=>{
    try{
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith("Bearer")){
           return res.status(400).json({
                success:false,
                message:'Authorization token is missing or invalid'
            })
        }
        const token = authHeader.split(" ")[1] // after split it become array
        let decoded 
        try{
            decoded = jwt.verify(token,process.env.JWT_SECRET)
        }
        catch(error){
            if(error.name ==="TokenExpiredError"){
                return res.status(400).json({
                    success:false,
                    message:"The registration token has expired  "
                })
            }
            return res.status(400).json({
                success:false,
                message:"TOKEN verifition failed"
            })
        }
        const user = await User.findById(decoded.id)
        if(!user){
            return res.status(400).json({
                success:false,
                message:'User not found'
            })
        }
        user.token = null
        user.isVerified = true
        await user.save()
        return res.status(200).json({
            success:true,
            message:"Email verified successfully "
        })
    }
catch(error){ 
  return  res.status(500).json({
        success:false,
        message:error.message
    })
     
}
}

export const reVerify = async(req,res)=>{
    try{
        const{email} = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not founnd"
            })
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'10m'})
        verifyEmail(token,email)
        user.token = token
        await user.save()
        return res.status(200).json({
            success:true,
            message:"Verification email sent again successfully",
            token:user.token
        })
   
    }catch(error){
    return res.status(500).json({
        success:false,
        message:error.message
    })

    }
}

export const login = async(req,res)=>{
    try{
        const{email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All field are required"
            })
        }
        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({
                success:false,
                message:"User not exists"
            })
        } 
        const isPasswordValid = await bcrypt.compare(password,existingUser.password)
    if(!isPasswordValid){
        return res.status(400).json({
            succes:false,
            message:"Inavlid Credentials"
        })
    }
    if(existingUser.isVerified===false){
        return res.status(400).json({
            success:false,
            message:"Verify your account than login "
        })
    }

    const accessToken = jwt.sign({id:existingUser._id},process.env.JWT_SECRET,{expiresIn:'10d'})
   const refreshToken = jwt.sign({id:existingUser._id},process.env.JWT_SECRET,{expiresIn:'30d'})

   existingUser.isLoggedIn = true 
   await existingUser.save()

   const existingSession = await Session.findOne({userId:existingUser._id})
   if(existingSession){
    await Session.deleteOne({userId:existingUser._id})
   }

    await Session.create({userId:existingUser._id})
    return res.status(200).json({
        success:true,
        message:`Welcome back ${existingUser.FirstName}`,
        user:existingUser,
        accessToken,
        refreshToken
    })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


export const logout = async(req,res)=>{
    try{
const userId = req.userId
await Session.deleteMany({userId:userId})
await User.findByIdAndUpdate(userId,{isLoggedIn:false})
return res.status(200).json({
    success:true,
    message:"User logged out successfully"
})
    }
    catch(error){
        return res.status(500).json({
        success:false,
        message:error.message
    })
    }
}

export const forgetPassword = async(req,res)=>{
    try{
        const{email}=req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })
        }
        const otp = Math.floor(100000+Math.random()*900000).toString()
        const otpExpiry = new Date(Date.now()+10*60*1000)
        user.otp = otp
        user.otpExpiry = otpExpiry
       await user.save()
       await sendOTPMail(otp,email)
       return res.status(200).json({
          success:true,
          message:"otp sent to email successfully"
       })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const verifyOTP = async (req,res)=>{
    try{
        const {otp} = req.body;
        const email  = req.params.email
        if(!otp){
          return res.status(400).json({
            success:false,
            message:'Otp is required'
          })
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        if(!user.otp || !user.otpExpiry){
            return res.status(400).json({
                success:false,
                message:"OTP is not generated"
            })
        }
        if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }
        if(user.otpExpiry < new Date()){
            return res.status(400).json({
                success:false,
                message:'otp is invalid'
            })
        }
        user.otp = null
        user.otpExpiry = null
        await user.save()
        return res.status(200).json({
            success:true,
            message:"OTP verified sucessfully "
        })
    }
        catch(error){
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }

export const changePassword = async(req,res)=>{
    try{
        const {newPassword,confirmPassword} = req.body;
        const {email} = req.params
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })

        }
        if(!newPassword || !confirmPassword){
            return res.status(400).json({
                success:false,
                message:"All feilds are required"
            })
        }
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password do not match"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword,10)
        user.password = hashedPassword
        await user.save()
        return res.status(200).json({
            success:true,
            message:"Password changed successfully"
        })
     } catch(error){
            return res.status(500).json({
            success:false,
            message:error.message
            })
        }
    
}

// all usr get by admin 

export const allUser = async(_,res)=>{
    try{
          const users = await User.find()
          return res.status(200).json({
            success:true,
            users,
          })
    }
    catch(error){
       return  res.status(200).json({
        success:false,
        message:error.message
    })
    }

}

export const getUserById = async(req,res)=>{
    try{

        const{userId} = req.params;
        console.log(userId)
        const user = await User.findById(userId).select( "-password -otp -otpexpiry -token")
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        res.status(200).json({
            success:true,
            user,
        })
    
    }catch(error){
        console.error("getuserbyid :",error)
     return res.status(500).json({
        success:false,
        message:error.message
     })
    }
}

       

export const updateUser  = async (req,res)=>{
    console.log("req.params:", req.params);
console.log("req.user:", req.user);
console.log("loggedInUser ID:", req.user?._id?.toString());
    try{
        const userIdToUpdate = req.params.userId
        const loggedInUser = req.user
        const{FirstName,lastName,email,address,city,zipCode,phoneNo,role} = req.body

        if(loggedInUser._id.toString()!== userIdToUpdate &&
    loggedInUser.role !== 'admin'){
        return res.status(403).json({
            success:false,
            message:"You are not allowed to update this profile"
        })
    }

    let user = await User.findById(userIdToUpdate);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
    }
    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    if(req.file){
        try{
        if(profilePicPublicId){
            try{
            await cloudinary.uploader.destroy(profilePicPublicId)
        }catch(err){
           
            console.warn("Failed to delte old profile pic",err.message);
        }}

        const uploadResult = await new Promise((resolve,reject)=>{
            const stream = cloudinary.uploader.upload_stream({
                folder:"profiles"},
            (error,result)=>{
                if(error) reject(error)
                    else resolve(result)
            })
            stream.end(req.file.buffer)
        })
        profilePicUrl= uploadResult.secure_url;
        profilePicPublicId = uploadResult.public_id;
    }
    catch (err) {
    console.error("Cloudinary upload failed:", err.message);
    return res.status(500).json({
      success: false,
      message: "Profile picture upload failed",
    });
  }
}
    user.FirstName = FirstName || user.FirstName;
    user.lastName = lastName || user.lastName
    user.address = address || user.address
    user.city = city || user.city
    user.zipCode = zipCode || user.zipCode
    user.phoneNo = phoneNo|| user.phoneNo
     user.role = role;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId

   const updatedUser = await user.save()
   
   return res.status(200).json({
    success:true,
    message:"Profile Updated Succesfully",
    user:updatedUser,
   })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}