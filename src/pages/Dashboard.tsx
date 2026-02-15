import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome to your dashboard!</p>

        {user && (
          <div className="user-info">
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Role:</span>
              <span className="info-value">{user.role}</span>
            </div>
            <div className="info-row">
              <span className="info-label">User ID:</span>
              <span className="info-value">{user.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Organization ID:</span>
              <span className="info-value">{user.organizationId}</span>
            </div>
          </div>
        )}

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
