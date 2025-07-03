// Cursor and ChatGPT helped write this code
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskSlice, useContactSlice, useCompanySlice } from '../store';

function DashboardOverview() {
  const { all: tasks } = useTaskSlice();
  const { all: companies } = useCompanySlice();
  const { all: contacts } = useContactSlice();
  const navigate = useNavigate();

  const getCompanyStatus = (company) => {
    switch (company.applicationStatus) {
      case 'Networking':
        return { label: 'Networking', color: '#4299e1', progress: 0 };
      case 'Not Applying':
        return { label: 'Not Applying', color: '#a0aec0', progress: 0 };
      case 'Applied':
        return { label: 'Applied', color: '#48bb78', progress: 14 };
      case '1st Round Interview':
        return { label: '1st Round Interview', color: '#805ad5', progress: 28 };
      case '2nd Round Interview':
        return { label: '2nd Round Interview', color: '#805ad5', progress: 42 };
      case '3rd Round Interview':
        return { label: '3rd Round Interview', color: '#805ad5', progress: 56 };
      case 'Final Round Interview':
        return { label: 'Final Round Interview', color: '#805ad5', progress: 70 };
      case 'Offer':
        return { label: 'Offer', color: '#38a169', progress: 85 };
      case 'Rejected':
        return { label: 'Rejected', color: '#e53e3e', progress: 100 };
      default:
        return { label: 'Networking', color: '#4299e1', progress: 0 };
    }
  };

  // From IndividualView
  const getCompanyName = (companyId) => {
    if (!companyId) return 'No Company';
    const { name } = companyId;
    return name ?? 'Unknown Company';
  };

  const getNetworkGrowth = (companyId) => {
    if (!companyId) return 0;
    // const { name } = companyId;
    const company = companies.find((c) => c._id.toString() === companyId);
    const { name: companyName } = company;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    console.log(companyName);
    return contacts.filter((contact) => getCompanyName(contact.companyId) === companyName
      && new Date(contact.createdAt) > oneWeekAgo).length;
  };

  // Filter out companies with "Not Applying" status
  const activeCompanies = companies.filter((company) => company.applicationStatus !== 'Not Applying');

  // Sort companies by progress
  const sortedCompanies = [...activeCompanies].sort((a, b) => {
    const statusA = getCompanyStatus(a);
    const statusB = getCompanyStatus(b);
    return statusB.progress - statusA.progress; // Sort in descending order
  });

  return (
    <div className="dashboard-overview">
      <h2>My Applications</h2>
      <div className="applications-grid">
        <div className="country-section">
          <div className="applications-list">
            {sortedCompanies.map((company) => {
              const status = getCompanyStatus(company);
              const networkGrowth = getNetworkGrowth(company._id);

              return (
                <div
                  key={company._id}
                  className="application-row"
                  onClick={() => navigate(`/contacts/company?id=${company._id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(`/contacts/company?id=${company._id}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                  aria-label={`View details for ${company.name}`}
                >
                  <div className="application-header">
                    <div className="application-title">
                      <span className="company-name">{company.name}</span>
                      <span className="application-name">{company.applicationName || 'Unnamed Application'}</span>
                    </div>
                    <span className="application-due-date">
                      {company.applicationDueDate ? `Due: ${new Date(company.applicationDueDate).toLocaleDateString()}` : 'No due date'}
                    </span>
                  </div>
                  <div className="application-details">
                    <div className="application-status">
                      <span className="status-badge" style={{ backgroundColor: status.color }}>
                        {status.label}
                      </span>
                    </div>
                    <div className="application-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-bar__fill"
                          style={{
                            width: `${status.progress}%`,
                            backgroundColor: status.color,
                          }}
                        />
                      </div>
                    </div>
                    <div className="network-growth">
                      <span className="growth-label">New Contacts<br />(Last 7 days):</span>
                      <span className="growth-value">{networkGrowth}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
