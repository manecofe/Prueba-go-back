import { Task, TaskWithProject, CreateTaskData, UpdateTaskData, TaskFilters } from '../entities/Task';
import { TaskStatus } from '../entities/enums';

export interface ITaskRepository {
  findAll(filters?: TaskFilters): Promise<TaskWithProject[]>;
  findById(id: string): Promise<TaskWithProject | null>;
  findByProjectId(projectId: string): Promise<TaskWithProject[]>;
  create(data: CreateTaskData): Promise<Task>;
  update(id: string, data: UpdateTaskData): Promise<Task | null>;
  updateStatus(id: string, status: TaskStatus): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}
