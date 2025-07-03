// Cursor and ChatGPT helped write this code
import React, { useEffect } from 'react';
import { useTaskSlice, useContactSlice, useCompanySlice, useCallSlice } from '../store';
import DashboardOverview from '../components/dashboardOverview';
import Tasks from '../components/dashboardTasks';
import Calendar from '../components/Calendar';
import StatsOverview from '../components/StatsOverview';
import UpcomingEvents from '../components/UpcomingEvents';

function Dashboard() {
  const { all: tasks, fetchAll: fetchTasks } = useTaskSlice();
  const { all: contacts, fetchAll: fetchContacts } = useContactSlice();
  const { all: companies, fetchAll: fetchCompanies } = useCompanySlice();
  const { all: calls, fetchAll: fetchCalls } = useCallSlice();

  useEffect(() => {
    fetchTasks();
    fetchContacts();
    fetchCompanies();
    fetchCalls();
  }, [fetchTasks, fetchContacts, fetchCompanies, fetchCalls]);

  // Calculate statistics
  const pendingFollowUps = tasks.filter((task) => !task.isCompleted).length;
  const upcomingCalls = calls.filter((call) => !call.isCompleted).length;
  const activeApplications = companies.filter((company) => company.applicationStatus && company.applicationStatus !== 'Not Applying').length;
  const totalContacts = contacts.length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Networking Dashboard</h1>
        <p>Track your progress and stay organized</p>
      </div>

      <StatsOverview
        pendingFollowUps={pendingFollowUps}
        upcomingCalls={upcomingCalls}
        activeApplications={activeApplications}
        totalContacts={totalContacts}
      />

      <div className="dashboard-grid">
        <div className="main-content">
          <div className="card">
            <DashboardOverview />
          </div>
        </div>

        <div className="sidebar">
          <div className="card">
            <Tasks />
          </div>
          <div className="card">
            <h2>Calendar</h2>
            <Calendar tasks={tasks} calls={calls} companies={companies} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
