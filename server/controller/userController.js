import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import Job from "../models/job.js"
import {v2 as cloudinary } from "cloudinary"
import { clerkClient } from "@clerk/clerk-sdk-node"; // install if not already

//get user data
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