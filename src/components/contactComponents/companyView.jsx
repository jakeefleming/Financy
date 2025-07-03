// Cursor and ChatGPT helped write this code
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCompanySlice, useContactSlice } from '../../store';
import BackButton from '../BackButton';

function CompanyView() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const { fetchOne: fetchCompany, remove } = useCompanySlice();
  const { all: contacts, fetchAll: fetchContacts } = useContactSlice();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [companyData] = await Promise.all([
          fetchCompany(id),
          fetchContacts(), // Fetch contacts when loading the company
        ]);
        setCompany(companyData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load company details.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, fetchCompany, fetchContacts]);

  const handleDelete = async () => {
    // Ensure we have the latest contacts data
    await fetchContacts();

    // Check if there are any contacts associated with this company
    const associatedContacts = contacts.filter((contact) => {
      const contactCompanyId = typeof contact.companyId === 'object' ? contact.companyId._id : contact.companyId;
      return contactCompanyId === id;
    });

    if (associatedContacts.length > 0) {
      setError(`Cannot delete company. There are ${associatedContacts.length} contacts still associated with this company. Please remove or reassign these contacts first.`);
      setTimeout(() => {
        navigate('/contacts');
      }, 2000); // Give user 2 seconds to read the message
      return;
    }

    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }

    setDeleting(true);
    try {
      await remove(id);
      navigate('/contacts');
    } catch (err) {
      console.error('Error deleting company:', err);
      setError('Failed to delete company.');
      setDeleting(false);
    }
  };

  if (loading) return <div className="loading-message">Loading company...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!company) return <div className="error-message">Company not found</div>;

  return (
    <div className="individual-view">
      <div className="individual-view__header">
        <div className="individual-view__header-left">
          <BackButton />
          <h1>{company.name}</h1>
        </div>
        <div className="individual-view__actions">
          <button
            type="button"
            className="individual-view__edit-button"
            onClick={() => navigate(`/contacts/createCompany?id=${id}`)}
          >
            Edit Company
          </button>
          <button
            type="button"
            className="individual-view__delete-button"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Company'}
          </button>
        </div>
      </div>

      <div className="individual-view__content">
        <div className="individual-view__section">
          <h2>Company Information</h2>
          <div className="individual-view__info-grid">
            <div className="individual-view__info-item">
              <span className="label">Industry</span>
              <span className="value">{company.industry}</span>
            </div>
            {company.location && (
              <div className="individual-view__info-item">
                <span className="label">Location</span>
                <span className="value">{company.location}</span>
              </div>
            )}
            <div className="individual-view__info-item">
              <span className="label">Application Status</span>
              <span className="value">{company.applicationStatus || 'Not Applied'}</span>
            </div>
            {company.applicationDueDate && (
              <div className="individual-view__info-item">
                <span className="label">Application Due Date</span>
                <span className="value">{new Date(company.applicationDueDate).toLocaleDateString()}</span>
              </div>
            )}
            {company.applicationName && (
              <div className="individual-view__info-item">
                <span className="label">Application Name</span>
                <span className="value">{company.applicationName}</span>
              </div>
            )}
            {company.applicationLink && (
              <div className="individual-view__info-item">
                <span className="label">Application Link</span>
                <a
                  href={company.applicationLink.startsWith('http') ? company.applicationLink : `https://${company.applicationLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="value link"
                >
                  {company.applicationLink}
                </a>
              </div>
            )}
          </div>
        </div>

        {company.notes && company.notes.length > 0 && (
          <div className="individual-view__section">
            <h2>Notes</h2>
            <div className="individual-view__notes">
              {company.notes.map((note, index) => (
                <p key={index} className="note">
                  {note}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyView;
