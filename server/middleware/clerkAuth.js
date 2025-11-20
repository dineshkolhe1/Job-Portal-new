import { clerkClient } from '@clerk/express'
import User from '../models/User.js'

export const requireClerkAuth = async (req, res, next) => {
    try {
        // Get auth data using the new function syntax
        const auth = req.auth()
        
        if (!auth.userId) {
            return res.json({
                success: false, 
                message: 'Not authorized, Login Again'
            })
        }

        // Get user from your database
        const user = await User.findById(auth.userId)
        
        if (!user) {
            return res.json({
                success: false, 
                message: 'User Not Found'
            })
        }

        // Attach user to request
        req.user = user
        req.userId = auth.userId
        
        next()

    } catch (error) {
        console.error('Auth error:', error)
        res.json({
            success: false, 
            message: error.message
        })
    }
}