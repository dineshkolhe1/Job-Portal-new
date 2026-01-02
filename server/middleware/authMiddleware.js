import jwt from 'jsonwebtoken'
import Company from '../models/Company.js'
import User from '../models/User.js'

export const protectCompany = async (req,res,next) => {

    const token = req.headers.token

    if(!token){
        return res.json({success:false, message:'Not authorized, Login Again'})
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.company = await Company.findById(decoded.id).select('-password')

        next()

    } catch (error) {
        res.json({success:false, message:error.message })
    }
}

// For User authentication (Clerk)
export const protectUser = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.json({
        success: false,
        message: "Not authorized, Login Again",
      });
    }

    req.userId = userId;
    next();

  } catch (error) {
    console.error("Auth error:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};