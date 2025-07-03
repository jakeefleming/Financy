// Cursor and ChatGPT helped write this code
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useEmailsSlice from '../../store/emailsSlice';
import BackButton from '../BackButton';

// Define the available contact fields and their display names
const CONTACT_FIELDS = [
  { key: 'FIRST_NAME', label: 'First Name' },
  { key: 'LAST_NAME', label: 'Last Name' },
  { key: 'EMAIL', label: 'Email' },
  { key: 'COMPANY', label: 'Company' },
  { key: 'POSITION', label: 'Position' },
  { key: 'RELATIONSHIP_STRENGTH', label: 'Relationship Strength' },
  { key: 'LINKEDIN', label: 'LinkedIn' },
  { key: 'UNIVERSITY', label: 'University' },
];

function EmailEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { create, update, fetchOne, current, remove } = useEmailsSlice();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (isEditing) {
          await fetchOne(id);
        } else {
          // Reset form when creating new template
          setTitle('');
          setContent('');
        }
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, fetchOne, isEditing]);

  useEffect(() => {
    if (current && isEditing) {
      setTitle(current.title);
      setContent(current.content);
    }
  }, [current, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const templateData = {
        title,
        content,
        customizableFields: CONTACT_FIELDS.map((field) => field.key),
      };

      if (isEditing) {
        await update(id, templateData);
      } else {
        await create(templateData);
      }
      navigate('/emails');
    } catch (err) {
      setError(err.message || 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await remove(id);
      navigate('/emails');
    } catch (err) {
      setError(err.message || 'Failed to delete template');
    } finally {
      setLoading(false);
    }
  };

  const insertField = (fieldKey) => {
    const fieldPlaceholder = `[${fieldKey}]`;
    setContent((prevContent) => {
      const textarea = document.getElementById('content');
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = prevContent.substring(0, start) + fieldPlaceholder + prevContent.substring(end);

      // Set cursor position after the inserted field
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + fieldPlaceholder.length, start + fieldPlaceholder.length);
      }, 0);

      return newContent;
    });
  };

  return (
    <div className="email-editor">
      <div className="main-content">
        <div className="email-editor__header">
          <div className="email-editor__header-left">
            <BackButton />
            <h1>{isEditing ? 'Edit Template' : 'Create New Template'}</h1>
          </div>
        </div>

        <div className="email-editor__container">
          <form onSubmit={handleSubmit} className="email-editor__form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="title"><h2>Template Title</h2></label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter template title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Template Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Enter template content. Use the buttons on the right to insert contact fields."
                rows={10}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate('/emails')}
                disabled={loading}
              >
                Cancel
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="delete-button"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete Template
                </button>
              )}
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Saving...' : isEditing ? 'Update Template' : 'Save Template'}
              </button>
            </div>
          </form>

          <div className="email-editor__sidebar">
            <h3>Contact Fields</h3>
            <p className="sidebar-description">Click a field to insert it into your template</p>
            <div className="field-buttons">
              {CONTACT_FIELDS.map((field) => (
                <button
                  key={field.key}
                  type="button"
                  className="field-button"
                  onClick={() => insertField(field.key)}
                >
                  {field.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailEditor;
