import React, { useState } from 'react';
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
      const success = await login(email.trim().toLowerCase(), password);

      if (!success) {
        setError('Invalid email or password.');
        return;
      }

      // Redirect based on the authenticated user's role
      const storedUser = JSON.parse(
        localStorage.getItem('sams_user')
      );

      if (storedUser?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (storedUser?.role === 'STUDENT') {
        navigate('/student/dashboard', { replace: true });
      } else {
        setError('User role not recognized.');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(
        'Login failed. Please check your credentials and try again.'
      );
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
