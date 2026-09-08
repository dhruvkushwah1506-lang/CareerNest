import express from 'express';

import isAuthenticated from '../middlewares/isAuthenticated.js';
import authorize from '../middlewares/authorize.js';
import { getAdminJobs, getAllJobs, getJobById, postJob, updateJob } from '../controllers/job.controller.js';
import { dataCreationLimiter } from '../middlewares/rateLimit.js';

const router=express.Router();
router.route('/post').post(isAuthenticated, authorize('Recruiter'), dataCreationLimiter, postJob)
router.route('/get').get(getAllJobs)
router.route('/get/:id').get(getJobById)
router.route('/getadminjobs').get(isAuthenticated, authorize('Recruiter'), getAdminJobs)
router.route('/update/:id').put(isAuthenticated, authorize('Recruiter'), updateJob)
export default router;