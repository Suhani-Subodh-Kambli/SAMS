import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentActivities } from '../../api/activityApi';

const Profile = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getStudentActivities().then(setActivities);
  }, []);

  const verified = activities.filter(a => a.status === 'VERIFIED').length;
  const pending = activities.filter(a => a.status === 'PENDING').length;
  const rejected = activities.filter(a => a.status === 'REJECTED').length;

  return (
    <div>
      <h1 style={{color: 'var(--color-primary)', marginBottom: '8px'}}>My Profile</h1>
      <p className="text-muted" style={{marginBottom: '24px'}}>View your personal details and activity summary.</p>
      
      <div className="card" style={{maxWidth: '800px'}}>
        <div style={{display: 'flex', gap: '32px', flexWrap: 'wrap'}}>
          
          <div style={{flex: '1', minWidth: '300px'}}>
            <h2 style={{fontSize: '18px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '16px'}}>Student Information</h2>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '24px'}}>
              <div className="text-muted">Name</div>
              <div style={{fontWeight: '500'}}>{user?.name}</div>
              
              <div className="text-muted">Student ID</div>
              <div style={{fontWeight: '500'}}>{user?.studentId}</div>
              
              <div className="text-muted">Email</div>
              <div style={{fontWeight: '500'}}>{user?.email}</div>
              
              <div className="text-muted">Department</div>
              <div style={{fontWeight: '500'}}>{user?.department}</div>
              
              <div className="text-muted">Year</div>
              <div style={{fontWeight: '500'}}>{user?.year}</div>
              
              <div className="text-muted">Division</div>
              <div style={{fontWeight: '500'}}>{user?.division}</div>
            </div>
          </div>
          
          <div style={{flex: '1', minWidth: '300px'}}>
            <h2 style={{fontSize: '18px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '16px'}}>Activity Summary</h2>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
               <div style={{backgroundColor: 'var(--color-bg)', padding: '16px', borderRadius: 'var(--border-radius-md)', textAlign: 'center'}}>
                 <div className="text-muted" style={{fontSize: '14px', marginBottom: '4px'}}>Total</div>
                 <div style={{fontSize: '28px', fontWeight: 'bold'}}>{activities.length}</div>
               </div>
               
               <div style={{backgroundColor: '#e6f4ea', padding: '16px', borderRadius: 'var(--border-radius-md)', textAlign: 'center'}}>
                 <div style={{color: 'var(--color-primary)', fontSize: '14px', marginBottom: '4px'}}>Verified</div>
                 <div style={{fontSize: '28px', fontWeight: 'bold', color: 'var(--color-primary)'}}>{verified}</div>
               </div>
               
               <div style={{backgroundColor: '#fef3c7', padding: '16px', borderRadius: 'var(--border-radius-md)', textAlign: 'center'}}>
                 <div style={{color: '#d97706', fontSize: '14px', marginBottom: '4px'}}>Pending</div>
                 <div style={{fontSize: '28px', fontWeight: 'bold', color: '#d97706'}}>{pending}</div>
               </div>

               <div style={{backgroundColor: '#fee2e2', padding: '16px', borderRadius: 'var(--border-radius-md)', textAlign: 'center'}}>
                 <div style={{color: 'var(--color-danger)', fontSize: '14px', marginBottom: '4px'}}>Rejected</div>
                 <div style={{fontSize: '28px', fontWeight: 'bold', color: 'var(--color-danger)'}}>{rejected}</div>
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
