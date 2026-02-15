export interface Project {
  id: string;
  name: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  organizationId: string;
}

// Project member type matching API response
export interface ProjectMember {
  id: string;
  email: string;
  role: string;
}
