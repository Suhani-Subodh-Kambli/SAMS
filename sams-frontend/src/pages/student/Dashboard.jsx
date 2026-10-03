import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentActivities } from '../../api/activityApi';
import StatusBadge from '../../components/StatusBadge';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getStudentActivities().then(setActivities);
  }, []);

  const verified = activities.filter(a => a.status === 'VERIFIED').length;
  const pending = activities.filter(a => a.status === 'PENDING').length;
  const rejected = activities.filter(a => a.status === 'REJECTED').length;

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Good morning, {user?.name} 👋</h1>
        <p>Here's an overview of your student activities.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card card">
          <h3>Total Activities</h3>
          <div className="stat-value">{activities.length}</div>
        </div>
        <div className="stat-card card">
          <h3>Verified</h3>
          <div className="stat-value text-primary">{verified}</div>
        </div>
        <div className="stat-card card">
          <h3>Pending</h3>
          <div className="stat-value text-muted">{pending}</div>
        </div>
        <div className="stat-card card">
          <h3>Rejected</h3>
          <div className="stat-value text-danger">{rejected}</div>
        </div>
      </div>

      <div className="recent-activities">
        <div className="section-header">
          <h2>Recent Activities</h2>
          <Link to="/student/activities" className="btn btn-secondary">View All</Link>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.slice(0, 5).map(act => (
                <tr key={act.id}>
                  <td>{act.title}</td>
                  <td>{act.category}</td>
                  <td>{act.date}</td>
                  <td><StatusBadge status={act.status} /></td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center'}}>No activities found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
