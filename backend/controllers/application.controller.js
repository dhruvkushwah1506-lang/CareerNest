import Application from "../models/application.model.js";
import Job from "../models/job.model.js";


export const applyJob = async (req, res) => {
    try {
        const { id: jobId } = req.params;
        const userId = req.id;
        if (!jobId) {
            return res.status(400).json({ msg: 'Job id is required' })
        }
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({ msg: 'You have already applied for this job' })
        }
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' })
        }
        const application = await Application.create({
            job: jobId,
            applicant: userId
        })
        await Job.findByIdAndUpdate(
            jobId,
            { $push: { applications: application._id } });

        return res.status(201).json({ 
            message: 'Applied successfully', 
            application,
            success: true 
        })

    } catch (err) {
        console.error('Apply job error:', err);
        return res.status(500).json({ 
            message: 'Internal server error',
            success: false
        })
    }
}

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).
            populate({
                path: 'job',
                options: { sort: { createdAt: -1 } },
                populate: ({
                    path: 'company',
                    options: { sort: { createdAt: -1 } }
                })
            })
        if (!applications) {
            return res.status(404).json({
                message: 'No Application',
                success: false
            })
        }
        return res.status(200).json({
            applications,
            success: true
        })

    } catch (err) {
        console.error('Get applied jobs error:', err);
        return res.status(500).json({ message: 'Internal server error', success: false })
    }
}

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({ message: "JobId not Found." })
        }
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        })
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        }
        return res.status(200).json({
            job,
            success: true
        })
    } catch (err) {
        console.error('Get applicants error:', err);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: "Status is required", success: false });
        }

        const allowedStatuses = ['Pending', 'Accepted', 'Rejected'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value", success: false });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found", success: false })
        }

        const job = await Job.findById(application.job);
        if (!job || job.createdBy.toString() !== req.id) {
            return res.status(403).json({ message: "You can only update applications for your own jobs", success: false });
        }

        application.status = status;
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });
    } catch (err) {
        console.error('Update status error:', err);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
}