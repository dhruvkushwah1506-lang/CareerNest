import express from 'express';
import Job from '../models/job.model.js';

export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, position, experienceYear, companyId } = req.body;
        const userId = req.id;
        if (!title || !description || !requirements || !salary || !location || !jobType || !position || !experienceYear || !companyId) {
            return res.status(400).json({ msg: 'All fields are required', success: false })
        }
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(','),
            salary: Number(salary),
            location,
            jobType,
            position,
            experienceYear: Number(experienceYear),
            company: companyId,
            createdBy: userId
        })
        return res.status(201).json({ msg: 'Job posted successfully', job })

    } catch (err) {
        return res.status(500).json({ msg: err.message, success: false })
    }
}

//for student to view all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6; // 6 jobs per page
        const skip = (page - 1) * limit;

        const query = {
            $or: [
                { title: { $regex: keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
                { description: { $regex: keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
            ]
        };

        const totalJobs = await Job.countDocuments(query);
        const jobs = await Job.find(query)
            .populate({ path: 'company' })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'fullname email')
            .skip(skip)
            .limit(limit);

        if (!jobs || jobs.length === 0) {
            return res.status(200).json({
                jobs: [],
                success: true,
                message: "No jobs found."
            })

        }

        return res.status(200).json({ 
            jobs, 
            totalJobs, 
            totalPages: Math.ceil(totalJobs / limit), 
            currentPage: page,
            success: true 
        })

    } catch (err) {
        return res.status(500).json({ msg: err.message, success: false })
    }
}

//student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'company'
        });
        if (!job) {
            return res.status(404).json({ msg: 'Job not found', success: false })
        }
        return res.status(200).json({ job, success: true })
    } catch (err) {
        return res.status(500).json({ msg: err.message, success: false })
    }
}

//all jobs posted by a admin
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const totalJobs = await Job.countDocuments({ createdBy: adminId });
        const jobs = await Job.find({ createdBy: adminId })
            .populate({ path: 'company' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (!jobs || jobs.length === 0) {
            return res.status(200).json({
                jobs: [],
                success: true,
                message: "No jobs found."
            })

        }
        return res.status(200).json({ 
            jobs, 
            totalJobs, 
            totalPages: Math.ceil(totalJobs / limit), 
            currentPage: page,
            success: true 
        })
    } catch (err) {
        return res.status(500).json({ msg: err.message, success: false })
    }
}

// admin can update job details
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { title, description, requirements, salary, location, jobType, position, experienceYear, companyId } = req.body;
        
        const existingJob = await Job.findById(jobId);
        if (!existingJob) {
            return res.status(404).json({ message: 'Job not found.', success: false })
        }
        if (existingJob.createdBy.toString() !== req.id) {
            return res.status(403).json({ message: 'You can only update your own job postings', success: false })
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (requirements) updateData.requirements = Array.isArray(requirements) ? requirements : requirements.split(",");
        if (salary) updateData.salary = Number(salary);
        if (location) updateData.location = location;
        if (jobType) updateData.jobType = jobType;
        if (position) updateData.position = position;
        if (experienceYear) updateData.experienceYear = Number(experienceYear);
        if (companyId) updateData.company = companyId;

        const job = await Job.findByIdAndUpdate(jobId, updateData, { new: true });

        return res.status(200).json({
            message: "Job updated successfully.",
            job,
            success: true
        })

    } catch (error) {
        console.error('Job update error:', error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}