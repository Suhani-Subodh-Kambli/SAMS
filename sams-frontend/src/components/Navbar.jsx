import React from 'react';
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
