import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import {
  Users,
  ArrowLeft,
  Mail,
  Phone,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function JobApplicants() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [notesMap, setNotesMap] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getJobApplications(id);
      setJob(res.job);
      setApplicants(res.data || []);

      // Initialize status & notes state maps
      const sMap = {};
      const nMap = {};
      (res.data || []).forEach((app) => {
        sMap[app._id] = app.status;
        nMap[app._id] = app.recruiterNotes || '';
      });
      setStatusMap(sMap);
      setNotesMap(nMap);
    } catch (err) {
      setError(err.message || 'Failed to retrieve applicants for this job.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const handleStatusChange = (appId, newStatus) => {
    setStatusMap((prev) => ({ ...prev, [appId]: newStatus }));
  };

  const handleNotesChange = (appId, newNotes) => {
    setNotesMap((prev) => ({ ...prev, [appId]: newNotes }));
  };

  const handleSaveStatus = async (appId) => {
    try {
      setUpdatingId(appId);
      const newStatus = statusMap[appId];
      const newNotes = notesMap[appId];

      await api.updateApplicationStatus(appId, newStatus, newNotes);

      setSaveSuccess(appId);
      setTimeout(() => setSaveSuccess(null), 2500);

      // Update local applicants list
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: newStatus, recruiterNotes: newNotes } : app
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to update applicant status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <Link to="/recruiter-dashboard" className="back-link">
        <ArrowLeft size={16} /> Back to Recruiter Dashboard
      </Link>

      <div className="section-header-row">
        <div>
          <h1 className="page-heading">
            <Users size={28} className="heading-icon" /> Candidate Applicants
          </h1>
          <p className="page-subheading">
            Reviewing submissions for <strong>{job?.title || 'Position'}</strong> • {job?.company}
          </p>
        </div>
      </div>

      {loading && <LoadingSpinner message="Loading candidate applications..." />}

      {!loading && error && <ErrorBanner message={error} onRetry={fetchApplicants} />}

      {!loading && !error && applicants.length === 0 && (
        <EmptyState
          title="No candidates have applied yet"
          description="Your position is active. When candidates submit their resumes, they will appear here."
          actionText="View Job Details"
          actionLink={`/jobs/${id}`}
        />
      )}

      {!loading && !error && applicants.length > 0 && (
        <div className="applicants-list">
          {applicants.map((app) => (
            <div key={app._id} className="applicant-item-card">
              <div className="applicant-top-bar">
                <div className="applicant-primary-info">
                  <h3 className="applicant-name">{app.applicantName}</h3>
                  <div className="applicant-contact-meta">
                    <span>
                      <Mail size={14} /> {app.applicantEmail}
                    </span>
                    <span>
                      <Phone size={14} /> {app.applicantPhone}
                    </span>
                  </div>
                </div>

                <div className="applicant-actions-inline">
                  <a
                    href={app.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    Inspect Resume <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {app.coverLetter && (
                <div className="applicant-cover-note">
                  <strong>Candidate Note:</strong> {app.coverLetter}
                </div>
              )}

              {/* Status Update & Recruiter Feedback Controls */}
              <div className="applicant-status-controls">
                <div className="status-select-group">
                  <label>Application Status:</label>
                  <select
                    value={statusMap[app._id] || app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="status-dropdown"
                  >
                    <option value="Pending">⏳ Pending Review</option>
                    <option value="Reviewing">🔍 In Review</option>
                    <option value="Shortlisted">✅ Shortlisted</option>
                    <option value="Rejected">❌ Rejected</option>
                  </select>
                </div>

                <div className="notes-input-group">
                  <input
                    type="text"
                    value={notesMap[app._id] !== undefined ? notesMap[app._id] : app.recruiterNotes || ''}
                    onChange={(e) => handleNotesChange(app._id, e.target.value)}
                    placeholder="Add private evaluation notes or candidate feedback..."
                    className="notes-input"
                  />
                </div>

                <button
                  onClick={() => handleSaveStatus(app._id)}
                  disabled={updatingId === app._id}
                  className="btn btn-secondary btn-sm"
                >
                  {updatingId === app._id ? (
                    'Saving...'
                  ) : saveSuccess === app._id ? (
                    <>
                      <CheckCircle2 size={15} /> Saved!
                    </>
                  ) : (
                    <>
                      <Save size={15} /> Save Status
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
