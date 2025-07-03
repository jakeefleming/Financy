// Cursor and ChatGPT helped write this code
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AuthError() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const errorMessage = params.get('message') || 'An authentication error occurred';

  return (
    <div className="auth-error">
      <h2>Authentication Error</h2>
      <p>{errorMessage}</p>
      <button
        type="button"
        onClick={() => navigate('/signin')}
        className="back-button"
      >
        Back to Sign In
      </button>
    </div>
  );
}

export default AuthError;
