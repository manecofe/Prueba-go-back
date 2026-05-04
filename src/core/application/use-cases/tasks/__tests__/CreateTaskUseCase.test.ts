import { CreateTaskUseCase } from '../CreateTaskUseCase';
import { ITaskRepository } from '../../../../domain/repositories/ITaskRepository';
import { IProjectRepository } from '../../../../domain/repositories/IProjectRepository';
import { Task, CreateTaskData } from '../../../../domain/entities/Task';
import { TaskStatus, TaskPriority } from '../../../../domain/entities/enums';

describe('CreateTaskUseCase', () => {
  let createTaskUseCase: CreateTaskUseCase;
  let mockTaskRepository: jest.Mocked<ITaskRepository>;
  let mockProjectRepository: jest.Mocked<IProjectRepository>;

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

    mockProjectRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    createTaskUseCase = new CreateTaskUseCase(mockTaskRepository, mockProjectRepository);
  });

  describe('execute', () => {
    it('should create a task successfully when project exists', async () => {
      const projectId = '123e4567-e89b-12d3-a456-426614174000';
      const taskData: CreateTaskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.HIGH,
        projectId,
        dueDate: new Date('2026-12-31'),
      };

      const expectedTask: Task = {
        id: '987e6543-e21b-12d3-a456-426614174000',
        ...taskData,
        status: TaskStatus.TODO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProjectRepository.exists.mockResolvedValue(true);
      mockTaskRepository.create.mockResolvedValue(expectedTask);

      const result = await createTaskUseCase.execute(taskData);

      expect(mockProjectRepository.exists).toHaveBeenCalledWith(projectId);
      expect(mockTaskRepository.create).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(expectedTask);
    });

    it('should return null when project does not exist', async () => {
      const projectId = 'non-existent-project-id';
      const taskData: CreateTaskData = {
        title: 'Test Task',
        description: 'Description',
        priority: TaskPriority.MEDIUM,
        projectId,
      };

      mockProjectRepository.exists.mockResolvedValue(false);

      const result = await createTaskUseCase.execute(taskData);

      expect(mockProjectRepository.exists).toHaveBeenCalledWith(projectId);
      expect(mockTaskRepository.create).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should create task without optional fields', async () => {
      const projectId = '123e4567-e89b-12d3-a456-426614174000';
      const taskData: CreateTaskData = {
        title: 'Minimal Task',
        description: 'Minimal description',
        priority: TaskPriority.LOW,
        projectId,
      };

      const expectedTask: Task = {
        id: '987e6543-e21b-12d3-a456-426614174000',
        ...taskData,
        status: TaskStatus.TODO,
        dueDate: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProjectRepository.exists.mockResolvedValue(true);
      mockTaskRepository.create.mockResolvedValue(expectedTask);

      const result = await createTaskUseCase.execute(taskData);

      expect(result).toEqual(expectedTask);
      expect(result?.dueDate).toBeUndefined();
    });

    it('should handle repository errors', async () => {
      const projectId = '123e4567-e89b-12d3-a456-426614174000';
      const taskData: CreateTaskData = {
        title: 'Test Task',
        description: 'Desc',
        priority: TaskPriority.HIGH,
        projectId,
      };

      mockProjectRepository.exists.mockResolvedValue(true);
      const error = new Error('Database connection failed');
      mockTaskRepository.create.mockRejectedValue(error);

      await expect(createTaskUseCase.execute(taskData)).rejects.toThrow('Database connection failed');
    });
  });
});
