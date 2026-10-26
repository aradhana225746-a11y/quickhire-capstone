import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorBanner({ message = 'An unexpected error occurred.', onRetry }) {
  return (
    <div className="state-container error-state">
      <div className="error-icon-wrapper">
        <AlertCircle size={40} className="error-icon" />
      </div>
      <h3 className="error-title">Unable to Load Data</h3>
      <p className="error-description">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm retry-btn">
          <RotateCcw size={16} /> Try Again
        </button>
      )}
    </div>
  );
}
