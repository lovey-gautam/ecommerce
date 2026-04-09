import Razorpay from "razorpay"

const razorpayInstance  = new Razorpay({
    key_id:process.env.Razorpay_KEY_ID,
    key_secret:process.env.Razorpay_SECRET
})

export default razorpayInstance