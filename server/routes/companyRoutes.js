import express from 'express'
import { ChangeJobApplicationStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controller/companyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddleware.js'

const router = express.Router()


router.post('/register',upload.single('image'),registerCompany)


router.post('/login',loginCompany)


router.get('/company', protectCompany, getCompanyData)


router.post('/post-job',protectCompany, postJob)


router.get('/applicants', protectCompany, getCompanyJobApplicants)


router.get('/list-Jobs', protectCompany, getCompanyPostedJobs)


router.post('/change-status', protectCompany, ChangeJobApplicationStatus)


router.post('/change-visiblity', protectCompany, changeVisibility)

export default router