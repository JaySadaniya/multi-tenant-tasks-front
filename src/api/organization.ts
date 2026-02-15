import apiClient from './client';
import type {
  Organization,
  CreateOrganizationRequest,
  OrganizationUser,
} from '../types/organization';

export const createOrganization = async (
  name: string,
): Promise<Organization> => {
  const payload: CreateOrganizationRequest = { name };
  const response = await apiClient.post<Organization>(
    '/organizations',
    payload,
  );
  return response.data;
};

export const getOrganizationUsers = async (): Promise<OrganizationUser[]> => {
  const response = await apiClient.get<OrganizationUser[]>(
    '/organizations/users',
  );
  return response.data;
};
