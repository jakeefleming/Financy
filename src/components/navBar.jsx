// Cursor and ChatGPT helped write this code
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthSlice } from '../store';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, authenticated, signout } = useAuthSlice();

  const firstName = user?.firstName || '';
  if (!authenticated) return null;

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      signout();
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">Financy</div>
      <div className="navbar__container">
        <div className="navbar__links">
          {authenticated ? (
            <>
              <Link
                to="/dashboard"
                className={location.pathname === '/dashboard' ? 'active' : ''}
              >
                Dashboard
              </Link>
              <Link
                to="/contacts"
                className={location.pathname === '/contacts' ? 'active' : ''}
              >
                Contacts
              </Link>
              <Link
                to="/tasks"
                className={location.pathname === '/tasks' ? 'active' : ''}
              >
                Tasks
              </Link>
              <Link
                to="/emails"
                className={location.pathname === '/emails' ? 'active' : ''}
              >
                Emails
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="navbar__signout"
              >
                Sign Out
              </button>
              <div className="user-profile">
                <div className="avatar" />
                <span className="username">{firstName}</span>
              </div>
            </>
          ) : (
            <>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
