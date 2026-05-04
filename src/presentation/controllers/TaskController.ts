import { Request, Response } from 'express';
import { GetAllTasksUseCase } from '../../core/application/use-cases/tasks/GetAllTasksUseCase';
import { GetTaskByIdUseCase } from '../../core/application/use-cases/tasks/GetTaskByIdUseCase';
import { GetTasksByProjectIdUseCase } from '../../core/application/use-cases/tasks/GetTasksByProjectIdUseCase';
import { CreateTaskUseCase } from '../../core/application/use-cases/tasks/CreateTaskUseCase';
import { UpdateTaskUseCase } from '../../core/application/use-cases/tasks/UpdateTaskUseCase';
import { UpdateTaskStatusUseCase } from '../../core/application/use-cases/tasks/UpdateTaskStatusUseCase';
import { DeleteTaskUseCase } from '../../core/application/use-cases/tasks/DeleteTaskUseCase';
import { 
  CreateTaskSchema, 
  UpdateTaskSchema, 
  UpdateTaskStatusSchema,
  TaskFiltersSchema 
} from '../../core/dtos/TaskDTO';
import { ZodError } from 'zod';

export class TaskController {
  constructor(
    private getAllTasksUseCase: GetAllTasksUseCase,
    private getTaskByIdUseCase: GetTaskByIdUseCase,
    private getTasksByProjectIdUseCase: GetTasksByProjectIdUseCase,
    private createTaskUseCase: CreateTaskUseCase,
    private updateTaskUseCase: UpdateTaskUseCase,
    private updateTaskStatusUseCase: UpdateTaskStatusUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase
  ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters = TaskFiltersSchema.parse(req.query);
      const tasks = await this.getAllTasksUseCase.execute(filters);
      res.status(200).json(tasks);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: 'Invalid query parameters', 
          details: error.errors 
        });
        return;
      }
      console.error('Error getting tasks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.getTaskByIdUseCase.execute(id);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      console.error('Error getting task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getByProjectId(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const tasks = await this.getTasksByProjectIdUseCase.execute(projectId);
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error getting tasks by project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = CreateTaskSchema.parse(req.body);
      const task = await this.createTaskUseCase.execute(validatedData);

      if (!task) {
        res.status(400).json({ error: 'Project not found' });
        return;
      }

      res.status(201).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
        return;
      }
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = UpdateTaskSchema.parse(req.body);
      const task = await this.updateTaskUseCase.execute(id, validatedData);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
        return;
      }
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = UpdateTaskStatusSchema.parse(req.body);
      const task = await this.updateTaskStatusUseCase.execute(id, status);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
        return;
      }
      console.error('Error updating task status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.deleteTaskUseCase.execute(id);

      if (!deleted) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
