import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

const CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Product', 'Data', 'Customer Support', 'Other'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];

export default function PostJob() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '',
    location: '',
    jobType: 'Full-time',
    category: 'Engineering',
    experience: 'Fresher / 0-2 years',
    salary: '₹4,00,000 - ₹6,00,000 / year',
    description: '',
    requirements: ''
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchJobDetails = async () => {
        try {
          const res = await api.getJobById(id);
          const j = res.data;
          setFormData({
            title: j.title || '',
            company: j.company || '',
            location: j.location || '',
            jobType: j.jobType || 'Full-time',
            category: j.category || 'Engineering',
            experience: j.experience || '',
            salary: j.salary || '',
            description: j.description || '',
            requirements: Array.isArray(j.requirements) ? j.requirements.join('\n') : ''
          });
        } catch (err) {
          setError(err.message || 'Failed to load job details for editing.');
        } finally {
          setLoading(false);
        }
      };
      fetchJobDetails();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.location || !formData.description) {
      setError('Title, Company, Location, and Description are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        ...formData,
        requirements: formData.requirements
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean)
      };

      if (isEditing) {
        await api.updateJob(id, payload);
      } else {
        await api.createJob(payload);
      }

      navigate('/recruiter-dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save job opening. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <Loader2 size={36} className="spinner-icon" />
        <p>Loading position data...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '850px' }}>
      <Link to="/recruiter-dashboard" className="back-link">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="card-form-wrapper">
        <div className="form-card-header">
          <h1 className="page-heading">
            <PlusCircle size={26} className="heading-icon" />{' '}
            {isEditing ? 'Edit Job Opening' : 'Post a New Job Opening'}
          </h1>
          <p className="page-subheading">
            Fill in the details below to publish your opening to verified candidates.
          </p>
        </div>

        {error && (
          <div className="alert-message alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="post-job-form">
          <div className="form-row-2">
            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Junior MERN Stack Developer"
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. TechWave Solutions"
                required
                className="form-control"
              />
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Kochi / Remote"
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="form-control"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Experience Level</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. Fresher / 0-2 years"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Salary / Compensation</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. ₹5,00,000 - ₹7,00,000 / year"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Provide a comprehensive summary of responsibilities, project goals, and team culture..."
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Requirements & Skills (One per line)</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              placeholder="Proficient in React.js and JavaScript ES6+&#10;Experience with Node.js and Express&#10;Understanding of MongoDB Atlas"
              className="form-control"
            />
          </div>

          <div className="form-submit-row">
            <Link to="/recruiter-dashboard" className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="spinner-icon" /> Saving Opening...
                </>
              ) : isEditing ? (
                'Update Opening'
              ) : (
                'Publish Vacancy'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
