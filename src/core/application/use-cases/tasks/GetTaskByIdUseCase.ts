import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { TaskWithProject } from '../../../domain/entities/Task';

export class GetTaskByIdUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<TaskWithProject | null> {
    return await this.taskRepository.findById(id);
  }
}
