export const TaskStatus = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  projectId: string;
  assigneeId: string | null;
  dueDate: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  assignee?: {
    id: string;
    email: string;
  };
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  status?: TaskStatus;
  dueDate: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assigneeId?: string;
  dueDate?: string;
}

export interface TaskFilters {
  projectId?: string;
  assigneeId?: string;
  status?: TaskStatus;
  search?: string;
  page?: number;
  limit?: number;
}
