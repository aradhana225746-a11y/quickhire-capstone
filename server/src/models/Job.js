const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'],
      default: 'Full-time'
    },
    category: {
      type: String,
      enum: ['Engineering', 'Design', 'Marketing', 'Product', 'Data', 'Customer Support', 'Other'],
      default: 'Engineering'
    },
    experience: {
      type: String,
      default: 'Fresher / Entry level'
    },
    salary: {
      type: String,
      default: 'Competitive'
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    requirements: {
      type: [String],
      default: []
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Active', 'Closed'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

// Indexing for search performance
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
