import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { Task } from '../../../domain/entities/Task';
import { TaskStatus } from '../../../domain/entities/enums';

export class UpdateTaskStatusUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string, status: TaskStatus): Promise<Task | null> {
    const exists = await this.taskRepository.exists(id);
    if (!exists) {
      return null;
    }

    return await this.taskRepository.updateStatus(id, status);
  }
}
