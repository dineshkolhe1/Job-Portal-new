import express from 'express'
import { applyForjob ,getUserData, getUserJobApplication, updateUserResume } from '../controller/userController.js'
import upload from '../config/multer.js'
import { requireAuth } from '@clerk/express'
import { protectUser } from '../middleware/authMiddleware.js'


const router = express.Router()

//get user data
router.get('/user', requireAuth(),protectUser, getUserData)


//Apply for a job
router.post('/apply', requireAuth(),protectUser, applyForjob)


//get applied jobs data
router.get('/application',requireAuth(),protectUser,getUserJobApplication)


//Update user profile (resume)
router.post('/update-resume',protectUser,upload.single('resume'),updateUserResume)


export default router