import { DeleteProjectUseCase } from '../DeleteProjectUseCase';
import { IProjectRepository } from '../../../../domain/repositories/IProjectRepository';

describe('DeleteProjectUseCase', () => {
  let deleteProjectUseCase: DeleteProjectUseCase;
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

    deleteProjectUseCase = new DeleteProjectUseCase(mockProjectRepository);
  });

  describe('execute', () => {
    it('should delete a project successfully when it exists', async () => {
      const projectId = '123e4567-e89b-12d3-a456-426614174000';

      mockProjectRepository.exists.mockResolvedValue(true);
      mockProjectRepository.delete.mockResolvedValue(true);

      const result = await deleteProjectUseCase.execute(projectId);

      expect(mockProjectRepository.exists).toHaveBeenCalledWith(projectId);
      expect(mockProjectRepository.delete).toHaveBeenCalledWith(projectId);
      expect(result).toBe(true);
    });

    it('should return false when project does not exist', async () => {
      const projectId = 'non-existent-id';

      mockProjectRepository.exists.mockResolvedValue(false);

      const result = await deleteProjectUseCase.execute(projectId);

      expect(mockProjectRepository.exists).toHaveBeenCalledWith(projectId);
      expect(mockProjectRepository.delete).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should handle repository errors during existence check', async () => {
      const projectId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Database connection failed');

      mockProjectRepository.exists.mockRejectedValue(error);

      await expect(deleteProjectUseCase.execute(projectId)).rejects.toThrow('Database connection failed');
      expect(mockProjectRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository errors during deletion', async () => {
      const projectId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Failed to delete project');

      mockProjectRepository.exists.mockResolvedValue(true);
      mockProjectRepository.delete.mockRejectedValue(error);

      await expect(deleteProjectUseCase.execute(projectId)).rejects.toThrow('Failed to delete project');
    });
  });
});
