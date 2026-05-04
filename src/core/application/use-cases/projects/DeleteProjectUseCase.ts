import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';

export class DeleteProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<boolean> {
    const exists = await this.projectRepository.exists(id);
    if (!exists) {
      return false;
    }

    return await this.projectRepository.delete(id);
  }
}
