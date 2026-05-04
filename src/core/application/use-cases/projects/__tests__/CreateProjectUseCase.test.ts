import { CreateProjectUseCase } from '../CreateProjectUseCase';
import { IProjectRepository } from '../../../../domain/repositories/IProjectRepository';
import { Project, CreateProjectData } from '../../../../domain/entities/Project';

describe('CreateProjectUseCase', () => {
  let createProjectUseCase: CreateProjectUseCase;
  let mockProjectRepository: jest.Mocked<IProjectRepository>;

  beforeEach(() => {
    mockProjectRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    createProjectUseCase = new CreateProjectUseCase(mockProjectRepository);
  });

  describe('execute', () => {
    it('should create a project successfully', async () => {
      const projectData: CreateProjectData = {
        name: 'Test Project',
        description: 'Test Description',
        color: '#3B82F6',
      };

      const expectedProject: Project = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProjectRepository.create.mockResolvedValue(expectedProject);

      const result = await createProjectUseCase.execute(projectData);

      expect(mockProjectRepository.create).toHaveBeenCalledWith(projectData);
      expect(mockProjectRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProject);
    });

    it('should create a project without description', async () => {
      const projectData: CreateProjectData = {
        name: 'Test Project',
        description: '',
        color: '#3B82F6',
      };

      const expectedProject: Project = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProjectRepository.create.mockResolvedValue(expectedProject);

      const result = await createProjectUseCase.execute(projectData);

      expect(result).toEqual(expectedProject);
      expect(result.description).toBe('');
    });

    it('should handle repository errors', async () => {
      const projectData: CreateProjectData = {
        name: 'Test Project',
        description: 'Test desc',
        color: '#3B82F6',
      };

      const error = new Error('Database connection failed');
      mockProjectRepository.create.mockRejectedValue(error);

      await expect(createProjectUseCase.execute(projectData)).rejects.toThrow('Database connection failed');
    });
  });
});
