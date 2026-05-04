export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectWithStats extends Project {
  taskCount: number;
  tasksByStatus: {
    TODO: number;
    IN_PROGRESS: number;
    IN_REVIEW: number;
    COMPLETED: number;
  };
}

export interface CreateProjectData {
  name: string;
  description: string;
  color: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  color?: string;
}
