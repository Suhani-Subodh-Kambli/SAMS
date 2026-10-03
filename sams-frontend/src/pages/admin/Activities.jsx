import React, { useEffect, useState } from 'react';
import { getAllActivities, updateActivityStatus } from '../../api/activityApi';
import StatusBadge from '../../components/StatusBadge';
import { CheckCircle, XCircle } from 'lucide-react';

const AdminActivities = () => {
  const [activities, setActivities] = useState([]);
  
  const loadActivities = () => {
    getAllActivities().then(setActivities);
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleVerify = async (id) => {
    if(window.confirm("Verify this activity?")) {
      await updateActivityStatus(id, 'VERIFIED');
      loadActivities();
    }
  };

  const handleReject = async (id) => {
    if(window.confirm("Reject this activity?")) {
      await updateActivityStatus(id, 'REJECTED');
      loadActivities();
    }
  };

  return (
    <div>
      <div style={{marginBottom: '24px'}}>
        <h1 style={{color: 'var(--color-primary)', marginBottom: '8px'}}>Review Activities</h1>
        <p className="text-muted">Verify or reject submitted student activities.</p>
      </div>

      <div className="card" style={{padding: '0'}}>
        <div className="table-container" style={{boxShadow: 'none', borderRadius: '0'}}>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Activity</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(act => (
                <tr key={act.id}>
                  <td><strong>{act.studentName}</strong></td>
                  <td><strong>{act.title}</strong><br/><span style={{fontSize:'12px', color: 'var(--color-text-light)'}}>{act.organizer}</span></td>
                  <td>{act.category}</td>
                  <td>{act.date}</td>
                  <td><StatusBadge status={act.status} /></td>
                  <td>
                    {act.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button className="btn btn-icon btn-secondary" style={{color: 'var(--color-primary)', borderColor: 'var(--color-primary)'}} onClick={() => handleVerify(act.id)} title="Verify">
                          <CheckCircle size={16} />
                        </button>
                        <button className="btn btn-icon btn-danger" onClick={() => handleReject(act.id)} title="Reject">
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminActivities;
