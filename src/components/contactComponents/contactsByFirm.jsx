// Cursor and ChatGPT helped write this code
import React, { useState, useEffect } from 'react';
import SearchBar from '../searchBar';
import IndividualInfoBar from './individualInfoBar';
import CompanyInfoBar from './companyInfoBar';
import { useContactSlice, useCompanySlice } from '../../store';

function ContactsByFirm() {
  const [searchTerm, setSearchTerm] = useState('');
  const { all: contacts, fetchAll: fetchContacts } = useContactSlice();
  const { all: companies, fetchAll: fetchCompanies } = useCompanySlice();

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching contacts and companies...');
        await fetchContacts();
        await fetchCompanies();
        console.log('Contacts:', contacts);
        console.log('Companies:', companies);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [fetchContacts, fetchCompanies]);

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  // Filter companies based on search term
  const filteredCompanies = companies
    .filter((company) => company.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Group and sort contacts by company
  const contactsByCompany = contacts.reduce((acc, contact) => {
    const { companyId } = contact;
    if (!acc[companyId]) {
      acc[companyId] = [];
    }
    acc[companyId].push(contact);
    return acc;
  }, {});

  // Sort contacts within each company
  Object.keys(contactsByCompany).forEach((companyId) => {
    contactsByCompany[companyId].sort((a, b) => {
      const lastNameCompare = a.lastName.localeCompare(b.lastName);
      if (lastNameCompare !== 0) return lastNameCompare;
      return a.firstName.localeCompare(b.firstName);
    });
  });

  return (
    <div>
      <div className="contacts-page__search">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search companies..."
        />
      </div>

      <div className="contacts-page__list">
        {filteredCompanies.map((company) => (
          <div key={company._id} className="company-group">
            <CompanyInfoBar company={company} />
            <div className="company-contacts" style={{ marginLeft: '2rem' }}>
              {contactsByCompany[company._id]?.map((contact) => (
                <IndividualInfoBar key={contact._id} contact={contact} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactsByFirm;
