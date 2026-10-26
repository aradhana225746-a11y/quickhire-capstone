import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import { Search, MapPin, Filter, Sparkles, Briefcase } from 'lucide-react';

const CATEGORIES = ['All', 'Engineering', 'Design', 'Marketing', 'Data', 'Customer Support', 'Other'];
const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (keyword.trim()) params.keyword = keyword.trim();
      if (location.trim()) params.location = location.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedType !== 'All') params.jobType = selectedType;

      const res = await api.getJobs(params);
      setJobs(res.data || []);
    } catch (err) {
      setError(err.message || 'Unable to retrieve jobs. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setLocation('');
    setSelectedCategory('All');
    setSelectedType('All');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="container hero-container">
          <div className="hero-badge">
            <Sparkles size={16} /> Connecting Top Talent with Industry Opportunities
          </div>
          <h1 className="hero-title">
            Find Your Dream Career with <span className="highlight-text">QuickHire</span>
          </h1>
          <p className="hero-subtitle">
            Explore verified openings across Kerala, India, and global remote companies.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="search-bar-wrapper">
            <div className="search-input-group">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, keywords, or company..."
                className="search-input"
              />
            </div>

            <div className="search-input-group">
              <MapPin size={18} className="search-icon" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City (e.g. Kochi, Trivandrum, Remote)"
                className="search-input"
              />
            </div>

            <button type="submit" className="btn btn-primary search-btn">
              Search Openings
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container main-content-container">
        {/* Category Pills Bar */}
        <div className="category-scroll-bar">
          <span className="filter-label">Categories:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Bar */}
        <div className="filter-summary-row">
          <div className="results-count">
            <Briefcase size={18} />
            <span>
              {!loading && !error && (
                <>Showing <strong>{jobs.length}</strong> active position{jobs.length === 1 ? '' : 's'}</>
              )}
            </span>
          </div>

          <div className="filter-controls">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="select-control"
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Job Types' : type}
                </option>
              ))}
            </select>

            {(keyword || location || selectedCategory !== 'All' || selectedType !== 'All') && (
              <button onClick={handleResetFilters} className="btn btn-outline btn-sm">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* 4 State Handling */}
        {loading && <LoadingSpinner message="Scanning active job listings..." />}

        {!loading && error && <ErrorBanner message={error} onRetry={fetchJobs} />}

        {!loading && !error && jobs.length === 0 && (
          <EmptyState
            title="No matching job listings found"
            description="Try modifying your keyword search or resetting category filters."
            actionText="Reset All Filters"
            onAction={handleResetFilters}
          />
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
