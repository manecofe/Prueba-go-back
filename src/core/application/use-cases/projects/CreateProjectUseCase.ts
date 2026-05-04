import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { Project, CreateProjectData } from '../../../domain/entities/Project';

export class CreateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(data: CreateProjectData): Promise<Project> {
    return await this.projectRepository.create(data);
  }
}
