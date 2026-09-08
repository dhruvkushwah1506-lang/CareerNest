import Company from "../models/company.model.js";
import Users from "../models/user.model.js";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.error('Register company error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false })
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";

        const query = { userId };
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const totalCompanies = await Company.countDocuments(query);
        const companies = await Company.find(query).skip(skip).limit(limit);

        return res.status(200).json({
            companies: companies || [],
            totalCompanies,
            totalPages: Math.ceil(totalCompanies / limit),
            currentPage: page,
            success: true
        });
    } catch (error) {
        console.error('Get companies error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false })
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        // Ownership check
        if (company.userId.toString() !== req.id) {
            return res.status(403).json({
                message: "You can only access your own company details.",
                success: false
            });
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.error('Get company by ID error:', error);
        return res.status(500).json({ message: 'Internal server error', success: false })
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ msg: 'Company not found', success: false })
        }
        if (company.userId.toString() !== req.id) {
            return res.status(403).json({ msg: 'You can only update your own company', success: false })
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (website) updateData.website = website;
        if (location) updateData.location = location;

        const file = req.file;
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateData.logo = cloudResponse.secure_url;
        }

        const update = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
        return res.status(200).json({ msg: 'Company updated successfully', company: update, success: true })

    } catch (err) {
        console.error('Company update error:', err);
        return res.status(500).json({ msg: 'Internal server error', success: false })
    }
}

export const getAllCompanies = async (req, res) => {
    try {
        // Prevent recruiters from seeing all companies via this public endpoint
        // If they are logged in, check their role
        const token = req.cookies.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await Users.findById(decoded.userId).select('role');
            if (user && user.role === 'Recruiter') {
                return res.status(403).json({
                    message: "Recruiters are not allowed to use the public browse endpoint.",
                    success: false
                });
            }
        }
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const totalCompanies = await Company.countDocuments({});
        const companies = await Company.find({}).skip(skip).limit(limit);

        if (!companies || companies.length === 0) {
            return res.status(200).json({
                companies: [],
                success: true,
                message: "No companies found."
            })
        }
        return res.status(200).json({
            companies,
            totalCompanies,
            totalPages: Math.ceil(totalCompanies / limit),
            currentPage: page,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}