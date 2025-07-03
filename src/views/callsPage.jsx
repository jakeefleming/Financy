// Cursor and ChatGPT helped write this code
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/index';
import SearchBar from '../components/searchBar';
import '../style.scss';

function CallsPage() {
  const navigate = useNavigate();
  const all = useStore((state) => state.callSlice.all);
  const fetchAll = useStore((state) => state.callSlice.fetchAll);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Filter calls by summary
  const filteredCalls = all.filter((call) => {
    const matchesSummary = call.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSummary;
  });

  return (
    <div className="calls-page">
      <div className="main-content">
        <div className="calls-page__header">
          <h1>Calls</h1>
          <div className="calls-page__controls">
            <div className="calls-page__search">
              <SearchBar
                onSearch={setSearchTerm}
                placeholder="Search calls..."
              />
            </div>
            <button
              type="button"
              onClick={() => navigate('/calls/new')}
              className="calls-page__create-btn"
            >
              Create New Call
            </button>
          </div>
        </div>

        <div className="calls-page__list">
          {filteredCalls.map((call) => (
            <Link to={`/calls/${call._id}`} key={call._id} className="call-card">
              <div className="call-card__header">
                <h2>{call.summary}</h2>
                <span className={`call-card__status ${call.isCompleted ? 'completed' : 'pending'}`}>
                  {call.isCompleted ? 'Completed' : 'Pending'}
                </span>
              </div>
              <div className="call-card__meta">
                <span className="call-card__date">
                  {new Date(call.date).toLocaleDateString()}
                </span>
                <span className="call-card__contact">
                  Contact: {call.contactId?.firstName} {call.contactId?.lastName}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CallsPage;
