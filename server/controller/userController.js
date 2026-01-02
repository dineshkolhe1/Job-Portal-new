import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import Job from "../models/job.js"
import {v2 as cloudinary } from "cloudinary"
import { clerkClient } from "@clerk/clerk-sdk-node"; // install if not already


export const getUserData = async (req, res) => {
  try {
    const clerkId = req.userId;

    // 1. FIND USER
    let user = await User.findOne({ clerkId });

    // 2. CREATE USER IF MISSING
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);

      user = await User.create({
        clerkId,
        name: clerkUser.firstName || "No Name",
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        image: clerkUser.imageUrl || "",
        resume: "",
      });
    }

    // 3. RETURN USER
    return res.json({
      success: true,
      user,
    });

  } catch (error) {
    console.log("Error in getUserData:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


// get user data -
// export const getUserData = async (req, res) => {
//   console.log("Clerk userId from auth:", req.auth.userId);
//   try {
//     console.log("req.auth:", req.auth);
//     const clerkUserId = req?.auth?.userId;

//     if (!clerkUserId) {
//       console.log("❌ No clerk user id in req.auth");
//       return res.status(401).json({ success: false, message: "Not authenticated" });
//     }

//     console.log("✅ Clerk UserId from middleware:", clerkUserId);

//     // 1. Try to find existing user in MongoDB
//     let user = await User.findById(clerkUserId); // because _id is String and == clerkId

//     console.log("📦 User from DB:", user);

//     // 2. If no user in DB → create one
//     if (!user) {
//       console.log("ℹ User not found in DB, creating new one...");

//       const clerkUser = await clerkClient.users.getUser(clerkUserId);
//       console.log("📨 Clerk user data:", {
//         id: clerkUser.id,
//         email: clerkUser.emailAddresses?.[0]?.emailAddress,
//         firstName: clerkUser.firstName,
//         imageUrl: clerkUser.imageUrl,
//       });

//       const newUser = {
//         _id: clerkUserId,
//         clerkId: clerkUserId,
//         name: clerkUser.firstName || "No Name",
//         email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
//         image: clerkUser.imageUrl || "",
//         resume: "",
//       };

//       user = await User.create(newUser);
//       console.log("✅ New user created in DB:", user);
//     }

//     console.log("🚀 Sending user in response:", user);

//     return res.status(200).json({
//       success: true,
//       user,
//     });

//   } catch (error) {
//     console.error("❌ getUserData Error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };


// // get user data - 

// export const getUserData = async(req,res)=>{

//     try {
        
//         const userId = req.auth.userId;

//         const user = await User.findById({userId});

//         if(!user){
//             return res.json({success:false, message:'User Not Found'})
//         }

//         res.json({success:true , user: req.user})

//     } catch (error){
//         res.json({success:false, message:error.message})
//     }
// }

//apply for job
export const applyForjob = async(req,res) =>{
    
    const {jobId} = req.body

    const userId = req.auth.userId
    
    try {
        
        const isAlreadyApplied = await JobApplication.find({jobId,userId})

        if(isAlreadyApplied.length > 0){
            return res.json({success:false, message:"Aleready Applied"})
        }

        const jobData = await Job.findById(jobId)

        if(!jobData){
            return res.json({success:false, message:'Job Not Found'})
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        res.json({success:true, message:"Applied successfully"})

    } catch (error) {
        res.json({success: false, message:error.message})
    }

}


// get user applied applications 
export const getUserJobApplication = async(req,res) =>{
    
    try {
        
        const userId = req.auth.userId

        const application = await JobApplication.find({userId})
        .populate('user', 'name email image resume')
        .populate('companyId','name email image')
        .populate('jobId','title description location category level salary')
        .exec()

        if(!application){
            return res.json({success:false,message:'No job application found'})
        }

        return res.json({success:true, application})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

//update user profile (resume)
export const updateUserResume = async(req,res) => {
    try {
        
        const userId = req.auth.userId

        const resumeFile = req.file

        const userData = await User.findOne({ clerkId: userId })

        if(resumeFile){
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }

        await userData.save()

        return res.json({success:true, message:'Resume Updated'})

    } catch (error) {
        res.json({success:false, message: error.message})
    }
}