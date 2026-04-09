import mongoose from 'mongoose';
 async function connectDb(){
    try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("databse is connected")
    }

    catch(error){
console.log("MongoDb connection failed ",error);
    }
 }

export default connectDb;