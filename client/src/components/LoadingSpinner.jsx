import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading details, please wait...' }) {
  return (
    <div className="state-container loading-state">
      <Loader2 className="spinner-icon" size={38} />
      <p className="state-message">{message}</p>
    </div>
  );
}
