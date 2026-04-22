import express from 'express'
import 'dotenv/config'
//const express = require('express');
//const app = require('./src/app');
import app from './src/app.js';
import connectDb from './src/database/db.js';
import userRoute from './src/routes/userRoute.js'
import cors from 'cors'
import productRoute from './src/routes/productRoute.js';
import cartRoute from './src/routes/cartRoute.js'
import orderRoute from './src/routes/orderRoute.js'

app.use(cors({
  origin:  [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://ecommerce-l6md.vercel.app"
    ],

    
  credentials: true
}));

const PORT = process.env.PORT || 3000;
app.use('/api/v1/user',userRoute)
app.use('/api/v1/products',productRoute)
app.use('/api/v1/cart',cartRoute)
app.use('/api/v1/orders',orderRoute)


app.listen(PORT,()=>{
    connectDb()
    console.log(`server is start at port :${PORT}`)
   // console.log("USING URI:", process.env.MONGO_URI);
})
