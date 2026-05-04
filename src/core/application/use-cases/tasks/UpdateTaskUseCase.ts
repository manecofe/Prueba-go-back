import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { Task, UpdateTaskData } from '../../../domain/entities/Task';

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string, data: UpdateTaskData): Promise<Task | null> {
    const exists = await this.taskRepository.exists(id);
    if (!exists) {
      return null;
    }

    return await this.taskRepository.update(id, data);
  }
}
