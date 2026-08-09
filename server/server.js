// import './config/instrument.js'  
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import bodyParser from "body-parser";
import connectDB from './config/db.js'
import { clerkWebhooks } from './controller/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'


const app = express()

connectDB()
await connectCloudinary() 

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "token",    
    ],
  })
);

app.post(
  "/api/webhooks/clerk",
  bodyParser.raw({ type: "application/json" }),
  clerkWebhooks
);


app.use(express.json())


app.use(clerkMiddleware())


//Routes
app.get('/',(req,res)=>res.send("API Working"))
// app.get("/debug-sentry", function mainHandler(req, res) {
//     throw new Error("My first Sentry error!");
// })

app.use('/api/company',companyRoutes)
app.use('/api/jobs',jobRoutes )
app.use('/api/users',userRoutes)
  
//Port
const PORT = process.env.PORT || 5000;

// Sentry.setupExpressErrorHandler(app);

app.listen(PORT,()=>{
    console.log(`✅ Server is running on port ${PORT}`)
})