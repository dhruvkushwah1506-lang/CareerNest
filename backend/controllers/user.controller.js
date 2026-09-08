
import Users from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { verifyTurnstileToken } from '../utils/verifyCaptcha.js';

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