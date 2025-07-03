// Cursor and ChatGPT helped write this code
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTaskSlice, useContactSlice, useCompanySlice } from '../store';
import SearchBar from '../components/searchBar';
import '../style.scss';

function TasksPage() {
  const navigate = useNavigate();
  const { all: tasks, fetchAll: fetchTasks, updateTask } = useTaskSlice();
  const { all: contacts, fetchAll: fetchContacts } = useContactSlice();
  const { all: companies, fetchAll: fetchCompanies } = useCompanySlice();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'pending'
  const [updatingTask, setUpdatingTask] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchTasks(), fetchContacts(), fetchCompanies()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [fetchTasks, fetchContacts, fetchCompanies]);

  const getContactInfo = (contactId) => {
    if (!contactId) return null;
    if (typeof contactId === 'object' && contactId.firstName) {
      return `${contactId.firstName} ${contactId.lastName}`;
    }
    const contact = contacts.find((c) => c._id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact';
  };

  const getCompanyInfo = (companyId) => {
    if (!companyId) return null;
    if (typeof companyId === 'object' && companyId.name) {
      return companyId.name;
    }
    const company = companies.find((c) => c._id === companyId);
    return company ? company.name : 'Unknown Company';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isOverdue = (dueDate, isCompleted) => {
    if (!dueDate || isCompleted) return false;
    return new Date(dueDate) < new Date();
  };

  // Filter tasks based on search term and status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.content.toLowerCase().includes(searchTerm.toLowerCase())
      || (task.contactId && getContactInfo(task.contactId).toLowerCase().includes(searchTerm.toLowerCase()))
      || (task.companyId && getCompanyInfo(task.companyId).toLowerCase().includes(searchTerm.toLowerCase()))
      || task.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all'
      || (filterStatus === 'completed' && task.isCompleted)
      || (filterStatus === 'pending' && !task.isCompleted);

    return matchesSearch && matchesStatus;
  });

  const handleToggleComplete = async (task, e) => {
    e.preventDefault(); // Prevent navigation when clicking the checkbox
    e.stopPropagation(); // Prevent event bubbling

    setUpdatingTask(task._id);
    try {
      await updateTask(task._id, {
        ...task,
        isCompleted: !task.isCompleted,
      });
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setUpdatingTask(null);
    }
  };

  return (
    <div className="tasks-page">
      <div className="main-content">
        <div className="tasks-page__header">
          <h1>Tasks</h1>
          <div className="tasks-page__controls">
            <div className="tasks-page__search">
              <SearchBar
                onSearch={setSearchTerm}
                placeholder="Search tasks, contacts, or companies..."
              />
            </div>
            <div className="tasks-page__filters">
              <button
                type="button"
                className={`tasks-page__filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`tasks-page__filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pending')}
              >
                Pending
              </button>
              <button
                type="button"
                className={`tasks-page__filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate('/tasks/new')}
              className="tasks-page__create-btn"
            >
              Create New Task
            </button>
          </div>
        </div>

        <div className="tasks-page__list">
          {filteredTasks.length === 0 ? (
            <div className="tasks-page__empty">
              <p>No tasks found</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-card__header">
                  <div className="task-card__status">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={(e) => handleToggleComplete(task, e)}
                      disabled={updatingTask === task._id}
                      className="task-card__checkbox"
                    />
                  </div>
                  <Link to={`/tasks/${task._id}`} className="task-card__content">
                    <h2 className={task.isCompleted ? 'completed' : ''}>{task.content}</h2>

                    <div className="task-card__details">
                      <p className={`due-date ${isOverdue(task.dueDate, task.isCompleted) ? 'overdue' : ''}`}>
                        Due: {formatDate(task.dueDate)}
                      </p>
                      {task.contactId && getContactInfo(task.contactId) !== 'Unknown Contact' && (
                      <p className="related-contact">
                        Contact: {getContactInfo(task.contactId)}
                      </p>
                      )}
                      {task.companyId && getCompanyInfo(task.companyId) !== 'Unknown Company' && (
                      <p className="related-company">
                        Company: {getCompanyInfo(task.companyId)}
                      </p>
                      )}
                      {task.tags && task.tags.length > 0 && (
                      <div className="task-card__tags">
                        {task.tags.map((tag) => (
                          <span key={tag} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                      )}
                    </div>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
