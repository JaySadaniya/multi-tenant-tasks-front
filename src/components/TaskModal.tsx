import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { TaskStatus } from '../types/task';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task';
import type { ProjectMember } from '../types/project';
import '../styles/modal.css';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
  task?: Task; // If provided, we are editing
  projectUsers: ProjectMember[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  task,
  projectUsers,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setAssigneeId(task.assigneeId || '');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus(TaskStatus.TODO);
      setAssigneeId('');
      setDueDate('');
    }
    setError('');
  }, [task, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!title || !dueDate) {
      setError('Title and Due Date are required');
      setLoading(false);
      return;
    }

    try {
      const { createTask, updateTask, updateTaskStatus, updateTaskAssignee } = await import('../api/task');
      
      if (task) {
        // Edit mode: determine which fields changed and call appropriate APIs
        const promises = [];

        // Check for general updates (title, description, dueDate)
        const currentDueDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
        if (
          title !== task.title || 
          description !== (task.description || '') || 
          dueDate !== currentDueDate
        ) {
          const updates: UpdateTaskRequest = {
            title,
            description,
            dueDate: new Date(dueDate).toISOString(),
          };
          promises.push(updateTask(task.id, updates));
        }

        // Check for status update
        if (status !== task.status) {
          promises.push(updateTaskStatus(task.id, status));
        }

        // Check for assignee update
        // Handle null/undefined comparisons carefully
        const currentAssigneeId = task.assigneeId || '';
        if (assigneeId !== currentAssigneeId) {
          promises.push(updateTaskAssignee(task.id, assigneeId || null));
        }

        if (promises.length > 0) {
          await Promise.all(promises);
        }
      } else {
        // Create mode
        const newData: CreateTaskRequest = {
          title,
          description,
          projectId,
          status,
          dueDate: new Date(dueDate).toISOString(),
          assigneeId: assigneeId || undefined,
        };
        await createTask(newData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Task save error:', err);
      // Try to extract the most relevant error message
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save task';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'Create Task'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title">Title *</label>
            <input
              type="text"
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                disabled={loading}
              >
                {Object.values(TaskStatus).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-date">Due Date *</label>
              <input
                type="date"
                id="task-date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-assignee">Assignee</label>
            <select
              id="task-assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              disabled={loading}
            >
              <option value="">Unassigned</option>
              {projectUsers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.email}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
