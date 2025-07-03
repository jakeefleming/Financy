// Cursor and ChatGPT helped write this code
import React, { useState } from 'react';
import { useCompanySlice } from '../../store';

function CompanyLinkedInEnrichment({ onEnrichmentComplete }) {
  const { enrichCompany } = useCompanySlice();
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEnrich = async () => {
    if (!linkedinUrl) {
      setError('Please enter a LinkedIn URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Attempting to enrich company with URL:', linkedinUrl);
      const enrichedData = await enrichCompany(linkedinUrl);
      console.log('Enriched data received:', enrichedData);
      onEnrichmentComplete(enrichedData);
      setLinkedinUrl('');
    } catch (err) {
      console.error('Error enriching company:', err);
      if (err.response?.status === 500) {
        setError('Company data unavailable from LinkedIn');
      } else {
        setError(err.message || 'Failed to enrich company data');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="linkedin-enrichment">
      <div className="form-group">
        <label htmlFor="linkedinUrl">
          LinkedIn Company URL
          <input
            id="linkedinUrl"
            type="text"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://www.linkedin.com/company/..."
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

export default CompanyLinkedInEnrichment;
