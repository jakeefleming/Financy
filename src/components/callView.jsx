// Cursor and ChatGPT helped write this code
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from '../store/index';
import '../style.scss';

function CallView() {
  const navigate = useNavigate();
  const { callId } = useParams();

  const fetchCall = useStore((state) => state.callSlice.fetchOne);
  const remove = useStore((state) => state.callSlice.remove);
  const currentCall = useStore((state) => state.callSlice.current);
  const loading = useStore((state) => state.callSlice.loading);
  const error = useStore((state) => state.callSlice.error);

  useEffect(() => {
    fetchCall(callId);
  }, [callId, fetchCall]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this call?')) {
      try {
        await remove(callId);
        navigate('/calls');
      } catch (err) {
        console.error('Error deleting call:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <h2>Loading...</h2>
          <p>Please wait while we load the call details.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Error</h2>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => navigate('/calls')}
            className="call-view__back-btn"
          >
            Back to Calls
          </button>
        </div>
      </div>
    );
  }

  if (!currentCall) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Call Not Found</h2>
          <p>The call you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
          <button
            type="button"
            onClick={() => navigate('/calls')}
            className="call-view__back-btn"
          >
            Back to Calls
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="call-view">
      <div className="call-view__header">
        <div className="call-view__header-left">
          <button
            type="button"
            onClick={() => navigate('/calls')}
            className="call-view__back-btn"
          >
            ← Back to Calls
          </button>
          <h1>Call Details</h1>
        </div>
        <div className="call-view__actions">
          <button
            type="button"
            onClick={() => navigate(`/calls/${callId}/edit`)}
            className="call-view__edit-btn"
          >
            Edit Call
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="call-view__delete-btn"
          >
            Delete Call
          </button>
        </div>
      </div>

      <div className="call-view__content">
        <div className="call-view__section">
          <h2>Summary</h2>
          <p>{currentCall.summary}</p>
        </div>

        <div className="call-view__section">
          <h2>Details</h2>
          <div className="call-view__details">
            <div className="call-view__detail">
              <span className="label">Date</span>
              <span className="value">
                {new Date(currentCall.date).toLocaleDateString()}
              </span>
            </div>
            <div className="call-view__detail">
              <span className="label">Status</span>
              <span className={`value status ${currentCall.isCompleted ? 'completed' : 'pending'}`}>
                {currentCall.isCompleted ? 'Completed' : 'Pending'}
              </span>
            </div>
            <div className="call-view__detail">
              <span className="label">Contact</span>
              <span className="value">
                {currentCall.contactId?.firstName} {currentCall.contactId?.lastName}
              </span>
            </div>
          </div>
        </div>

        {currentCall.notes && currentCall.notes.length > 0 && (
          <div className="call-view__section">
            <h2>Notes</h2>
            <div className="call-view__notes">
              {currentCall.notes.map((note, index) => (
                <p key={index} className="note">
                  {note}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CallView;
