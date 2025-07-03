// Cursor and ChatGPT helped write this code
import React from 'react';

function UpcomingEvents({ tasks, calls }) {
  const getUpcomingEvents = () => {
    const now = new Date();
    const upcomingTasks = tasks
      .filter((task) => new Date(task.dueDate) > now)
      .map((task) => ({
        ...task,
        type: 'task',
        date: task.dueDate,
      }));

    const upcomingCalls = calls
      .filter((call) => new Date(call.date) > now)
      .map((call) => ({
        ...call,
        type: 'call',
      }));

    return [...upcomingTasks, ...upcomingCalls]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5); // Show only the next 5 events
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="upcoming-events">
      {upcomingEvents.length === 0 ? (
        <p className="no-events">No upcoming events</p>
      ) : (
        upcomingEvents.map((event, index) => (
          <div key={index} className={`event-item ${event.type}`}>
            <div className="event-icon">
              {event.type === 'task' ? '📝' : '📞'}
            </div>
            <div className="event-details">
              <h4>{event.type === 'task' ? event.title : `Call with ${event.contact}`}</h4>
              <p className="event-time">{formatDate(event.date)}</p>
              {event.type === 'task' && (
                <p className="event-description">{event.description}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UpcomingEvents;
