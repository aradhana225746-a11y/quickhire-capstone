import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ApplyModal({ job, onClose, onSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    applicantName: user?.name || '',
    applicantEmail: user?.email || '',
    applicantPhone: '',
    resumeLink: '',
    coverLetter: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.applicantPhone.trim() || !formData.resumeLink.trim()) {
      setError('Phone number and resume/portfolio link are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await api.applyForJob(job._id, formData);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="modal-success-view">
            <CheckCircle2 size={54} className="success-icon" />
            <h3>Application Submitted!</h3>
            <p>
              Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been received.
            </p>
            <p className="subtext">You can track your application review progress anytime in 'My Applications'.</p>
            <button onClick={onClose} className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="apply-form">
            <div className="modal-header">
              <h2>Apply for Position</h2>
              <p className="modal-job-sub">{job.title} • {job.company}</p>
            </div>

            {error && (
              <div className="alert-message alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="applicantEmail"
                value={formData.applicantEmail}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="applicantPhone"
                value={formData.applicantPhone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Resume / Portfolio Link (Google Drive / GitHub / LinkedIn) *</label>
              <input
                type="url"
                name="resumeLink"
                value={formData.resumeLink}
                onChange={handleChange}
                placeholder="https://drive.google.com/... or portfolio link"
                required
                className="form-control"
              />
              <span className="input-hint">Ensure link access permissions are set to 'Anyone with the link can view'.</span>
            </div>

            <div className="form-group">
              <label>Cover Note (Optional)</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                rows={3}
                placeholder="Briefly describe why you are a great fit for this position..."
                className="form-control"
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn btn-outline" disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={16} className="spinner-icon" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
