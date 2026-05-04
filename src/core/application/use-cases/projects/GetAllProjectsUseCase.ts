import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { ProjectWithStats } from '../../../domain/entities/Project';

export class GetAllProjectsUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(): Promise<ProjectWithStats[]> {
    return await this.projectRepository.findAll();
  }
}
