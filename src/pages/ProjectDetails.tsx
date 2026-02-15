import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as projectApi from '../api/project';
import * as taskApi from '../api/task';
import * as organizationApi from '../api/organization';
import type { ProjectMember } from '../types/project';
import { TaskStatus } from '../types/task';
import type { Task } from '../types/task';
import type { OrganizationUser } from '../types/organization';
import TaskModal from '../components/TaskModal';
import AddMemberModal from '../components/AddMemberModal';
import { UserRole } from '../types/auth';
import '../styles/auth.css';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projectUsers, setProjectUsers] = useState<ProjectMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const isAdmin = user?.role === UserRole.ADMIN;

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError('');

      const [usersData, tasksData, orgUsersData] = await Promise.all([
        projectApi.getProjectUsers(projectId),
        taskApi.getTasks({ projectId }),
        organizationApi.getOrganizationUsers(),
      ]);

      setProjectUsers(usersData);
      setTasks(tasksData.tasks);
      setOrganizationUsers(orgUsersData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch project details';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskApi.deleteTask(taskId);
      fetchData();
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading project details...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card project-details-card">
        <div className="dashboard-header">
            <div>
              <button className="back-button" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
              </button>
              <h1 className="dashboard-title">Project Details</h1>
            </div>
            {isAdmin && (
                <div className="header-actions">
                  <button onClick={() => setShowAddMemberModal(true)} className="btn-secondary small">
                    + Add Member
                  </button>
                  <button onClick={handleCreateTask} className="btn-primary small">
                    + New Task
                  </button>
                </div>
            )}
        </div>

        <div className="project-content">
            <div className="tasks-section">
                <div className="kanban-board">
                  {Object.values(TaskStatus).map((status) => (
                    <div key={status} className={`kanban-column column-${status.toLowerCase().replace(' ', '-')}`}>
                      <h3 className="column-header">
                        {status} 
                        <span className="task-count">
                          {tasks.filter(t => t.status === status).length}
                        </span>
                      </h3>
                      <div className="kanban-tasks">
                        {tasks.filter(t => t.status === status).map(task => (
                          <div key={task.id} className="task-card">
                            <h4 className="task-title">{task.title}</h4>
                            {task.description && <p className="task-desc">{task.description}</p>}
                            
                            <div className="task-meta">
                              <div className="task-assignee">
                                {task.assignee ? (
                                  <div className="avatar-small" title={task.assignee.email}>
                                    {task.assignee.email.charAt(0).toUpperCase()}
                                  </div>
                                ) : (
                                  <div className="avatar-small unassigned" title="Unassigned">?</div>
                                )}
                              </div>
                              <div className="task-date">
                                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                            
                            {isAdmin && (
                              <div className="task-actions-hover">
                                <button onClick={() => handleEditTask(task)} className="btn-icon">✎</button>
                                <button onClick={() => handleDeleteTask(task.id)} className="btn-icon delete">🗑</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {isAdmin && (
                        <button 
                          className="add-task-btn-column"
                          onClick={() => {
                            setEditingTask(undefined);
                            // Pre-fill status based on column? 
                            // Current TaskModal doesn't support pre-filling status easily without modifying it, 
                            // so we'll just open the modal.
                            setShowTaskModal(true);
                          }}
                        >
                          + Add Task
                        </button>
                      )}
                    </div>
                  ))}
                </div>
            </div>

            <div className="members-section">
                <h2 className="section-title">Members ({projectUsers.length})</h2>
                <div className="members-list">
                    {projectUsers.map(member => (
                        <div key={member.id} className="member-item">
                            <div className="member-avatar">
                                {member.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="member-info">
                                <span className="member-email">{member.email}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {projectId && (
        <>
            <TaskModal 
                isOpen={showTaskModal} 
                onClose={() => setShowTaskModal(false)}
                onSuccess={fetchData}
                projectId={projectId}
                task={editingTask}
                projectUsers={projectUsers}
            />
            <AddMemberModal
                isOpen={showAddMemberModal}
                onClose={() => setShowAddMemberModal(false)}
                onSuccess={fetchData}
                projectId={projectId}
                organizationUsers={organizationUsers}
                existingMemberIds={projectUsers.map(member => member.id)}
            />
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
