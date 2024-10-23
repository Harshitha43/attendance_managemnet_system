import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './dashboard.css'; // Add custom styles here
import 'bootstrap/dist/css/bootstrap.min.css';
import AttendanceList from './AttendanceList';
import Profile from './Profile';
import './dashboard.css';

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      navigate('/');
    } else {
      setRole(user.role);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Function to check if the current path matches the link
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="dashboard-container m-0">
      {/* Sidebar */}
      <nav className="sidebar bg-dark">
        <ul className="nav flex-column mb-auto">
          {role !== 'user' && (
            <>
              <li className="nav-item">
                <Link className={`nav-link  text-white ${isActive('/dashboard')}`} to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link text-white ${isActive('/employees')}`} to="/employees">Employee Master</Link>
              </li>
            </>
          )}
          {role === 'admin' && (
            <>
              <li className="nav-item">
                <Link className={`nav-link text-white ${isActive('/departments')}`} to="/departments">Department Master</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link text-white ${isActive('/leave-types')}`} to="/leave-types">Leave Type Master</Link>
              </li>
            </>
          )}
          {role === 'user' && (           
            <li className="nav-item">
                <Link className={`nav-link  text-white ${isActive('/dashboard')}`} to="/dashboard">Dashboard</Link>
              </li>
          )}
          <li className="nav-item">
            <Link className={`nav-link text-white ${isActive('/leaves')}`} to="/leaves">Leave</Link>
          </li>
          <li className="nav-item d-flex justify-content-center">
            <button className="nav-link text-white bg-transparent border-0" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {location.pathname === '/dashboard' && (
        <>
          {role === 'user' ? (
            <Profile />
          ) : (
            <AttendanceList />
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
