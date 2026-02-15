import React, { useState } from 'react';
import type { FormEvent } from 'react';
import type { OrganizationUser } from '../types/organization';
import * as projectApi from '../api/project';
import '../styles/modal.css';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
  organizationUsers: OrganizationUser[];
  existingMemberIds: string[];
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  organizationUsers,
  existingMemberIds,
}) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter out users who are already members
  const availableUsers = organizationUsers.filter(
    (user) => !existingMemberIds.includes(user.id)
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!selectedUserId) {
      setError('Please select a user');
      setLoading(false);
      return;
    }

    try {
      await projectApi.addUserToProject(projectId, selectedUserId);
      setSelectedUserId('');
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add member';
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
          <h2 className="modal-title">Add Member to Project</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="select-user">Select User *</label>
            <select
              id="select-user"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={loading}
              autoFocus
            >
              <option value="">Select a user...</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email} ({user.role})
                </option>
              ))}
            </select>
            {availableUsers.length === 0 && (
              <p className="help-text">All organization members are already in this project.</p>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading || availableUsers.length === 0}
            >
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
