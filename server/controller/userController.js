import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import Job from "../models/job.js"
import {v2 as cloudinary } from "cloudinary"


// get user data - 

export const getUserData = async(req,res)=>{

    try {
        
        const userId = req.auth.userId;

        const user = await User.findOne({_id: userId});

        if(!user){
            return res.json({success:false, message:'User Not Found'})
        }

        res.json({success:true , user: req.user})

    } catch (error){
        res.json({success:false, message:error.message})
    }
}

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
        .populate('companyId','name email image')
        .populate('jobId','title description location cateory level salary')
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

        const resumeFile = req.resumeFile

        const userData = await User.findById(userId)

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