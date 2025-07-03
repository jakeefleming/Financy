// Cursor and ChatGPT helped write this code
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContactSlice, useCompanySlice } from '../../store';
import uploadImage from '../../store/s3';
import LinkedInEnrichment from './LinkedInEnrichment';
// Need useCompanySlice so can show optional companies to choose from

function CreateContact() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const isCreating = !id;

  const { fetchOne: fetchContact, create, update } = useContactSlice();
  const { all: companies, create: createCompany } = useCompanySlice();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyId: '',
    position: '',
    relationshipStrength: 5,
    tags: '',
    notes: '',
    headshotURL: '',
    university: '',
    linkedin: '',
  });

  const [loading, setLoading] = useState(!isCreating);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  // For input validation
  const [validationErrors, setValidationErrors] = useState({});
  const [enrichedCompany, setEnrichedCompany] = useState(null);

  // Load existing contact data if editing
  useEffect(() => {
    if (isCreating) return;

    // Get data if editing (not creating)
    fetchContact(id)
      .then((contact) => {
        setFormData({
          firstName: contact.firstName || '',
          lastName: contact.lastName || '',
          email: contact.email || '',
          companyId: contact.companyId || '',
          position: contact.position || '',
          relationshipStrength: contact.relationshipStrength || 5,
          tags: Array.isArray(contact.tags) ? contact.tags.join(', ') : '',
          notes: Array.isArray(contact.notes) ? contact.notes.join('\n') : '',
          headshotURL: contact.headshotURL || '',
          university: contact.university || '',
          linkedin: contact.linkedin || '',
        });
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load contact.');
      })
      .finally(() => setLoading(false));
  }, [id, fetchContact, isCreating]);

  const handleEnrichmentComplete = async (enrichedData) => {
    const { contact, company } = enrichedData;

    // Helper function to capitalize words
    const capitalizeWords = (str) => {
      if (!str) return '';
      return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    // Update form with contact data
    setFormData((prev) => ({
      ...prev,
      firstName: capitalizeWords(contact.firstName) || prev.firstName,
      lastName: capitalizeWords(contact.lastName) || prev.lastName,
      email: contact.email || prev.email,
      position: capitalizeWords(contact.position) || prev.position,
      tags: contact.tags ? contact.tags.map((tag) => capitalizeWords(tag)).join(', ') : prev.tags,
      linkedin: contact.linkedin || prev.linkedin,
      university: capitalizeWords(contact.university) || prev.university,
    }));

    // Handle company data
    if (company) {
      setEnrichedCompany({
        ...company,
        name: capitalizeWords(company.name),
        industry: capitalizeWords(company.industry),
        location: capitalizeWords(company.location),
        description: capitalizeWords(company.description),
      });
    }
  };

  const handleUseEnrichedCompany = async () => {
    if (!enrichedCompany) return;

    try {
      const newCompany = await createCompany(enrichedCompany);
      setFormData((prev) => ({
        ...prev,
        companyId: newCompany._id,
      }));
      setEnrichedCompany(null);
    } catch (err) {
      setError('Failed to create company from enriched data');
    }
  };

  const validateForm = () => {
    const errors = {};
    // Making everything required for now
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.companyId) errors.companyId = 'Company is required';
    if (!formData.position.trim()) errors.position = 'Position is required';

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // handling input typing changes
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

    // standardizing input format
    const contactData = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      notes: formData.notes.split('\n').map((note) => note.trim()).filter(Boolean),
      relationshipStrength: Number(formData.relationshipStrength),
    };

    try {
      if (isCreating) {
        await create(contactData);
        navigate('/contacts');
      } else {
        await update(id, contactData);
        navigate('/contacts');
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to ${isCreating ? 'create' : 'update'} contact.`);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        headshotURL: url,
      }));
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
    }
  };

  if (loading) return <div>Loading contact...</div>;

  return (
    <div className="create-contact">
      <h2>{isCreating ? 'Create New Contact' : 'Edit Contact'}</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <LinkedInEnrichment onEnrichmentComplete={handleEnrichmentComplete} />

        {enrichedCompany && (
          <div className="enriched-company">
            <h3>Enriched Company Data</h3>
            <p>Name: {enrichedCompany.name}</p>
            <p>Industry: {enrichedCompany.industry}</p>
            <p>Location: {enrichedCompany.location}</p>
            <button
              type="button"
              onClick={handleUseEnrichedCompany}
              className="btn btn-secondary"
            >
              Use This Company
            </button>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="headshot">
            Headshot
            <input
              id="headshot"
              name="headshot"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </label>
          {formData.headshotURL && (
            <div className="headshot-preview">
              <img src={formData.headshotURL} alt="Headshot preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="firstName">
            First Name
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className={validationErrors.firstName ? 'input-error' : ''}
              placeholder="John"
            />
          </label>
          {validationErrors.firstName && (
            <p className="field-error">{validationErrors.firstName}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">
            Last Name
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className={validationErrors.lastName ? 'input-error' : ''}
              placeholder="Doe"
            />
          </label>
          {validationErrors.lastName && (
            <p className="field-error">{validationErrors.lastName}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={validationErrors.email ? 'input-error' : ''}
              placeholder="john.doe@example.com"
            />
          </label>
          {validationErrors.email && (
            <p className="field-error">{validationErrors.email}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="companyId">
            Company
            <select
              id="companyId"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              className={validationErrors.companyId ? 'input-error' : ''}
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>
          {validationErrors.companyId && (
            <p className="field-error">{validationErrors.companyId}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="position">
            Position
            <input
              id="position"
              name="position"
              type="text"
              value={formData.position}
              onChange={handleChange}
              className={validationErrors.position ? 'input-error' : ''}
              placeholder="Software Engineer"
            />
          </label>
          {validationErrors.position && (
            <p className="field-error">{validationErrors.position}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="university">
            University
            <input
              id="university"
              name="university"
              type="text"
              value={formData.university}
              onChange={handleChange}
              className={validationErrors.university ? 'input-error' : ''}
              placeholder="Harvard University"
            />
          </label>
          {validationErrors.university && (
            <p className="field-error">{validationErrors.university}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="linkedin">
            LinkedIn URL
            <input
              id="linkedin"
              name="linkedin"
              type="text"
              value={formData.linkedin}
              onChange={handleChange}
              className={validationErrors.linkedin ? 'input-error' : ''}
              placeholder="https://linkedin.com/in/..."
            />
          </label>
          {validationErrors.linkedin && (
            <p className="field-error">{validationErrors.linkedin}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="relationshipStrength">
            Relationship Strength (0-10)
            <input
              id="relationshipStrength"
              name="relationshipStrength"
              type="number"
              min="0"
              max="10"
              value={formData.relationshipStrength}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="tags">
            Tags (comma-separated)
            <input
              id="tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              placeholder="friend, colleague, mentor"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="notes">
            Notes
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this contact..."
              rows="4"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? 'Saving...' : isCreating ? 'Create Contact' : 'Update Contact'}
        </button>
      </form>
    </div>
  );
}

export default CreateContact;
