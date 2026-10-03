import React, { useEffect, useState } from 'react';
import { getAllActivities } from '../../api/activityApi';
import { getAdminStats } from '../../api/statsApi';

const AdminDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    getAllActivities().then(setActivities);
    getAdminStats().then(setStats).catch(() => setStats({}));
  }, []);

  const totalStudents = stats.totalStudents || 0;
  const pending = activities.filter(a => a.status === 'PENDING').length;
  const verified = activities.filter(a => a.status === 'VERIFIED').length;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: 'var(--color-primary)', marginBottom: '8px' }}>Admin Dashboard</h1>
        <p className="text-muted">Overview of the Student Activity Management System.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div className="card">
          <h3 style={{ fontSize: '14px', color: 'var(--color-text-light)', marginBottom: '8px' }}>Total Students</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{totalStudents}</div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '14px', color: 'var(--color-text-light)', marginBottom: '8px' }}>Total Activities</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{activities.length}</div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '14px', color: 'var(--color-text-light)', marginBottom: '8px' }}>Pending Review</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>{pending}</div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '14px', color: 'var(--color-text-light)', marginBottom: '8px' }}>Verified</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{verified}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
