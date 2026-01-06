import express from 'express'
import {getJobs, getJobById } from '../controller/jobController.js';

const router = express.Router()

//Route to get all jobs data
router.get('/',getJobs)

// Route to get a single job by id 
router.get('/:id',getJobById)

export default router;