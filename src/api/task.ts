import apiClient from './client';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters,
  TaskStatus,
} from '../types/task';

export const getTasks = async (
  filters: TaskFilters,
): Promise<{ tasks: Task[]; total: number }> => {
  const response = await apiClient.get<{ tasks: Task[]; total: number }>(
    '/tasks',
    {
      params: filters,
    },
  );
  return response.data;
};

export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await apiClient.post<Task>('/tasks', data);
  return response.data;
};

export const updateTask = async (
  id: string,
  data: UpdateTaskRequest,
): Promise<Task> => {
  const response = await apiClient.put<Task>(`/tasks/${id}`, data);
  return response.data;
};

export const updateTaskStatus = async (
  id: string,
  status: TaskStatus,
): Promise<Task> => {
  const response = await apiClient.patch<Task>(`/tasks/${id}/status`, {
    status,
  });
  return response.data;
};

export const updateTaskAssignee = async (
  id: string,
  assigneeId: string | null,
): Promise<Task> => {
  const response = await apiClient.patch<Task>(`/tasks/${id}/assignee`, {
    assigneeId,
  });
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};
