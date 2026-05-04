import { GetProjectByIdUseCase } from '../GetProjectByIdUseCase';
import { IProjectRepository } from '../../../../domain/repositories/IProjectRepository';
import { ProjectWithStats } from '../../../../domain/entities/Project';
import { TaskStatus } from '../../../../domain/entities/enums';

describe('GetProjectByIdUseCase', () => {
  let getProjectByIdUseCase: GetProjectByIdUseCase;
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

    getProjectByIdUseCase = new GetProjectByIdUseCase(mockProjectRepository);
  });

  describe('execute', () => {
    it('should return a project with stats when found', async () => {
      const projectId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedProject: ProjectWithStats = {
        id: projectId,
        name: 'Test Project',
        description: 'Test Description',
        color: '#3B82F6',
        createdAt: new Date(),
        updatedAt: new Date(),
        taskCount: 5,
        tasksByStatus: {
          [TaskStatus.TODO]: 2,
          [TaskStatus.IN_PROGRESS]: 1,
          [TaskStatus.IN_REVIEW]: 1,
          [TaskStatus.COMPLETED]: 1,
        },
      };

      mockProjectRepository.findById.mockResolvedValue(expectedProject);

      const result = await getProjectByIdUseCase.execute(projectId);

      expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId);
      expect(mockProjectRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProject);
      expect(result?.taskCount).toBe(5);
    });

    it('should return null when project is not found', async () => {
      const projectId = 'non-existent-id';
      mockProjectRepository.findById.mockResolvedValue(null);

      const result = await getProjectByIdUseCase.execute(projectId);

      expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId);
      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      const projectId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Database connection failed');
      mockProjectRepository.findById.mockRejectedValue(error);

      await expect(getProjectByIdUseCase.execute(projectId)).rejects.toThrow('Database connection failed');
    });
  });
});
