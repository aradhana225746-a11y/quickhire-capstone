import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Lock, Mail, User, Building, AlertCircle, Loader2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    company: '',
    headline: ''
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const user = await register(formData);
      if (user.role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Briefcase size={26} />
          </div>
          <h2>Create QuickHire Account</h2>
          <p>Join as a candidate looking for work or as a hiring manager</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="role-selector-tabs">
          <button
            type="button"
            className={`role-tab ${formData.role === 'user' ? 'active' : ''}`}
            onClick={() => setFormData({ ...formData, role: 'user' })}
          >
            👤 Job Seeker
          </button>
          <button
            type="button"
            className={`role-tab ${formData.role === 'recruiter' ? 'active' : ''}`}
            onClick={() => setFormData({ ...formData, role: 'recruiter' })}
          >
            💼 Recruiter / Employer
          </button>
        </div>

        {error && (
          <div className="alert-message alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name *</label>
            <div className="input-with-icon">
              <User size={18} className="field-icon" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aradhana Rose"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password (min. 6 characters) *</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-control"
              />
            </div>
          </div>

          {formData.role === 'recruiter' && (
            <div className="form-group">
              <label>Company / Organization Name *</label>
              <div className="input-with-icon">
                <Building size={18} className="field-icon" />
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. TechWave Solutions"
                  className="form-control"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Professional Headline (Optional)</label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder={formData.role === 'recruiter' ? 'e.g. Talent Acquisition Lead' : 'e.g. Full Stack Developer'}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={18} className="spinner-icon" /> Creating Account...
              </>
            ) : (
              'Complete Registration'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
