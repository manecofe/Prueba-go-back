import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { Task, CreateTaskData } from '../../../domain/entities/Task';

export class CreateTaskUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private projectRepository: IProjectRepository
  ) {}

  async execute(data: CreateTaskData): Promise<Task | null> {
    const projectExists = await this.projectRepository.exists(data.projectId);
    if (!projectExists) {
      return null;
    }

    return await this.taskRepository.create(data);
  }
}
