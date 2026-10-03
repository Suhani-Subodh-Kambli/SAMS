const fs = require('fs');
const path = require('path');

const files = {
  "src/api/studentApi.js": `// Mock API for students
export const getAllStudents = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: 2, name: 'Suhani', studentId: 'S12345', email: 'student@sams.edu', department: 'Computer Science', year: '3rd Year', division: 'A', totalActivities: 3 },
    { id: 3, name: 'Rahul', studentId: 'S12346', email: 'rahul@sams.edu', department: 'Information Technology', year: '2nd Year', division: 'B', totalActivities: 1 },
    { id: 4, name: 'Priya', studentId: 'S12347', email: 'priya@sams.edu', department: 'Electronics', year: '4th Year', division: 'A', totalActivities: 5 }
  ];
};
`,
  "src/pages/student/Profile.jsx": `import React, { useEffect, useState } from 'react';
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
`,
  "src/pages/student/EditActivity.jsx": `import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getActivityById, updateActivity } from '../../api/activityApi';

const EditActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', category: '', description: '', organizer: '', date: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getActivityById(id).then(data => {
      if(data) {
        setFormData({
          title: data.title,
          category: data.category,
          description: data.description || '',
          organizer: data.organizer,
          date: data.date
        });
      }
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateActivity(id, formData);
    setSaving(false);
    navigate('/student/activities');
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{color: 'var(--color-primary)', marginBottom: '8px'}}>Edit Activity</h1>
      <p className="text-muted" style={{marginBottom: '24px'}}>Update your activity details.</p>
      
      <div className="card" style={{maxWidth: '600px'}}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Activity Title</label>
            <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
              <option value="Academic">Academic</option>
              <option value="Technical">Technical</option>
              <option value="Internship">Internship</option>
              <option value="Certification">Certification</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Workshop">Workshop</option>
              <option value="Volunteering">Volunteering</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Organizer / Institution</label>
            <input type="text" name="organizer" className="form-control" value={formData.organizer} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange}></textarea>
          </div>
          <div className="flex gap-4 mt-4">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Update Activity'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/student/activities')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditActivity;
`,
  "src/pages/admin/Students.jsx": `import React, { useEffect, useState } from 'react';
import { getAllStudents } from '../../api/studentApi';
import { Eye } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  
  useEffect(() => {
    getAllStudents().then(setStudents);
  }, []);

  return (
    <div>
      <div style={{marginBottom: '24px'}}>
        <h1 style={{color: 'var(--color-primary)', marginBottom: '8px'}}>Students List</h1>
        <p className="text-muted">View all registered students in the system.</p>
      </div>

      <div className="card" style={{padding: '0'}}>
        <div className="table-container" style={{boxShadow: 'none', borderRadius: '0'}}>
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Total Activities</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td><strong>{student.studentId}</strong></td>
                  <td>{student.name}<br/><span style={{fontSize:'12px', color: 'var(--color-text-light)'}}>{student.email}</span></td>
                  <td>{student.department}</td>
                  <td>{student.year}</td>
                  <td>{student.totalActivities}</td>
                  <td>
                    <button className="btn btn-icon btn-secondary" title="View Details">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
`
};

for (const [filepath, content] of Object.entries(files)) {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Created:', filepath);
}

// 1. Update activityApi.js to add getActivityById and updateActivity
let activityApi = fs.readFileSync('src/api/activityApi.js', 'utf8');
if(!activityApi.includes('getActivityById')) {
  activityApi += \`\n
export const getActivityById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockActivities.find(a => a.id === parseInt(id));
};

export const updateActivity = async (id, updatedData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockActivities.findIndex(a => a.id === parseInt(id));
  if (index > -1) {
    mockActivities[index] = { ...mockActivities[index], ...updatedData };
    return mockActivities[index];
  }
  throw new Error("Activity not found");
};
\`;
  fs.writeFileSync('src/api/activityApi.js', activityApi);
}

// 2. Update Activities.jsx to wire up the Edit button
let activitiesPage = fs.readFileSync('src/pages/student/Activities.jsx', 'utf8');
if (!activitiesPage.includes('navigate(')) {
  activitiesPage = activitiesPage.replace(
    "import { Link } from 'react-router-dom';",
    "import { Link, useNavigate } from 'react-router-dom';"
  );
  activitiesPage = activitiesPage.replace(
    "const Activities = () => {",
    "const Activities = () => {\\n  const navigate = useNavigate();"
  );
  activitiesPage = activitiesPage.replace(
    "<button className=\\"btn btn-icon btn-secondary\\" title=\\"Edit\\">",
    "<button className=\\"btn btn-icon btn-secondary\\" title=\\"Edit\\" onClick={() => navigate('/student/edit-activity/' + act.id)}>"
  );
  fs.writeFileSync('src/pages/student/Activities.jsx', activitiesPage);
}

// 3. Update App.jsx to use these components instead of TODO divs
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');
if(appJsx.includes('<div>Profile (TODO)</div>')) {
  // Add imports
  const importLines = \`
import StudentProfile from './pages/student/Profile';
import EditActivity from './pages/student/EditActivity';
import AdminStudents from './pages/admin/Students';
\`;
  appJsx = appJsx.replace('import AdminActivities from \\'./pages/admin/Activities\\';', "import AdminActivities from './pages/admin/Activities';" + importLines);
  
  // Replace student profile route
  appJsx = appJsx.replace(
    '<Route path="profile" element={<div>Profile (TODO)</div>} />',
    '<Route path="profile" element={<StudentProfile />} />\\n                  <Route path="edit-activity/:id" element={<EditActivity />} />'
  );
  
  // Replace admin students route
  appJsx = appJsx.replace(
    '<Route path="students" element={<div>Students List (TODO)</div>} />',
    '<Route path="students" element={<AdminStudents />} />'
  );
  
  fs.writeFileSync('src/App.jsx', appJsx);
}

console.log('Modifications completed.');
