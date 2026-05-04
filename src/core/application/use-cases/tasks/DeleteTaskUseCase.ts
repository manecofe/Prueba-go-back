import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';

export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<boolean> {
    const exists = await this.taskRepository.exists(id);
    if (!exists) {
      return false;
    }

    return await this.taskRepository.delete(id);
  }
}
