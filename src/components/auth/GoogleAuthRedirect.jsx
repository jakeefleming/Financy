// Cursor and ChatGPT helped write this code
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthSlice } from '../../store';

function GoogleAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleLogin } = useAuthSlice();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const data = params.get('data');
    const error = params.get('error');

    console.log('GoogleAuthRedirect - URL params:', {
      data: data ? 'present' : 'missing',
      error: error || 'none',
    });

    if (error) {
      console.error('GoogleAuthRedirect - Error from backend:', error);
      navigate('/signin');
      return;
    }

    if (data) {
      try {
        const userInfo = JSON.parse(decodeURIComponent(data));
        console.log('GoogleAuthRedirect - Received user info:', userInfo);
        googleLogin(userInfo.token, userInfo);
        navigate('/dashboard');
      } catch (err) {
        console.error('GoogleAuthRedirect - Error processing data:', err);
        navigate('/signin');
      }
    } else {
      console.error('GoogleAuthRedirect - No data received');
      navigate('/signin');
    }
  }, [location, googleLogin, navigate]);

  return (
    <div className="loading-container">
      <div className="loading-content">
        <h2>Signing in with Google...</h2>
        <p>Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}

export default GoogleAuthRedirect;
