// Cursor and ChatGPT helped write this code
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCompanySlice } from '../../store';
import CompanyLinkedInEnrichment from './CompanyLinkedInEnrichment';

function CreateCompany() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const isCreating = !id;

  const { fetchOne: fetchCompany, create, update } = useCompanySlice();

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    notes: '',
    applicationStatus: 'Networking',
    applicationDueDate: '',
    applicationName: '',
    applicationLink: '',
  });

  const [loading, setLoading] = useState(!isCreating);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Load existing company data if editing
  useEffect(() => {
    if (isCreating) return;

    fetchCompany(id)
      .then((company) => {
        setFormData({
          name: company.name || '',
          industry: company.industry || '',
          location: company.location || '',
          notes: Array.isArray(company.notes) ? company.notes.join('\n') : '',
          applicationStatus: company.applicationStatus || 'Networking',
          applicationDueDate: company.applicationDueDate ? new Date(company.applicationDueDate).toISOString().split('T')[0] : '',
          applicationName: company.applicationName || '',
          applicationLink: company.applicationLink || '',
        });
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load company.');
      })
      .finally(() => setLoading(false));
  }, [id, fetchCompany, isCreating]);

  const handleEnrichmentComplete = (enrichedData) => {
    console.log('Enriched data received:', enrichedData);
    const companyData = enrichedData.company;

    // Helper function to capitalize words
    const capitalizeWords = (str) => {
      if (!str) return '';
      return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    setFormData((prev) => ({
      ...prev,
      name: capitalizeWords(companyData.name) || prev.name,
      industry: capitalizeWords(companyData.industry) || prev.industry,
      location: capitalizeWords(companyData.location) || prev.location,
      applicationName: capitalizeWords(companyData.applicationName) || prev.applicationName,
      applicationLink: companyData.applicationLink || prev.applicationLink,
      notes: companyData.description ? `${prev.notes}\n${capitalizeWords(companyData.description)}`.trim() : prev.notes,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Company name is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    setError(null);

    const companyData = {
      ...formData,
      notes: formData.notes.split('\n').map((note) => note.trim()).filter(Boolean),
    };

    try {
      if (isCreating) {
        await create(companyData);
        navigate('/contacts');
      } else {
        await update(id, companyData);
        navigate('/contacts');
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to ${isCreating ? 'create' : 'update'} company.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading company...</div>;

  return (
    <div className="create-contact">
      <h2>{isCreating ? 'Create New Company' : 'Edit Company'}</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <CompanyLinkedInEnrichment onEnrichmentComplete={handleEnrichmentComplete} />

        <div className="form-group">
          <label htmlFor="name">
            Company Name
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={validationErrors.name ? 'input-error' : ''}
              placeholder="Acme Corporation"
            />
          </label>
          {validationErrors.name && (
            <p className="field-error">{validationErrors.name}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="industry">
            Industry
            <input
              id="industry"
              name="industry"
              type="text"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Technology"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="location">
            Location
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="San Francisco, CA"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="applicationStatus">
            Application Status
            <select
              id="applicationStatus"
              name="applicationStatus"
              value={formData.applicationStatus}
              onChange={handleChange}
            >
              <option value="Networking">Networking</option>
              <option value="Not Applying">Not Applying</option>
              <option value="Applied">Applied</option>
              <option value="1st Round Interview">1st Round Interview</option>
              <option value="2nd Round Interview">2nd Round Interview</option>
              <option value="3rd Round Interview">3rd Round Interview</option>
              <option value="Final Round Interview">Final Round Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="applicationDueDate">
            Application Due Date
            <input
              id="applicationDueDate"
              name="applicationDueDate"
              type="date"
              value={formData.applicationDueDate}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="applicationName">
            Application Name
            <input
              id="applicationName"
              name="applicationName"
              type="text"
              value={formData.applicationName}
              onChange={handleChange}
              placeholder="e.g., Software Engineer Internship"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="applicationLink">
            Application Link
            <input
              id="applicationLink"
              name="applicationLink"
              type="text"
              value={formData.applicationLink}
              onChange={handleChange}
              placeholder="microsoft.com"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="notes">
            Notes (one per line)
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Key points about the company"
            />
          </label>
        </div>

        <button type="submit" disabled={saving}>
          {(() => {
            if (saving) return isCreating ? 'Creating...' : 'Saving...';
            return isCreating ? 'Create Company' : 'Save Changes';
          })()}
        </button>
      </form>
    </div>
  );
}

export default CreateCompany;
