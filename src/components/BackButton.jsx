// Cursor and ChatGPT helped write this code
import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    const previousLocation = sessionStorage.getItem('previousLocation');
    console.log('Previous location:', previousLocation); // Debug log

    if (previousLocation) {
      // Clear the stored location after using it
      sessionStorage.removeItem('previousLocation');
      navigate(previousLocation);
    } else {
      // Fallback to default navigation if no previous location is stored
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="back-button"
    >
      ←
    </button>
  );
}

export default BackButton;
