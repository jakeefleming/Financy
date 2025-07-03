// Cursor and ChatGPT helped write this code
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactsByAllContacts from '../components/contactComponents/contactsByAllContacts';
import ContactsByFirm from '../components/contactComponents/contactsByFirm';
import SearchBar from '../components/searchBar';
import NavBar from '../components/navBar';
import { useContactSlice, useCompanySlice } from '../store';

export default function ContactsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const renderTab = () => {
    switch (activeTab) {
      case 'all':
        return <ContactsByAllContacts />;
      case 'firm':
        return <ContactsByFirm />;
      default:
        return null;
    }
  };

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

  return (
    <div className="contacts-page">
      <div className="contacts-page__content">
        <div className="main-content">
          <div className="contacts-page__header">
            <h1>Contacts</h1>
            <div className="contacts-page__top-row">
              <div className="contacts-page__tabs">
                <button
                  type="button"
                  className={`contacts-page__tab ${activeTab === 'all' ? 'contacts-page__tab--active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Contacts
                </button>
                <button
                  type="button"
                  className={`contacts-page__tab ${activeTab === 'firm' ? 'contacts-page__tab--active' : ''}`}
                  onClick={() => setActiveTab('firm')}
                >
                  Contacts by Firm
                </button>
              </div>
              <div className="contacts-page__actions">
                <button
                  type="button"
                  className="contacts-page__tab"
                  onClick={() => navigate('/contacts/createContact')}
                >
                  Create Contact
                </button>
                <button
                  type="button"
                  className="contacts-page__tab"
                  onClick={() => navigate('/contacts/createCompany')}
                >
                  Create Company
                </button>
              </div>
            </div>
          </div>
          <section className="w-full">
            {renderTab()}
          </section>
        </div>
      </div>
    </div>
  );
}
