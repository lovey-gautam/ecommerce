// npm i nodemailer
import nodemailer from 'nodemailer'
import 'dotenv/config'


export const verifyEmail = (token,email) =>{
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
    subject:'Email verification',

    text: 
    ` Hi !There,You have a recently visited
      our website and entered your email.
      Please click the given link to verify your email 

     https://ecommerce-brijkart.netlify.app/verify/${token}
     
     Thanks`


};


transporter.sendMail(mailConfiguration,function(error,info){
    if(error) throw Error(error);
    console.log('Email sent successfully ');
    console.log(info)
});

}
