// Cursor and ChatGPT helped write this code
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTaskSlice, useContactSlice, useCompanySlice } from '../store';
import SearchBar from './searchBar';
import '../style.scss';

function TaskEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addTask, updateTask, fetchTask, current: currentTask, deleteTask } = useTaskSlice();
  const { all: contacts, fetchAll: fetchContacts } = useContactSlice();
  const { all: companies, fetchAll: fetchCompanies } = useCompanySlice();

  const [formData, setFormData] = useState({
    content: '',
    isCompleted: false,
    dueDate: '',
    tags: [],
    contactId: '',
    companyId: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [companySearchTerm, setCompanySearchTerm] = useState('');

  const { id: taskId } = useParams();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch contacts and companies
        await Promise.all([fetchContacts(), fetchCompanies()]);

        // If editing, fetch task data
        if (taskId) {
          await fetchTask(taskId);
        }
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [taskId, fetchTask, fetchContacts, fetchCompanies]);

  // Update form data when currentTask changes
  useEffect(() => {
    if (currentTask && taskId) {
      setFormData({
        content: currentTask.content || '',
        isCompleted: currentTask.isCompleted || false,
        dueDate: currentTask.dueDate ? new Date(currentTask.dueDate).toISOString().split('T')[0] : '',
        tags: currentTask.tags || [],
        contactId: currentTask.contactId?._id || currentTask.contactId || '',
        companyId: currentTask.companyId?._id || currentTask.companyId || '',
      });
    }
  }, [currentTask, taskId]);

  const validateForm = () => {
    const errors = {};
    if (!formData.content.trim()) {
      errors.content = 'Task content is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError(null);

    try {
      // Adjust the date to account for timezone
      const adjustedFormData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(`${formData.dueDate}T12:00:00`).toISOString() : null,
      };

      if (taskId) {
        await updateTask(taskId, adjustedFormData);
      } else {
        await addTask(adjustedFormData);
      }
      navigate('/tasks');
    } catch (err) {
      setError('Failed to save task. Please try again.');
      console.error('Error saving task:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'contactId') {
      // When contact is selected, find the contact and set its company
      const selectedContact = contacts.find((contact) => contact._id === value);
      console.log('Selected contact:', selectedContact);

      setFormData((prev) => {
        const newData = {
          ...prev,
          contactId: value,
          companyId: selectedContact?.companyId?._id || selectedContact?.companyId || '',
        };
        console.log('New form data:', newData);
        return newData;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleTagChange = (e) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim());
    setFormData((prev) => ({ ...prev, tags }));
  };

  const filteredContacts = contacts.filter(
    (contact) => contact.firstName.toLowerCase().includes(contactSearchTerm.toLowerCase())
      || contact.lastName.toLowerCase().includes(contactSearchTerm.toLowerCase()),
  );

  const filteredCompanies = companies.filter(
    (company) => company.name.toLowerCase().includes(companySearchTerm.toLowerCase()),
  );

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await deleteTask(taskId);
      navigate('/tasks');
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <h2>Loading...</h2>
          <p>Please wait while we load the task data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-editor">
      <h1>{taskId ? 'Edit Task' : 'Create New Task'}</h1>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Content</label>
          <textarea
            id="task-content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className={validationErrors.content ? 'input-error' : ''}
          />
          {validationErrors.content && (
            <div className="field-error">{validationErrors.content}</div>
          )}
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            id="task-due-date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              id="task-completed"
              name="isCompleted"
              checked={formData.isCompleted}
              onChange={handleInputChange}
            />
            Completed
          </label>
        </div>

        <div className="form-group">
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            id="task-tags"
            name="tags"
            value={formData.tags.join(', ')}
            onChange={handleTagChange}
          />
        </div>

        <div className="form-group">
          <label>Related Contact</label>
          <SearchBar
            id="contact-search"
            onSearch={setContactSearchTerm}
            placeholder="Search contacts..."
          />
          <select
            id="task-contact"
            name="contactId"
            value={formData.contactId}
            onChange={handleInputChange}
            className="mt-2"
          >
            <option value="">Select a contact</option>
            {filteredContacts.map((contact) => (
              <option key={contact._id} value={contact._id}>
                {`${contact.firstName} ${contact.lastName}`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Related Company</label>
          <SearchBar
            id="company-search"
            onSearch={setCompanySearchTerm}
            placeholder="Search companies..."
          />
          <select
            id="task-company"
            name="companyId"
            value={formData.companyId}
            onChange={handleInputChange}
            className="mt-2"
          >
            <option value="">Select a company</option>
            {filteredCompanies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : taskId ? 'Update Task' : 'Create Task'}
          </button>
          {taskId && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="delete-button"
            >
              Delete Task
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TaskEditor;
