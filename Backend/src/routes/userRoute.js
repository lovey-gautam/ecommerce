import express from 'express';
import {allUser,login,register,reVerify,verify,logout, forgetPassword, changePassword,verifyOTP, getUserById, updateUser} from '../controllers/user.controller.js'
import {isAdmin, isAuthenticated } from '../isAuthenticated/isAuthenticated.js';
import { singleUpload } from '../controllers/middleware/multer.js';

const router = express.Router()
 router.post('/register',register)
 router.get('/verify/:token',verify)
 router.post('/reVerify',reVerify)
 router.post('/login',login)
  router.post('/logout',isAuthenticated,logout)
  router.post('/forget-password',forgetPassword);
 router.post('/verify-otp/:email',verifyOTP)

 router.post('/change-password/:email',changePassword)
router.get('/all-user',isAuthenticated,isAdmin,allUser);
router.get('/get-user/:userId',getUserById)
router.put("/update/:userId",isAuthenticated,singleUpload,updateUser)

 export default router
