// Cursor and ChatGPT helped write this code
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useStore, { useContactSlice } from '../store/index';
import SearchBar from './searchBar';
import '../style.scss';

function CallEditor() {
  const navigate = useNavigate();
  const { callId } = useParams();
  const isEditing = Boolean(callId);

  const create = useStore((state) => state.callSlice.create);
  const updateCall = useStore((state) => state.callSlice.update);
  const fetchCall = useStore((state) => state.callSlice.fetchOne);
  const currentCall = useStore((state) => state.callSlice.current);
  const { all: contacts, fetchAll: fetchContacts } = useContactSlice();

  const [formData, setFormData] = useState({
    contactId: '',
    date: '',
    summary: '',
    notes: '',
    isCompleted: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [contactSearchTerm, setContactSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchContacts();
        if (isEditing && callId) {
          await fetchCall(callId);
        }
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isEditing, callId, fetchCall, fetchContacts]);

  useEffect(() => {
    if (isEditing && currentCall) {
      setFormData({
        contactId: currentCall.contactId || '',
        date: currentCall.date ? new Date(currentCall.date).toISOString().split('T')[0] : '',
        summary: currentCall.summary || '',
        notes: currentCall.notes ? currentCall.notes.join('\n') : '',
        isCompleted: currentCall.isCompleted || false,
      });
    }
  }, [isEditing, currentCall]);

  const validateForm = () => {
    const errors = {};
    if (!formData.summary.trim()) {
      errors.summary = 'Call summary is required';
    }
    if (!formData.date) {
      errors.date = 'Call date is required';
    }
    if (!formData.contactId) {
      errors.contactId = 'Contact is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError(null);

    const call = {
      ...formData,
      notes: formData.notes.split('\n').filter((note) => note.trim() !== ''),
    };

    try {
      if (isEditing) {
        await updateCall(callId, call);
      } else {
        await create(call);
      }
      navigate('/calls');
    } catch (err) {
      setError('Failed to save call. Please try again.');
      console.error('Error saving call:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const filteredContacts = contacts.filter(
    (contact) => contact.firstName.toLowerCase().includes(contactSearchTerm.toLowerCase())
      || contact.lastName.toLowerCase().includes(contactSearchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <h2>Loading...</h2>
          <p>Please wait while we load the call data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="call-editor">
      <div className="main-content">
        <h1>{isEditing ? 'Edit Call' : 'Create New Call'}</h1>

        {error && (
        <div className="error-message">
          {error}
        </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Related Contact</label>
            <SearchBar
              id="contact-search"
              onSearch={setContactSearchTerm}
              placeholder="Search contacts..."
            />
            <select
              id="call-contact"
              name="contactId"
              value={formData.contactId}
              onChange={handleInputChange}
              className={validationErrors.contactId ? 'input-error' : ''}
            >
              <option value="">Select a contact</option>
              {filteredContacts.map((contact) => (
                <option key={contact._id} value={contact._id}>
                  {`${contact.firstName} ${contact.lastName}`}
                </option>
              ))}
            </select>
            {validationErrors.contactId && (
            <div className="field-error">{validationErrors.contactId}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date">Call Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className={validationErrors.date ? 'input-error' : ''}
              required
            />
            {validationErrors.date && (
            <div className="field-error">{validationErrors.date}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="summary">Call Summary</label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              className={validationErrors.summary ? 'input-error' : ''}
              placeholder="Enter call summary"
              required
              rows="4"
            />
            {validationErrors.summary && (
            <div className="field-error">{validationErrors.summary}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (one per line)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Enter notes, one per line"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isCompleted"
                checked={formData.isCompleted}
                onChange={handleInputChange}
              />
              Mark as completed
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Update Call' : 'Create Call'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CallEditor;
