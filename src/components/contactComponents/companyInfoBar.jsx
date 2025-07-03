// Cursor and ChatGPT helped write this code
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContactSlice } from '../../store';
import '../../style.scss';

function CompanyInfoBar({ company }) {
  const navigate = useNavigate();
  const { all: contacts } = useContactSlice();
  const [companyContacts, setCompanyContacts] = useState([]);

  const {
    _id,
    name,
    industry,
    location,
  } = company;

  // Get initials from company name
  const getInitials = (companyName) => {
    if (!companyName) return '';
    return companyName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get all contacts associated with this company
  const getCompanyContacts = () => {
    if (!contacts || !_id) return [];
    const associatedContacts = contacts.filter((contact) => {
      // Handle both string and object companyId
      const contactCompanyId = typeof contact.companyId === 'object'
        ? contact.companyId._id
        : contact.companyId;
      return contactCompanyId === _id;
    });
    // Sort contacts by last name, then first name
    return associatedContacts.sort((a, b) => {
      const lastNameCompare = a.lastName.localeCompare(b.lastName);
      if (lastNameCompare !== 0) return lastNameCompare;
      return a.firstName.localeCompare(b.firstName);
    });
  };

  // Update company contacts whenever contacts or company ID changes
  useEffect(() => {
    const filteredContacts = getCompanyContacts();
    setCompanyContacts(filteredContacts);
  }, [contacts, _id]);

  const handleViewDetails = () => {
    navigate(`/contacts/company?id=${_id}`);
  };

  const handleContactClick = (contactId) => {
    navigate(`/contacts/contact?id=${contactId}`);
  };

  return (
    <div className="company-section">
      <div className="company-info-bar">
        <div className="company-info-bar__left">
          <div className="company-info-bar__initials">
            {getInitials(name)}
          </div>

          <div className="company-info-bar__info">
            <h2>{name}</h2>
            <div className="company-info-bar__details">
              <div className="company-info-bar__detail">
                <span className="company-info-bar__label">Industry:</span>
                <span className="company-info-bar__value">{industry}</span>
              </div>
              {location && (
                <div className="company-info-bar__detail">
                  <span className="company-info-bar__label">Location:</span>
                  <span className="company-info-bar__value">{location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="company-info-bar__actions">
          <button
            type="button"
            className="company-info-bar__button"
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div>
      </div>

      <div className="company-contacts-section">
        <h3 className="company-contacts-section__title">Company Contacts</h3>
        {companyContacts.length > 0 ? (
          <div className="contacts-list">
            {companyContacts.map((contact) => (
              <div
                key={contact._id}
                className="contact-item"
                onClick={() => handleContactClick(contact._id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleContactClick(contact._id);
                  }
                }}
              >
                <span className="contact-name">{`${contact.firstName} ${contact.lastName}`}</span>
                {contact.position && <span className="contact-position">{contact.position}</span>}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-contacts">No contacts associated with this company</p>
        )}
      </div>
    </div>
  );
}

export default CompanyInfoBar;
