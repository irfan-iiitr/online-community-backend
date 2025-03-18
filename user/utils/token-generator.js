const jwt= require('jsonwebtoken');
const crypto= require('crypto');
const RefreshToken = require('../models/refresh-token');


const tokenGenerator=async(user)=>{
   const token=jwt.sign({userId:user._id,username:user.username},process.env.JWT_SECRET,{expiresIn:'60m'});
   
   const refreshToken=crypto.randomBytes(40).toString('hex');
   const expiresAt= new Date();
   expiresAt.setDate(expiresAt.getDate()+10) //7 days
   await RefreshToken.create({token:refreshToken,user:user._id,expiresAt});
   console.log("token",token);
   return {token,refreshToken};
}

module.exports=tokenGenerator;