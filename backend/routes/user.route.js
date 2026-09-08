import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { authLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

router.route('/register').post(authLimiter, singleUpload, register);
router.route('/login').post(authLimiter, login);
router.route('/profile/update').post(isAuthenticated, singleUpload, updateProfile);
router.route('/logout').get(logout);

export default router;
