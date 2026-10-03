const fs = require('fs');
const path = require('path');

const files = {
  "src/context/AuthContext.jsx": `import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in local storage
    const storedUser = localStorage.getItem('sams_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await apiLogin(email, password);
    if (response.user) {
      setUser(response.user);
      localStorage.setItem('sams_user', JSON.stringify(response.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sams_user');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
`,
  "src/api/authApi.js": `// Mock API for authentication
export const login = async (email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (email === 'admin@sams.edu' && password === 'admin') {
    return {
      user: {
        id: 1,
        name: 'Admin User',
        email: 'admin@sams.edu',
        role: 'ADMIN'
      }
    };
  } else if (email === 'student@sams.edu' && password === 'student') {
    return {
      user: {
        id: 2,
        name: 'Suhani',
        studentId: 'S12345',
        email: 'student@sams.edu',
        department: 'Computer Science',
        year: '3rd Year',
        division: 'A',
        role: 'STUDENT'
      }
    };
  }
  throw new Error('Invalid credentials');
};
`,
  "src/api/activityApi.js": `// Mock API for activities
const mockActivities = [
  { id: 1, studentId: 2, studentName: 'Suhani', title: 'React Hackathon', category: 'Hackathon', date: '2026-09-15', status: 'VERIFIED', organizer: 'XYZ Institute' },
  { id: 2, studentId: 2, studentName: 'Suhani', title: 'Web Dev Workshop', category: 'Workshop', date: '2026-10-01', status: 'PENDING', organizer: 'ABC College' },
  { id: 3, studentId: 2, studentName: 'Suhani', title: 'Paper Presentation', category: 'Academic', date: '2026-08-20', status: 'REJECTED', organizer: 'DEF University' }
];

export const getStudentActivities = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockActivities];
};

export const getAllActivities = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockActivities];
};

export const addActivity = async (activity) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newAct = { ...activity, id: Date.now(), status: 'PENDING', studentId: 2, studentName: 'Suhani' };
  mockActivities.push(newAct);
  return newAct;
};

export const updateActivityStatus = async (id, status) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const act = mockActivities.find(a => a.id === id);
  if (act) act.status = status;
  return act;
};

export const deleteActivity = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockActivities.findIndex(a => a.id === id);
  if (index > -1) mockActivities.splice(index, 1);
  return true;
};
`,
  "src/components/ProtectedRoute.jsx": `import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }
  
  return children;
};
`,
  "src/components/Sidebar.jsx": `import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, User, Activity, PlusSquare, Users, BookOpen } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/student/profile', icon: <User size={20} />, label: 'My Profile' },
    { to: '/student/activities', icon: <Activity size={20} />, label: 'Activities' },
    { to: '/student/add-activity', icon: <PlusSquare size={20} />, label: 'Add Activity' }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/students', icon: <Users size={20} />, label: 'Students' },
    { to: '/admin/activities', icon: <BookOpen size={20} />, label: 'All Activities' }
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : studentLinks;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>SAMS</h2>
        <p>Student Activity System</p>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink 
            key={link.to} 
            to={link.to} 
            className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
`,
  "src/components/Sidebar.css": `.sidebar {
  width: 250px;
  background-color: var(--color-primary);
  color: var(--color-white);
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  padding: 24px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.sidebar-logo h2 {
  color: var(--color-bg);
  font-size: 24px;
}

.sidebar-logo p {
  font-size: 12px;
  color: var(--color-accent);
}

.sidebar-nav {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: var(--color-white);
  transition: background 0.2s;
  opacity: 0.8;
}

.sidebar-link:hover {
  background-color: rgba(255,255,255,0.1);
  opacity: 1;
}

.sidebar-link.active {
  background-color: var(--color-secondary);
  border-left: 4px solid var(--color-bg);
  opacity: 1;
}
`,
  "src/components/Navbar.jsx": `import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-title">
        {/* Can put page title here if using context, else just empty */}
      </div>
      <div className="navbar-user">
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">{user?.role}</span>
        </div>
        <button onClick={logout} className="btn btn-secondary logout-btn">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
`,
  "src/components/Navbar.css": `.navbar {
  height: 70px;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
}

.user-role {
  font-size: 12px;
  color: var(--color-text-light);
}

.logout-btn {
  padding: 6px 12px;
}
`,
  "src/components/StatusBadge.jsx": `import React from 'react';

const StatusBadge = ({ status }) => {
  let bgColor = '#e2e8f0';
  let color = '#718096';
  let text = 'Unknown';
  let icon = '●';

  if (status === 'VERIFIED') {
    bgColor = '#e6f4ea';
    color = 'var(--color-primary)';
    text = 'Verified';
    icon = '✓';
  } else if (status === 'PENDING') {
    bgColor = '#fef3c7';
    color = '#d97706';
    text = 'Pending';
    icon = '●';
  } else if (status === 'REJECTED') {
    bgColor = '#fee2e2';
    color = 'var(--color-danger)';
    text = 'Rejected';
    icon = '×';
  }

  return (
    <span style={{
      backgroundColor: bgColor,
      color: color,
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    }}>
      <span>{icon}</span> {text}
    </span>
  );
};

export default StatusBadge;
`,
  "src/App.jsx": `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import StudentDashboard from './pages/student/Dashboard';
import StudentActivities from './pages/student/Activities';
import AddActivity from './pages/student/AddActivity';
import AdminDashboard from './pages/admin/Dashboard';
import AdminActivities from './pages/admin/Activities';

const Layout = ({ children }) => (
  <div className="app-container">
    <Sidebar />
    <div className="main-content">
      <Navbar />
      <div className="page-container">
        {children}
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Student Routes */}
          <Route path="/student/*" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="activities" element={<StudentActivities />} />
                  <Route path="add-activity" element={<AddActivity />} />
                  <Route path="profile" element={<div>Profile (TODO)</div>} />
                  <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="activities" element={<AdminActivities />} />
                  <Route path="students" element={<div>Students List (TODO)</div>} />
                  <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
`,
  "src/pages/Login.jsx": `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('student@sams.edu');
  const [password, setPassword] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        // Redirection is handled in ProtectedRoute usually, but let's push to dashboard based on role
        if (email.includes('admin')) {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (err) {
      setError('Invalid credentials. Try student@sams.edu / student OR admin@sams.edu / admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card card">
        <div className="login-header">
          <h1>SAMS</h1>
          <p>Student Activity Management System</p>
        </div>
        
        <div className="login-body">
          <h2>Welcome back</h2>
          <p className="subtitle">Sign in to continue</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="demo-credentials text-muted mt-4">
            <p><strong>Demo Access:</strong></p>
            <p>Student: student@sams.edu / student</p>
            <p>Admin: admin@sams.edu / admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
`,
  "src/pages/Login.css": `.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: 0;
  overflow: hidden;
}

.login-header {
  background-color: var(--color-primary);
  color: var(--color-bg);
  padding: 30px;
  text-align: center;
}

.login-header h1 {
  margin: 0;
  font-size: 32px;
}

.login-header p {
  color: var(--color-accent);
  margin-top: 8px;
  font-size: 14px;
}

.login-body {
  padding: 30px;
}

.login-body h2 {
  font-size: 24px;
  color: var(--color-text-dark);
}

.subtitle {
  color: var(--color-text-light);
  margin-bottom: 24px;
}

.login-btn {
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  font-size: 16px;
}

.error-message {
  background-color: #fee2e2;
  color: var(--color-danger);
  padding: 12px;
  border-radius: var(--border-radius-md);
  margin-bottom: 16px;
  font-size: 14px;
}
.demo-credentials {
  font-size: 12px;
  text-align: center;
  border-top: 1px solid var(--color-border);
  padding-top: 16px;
}
`,
  "src/pages/student/Dashboard.jsx": `import React, { useEffect, useState } from 'react';
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
`,
  "src/pages/student/Dashboard.css": `.welcome-section {
  margin-bottom: 24px;
}

.welcome-section h1 {
  font-size: 28px;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.welcome-section p {
  color: var(--color-text-light);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card h3 {
  font-size: 14px;
  color: var(--color-text-light);
  font-weight: 500;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 20px;
}
`,
  "src/pages/student/Activities.jsx": `import React, { useEffect, useState } from 'react';
import { getStudentActivities, deleteActivity } from '../../api/activityApi';
import StatusBadge from '../../components/StatusBadge';
import { Link } from 'react-router-dom';
import { Trash2, Edit } from 'lucide-react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  
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
                      <button className="btn btn-icon btn-secondary" title="Edit">
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
`,
  "src/pages/student/AddActivity.jsx": `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addActivity } from '../../api/activityApi';

const AddActivity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Hackathon',
    description: '',
    organizer: '',
    date: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addActivity(formData);
    setLoading(false);
    navigate('/student/activities');
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div>
      <h1 style={{color: 'var(--color-primary)', marginBottom: '8px'}}>Add Activity</h1>
      <p className="text-muted" style={{marginBottom: '24px'}}>Record a new academic or extracurricular activity.</p>
      
      <div className="card" style={{maxWidth: '600px'}}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Activity Title</label>
            <input 
              type="text" 
              name="title"
              className="form-control" 
              value={formData.title}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              name="category" 
              className="form-control" 
              value={formData.category} 
              onChange={handleChange}
            >
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
            <input 
              type="text" 
              name="organizer"
              className="form-control" 
              value={formData.organizer}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input 
              type="date" 
              name="date"
              className="form-control" 
              value={formData.date}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description"
              className="form-control" 
              rows="4" 
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="flex gap-4 mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Activity'}
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

export default AddActivity;
`,
  "src/pages/admin/Dashboard.jsx": `import React, { useEffect, useState } from 'react';
import { getAllActivities } from '../../api/activityApi';

const AdminDashboard = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getAllActivities().then(setActivities);
  }, []);

  const totalStudents = 1250; // Mock stat
  const pending = activities.filter(a => a.status === 'PENDING').length;
  const verified = activities.filter(a => a.status === 'VERIFIED').length;

  return (
    <div>
      <div style={{marginBottom: '24px'}}>
        <h1 style={{color: 'var(--color-primary)', marginBottom: '8px'}}>Admin Dashboard</h1>
        <p className="text-muted">Overview of the Student Activity Management System.</p>
      </div>

      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '32px'
      }}>
        <div className="card">
          <h3 style={{fontSize: '14px', color: 'var(--color-text-light)', marginBottom: '8px'}}>Total Students</h3>
          <div style={{fontSize: '32px', fontWeight: 'bold'}}>{totalStudents}</div>
        </div>
        <div className="card">
          <h3 style={{fontSize: '14px', color: 'var(--color-text-light)', marginBottom: '8px'}}>Total Activities</h3>
          <div style={{fontSize: '32px', fontWeight: 'bold'}}>{activities.length}</div>
        </div>
        <div className="card">
          <h3 style={{fontSize: '14px', color: 'var(--color-text-light)', marginBottom: '8px'}}>Pending Review</h3>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: '#d97706'}}>{pending}</div>
        </div>
        <div className="card">
          <h3 style={{fontSize: '14px', color: 'var(--color-text-light)', marginBottom: '8px'}}>Verified</h3>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: 'var(--color-primary)'}}>{verified}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
`,
  "src/pages/admin/Activities.jsx": `import React, { useEffect, useState } from 'react';
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
