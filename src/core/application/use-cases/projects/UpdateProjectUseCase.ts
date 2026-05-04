import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { Project, UpdateProjectData } from '../../../domain/entities/Project';

export class UpdateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string, data: UpdateProjectData): Promise<Project | null> {
    const exists = await this.projectRepository.exists(id);
    if (!exists) {
      return null;
    }

    return await this.projectRepository.update(id, data);
  }
}
