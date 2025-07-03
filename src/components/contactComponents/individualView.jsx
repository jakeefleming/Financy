// Cursor and ChatGPT helped write this code
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContactSlice, useCompanySlice, useTaskSlice } from '../../store';
import BackButton from '../BackButton';

function IndividualView() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const { fetchOne: fetchContact, remove } = useContactSlice();
  const { all: companies } = useCompanySlice();
  const { all: tasks, fetchAll: fetchTasks } = useTaskSlice();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError('No contact ID provided');
        setLoading(false);
        return;
      }

      try {
        const [contactData] = await Promise.all([
          fetchContact(id),
          fetchTasks(),
        ]);

        if (!contactData) {
          throw new Error('Contact not found');
        }
        setContact(contactData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Failed to load contact details.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, fetchContact, fetchTasks]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    setDeleting(true);
    try {
      await remove(id);
      navigate('/contacts');
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact.');
      setDeleting(false);
    }
  };

  const getCompanyName = (companyId) => {
    if (!companyId) return 'No Company';
    // console.log(companyId);
    const { name } = companyId;
    // const company = companies.find((c) => c._id.toString() === companyId);
    // console.log(company);
    return name ?? 'Unknown Company';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate, isCompleted) => {
    if (!dueDate || isCompleted) return false;
    return new Date(dueDate) < new Date();
  };

  // Filter tasks for this contact
  const contactTasks = tasks.filter((task) => {
    if (!task.contactId) return false;

    // Handle both string IDs and populated contact objects
    const taskContactId = typeof task.contactId === 'object' ? task.contactId._id : task.contactId;
    return taskContactId === id;
  });

  if (loading) return <div className="loading-message">Loading contact...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!contact) return <div className="error-message">Contact not found</div>;

  return (
    <div className="individual-view">
      <div className="individual-view__header">
        <div className="individual-view__header-left">
          <BackButton />
          <h1>{`${contact.firstName} ${contact.lastName}`}</h1>
        </div>
        <div className="individual-view__actions">
          <button
            type="button"
            className="individual-view__edit-button"
            onClick={() => navigate(`/contacts/createContact?id=${id}`)}
          >
            Edit Contact
          </button>
          <button
            type="button"
            className="individual-view__delete-button"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Contact'}
          </button>
        </div>
      </div>

      <div className="individual-view__content">
        <div className="individual-view__section">
          <h2>Contact Information</h2>
          <div className="individual-view__info-grid">
            {contact.headshotURL && (
              <div className="individual-view__headshot">
                <img src={contact.headshotURL} alt={`${contact.firstName} ${contact.lastName}`} />
              </div>
            )}
            <div className="individual-view__info-item">
              <span className="label">Email</span>
              <span className="value">{contact.email}</span>
            </div>
            <div className="individual-view__info-item">
              <span className="label">Company</span>
              <span className="value">
                {contact.companyId ? (
                  <button
                    type="button"
                    className="company-link"
                    onClick={() => navigate(`/contacts/company?id=${contact.companyId._id}`)}
                  >
                    {getCompanyName(contact.companyId)}
                  </button>
                ) : (
                  'No Company'
                )}
              </span>
            </div>
            <div className="individual-view__info-item">
              <span className="label">Position</span>
              <span className="value">{contact.position}</span>
            </div>
            <div className="individual-view__info-item">
              <span className="label">Relationship Strength</span>
              <span className="value">{contact.relationshipStrength}/10</span>
            </div>
            {contact.linkedin && (
              <div className="individual-view__info-item">
                <span className="label">LinkedIn</span>
                <span className="value">{contact.linkedin}</span>
              </div>
            )}
            {contact.university && (
              <div className="individual-view__info-item">
                <span className="label">University</span>
                <span className="value">{contact.university}</span>
              </div>
            )}
            <div className="individual-view__info-item">
              <span className="label">Last Contacted</span>
              <span className="value">
                {contact.lastContactDate
                  ? new Date(contact.lastContactDate).toLocaleDateString()
                  : 'Never'}
              </span>
            </div>
          </div>
        </div>

        {contact.tags && contact.tags.length > 0 && (
          <div className="individual-view__section">
            <h2>Tags</h2>
            <div className="individual-view__tags">
              {contact.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {contact.notes && contact.notes.length > 0 && (
          <div className="individual-view__section">
            <h2>Notes</h2>
            <div className="individual-view__notes">
              {contact.notes.map((note, index) => (
                <p key={index} className="note">
                  {note}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="individual-view__section">
          <h2>Associated Tasks</h2>
          {contactTasks.length === 0 ? (
            <p>No tasks associated with this contact</p>
          ) : (
            <div className="tasks-list">
              {contactTasks.map((task) => (
                <button
                  key={task._id}
                  type="button"
                  className={`task-item ${task.isCompleted ? 'completed' : ''}`}
                  onClick={() => navigate(`/tasks/${task._id}`)}
                >
                  <div className="task-item__header">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      readOnly
                      className="task-item__checkbox"
                    />
                    <h3>{task.content}</h3>
                  </div>
                  <div className="task-item__details">
                    <p className={`due-date ${isOverdue(task.dueDate, task.isCompleted) ? 'overdue' : ''}`}>
                      Due: {formatDate(task.dueDate)}
                    </p>
                    {task.tags && task.tags.length > 0 && (
                      <div className="task-item__tags">
                        {task.tags.map((tag) => (
                          <span key={tag} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            className="create-task-button"
            onClick={() => navigate(`/tasks/new?contactId=${id}`)}
          >
            Create New Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default IndividualView;
