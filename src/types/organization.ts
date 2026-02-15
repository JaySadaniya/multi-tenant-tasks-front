export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationRequest {
  name: string;
}

export interface OrganizationUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
