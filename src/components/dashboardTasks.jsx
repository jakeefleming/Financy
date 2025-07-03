// Cursor and ChatGPT helped write this code
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskSlice } from '../store';

function Tasks() {
  const navigate = useNavigate();
  const { all: tasks } = useTaskSlice();

  const getUpcomingTasks = () => {
    const now = new Date();
    return tasks
      .filter((task) => !task.isCompleted && new Date(task.dueDate) > now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3); // Show only the next 3 tasks
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-default';
    }
  };

  const upcomingTasks = getUpcomingTasks();

  return (
    <div className="tasks-container">
      <h3 className="tasks-title">Upcoming Tasks</h3>
      {upcomingTasks.length === 0 ? (
        <p className="no-tasks">No upcoming tasks</p>
      ) : (
        <ul className="tasks-list">
          {upcomingTasks.map((task) => (
            <li key={task._id} className="task-item">
              <span className="task-title">{task.content}</span>
              <span className={`priority-dot ${getPriorityColor(task.priority)}`} />
              <small className="task-date">{formatDate(task.dueDate)}</small>
            </li>
          ))}
        </ul>
      )}
      <div className="tasks-actions">
        <button
          type="button"
          onClick={() => navigate('/tasks')}
          className="view-tasks-btn"
        >
          View All Tasks
        </button>
        <button
          type="button"
          onClick={() => navigate('/tasks/new')}
          className="add-task-btn"
        >
          Add New Task
        </button>
      </div>
    </div>
  );
}

export default Tasks;
