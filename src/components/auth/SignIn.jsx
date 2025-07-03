// Cursor and ChatGPT helped write this code
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthSlice } from '../../store';

function SignIn() {
  const navigate = useNavigate();
  const { signin, error, authenticated } = useAuthSlice();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signin(email, password);
    console.log('Signin success:', success, 'Authenticated:', authenticated);
    if (success) {
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    }
  };

  return (
    <div className="auth-container">
      <div className="triangle-gradient" />
      <nav>
        <div className="logo2">Financy</div>
      </nav>
      <div className="auth-box">
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <div className="google-auth-container">
          <a href="https://project-api-financy.onrender.com/api/auth/google" className="google-auth-button">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="google-icon" />
            Continue with Google
          </a>
        </div>
        <p className="auth-link">
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <p className="auth-link">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
