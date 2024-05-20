const express=require("express");
const { getAllBlogsController, createBlogController, deleteBlogController, updateBlogController, getBlogByIdController, userBlogController } = require("../controllers/blogController");

const router=express.Router();
//get all blog
router.get('/all-blog',getAllBlogsController);
//create blog
router.post('/create-blog',createBlogController);
//delete blog
router.delete('/delete-blog/:id',deleteBlogController);
//update blog

router.put('/update-blog/:id',updateBlogController);
 
//get blog by id

router.get('/get-blog/:id',getBlogByIdController);
// get user blog

router.get('/user-blog/:id',userBlogController);

module.exports=router;