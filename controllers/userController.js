const userModel=require('../models/userModel');
const bcrypt=require("bcrypt");

//create user register

exports.registerController=async(req,res)=>{
   try {
         let {username,email,password}=req.body;
         //validation 
         if(!username||!email||!password){
          return res.status(400).send({
            success:false,
            message:'plz fill all fields',

          })
         }
          //existing user

          const existingUser=await userModel.findOne({email});
          if(existingUser){
            return res.status(401).send({
              success:false,
              message:'User already exists'
            })
          }
          const hashpassword=await bcrypt.hash(password,10);
          password=hashpassword;
          //save user
          const user=new userModel({username,email,password});
          await user.save();
          return res.status(201).send({
            success:true,
            message:'new user created',
            user
          })
   } catch (error) {
    console.log(error);
    res.status(500).send({
      message:'error in register',
      success:false,
      error
    })
   }
};

exports.getAllUsers=async(req,res)=>{
try {
  const users=await userModel.find({});
  return res.status(200).send({
    userCount:users.length,
    success:true,
    message:'all user data',
    user
  });
} catch (error) {
  console.log(error);
  res.status(500).send({
    success:false,
    message:'error in get all users',
    error
  })
}
};

//login

exports.loginController=async(req,res)=>{
  try {
     const {email,password}=req.body;
     //validation
     if(!email||!password){
      return res.status(401).send({
        success:true,
        message:"please provide email or password",

      })
     }
     const user=await userModel.findOne({email})
     if(!user){
      return res.send({
        success:false,
        message:"email is not registered",

      })
     }
     //password
     const ismatch=await bcrypt.compare(password,user.password)
     if(!ismatch){
      return res.status(401).send({
        success:true,
        message:"invalid email or password "
      })
     }
     return res.status(200).send({
      success:true,
      message:"login successfully",
      user
     })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success:false,
      message:'error in login ',
      error
    })
  }
};