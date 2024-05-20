const mongoose = require('mongoose');
const blogModel=require('../models/blogModel');
const userModel = require('../models/userModel');

//get all blog
exports.getAllBlogsController=async(req,res)=>{
  try {
    const blogs=await blogModel.find({}).populate("user");
    if(!blogs){
      return res.status(200).send({
        success:false,
        message:"no blog found"
      })
    }

    return res.status(200).send({
      success:true,
      blogCount:blogs.length,
      message:"all blog lists",
      blogs
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success:false,
      message:'error in getting all blogs',
      error
    })
  }
};

//get blog by id

exports.getBlogByIdController=async(req,res)=>{
  try {
    const {id}=req.params;
    const blog=await blogModel.findById(id);
    if(!blog){
      return res.status(404).send({
        success:false,
        message:"blog not found"
      })
    }
    return res.status(200).send({
      success:true,
      message:"blog found",
      blog
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success:false,
      message:'error in getting a blog',
      error
    })
  }
};

//delete blog

exports.deleteBlogController=async(req,res)=>{
  try {
    const {id}=req.params;
    const blog=await blogModel.findByIdAndDelete(req.params.id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    if(!blog){
      return res.status(400).send({
        success:false,
        message:"blog not found"
      })
    }
    return res.status(200).send({
      success:true,
      message:"blog deleted"
    })

  } catch (error) {
    console.log(error)
    return res.status(400).send({
      success:false,
      message:'error in deleting blog',
      error
    })
  }
};

//update blog

exports.updateBlogController=async(req,res)=>{
  try {
    const {id}=req.params;
    const {title,description,image}=req.body;
    const blog=await blogModel.findByIdAndUpdate(id,{...req.body},{new:true})
    return res.status(200).send({
      success:true,
      message:"blog updated",
      blog
    })
  
} catch (error) {
  console.log(error)
    return res.status(400).send({
      success:false,
      message:'error in updatting blog',
      error
    })
}};

//create blog

exports.createBlogController=async(req,res)=>{
  try {
       const {title,description,image,user}=req.body;
      
       if(!title||!description||!image||!user){
        return res.status(400).send({
          success:false,
          message:'all fields are required'
        });
       }
       
       const existingUser=await userModel.findById(user);
       //validation
       if(!existingUser){
        return res.status(201).send({
          success:false,
          message:"unable to find user"
        })
       }

       const newBlog=new blogModel({title,description,image,user});
       const session =await mongoose.startSession();
       session.startTransaction();
       await newBlog.save({session});
       existingUser.blogs.push(newBlog);
       await existingUser.save({session});
       await session.commitTransaction();

       await newBlog.save();

       return res.status(201).send({
        success:true,
        message:'blog is created',
        newBlog
       });

  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success:false,
      message:'error in creating  blog',
      error
    })
  }
};

//user blog get controller

exports.userBlogController=async(req,res)=>{
  try {
    const userBlog=await userModel.findById(req.params.id).populate("blogs");
    if(!userBlog){
      return res.status(404).send({
        success:false,
        message:"blogs not fount with this id"
      })
    }

    return res.status(200).send({
      success:true,
      message:"blogs found with this id",
      userBlog
    })

    

  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success:false,
      message:"error in user blog ",
      error
    })
  }
};