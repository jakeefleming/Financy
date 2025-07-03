// Cursor and ChatGPT helped write this code
import React from 'react';

function StatsOverview({ pendingFollowUps, upcomingCalls, activeApplications, totalContacts }) {
  return (
    <div className="stats-overview">
      <div className="stat-card">
        <div className="stat-icon">📝</div>
        <div className="stat-content">
          <h3>Work to do</h3>
          <p className="stat-number">{pendingFollowUps}</p>
          <p className="stat-label">Tasks to complete</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">💼</div>
        <div className="stat-content">
          <h3>Active Applications</h3>
          <p className="stat-number">{activeApplications}</p>
          <p className="stat-label">In progress</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <h3>Total Contacts</h3>
          <p className="stat-number">{totalContacts}</p>
          <p className="stat-label">In your network</p>
        </div>
      </div>
    </div>
  );
}

export default StatsOverview;
