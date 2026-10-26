const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getRecruiterStats
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

// Candidate routes
router.post('/:jobId', protect, applyForJob);
router.get('/my-applications', protect, getMyApplications);

// Recruiter / Admin routes
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.get('/recruiter-stats', protect, authorize('recruiter', 'admin'), getRecruiterStats);

module.exports = router;
