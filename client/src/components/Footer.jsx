import React from 'react';
import { Briefcase, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <Briefcase size={20} />
            <span>QuickHire</span>
          </div>
          <p className="footer-description">
            A full-featured MERN stack Career & Placement Portal developed for the ICT Academy of Kerala (ICTAK) Capstone Project.
          </p>
        </div>

        <div className="footer-links-group">
          <h4>Platform</h4>
          <a href="#browse">Browse Openings</a>
          <a href="#roles">Recruiter Portal</a>
          <a href="#workflow">Application Tracking</a>
        </div>

        <div className="footer-links-group">
          <h4>Technologies</h4>
          <span>React.js & Vite</span>
          <span>Node.js & Express</span>
          <span>MongoDB Atlas</span>
          <span>JSON Web Tokens</span>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} QuickHire. Built with <Heart size={14} className="heart-icon" /> by Aradhana Rose | ICTAK Capstone.</p>
        </div>
      </div>
    </footer>
  );
}
