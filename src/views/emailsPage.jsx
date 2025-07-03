// Cursor and ChatGPT helped write this code
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmailsSlice from '../store/emailsSlice';
import { useContactSlice } from '../store';

function EmailsPage() {
  const navigate = useNavigate();
  const { all: templates, fetchAll, setSelectedContactEmail, setDraft } = useEmailsSlice();
  const { all: contacts, fetchAll: fetchContacts } = useContactSlice();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [fieldValues, setFieldValues] = useState({});
  const [previewContent, setPreviewContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchAll(), fetchContacts()]);
        // Reset state when component mounts
        setSelectedTemplate(null);
        setSelectedContactId('');
        setFieldValues({});
        setPreviewContent('');
        setSelectedContactEmail(null);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchAll, fetchContacts, setSelectedContactEmail]);

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find((t) => t._id === selectedTemplate);
      if (template) {
        let { content } = template;
        // Use the customizableFields array from the template
        template.customizableFields.forEach((field) => {
          const value = fieldValues[field] || `[${field}]`;
          const regex = new RegExp(`\\[${field}\\]`, 'g');
          content = content.replace(regex, value);
        });
        setPreviewContent(content);
      }
    }
  }, [selectedTemplate, templates, fieldValues]);

  const handleTemplateSelect = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    // Don't reset field values here as it might clear auto-populated values
    // setFieldValues({});
  };

  const handleContactSelect = (e) => {
    const contactId = e.target.value;
    setSelectedContactId(contactId);
    const selectedContact = contacts.find((c) => c._id === contactId);
    setSelectedContactEmail(selectedContact?.email || null);

    // Debug logging
    console.log('Selected Contact:', selectedContact);
    console.log('Company Object:', selectedContact?.company);

    // Auto-populate field values based on the selected contact
    if (selectedContact) {
      const newFieldValues = {};
      const template = templates.find((t) => t._id === selectedTemplate);
      if (template) {
        template.customizableFields.forEach((field) => {
          // Map the field keys to the contact's data
          switch (field) {
            case 'FIRST_NAME':
              newFieldValues[field] = selectedContact.firstName;
              break;
            case 'LAST_NAME':
              newFieldValues[field] = selectedContact.lastName;
              break;
            case 'EMAIL':
              newFieldValues[field] = selectedContact.email;
              break;
            case 'COMPANY':
              newFieldValues[field] = selectedContact.companyId?.name || '';
              break;
            case 'POSITION':
              newFieldValues[field] = selectedContact.position || '';
              break;
            case 'RELATIONSHIP_STRENGTH':
              newFieldValues[field] = selectedContact.relationshipStrength?.toString() || '';
              break;
            case 'LINKEDIN':
              newFieldValues[field] = selectedContact.linkedin || '';
              break;
            case 'UNIVERSITY':
              newFieldValues[field] = selectedContact.university || '';
              break;
            default:
              newFieldValues[field] = '';
          }
        });
      }
      setFieldValues(newFieldValues);
    }
  };

  const handleFieldChange = (field, value) => {
    setFieldValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = (templateId) => {
    navigate(`/emails/edit/${templateId}`);
  };

  const handleSendEmail = async () => {
    if (!selectedContactId || !selectedTemplate) {
      setError('Please select both a template and a recipient');
      return;
    }

    const template = templates.find((t) => t._id === selectedTemplate);
    if (!template) {
      setError('Template not found');
      return;
    }

    const selectedContact = contacts.find((c) => c._id === selectedContactId);
    if (!selectedContact) {
      setError('Contact not found');
      return;
    }

    // Store the draft in the store
    setDraft({
      templateId: selectedTemplate,
      contactId: selectedContactId,
      fieldValues,
      previewContent,
      template: {
        ...template,
        recipientEmail: selectedContact.email,
      },
    });

    // Navigate to the send page
    navigate('/emails/send');
  };

  return (
    <div className="emails-page">
      <div className="main-content">
        <div className="emails-page__header">
          <h1>Email Templates</h1>
          <button
            type="button"
            className="create-template-button"
            onClick={() => navigate('/emails/create')}
          >
            Create New Template
          </button>
        </div>

        <div className="emails-page__content">
          <div className="emails-page__selectors">
            <div className="emails-page__template-selector">
              <label htmlFor="template">Select Template</label>
              <select
                id="template"
                value={selectedTemplate || ''}
                onChange={handleTemplateSelect}
                className="template-select"
              >
                <option value="">Select a template</option>
                {templates.map((template) => (
                  <option key={template._id} value={template._id}>
                    {template.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="emails-page__contact-selector">
              <label htmlFor="contact">Select Recipient</label>
              <select
                id="contact"
                value={selectedContactId}
                onChange={handleContactSelect}
                className="contact-select"
              >
                <option value="">Select a contact</option>
                {contacts.map((contact) => (
                  <option key={contact._id} value={contact._id}>
                    {`${contact.firstName} ${contact.lastName} (${contact.email})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {selectedTemplate && (
          <div className="emails-page__preview-container">
            <div className="emails-page__preview">
              <h2>Preview</h2>
              <div className="preview-content">{previewContent}</div>
            </div>

            <div className="emails-page__fields">
              <h2>Customize Fields</h2>
              {templates.find((t) => t._id === selectedTemplate)?.customizableFields.map((field) => (
                <div key={field} className="field-input">
                  <label htmlFor={field}>{field}</label>
                  <input
                    type="text"
                    id={field}
                    value={fieldValues[field] || ''}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
            </div>
            <div className="emails-page__actions">
              <button
                type="button"
                className="edit-button"
                onClick={() => navigate(`/emails/edit/${selectedTemplate}`)}
              >
                Edit Template
              </button>
              {selectedTemplate && selectedContactId && (
                <button
                  type="button"
                  className="review-button"
                  onClick={handleSendEmail}
                >
                  Review Email Draft
                </button>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailsPage;
