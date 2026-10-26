import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, Users, ArrowUpRight } from 'lucide-react';

export default function JobCard({ job, showRecruiterActions = false, onDelete }) {
  const formatTime = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <span className="badge badge-category">{job.category || 'General'}</span>
          <span className={`badge badge-type badge-type-${(job.jobType || 'full-time').toLowerCase()}`}>
            {job.jobType}
          </span>
        </div>
        <span className="job-posted-date">
          <Clock size={13} /> {formatTime(job.createdAt)}
        </span>
      </div>

      <h3 className="job-card-title">
        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
      </h3>
      <p className="job-card-company">{job.company}</p>

      <div className="job-card-meta">
        <span className="meta-item">
          <MapPin size={15} /> {job.location}
        </span>
        <span className="meta-item">
          <DollarSign size={15} /> {job.salary}
        </span>
      </div>

      <p className="job-card-snippet">
        {job.description?.length > 120 ? `${job.description.substring(0, 120)}...` : job.description}
      </p>

      {job.requirements && job.requirements.length > 0 && (
        <div className="job-card-skills">
          {job.requirements.slice(0, 3).map((req, idx) => (
            <span key={idx} className="skill-pill">{req}</span>
          ))}
          {job.requirements.length > 3 && (
            <span className="skill-pill more-pill">+{job.requirements.length - 3} more</span>
          )}
        </div>
      )}

      <div className="job-card-footer">
        {showRecruiterActions ? (
          <div className="recruiter-card-actions">
            <Link to={`/recruiter/job/${job._id}/applicants`} className="btn btn-outline btn-sm">
              <Users size={15} /> {job.applicantsCount ?? 0} Applicants
            </Link>
            <div className="action-button-group">
              <Link to={`/edit-job/${job._id}`} className="btn btn-secondary btn-sm">Edit</Link>
              <button onClick={() => onDelete(job._id)} className="btn btn-danger-outline btn-sm">
                Delete
              </button>
            </div>
          </div>
        ) : (
          <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm btn-full">
            View Position & Apply <ArrowUpRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
