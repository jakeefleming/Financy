// Cursor and ChatGPT helped write this code
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthSlice } from '../../store';

function RequireAuth({ children }) {
  const { authenticated } = useAuthSlice();
  console.log('RequireAuth - authenticated:', authenticated);

  if (!authenticated) {
    console.log('RequireAuth - redirecting to signin');
    return <Navigate to="/signin" />;
  }

  console.log('RequireAuth - rendering protected content');
  return children;
}

export default RequireAuth;
