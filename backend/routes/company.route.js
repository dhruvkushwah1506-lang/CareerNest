import express from 'express';
import { getAllCompanies, getCompany, getCompanyById, registerCompany, updateCompany } from '../controllers/company.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import authorize from '../middlewares/authorize.js';
import { singleUpload } from '../middlewares/multer.js';
import { dataCreationLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

router.route('/register').post(isAuthenticated, authorize('Recruiter'), dataCreationLimiter, registerCompany);
router.route('/get').get(isAuthenticated, getCompany);
router.route('/get/:id').get(isAuthenticated, getCompanyById);
router.route('/all').get(getAllCompanies);
router.route('/update/:id').put(isAuthenticated, authorize('Recruiter'), singleUpload, updateCompany);

export default router;