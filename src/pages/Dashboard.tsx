import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../types/project';
import * as projectApi from '../api/project';
import * as organizationApi from '../api/organization';
import type { OrganizationUser } from '../types/organization';
import { UserRole } from '../types/auth';
import CreateOrganizationModal from '../components/CreateOrganizationModal';
import CreateProjectModal from '../components/CreateProjectModal';
import '../styles/auth.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const isAdmin = user?.role === UserRole.ADMIN;

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await projectApi.getUserProjects();
      setProjects(data);
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch projects';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchOrganizationUsers();
  }, []);

  const fetchOrganizationUsers = async () => {
    try {
      const data = await organizationApi.getOrganizationUsers();
      setOrganizationUsers(data);
    } catch (err) {
      console.error('Failed to fetch organization users', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOrganizationCreated = () => {
    // Optionally refresh data or show success message
    console.log('Organization created successfully');
  };

  const handleProjectCreated = () => {
    // Refresh project list
    fetchProjects();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <button onClick={handleLogout} className="logout-button-small">
            Logout
          </button>
        </div>
        <p className="dashboard-subtitle">Welcome back, {user?.email}!</p>

        {user && (
          <div className="user-info">
            <div className="info-row">
              <span className="info-label">Role:</span>
              <span className="info-value">{user.role}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Organization:</span>
              <span className="info-value">{user.organizationName || user.organizationId}</span>
            </div>
          </div>
        )}

        {/* RBAC-based action buttons - Only visible to ADMIN */}
        {isAdmin && (
          <div className="action-buttons">
            <button onClick={() => setShowOrgModal(true)} className="btn-create">
              <span className="btn-icon">+</span>
              Create Organization
            </button>
            <button onClick={() => setShowProjectModal(true)} className="btn-create">
              <span className="btn-icon">+</span>
              Create Project
            </button>
          </div>
        )}

        <div className="projects-section">
          <h2 className="section-title">Your Projects</h2>
          
          {loading && <p className="loading-text">Loading projects...</p>}
          
          {error && <div className="error-message">{error}</div>}
          
          {!loading && !error && projects.length === 0 && (
            <p className="empty-state">
              No projects found. {isAdmin ? 'Create your first project to get started!' : 'Contact your admin to be added to a project.'}
            </p>
          )}
          
          {!loading && !error && projects.length > 0 && (
            <div className="projects-list">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="project-card clickable"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-meta">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="users-section">
          <h2 className="section-title">Organization Members</h2>
          <div className="users-list">
            {organizationUsers.map((orgUser) => (
              <div key={orgUser.id} className="user-card">
                <div className="user-avatar">{orgUser.email.charAt(0).toUpperCase()}</div>
                <div className="user-details">
                  <div className="user-email">{orgUser.email}</div>
                  <div className="user-role">{orgUser.role}</div>
                </div>
              </div>
            ))}
            {organizationUsers.length === 0 && (
               <p className="empty-state">No other members in this organization.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modals - Only render if user is ADMIN */}
      {isAdmin && user && (
        <>
          <CreateOrganizationModal
            isOpen={showOrgModal}
            onClose={() => setShowOrgModal(false)}
            onSuccess={handleOrganizationCreated}
          />
          <CreateProjectModal
            isOpen={showProjectModal}
            onClose={() => setShowProjectModal(false)}
            onSuccess={handleProjectCreated}
            organizationId={user.organizationId}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
