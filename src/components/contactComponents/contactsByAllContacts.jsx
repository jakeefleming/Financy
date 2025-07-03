// Cursor and ChatGPT helped write this code
import React, { useState, useEffect } from 'react';
import SearchBar from '../searchBar';
import IndividualInfoBar from './individualInfoBar';
import { useContactSlice, useCompanySlice } from '../../store';

function ContactsByAllContacts() {
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

  // Filter and sort contacts
  const filteredAndSortedContacts = contacts
    .filter((contact) => {
      const searchLower = searchTerm.toLowerCase();
      const company = companies.find((c) => c._id === contact.companyId);
      return (
        contact.firstName.toLowerCase().includes(searchLower)
        || contact.lastName.toLowerCase().includes(searchLower)
        || (company && company.name.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      // Sort by last name first, then first name
      const lastNameCompare = a.lastName.localeCompare(b.lastName);
      if (lastNameCompare !== 0) return lastNameCompare;
      return a.firstName.localeCompare(b.firstName);
    });

  return (
    <div>
      <div className="contacts-page__search">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search contacts and companies..."
        />
      </div>

      <div className="contacts-page__list">
        {filteredAndSortedContacts.map((contact) => (
          <IndividualInfoBar key={contact._id} contact={contact} />
        ))}
      </div>
    </div>
  );
}

export default ContactsByAllContacts;
