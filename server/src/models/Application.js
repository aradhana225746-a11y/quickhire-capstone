const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    applicantName: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true
    },
    applicantEmail: {
      type: String,
      required: [true, 'Applicant email is required'],
      trim: true
    },
    applicantPhone: {
      type: String,
      required: [true, 'Applicant phone number is required'],
      trim: true
    },
    resumeLink: {
      type: String,
      required: [true, 'Resume / Portfolio link is required'],
      trim: true
    },
    coverLetter: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewing', 'Shortlisted', 'Rejected'],
      default: 'Pending'
    },
    recruiterNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Prevent duplicate applications from the same candidate for the same job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
