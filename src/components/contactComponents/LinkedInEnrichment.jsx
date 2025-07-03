// Cursor and ChatGPT helped write this code
import React, { useState } from 'react';
import { useContactSlice, useCompanySlice } from '../../store';

function LinkedInEnrichment({ onEnrichmentComplete }) {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { enrichContact } = useContactSlice();
  const { enrichCompany } = useCompanySlice();

  const handleEnrich = async () => {
    if (!linkedinUrl) {
      setError('Please enter a LinkedIn URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const enrichedData = await enrichContact(linkedinUrl);
      onEnrichmentComplete(enrichedData);
    } catch (err) {
      if (err.response?.status === 500) {
        setError('Contact data unavailable from LinkedIn');
      } else {
        setError(err.message || 'Failed to enrich contact data');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="linkedin-enrichment">
      <div className="form-group">
        <label htmlFor="linkedinUrl">
          LinkedIn Profile URL
          <input
            id="linkedinUrl"
            type="text"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://www.linkedin.com/in/..."
            className={error ? 'input-error' : ''}
          />
        </label>
        {error && <p className="field-error">{error}</p>}
      </div>
      <button
        type="button"
        onClick={handleEnrich}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Enriching...' : 'Enrich from LinkedIn'}
      </button>
    </div>
  );
}

export default LinkedInEnrichment;
