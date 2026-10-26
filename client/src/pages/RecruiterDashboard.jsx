import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Users,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    shortlistedCount: 0,
    pendingCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [jobsRes, statsRes] = await Promise.all([
        api.getMyPostedJobs(),
        api.getRecruiterStats()
      ]);

      setJobs(jobsRes.data || []);
      setStats(statsRes.data || {});
    } catch (err) {
      setError(err.message || 'Failed to load recruiter management data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting and its associated applications?')) {
      return;
    }

    try {
      await api.deleteJob(jobId);
      setJobs(jobs.filter((j) => j._id !== jobId));
      // Refresh stats
      const statsRes = await api.getRecruiterStats();
      setStats(statsRes.data || {});
    } catch (err) {
      alert(err.message || 'Failed to delete job posting.');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div className="section-header-row">
        <div>
          <h1 className="page-heading">
            <LayoutDashboard size={28} className="heading-icon" /> Recruiter Management Hub
          </h1>
          <p className="page-subheading">
            Manage your company's vacancies, review candidates, and progress applications.
          </p>
        </div>
        <div>
          <Link to="/post-job" className="btn btn-primary">
            <PlusCircle size={18} /> Post New Vacancy
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box bg-blue">
            <Briefcase size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-number">{stats.totalJobs || 0}</span>
            <span className="metric-title">Active Vacancies</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box bg-purple">
            <Users size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-number">{stats.totalApplications || 0}</span>
            <span className="metric-title">Total Applicants</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box bg-green">
            <CheckCircle size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-number">{stats.shortlistedCount || 0}</span>
            <span className="metric-title">Shortlisted Candidates</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box bg-orange">
            <Clock size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-number">{stats.pendingCount || 0}</span>
            <span className="metric-title">Pending Reviews</span>
          </div>
        </div>
      </div>

      {/* Posted Jobs Section */}
      <div className="recruiter-jobs-section">
        <h2 className="section-title">Your Job Postings</h2>

        {loading && <LoadingSpinner message="Fetching your job listings..." />}

        {!loading && error && <ErrorBanner message={error} onRetry={fetchData} />}

        {!loading && !error && jobs.length === 0 && (
          <EmptyState
            title="You haven't posted any jobs yet"
            description="Create your first job listing to start receiving qualified applicant submissions."
            actionText="Post Your First Job"
            actionLink="/post-job"
          />
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                showRecruiterActions={true}
                onDelete={handleDeleteJob}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
