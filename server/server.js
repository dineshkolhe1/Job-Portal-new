import './config/instrument.js'  
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import bodyParser from "body-parser";
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controller/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'


// initialize Express 
const app = express()

//Connect to Database 
connectDB()
await connectCloudinary() 
// app.use(cors())
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

// NOW add express.json() for other routes
app.use(express.json())

// Updated Clerk Middleware - remove the old one and use this
app.use(clerkMiddleware())



//Routes
app.get('/',(req,res)=>res.send("API Working"))
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
})

app.use('/api/company',companyRoutes)
app.use('/api/jobs',jobRoutes )
app.use('/api/users',userRoutes)
  
//Port
const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT,()=>{
    console.log(`✅ Server is running on port ${PORT}`)
})