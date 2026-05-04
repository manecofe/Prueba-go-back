import { Request, Response } from 'express';
import { GetAllProjectsUseCase } from '../../core/application/use-cases/projects/GetAllProjectsUseCase';
import { GetProjectByIdUseCase } from '../../core/application/use-cases/projects/GetProjectByIdUseCase';
import { CreateProjectUseCase } from '../../core/application/use-cases/projects/CreateProjectUseCase';
import { UpdateProjectUseCase } from '../../core/application/use-cases/projects/UpdateProjectUseCase';
import { DeleteProjectUseCase } from '../../core/application/use-cases/projects/DeleteProjectUseCase';
import { CreateProjectSchema, UpdateProjectSchema } from '../../core/dtos/ProjectDTO';
import { ZodError } from 'zod';

export class ProjectController {
  constructor(
    private getAllProjectsUseCase: GetAllProjectsUseCase,
    private getProjectByIdUseCase: GetProjectByIdUseCase,
    private createProjectUseCase: CreateProjectUseCase,
    private updateProjectUseCase: UpdateProjectUseCase,
    private deleteProjectUseCase: DeleteProjectUseCase
  ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const projects = await this.getAllProjectsUseCase.execute();
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error getting projects:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await this.getProjectByIdUseCase.execute(id);

      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      res.status(200).json(project);
    } catch (error) {
      console.error('Error getting project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = CreateProjectSchema.parse(req.body);
      const project = await this.createProjectUseCase.execute(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
        return;
      }
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = UpdateProjectSchema.parse(req.body);
      const project = await this.updateProjectUseCase.execute(id, validatedData);

      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      res.status(200).json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
        return;
      }
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.deleteProjectUseCase.execute(id);

      if (!deleted) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
