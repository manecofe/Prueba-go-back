import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { ProjectWithStats } from '../../../domain/entities/Project';

export class GetProjectByIdUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<ProjectWithStats | null> {
    return await this.projectRepository.findById(id);
  }
}
