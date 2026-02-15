import apiClient from './client';
import type { Project, CreateProjectRequest } from '../types/project';

export const getUserProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get<Project[]>('/projects');
  return response.data;
};

export const createProject = async (
  name: string,
  organizationId: string,
): Promise<Project> => {
  const payload: CreateProjectRequest = { name, organizationId };
  const response = await apiClient.post<Project>('/projects', payload);
  return response.data;
};
