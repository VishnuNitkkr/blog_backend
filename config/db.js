const mongoose=require("mongoose")

const connectDB=async()=>{
try {
  const connect=await mongoose.connect(process.env.MONGO_URL)
  console.log(`connected to mongodb `)
} catch (e) {
  console.log(e)
}
}

module.exports=connectDB;