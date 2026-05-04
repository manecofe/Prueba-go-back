import { Project, ProjectWithStats, CreateProjectData, UpdateProjectData } from '../entities/Project';

export interface IProjectRepository {
  findAll(): Promise<ProjectWithStats[]>;
  findById(id: string): Promise<ProjectWithStats | null>;
  create(data: CreateProjectData): Promise<Project>;
  update(id: string, data: UpdateProjectData): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}
