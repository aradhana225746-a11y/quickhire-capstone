import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import {
  FileText,
  Building,
  MapPin,
  Calendar,
  ExternalLink,
  MessageSquareQuote
} from 'lucide-react';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMyApplications();
      setApplications(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve your applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'badge-status-shortlisted';
      case 'Reviewing':
        return 'badge-status-reviewing';
      case 'Rejected':
        return 'badge-status-rejected';
      default:
        return 'badge-status-pending';
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div className="section-header-row">
        <div>
          <h1 className="page-heading">
            <FileText size={28} className="heading-icon" /> My Submitted Applications
          </h1>
          <p className="page-subheading">
            Track real-time hiring progress and employer feedback for your applications.
          </p>
        </div>
      </div>

      {loading && <LoadingSpinner message="Loading your application records..." />}

      {!loading && error && <ErrorBanner message={error} onRetry={fetchApplications} />}

      {!loading && !error && applications.length === 0 && (
        <EmptyState
          title="No applications submitted yet"
          description="Browse available job vacancies and start applying to launch your career."
          actionText="Explore Open Jobs"
          actionLink="/"
        />
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app._id} className="application-card">
              <div className="app-card-header">
                <div>
                  <h3 className="app-job-title">
                    <Link to={`/jobs/${app.job?._id}`}>{app.job?.title || 'Position'}</Link>
                  </h3>
                  <p className="app-company-name">
                    <Building size={16} /> {app.job?.company || 'Company'}
                  </p>
                </div>
                <div>
                  <span className={`badge-status ${getStatusBadgeClass(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              </div>

              <div className="app-card-meta">
                <span>
                  <MapPin size={15} /> {app.job?.location || 'Location'}
                </span>
                <span>
                  <Calendar size={15} /> Applied on{' '}
                  {new Date(app.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span>
                  <a
                    href={app.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-link"
                  >
                    View Submitted Resume <ExternalLink size={13} />
                  </a>
                </span>
              </div>

              {app.recruiterNotes && (
                <div className="recruiter-feedback-box">
                  <div className="feedback-label">
                    <MessageSquareQuote size={15} /> Recruiter Feedback:
                  </div>
                  <p>{app.recruiterNotes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
