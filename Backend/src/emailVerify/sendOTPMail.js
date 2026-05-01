// npm i nodemailer
import nodemailer from 'nodemailer'
import 'dotenv/config'


export const sendOTPMail = async (otp,email) =>{
    try{
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASSWORD
    }
});


const mailConfiguration ={  
    from:process.env.MAIL_USER,
    to:email,
    subject:'Password Reset OTP',
    html:`<p>Your OTP for password reset is : <b>${otp}</b></p>`


};


const info = await transporter.sendMail(mailConfiguration)//,function(error,info){
   // if(error) throw Error(error);
        if (!info || !info.messageId) {
  throw new Error("Email not sent");
}
    console.log('OTP sent successfully ');
    console.log(info)
    return true;

    }
catch(error){
 console.error('Failed to send OTP mail:', error.message);
    throw new Error('Could not send OTP email');
}

}
