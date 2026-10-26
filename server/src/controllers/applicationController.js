const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (User / Candidate)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { applicantName, applicantEmail, applicantPhone, resumeLink, coverLetter } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    if (job.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer accepting applications.'
      });
    }

    // Check if already applied
    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this job position.'
      });
    }

    if (!applicantPhone || !resumeLink) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number and a valid resume / portfolio link.'
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      applicantName: applicantName || req.user.name,
      applicantEmail: applicantEmail || req.user.email,
      applicantPhone,
      resumeLink,
      coverLetter: coverLetter || ''
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's job applications
// @route   GET /api/applications/my-applications
// @access  Private (User)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location jobType salary status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a specific job (Recruiter / Admin)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter / Admin)
const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    // Check authorization: must be job owner or admin
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job.'
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email skills headline')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      job: {
        _id: job._id,
        title: job.title,
        company: job.company
      },
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Reviewing, Shortlisted, Rejected)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter / Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, recruiterNotes } = req.body;

    if (!['Pending', 'Reviewing', 'Shortlisted', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.'
      });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.'
      });
    }

    // Verify ownership of the job
    if (
      application.job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this candidate application.'
      });
    }

    application.status = status;
    if (recruiterNotes !== undefined) {
      application.recruiterNotes = recruiterNotes;
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: `Application marked as ${status}.`,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter overview dashboard metrics
// @route   GET /api/applications/recruiter-stats
// @access  Private (Recruiter / Admin)
const getRecruiterStats = async (req, res, next) => {
  try {
    const myJobs = await Job.find({ postedBy: req.user._id });
    const jobIds = myJobs.map((j) => j._id);

    const totalJobs = myJobs.length;
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
    const shortlistedCount = await Application.countDocuments({
      job: { $in: jobIds },
      status: 'Shortlisted'
    });
    const pendingCount = await Application.countDocuments({
      job: { $in: jobIds },
      status: 'Pending'
    });

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        totalApplications,
        shortlistedCount,
        pendingCount
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getRecruiterStats
};
