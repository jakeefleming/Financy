// Cursor and ChatGPT helped write this code
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style.scss';
import { useContactSlice } from '../../store';

const formatLastContacted = (date) => {
  if (!date) return 'Never';
  return new Date(date).toLocaleDateString();
};

function IndividualInfoBar({ contact }) {
  const navigate = useNavigate();
  const {
    _id,
    firstName,
    lastName,
    email,
    position,
    linkedin,
    university,
    lastContactDate,
    relationshipStrength,
    notes,
    headshotURL,
  } = contact;

  const getInitials = (first, last) => {
    if (!first || !last) return '';
    return `${first[0]}${last[0]}`.toUpperCase();
  };

  const handleViewDetails = () => {
    navigate(`/contacts/contact?id=${_id}`);
  };

  return (
    <div className="individual-info-bar">
      <div className="individual-info-bar__content">
        <div className="individual-info-bar__header">
          <div className="individual-info-bar__image">
            {headshotURL ? (
              <img
                src={headshotURL}
                alt={`${firstName} ${lastName}`}
                className="individual-info-bar__headshot"
              />
            ) : (
              <div className="individual-info-bar__initials">
                {getInitials(firstName, lastName)}
              </div>
            )}
          </div>
          <div className="individual-info-bar__info">
            <h3 className="individual-info-bar__name">{`${firstName} ${lastName}`}</h3>
            <span className="individual-info-bar__position">{position}</span>
          </div>
        </div>
        <div className="individual-info-bar__details">
          <div className="individual-info-bar__detail">
            <span className="individual-info-bar__label">Email:</span>
            <span className="individual-info-bar__value">{email}</span>
          </div>
          {linkedin && (
            <div className="individual-info-bar__detail">
              <span className="individual-info-bar__label">LinkedIn:</span>
              <span className="individual-info-bar__value">{linkedin}</span>
            </div>
          )}
          {university && (
            <div className="individual-info-bar__detail">
              <span className="individual-info-bar__label">University:</span>
              <span className="individual-info-bar__value">{university}</span>
            </div>
          )}
          <div className="individual-info-bar__detail">
            <span className="individual-info-bar__label">Last Contacted:</span>
            <span className="individual-info-bar__value">{formatLastContacted(lastContactDate)}</span>
          </div>
          <div className="individual-info-bar__detail">
            <span className="individual-info-bar__label">Relationship Strength:</span>
            <span className="individual-info-bar__value">{relationshipStrength}/10</span>
          </div>
        </div>
      </div>
      <div className="individual-info-bar__actions">
        <button
          type="button"
          className="individual-info-bar__button"
          onClick={handleViewDetails}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default IndividualInfoBar;
