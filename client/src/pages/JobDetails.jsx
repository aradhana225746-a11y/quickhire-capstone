import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import ApplyModal from '../components/ApplyModal';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Building,
  CheckCircle,
  ArrowLeft,
  Share2,
  Send
} from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isRecruiter } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getJobById(id);
      setJob(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load position specifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    setIsApplyOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <LoadingSpinner message="Fetching position specifications..." />;
  if (error) return <div className="container" style={{ padding: '2rem 1rem' }}><ErrorBanner message={error} onRetry={fetchJob} /></div>;
  if (!job) return null;

  return (
    <div className="job-details-page">
      <div className="container job-details-container">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to all jobs
        </Link>

        <div className="details-card-header">
          <div className="header-main-info">
            <span className="badge badge-category">{job.category}</span>
            <span className={`badge badge-type badge-type-${(job.jobType || 'full-time').toLowerCase()}`}>
              {job.jobType}
            </span>
            <h1 className="details-title">{job.title}</h1>
            <p className="details-company">
              <Building size={18} /> {job.company}
            </p>
          </div>

          <div className="header-actions">
            <button onClick={handleShare} className="btn btn-outline btn-sm">
              <Share2 size={16} /> {copied ? 'Link Copied!' : 'Share'}
            </button>
            {!isRecruiter && (
              <button onClick={handleApplyClick} className="btn btn-primary btn-lg">
                <Send size={18} /> Apply Now
              </button>
            )}
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="job-meta-bar">
          <div className="meta-box">
            <MapPin className="meta-icon" size={20} />
            <div>
              <span className="meta-label">Location</span>
              <span className="meta-val">{job.location}</span>
            </div>
          </div>
          <div className="meta-box">
            <DollarSign className="meta-icon" size={20} />
            <div>
              <span className="meta-label">Compensation</span>
              <span className="meta-val">{job.salary}</span>
            </div>
          </div>
          <div className="meta-box">
            <Briefcase className="meta-icon" size={20} />
            <div>
              <span className="meta-label">Experience</span>
              <span className="meta-val">{job.experience}</span>
            </div>
          </div>
          <div className="meta-box">
            <Calendar className="meta-icon" size={20} />
            <div>
              <span className="meta-label">Date Posted</span>
              <span className="meta-val">
                {new Date(job.createdAt).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="details-content-grid">
          <div className="details-main-body">
            <div className="details-section">
              <h2>About the Role</h2>
              <p className="description-text">{job.description}</p>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div className="details-section">
                <h2>Key Requirements & Qualifications</h2>
                <ul className="requirements-list">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>
                      <CheckCircle size={18} className="check-icon" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="details-sidebar">
            <div className="sidebar-card">
              <h3>Interested in this role?</h3>
              <p>Applications are reviewed by hiring managers on a rolling basis.</p>
              {!isRecruiter ? (
                <button onClick={handleApplyClick} className="btn btn-primary btn-full">
                  <Send size={16} /> Submit Application
                </button>
              ) : (
                <p className="subtext">You are viewing this position as a Recruiter.</p>
              )}
            </div>

            <div className="sidebar-card">
              <h3>Company Overview</h3>
              <p><strong>{job.company}</strong></p>
              <p className="subtext">
                Verified hiring partner on QuickHire. Reach out via your application to initiate screening discussions.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {isApplyOpen && (
        <ApplyModal
          job={job}
          onClose={() => setIsApplyOpen(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
