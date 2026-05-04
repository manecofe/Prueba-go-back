import { UpdateTaskStatusUseCase } from '../UpdateTaskStatusUseCase';
import { ITaskRepository } from '../../../../domain/repositories/ITaskRepository';
import { Task } from '../../../../domain/entities/Task';
import { TaskStatus, TaskPriority } from '../../../../domain/entities/enums';

describe('UpdateTaskStatusUseCase', () => {
  let updateTaskStatusUseCase: UpdateTaskStatusUseCase;
  let mockTaskRepository: jest.Mocked<ITaskRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByProjectId: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    updateTaskStatusUseCase = new UpdateTaskStatusUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    it('should update task status successfully when task exists', async () => {
      const taskId = '987e6543-e21b-12d3-a456-426614174000';
      const newStatus = TaskStatus.IN_PROGRESS;

      const updatedTask: Task = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: newStatus,
        priority: TaskPriority.HIGH,
        projectId: '123e4567-e89b-12d3-a456-426614174000',
        dueDate: undefined,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date(),
      };

      mockTaskRepository.exists.mockResolvedValue(true);
      mockTaskRepository.updateStatus.mockResolvedValue(updatedTask);

      const result = await updateTaskStatusUseCase.execute(taskId, newStatus);

      expect(mockTaskRepository.exists).toHaveBeenCalledWith(taskId);
      expect(mockTaskRepository.updateStatus).toHaveBeenCalledWith(taskId, newStatus);
      expect(result).toEqual(updatedTask);
      expect(result?.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should return null when task does not exist', async () => {
      const taskId = 'non-existent-task-id';
      const newStatus = TaskStatus.COMPLETED;

      mockTaskRepository.exists.mockResolvedValue(false);

      const result = await updateTaskStatusUseCase.execute(taskId, newStatus);

      expect(mockTaskRepository.exists).toHaveBeenCalledWith(taskId);
      expect(mockTaskRepository.updateStatus).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle all status transitions', async () => {
      const taskId = '987e6543-e21b-12d3-a456-426614174000';
      const statuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW, TaskStatus.COMPLETED];

      for (const status of statuses) {
        const updatedTask: Task = {
          id: taskId,
          title: 'Test Task',
          description: 'Description',
          status,
          priority: TaskPriority.MEDIUM,
          projectId: '123e4567-e89b-12d3-a456-426614174000',
          dueDate: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockTaskRepository.exists.mockResolvedValue(true);
        mockTaskRepository.updateStatus.mockResolvedValue(updatedTask);

        const result = await updateTaskStatusUseCase.execute(taskId, status);

        expect(result?.status).toBe(status);
      }
    });

    it('should handle repository errors', async () => {
      const taskId = '987e6543-e21b-12d3-a456-426614174000';
      const newStatus = TaskStatus.COMPLETED;

      mockTaskRepository.exists.mockResolvedValue(true);
      const error = new Error('Database connection failed');
      mockTaskRepository.updateStatus.mockRejectedValue(error);

      await expect(updateTaskStatusUseCase.execute(taskId, newStatus)).rejects.toThrow('Database connection failed');
    });
  });
});
