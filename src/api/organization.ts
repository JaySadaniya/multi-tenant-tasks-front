import apiClient from './client';
import type {
  Organization,
  CreateOrganizationRequest,
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
