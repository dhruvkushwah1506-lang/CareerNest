import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import authorize from '../middlewares/authorize.js';
import { aiLimiter } from '../middlewares/rateLimit.js';
import { generateJobDescription, generateBio } from '../controllers/ai.controller.js';

const router = express.Router();

router.route('/generate-job-description').post(isAuthenticated, authorize('Recruiter'), aiLimiter, generateJobDescription);
router.route('/generate-bio').post(isAuthenticated, aiLimiter, generateBio);

export default router;
