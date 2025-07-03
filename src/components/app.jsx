// Cursor and ChatGPT helped write this code
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import TasksPage from '../views/tasksPage';
import 'react-toastify/dist/ReactToastify.css';
import TaskEditor from './taskEditor';
import ContactsPage from '../views/contactsPage';
import CreateContact from './contactComponents/createContact';
import CreateCompany from './contactComponents/createCompany';
import IndividualView from './contactComponents/individualView';
import CompanyView from './contactComponents/companyView';
import '../style.scss';
import Dashboard from '../views/dashboard';
import NavBar from './navBar';
import EmailsPage from '../views/emailsPage';
import EmailEditor from './emailComponents/emailEditor';
import EmailSend from './emailComponents/EmailSend';
import CallsPage from '../views/callsPage';
import CallEditor from './callEditor';
import CallView from './callView';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import LandingPage from '../views/LandingPage';
import RequireAuth from './auth/RequireAuth';
import GoogleAuthRedirect from './auth/GoogleAuthRedirect';
import AuthError from './auth/AuthError';
import { useAuthSlice } from '../store';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { checkAuth } = useAuthSlice();

  useEffect(() => {
    // Check API connection
    fetch('https://project-api-financy.onrender.com')
      .then((res) => {
        if (!res.ok) {
          throw new Error('API connection failed');
        }
        return res.text();
      })
      .then(() => {
        setIsLoading(false);
        checkAuth(); // Check if user is already authenticated
      })
      .catch((err) => {
        console.error('API connection error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <h2>Loading...</h2>
          <p>Connecting to the server</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <p className="error-message">Please check your internet connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/auth/callback" element={<GoogleAuthRedirect />} />
            <Route path="/auth/error" element={<AuthError />} />
            <Route
              path="/dashboard"
              element={(
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              )}
            />
            <Route
              path="/contacts"
              element={(
                <RequireAuth>
                  <ContactsPage />
                </RequireAuth>
              )}
            />
            <Route
              path="/contacts/createContact"
              element={(
                <RequireAuth>
                  <CreateContact />
                </RequireAuth>
              )}
            />
            <Route
              path="/contacts/createCompany"
              element={(
                <RequireAuth>
                  <CreateCompany />
                </RequireAuth>
              )}
            />
            <Route
              path="/contacts/contact"
              element={(
                <RequireAuth>
                  <IndividualView />
                </RequireAuth>
              )}
            />
            <Route
              path="/contacts/company"
              element={(
                <RequireAuth>
                  <CompanyView />
                </RequireAuth>
              )}
            />
            <Route
              path="/emails"
              element={(
                <RequireAuth>
                  <EmailsPage />
                </RequireAuth>
              )}
            />
            <Route
              path="/emails/create"
              element={(
                <RequireAuth>
                  <EmailEditor />
                </RequireAuth>
              )}
            />
            <Route
              path="/emails/edit/:id"
              element={(
                <RequireAuth>
                  <EmailEditor />
                </RequireAuth>
              )}
            />
            <Route
              path="/emails/send"
              element={(
                <RequireAuth>
                  <EmailSend />
                </RequireAuth>
              )}
            />
            <Route
              path="/calls"
              element={(
                <RequireAuth>
                  <CallsPage />
                </RequireAuth>
              )}
            />
            <Route
              path="/calls/new"
              element={(
                <RequireAuth>
                  <CallEditor />
                </RequireAuth>
              )}
            />
            <Route
              path="/calls/:callId"
              element={(
                <RequireAuth>
                  <CallView />
                </RequireAuth>
              )}
            />
            <Route
              path="/calls/:callId/edit"
              element={(
                <RequireAuth>
                  <CallEditor />
                </RequireAuth>
              )}
            />
            <Route
              path="/tasks"
              element={(
                <RequireAuth>
                  <TasksPage />
                </RequireAuth>
              )}
            />
            <Route
              path="/tasks/new"
              element={(
                <RequireAuth>
                  <TaskEditor />
                </RequireAuth>
              )}
            />
            <Route
              path="/tasks/:id"
              element={(
                <RequireAuth>
                  <TaskEditor />
                </RequireAuth>
              )}
            />
          </Routes>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
