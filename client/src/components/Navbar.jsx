import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, LogOut, PlusCircle, LayoutDashboard, FileText, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isRecruiter, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-box">
            <Briefcase size={22} className="logo-icon" />
          </div>
          <span className="logo-text">Quick<span className="logo-accent">Hire</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Find Jobs</Link>

          {isAuthenticated ? (
            <>
              {!isRecruiter && (
                <Link to="/my-applications" className="nav-link">
                  <FileText size={16} /> My Applications
                </Link>
              )}

              {isRecruiter && (
                <>
                  <Link to="/recruiter-dashboard" className="nav-link">
                    <LayoutDashboard size={16} /> Recruiter Hub
                  </Link>
                  <Link to="/post-job" className="btn btn-primary btn-sm">
                    <PlusCircle size={16} /> Post a Job
                  </Link>
                </>
              )}

              <div className="user-profile-badge">
                <span className="user-avatar-circle">
                  <User size={15} />
                </span>
                <div className="user-info-text">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-role-tag">{user?.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-icon-logout"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Create Account</Link>
            </div>
          )}
        </nav>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Find Jobs</Link>
          {isAuthenticated ? (
            <>
              {!isRecruiter && (
                <Link to="/my-applications" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  My Applications
                </Link>
              )}
              {isRecruiter && (
                <>
                  <Link to="/recruiter-dashboard" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                    Recruiter Hub
                  </Link>
                  <Link to="/post-job" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                    Post a Job
                  </Link>
                </>
              )}
              <div className="mobile-user-row">
                <span>Signed in as <strong>{user?.name}</strong> ({user?.role})</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="mobile-auth-grid">
              <Link to="/login" className="btn btn-outline" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
