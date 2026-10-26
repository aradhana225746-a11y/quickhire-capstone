import React from 'react';
import { Inbox, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No items found',
  description = 'There are no records matching your current criteria.',
  actionText,
  actionLink,
  onAction
}) {
  return (
    <div className="state-container empty-state">
      <div className="empty-icon-wrapper">
        <Inbox size={42} className="empty-icon" />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {actionLink && actionText && (
        <Link to={actionLink} className="btn btn-primary btn-sm">
          {actionText} <ArrowRight size={16} />
        </Link>
      )}
      {onAction && actionText && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
}
