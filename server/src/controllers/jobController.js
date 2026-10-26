const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs (with search, category, type filter, & pagination)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const { keyword, category, jobType, location, page = 1, limit = 10 } = req.query;

    const query = { status: 'Active' };

    // Keyword search in title, company, or description
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('postedBy', 'name company email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter / Admin)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      category,
      experience,
      salary,
      description,
      requirements
    } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, company, location, and description are required.'
      });
    }

    const job = await Job.create({
      title,
      company,
      location,
      jobType: jobType || 'Full-time',
      category: category || 'Engineering',
      experience: experience || 'Fresher / Entry level',
      salary: salary || 'Competitive',
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements
        ? requirements.split('\n').map((r) => r.trim()).filter(Boolean)
        : [],
      postedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Owner / Admin)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    // Check ownership or admin
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job posting.'
      });
    }

    const updatedData = { ...req.body };
    if (typeof updatedData.requirements === 'string') {
      updatedData.requirements = updatedData.requirements
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);
    }

    job = await Job.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully!',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Owner / Admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    // Check ownership or admin
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job posting.'
      });
    }

    // Clean up applications for this job
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job posting and associated applications removed.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by the logged-in recruiter
// @route   GET /api/jobs/my-jobs
// @access  Private (Recruiter / Admin)
const getMyPostedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });

    // Attach application counts for each job
    const jobIds = jobs.map((j) => j._id);
    const counts = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$job', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const jobsWithCounts = jobs.map((j) => ({
      ...j.toObject(),
      applicantsCount: countMap[j._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      count: jobsWithCounts.length,
      data: jobsWithCounts
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyPostedJobs
};
