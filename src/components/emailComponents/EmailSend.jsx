// Cursor and ChatGPT helped write this code
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthSlice } from '../../store';
import useEmailsSlice from '../../store/emailsSlice';
import BackButton from '../BackButton';

function EmailSend() {
  const navigate = useNavigate();
  const { user } = useAuthSlice();
  const { draft, sendEmail, loading, error, clearDraft } = useEmailsSlice();
  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    if (draft) {
      setPreviewContent(draft.previewContent);
    } else {
      navigate('/emails');
    }
  }, [draft, navigate]);

  const handleSend = async () => {
    if (!draft) return;

    try {
      console.log('EmailSend - Draft data:', {
        templateId: draft.templateId,
        contactId: draft.contactId,
        fieldValues: draft.fieldValues,
        template: draft.template,
        previewContent,
      });
      await sendEmail(draft.templateId, draft.contactId, draft.fieldValues);
      clearDraft();
      navigate('/emails');
    } catch (err) {
      console.error('EmailSend - Failed to send email:', err);
      console.error('EmailSend - Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
    }
  };

  if (!draft) {
    return (
      <div className="email-send">
        <div className="email-send__header">
          <BackButton />
          <h1>Error</h1>
        </div>
        <p>No draft found. Please go back and create a new email.</p>
      </div>
    );
  }

  const hasGoogleAccess = !!user?.googleAccessToken;

  return (
    <div className="email-send">
      <div className="email-send__header">
        <BackButton />
        <h1>Review Email</h1>
      </div>

      <div className="email-send__content">
        <div className="email-send__preview">
          <h2>Preview</h2>
          <div className="preview-content">
            <p><strong>To:</strong> {draft.template.recipientEmail}</p>
            <p><strong>Subject:</strong> {draft.template.title}</p>
            <div className="email-body">{previewContent}</div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="email-send__actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/emails')}
            disabled={loading}
          >
            Cancel
          </button>
          {hasGoogleAccess && (
            <button
              type="button"
              className="send-button"
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Email'}
            </button>
          )}
        </div>

        {!hasGoogleAccess && (
          <div className="google-auth-notice">
            <p>To send emails, please sign in with your Dartmouth Google account.</p>
            <a href="https://project-api-financy.onrender.com/api/auth/google" className="google-auth-button">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="google-icon" />
              Sign in with Google
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailSend;
