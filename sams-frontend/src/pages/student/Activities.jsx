import React, { useEffect, useState } from 'react';
import { getStudentActivities, deleteActivity } from '../../api/activityApi';
import StatusBadge from '../../components/StatusBadge';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Edit } from 'lucide-react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();
  
  const loadActivities = () => {
    getStudentActivities().then(setActivities);
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this activity? This action cannot be undone.")) {
      await deleteActivity(id);
      loadActivities();
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{color: 'var(--color-primary)'}}>Activities</h1>
          <p className="text-muted">Manage your academic and extracurricular activity records.</p>
        </div>
        <Link to="/student/add-activity" className="btn btn-primary">Add Activity</Link>
      </div>

      <div className="card" style={{padding: '0'}}>
        <div className="table-container" style={{boxShadow: 'none', borderRadius: '0'}}>
          <table>
            <thead>
              <tr>
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
                  <td><strong>{act.title}</strong><br/><span style={{fontSize:'12px', color: 'var(--color-text-light)'}}>{act.organizer}</span></td>
                  <td>{act.category}</td>
                  <td>{act.date}</td>
                  <td><StatusBadge status={act.status} /></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-icon btn-secondary" title="Edit" onClick={() => navigate('/student/edit-activity/' + act.id)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-icon btn-danger" onClick={() => handleDelete(act.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>
                    <p>No activities found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Activities;
