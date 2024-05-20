const express=require("express");
const cors=require("cors");
const morgan=require("morgan");
const bodyParser=require('body-parser')
const dotenv=require("dotenv");
const connectDB = require("./config/db");
//config env
dotenv.config();

//routes
const userRoutes=require('./routes/userRoutes')
const blogRoutes=require('./routes/blogRoutes')
//mongodb connection
connectDB();
//create rest object
const app=express();
//middlewares
app.use(cors(
  {
    origin:[process.env.FRONTEND_URL],
    methods:['POST','GET','DELETE','PUT'],
    credentials:true,
  }
));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.use(morgan("dev"));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // If you need to send cookies
  next();
});


//Routes
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/blog',blogRoutes);

const port=process.env.PORT||8080;

app.listen(port,()=>{
  console.log(`server running on port ${port}`);
})



