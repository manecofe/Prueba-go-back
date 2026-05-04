import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { TaskWithProject, TaskFilters } from '../../../domain/entities/Task';

export class GetAllTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(filters?: TaskFilters): Promise<TaskWithProject[]> {
    return await this.taskRepository.findAll(filters);
  }
}
