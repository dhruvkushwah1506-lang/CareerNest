
import Users from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { verifyTurnstileToken } from '../utils/verifyCaptcha.js';
import { sendPasswordResetEmail } from '../utils/sendEmail.js';

export const register = async (req, res) => {
    try {
        const { fullname, email, password, phoneNumber, role, captchaToken } = req.body;
        if (!fullname || !email || !password || !phoneNumber || !role) {
            return res.status(400).json({ msg: 'All fields are required' })
        }
        if (password.length < 8) {
            return res.status(400).json({ msg: 'Password must be at least 8 characters long' })
        }

        const captchaVerification = await verifyTurnstileToken(captchaToken);
        if (!captchaVerification.success) {
            return res.status(400).json({ msg: captchaVerification.msg || 'CAPTCHA validation failed' });
        }
        const file = req.file;
        let profilePhotoUrl = '';
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhotoUrl = cloudResponse.secure_url;
        }

        const user = await Users.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Users.create({
            fullname,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
            profile: {
                profilePhoto: profilePhotoUrl
            }
        })
        return res.status(201).json({ msg: 'User registered successfully', success: true })

    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ msg: 'Internal server error' })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role, captchaToken } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ msg: 'All fields are required' })
        }

        const captchaVerification = await verifyTurnstileToken(captchaToken);
        if (!captchaVerification.success) {
            return res.status(400).json({ msg: captchaVerification.msg || 'CAPTCHA validation failed' });
        }
        let user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' })
        }
        if (user.role !== role) {
            return res.status(400).json({ msg: "Account doesn't exist with this role" })
        }

        const tokenData = {
            userId: user._id,
            role: user.role
        }

        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'None', secure: true }).json({
            msg: "Welcome back " + user.fullname,
            user,
            success: true
        })

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ msg: 'Internal server error' })
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }).json({
            msg: "Logged out successfully",
            success: true
        })
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ msg: 'Internal server error' })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(',').map(s => s.trim());
        }

        const userId = req.id;
        let user = await Users.findById(userId);
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' })
        }

        // Handle file upload — treat as resume (PDF) or profile photo (image) based on mimetype
        if (file) {
            const fileUri = getDataUri(file);
            const isImage = file.mimetype.startsWith('image/');
            const isPdf = file.mimetype === 'application/pdf';
            
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: (isImage || isPdf) ? 'image' : 'raw',
                use_filename: true,
                unique_filename: true
            });

            if (isImage) {
                user.profile.profilePhoto = cloudResponse.secure_url;
            } else {
                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = file.originalname;
            }
        }

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).json({
            msg: "Profile updated successfully",
            user,
            success: true
        })

    } catch (err) {
        console.error('Profile update error:', err);
        return res.status(500).json({ msg: 'Internal server error' })
    }
}

// Step 1: user submits their email, we generate a token and email them a reset link
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ msg: 'Email is required', success: false });
        }

        const user = await Users.findOne({ email });
        // Always respond the same way whether the user exists or not,
        // so people can't use this to check which emails are registered.
        if (!user) {
            return res.status(200).json({
                msg: 'If an account exists for that email, a reset link has been sent.',
                success: true
            });
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${rawToken}`;

        try {
            await sendPasswordResetEmail(user.email, resetUrl);
        } catch (emailErr) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            console.error('Failed to send reset email:', emailErr);
            return res.status(503).json({ msg: 'Could not send reset email. Please try again later.', success: false });
        }

        return res.status(200).json({
            msg: 'If an account exists for that email, a reset link has been sent.',
            success: true
        });

    } catch (err) {
        console.error('Forgot password error:', err);
        return res.status(500).json({ msg: 'Internal server error', success: false });
    }
}

// Step 2: user clicks the emailed link and submits a new password + the token from the URL
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ msg: 'Token and new password are required', success: false });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ msg: 'Password must be at least 8 characters long', success: false });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await Users.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'This reset link is invalid or has expired. Please request a new one.', success: false });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ msg: 'Password reset successfully. You can now log in.', success: true });

    } catch (err) {
        console.error('Reset password error:', err);
        return res.status(500).json({ msg: 'Internal server error', success: false });
    }
}