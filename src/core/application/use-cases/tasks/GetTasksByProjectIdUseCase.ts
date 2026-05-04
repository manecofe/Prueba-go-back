import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { TaskWithProject } from '../../../domain/entities/Task';

export class GetTasksByProjectIdUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(projectId: string): Promise<TaskWithProject[]> {
    return await this.taskRepository.findByProjectId(projectId);
  }
}
