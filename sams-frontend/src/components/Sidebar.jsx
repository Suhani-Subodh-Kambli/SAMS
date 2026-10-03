import React from 'react';
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
