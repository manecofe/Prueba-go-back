import { PrismaClient, TaskStatus as PrismaTaskStatus } from '@prisma/client';
import { IProjectRepository } from '../../core/domain/repositories/IProjectRepository';
import { Project, ProjectWithStats, CreateProjectData, UpdateProjectData } from '../../core/domain/entities/Project';
import { TaskStatus } from '../../core/domain/entities/enums';

export class PrismaProjectRepository implements IProjectRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<ProjectWithStats[]> {
    const projects = await this.prisma.project.findMany({
      include: {
        tasks: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return projects.map((project) => this.mapToProjectWithStats(project));
  }

  async findById(id: string): Promise<ProjectWithStats | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!project) {
      return null;
    }

    return this.mapToProjectWithStats(project);
  }

  async create(data: CreateProjectData): Promise<Project> {
    return await this.prisma.project.create({
      data,
    });
  }

  async update(id: string, data: UpdateProjectData): Promise<Project | null> {
    try {
      return await this.prisma.project.update({
        where: { id },
        data,
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.project.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.project.count({
      where: { id },
    });
    return count > 0;
  }

  private mapToProjectWithStats(project: any): ProjectWithStats {
    const tasksByStatus = {
      TODO: 0,
      IN_PROGRESS: 0,
      IN_REVIEW: 0,
      COMPLETED: 0,
    };

    project.tasks.forEach((task: { status: PrismaTaskStatus }) => {
      tasksByStatus[task.status as TaskStatus]++;
    });

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      color: project.color,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      taskCount: project.tasks.length,
      tasksByStatus,
    };
  }
}
