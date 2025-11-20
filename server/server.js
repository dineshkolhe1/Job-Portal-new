import './config/instrument.js'  
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
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
await connectDB()
await connectCloudinary()

//Middlewares 
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// ⚠️ IMPORTANT: Webhook route MUST come BEFORE express.json()
app.post('/webhooks', express.raw({ type: 'application/json' }), clerkWebhooks)

// NOW add express.json() for other routes
app.use(express.json({ limit: '10mb' }))

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