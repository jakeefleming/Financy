// Cursor and ChatGPT helped write this code
import React, { useState } from 'react';

function Calendar({ tasks, calls, companies }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDay = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayTasks = tasks.filter((task) => new Date(task.dueDate).toDateString() === date.toDateString());
    const dayCalls = calls.filter((call) => new Date(call.date).toDateString() === date.toDateString());
    const dayApplications = companies.filter((company) => company.applicationDueDate && new Date(company.applicationDueDate).toDateString() === date.toDateString());
    return {
      tasks: dayTasks,
      calls: dayCalls,
      applications: dayApplications,
    };
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDay(day);
      days.push(
        <button
          key={day}
          type="button"
          className="calendar-day"
          onClick={() => handleDayClick(day)}
        >
          <span className="day-number">{day}</span>
          {(events.tasks.length > 0 || events.calls.length > 0 || events.applications.length > 0) && (
            <div className="day-events">
              {events.calls.map((call, index) => (
                <div key={`call-${index}`} className="event-dot call" title={`Call: ${call.summary}`} />
              ))}
              {events.tasks.map((task, index) => (
                <div key={`task-${index}`} className="event-dot task" title={`Task: ${task.content}`} />
              ))}
              {events.applications.map((app, index) => (
                <div key={`application-${index}`} className="event-dot application" title={`Application: ${app.name}`} />
              ))}
            </div>
          )}
        </button>,
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button type="button" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
          ←
        </button>
        <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <button type="button" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
          →
        </button>
      </div>
      <div className="calendar-grid">
        <div className="weekday">Sun</div>
        <div className="weekday">Mon</div>
        <div className="weekday">Tue</div>
        <div className="weekday">Wed</div>
        <div className="weekday">Thu</div>
        <div className="weekday">Fri</div>
        <div className="weekday">Sat</div>
        {renderCalendarDays()}
      </div>

      {showModal && selectedDay && (
        <div className="calendar-modal">
          <div className="calendar-modal-content">
            <div className="calendar-modal-header">
              <h3>{monthNames[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()}</h3>
              <button type="button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="calendar-modal-body">
              {(() => {
                const events = getEventsForDay(selectedDay);
                return (
                  <>
                    {events.tasks.length > 0 && (
                      <div className="event-section">
                        <h4>Tasks</h4>
                        {events.tasks.map((task, index) => (
                          <div key={`task-${index}`} className="event-item">
                            <span className="event-title">{task.content}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {events.calls.length > 0 && (
                      <div className="event-section">
                        <h4>Calls</h4>
                        {events.calls.map((call, index) => (
                          <div key={`call-${index}`} className="event-item">
                            <span className="event-title">{call.summary}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {events.applications.length > 0 && (
                      <div className="event-section">
                        <h4>Applications Due</h4>
                        {events.applications.map((app, index) => (
                          <div key={`app-${index}`} className="event-item">
                            <span className="event-title">{app.applicationName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {events.tasks.length === 0 && events.calls.length === 0 && events.applications.length === 0 && (
                      <p className="no-events">No events for this day</p>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
