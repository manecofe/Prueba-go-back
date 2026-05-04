import { PrismaClient, TaskStatus as PrismaTaskStatus, TaskPriority as PrismaTaskPriority } from '@prisma/client';
import { ITaskRepository } from '../../core/domain/repositories/ITaskRepository';
import { Task, TaskWithProject, CreateTaskData, UpdateTaskData, TaskFilters } from '../../core/domain/entities/Task';
import { TaskStatus } from '../../core/domain/entities/enums';

export class PrismaTaskRepository implements ITaskRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(filters?: TaskFilters): Promise<TaskWithProject[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.priority) {
      where.priority = filters.priority;
    }
    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks.map((task) => this.mapToTaskWithProject(task));
  }

  async findById(id: string): Promise<TaskWithProject | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!task) {
      return null;
    }

    return this.mapToTaskWithProject(task);
  }

  async findByProjectId(projectId: string): Promise<TaskWithProject[]> {
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks.map((task) => this.mapToTaskWithProject(task));
  }

  async create(data: CreateTaskData): Promise<Task> {
    return await this.prisma.task.create({
      data: {
        ...data,
        status: 'TODO' as PrismaTaskStatus,
      },
    });
  }

  async update(id: string, data: UpdateTaskData): Promise<Task | null> {
    try {
      const updateData: any = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null) {
          updateData[key] = value;
        }
      });

      return await this.prisma.task.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      return null;
    }
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task | null> {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: { status: status as PrismaTaskStatus },
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.task.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.task.count({
      where: { id },
    });
    return count > 0;
  }

  private mapToTaskWithProject(task: any): TaskWithProject {
    return {
      id: task.id,
      projectId: task.projectId,
      title: task.title,
      description: task.description,
      status: task.status as TaskStatus,
      priority: task.priority,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      projectName: task.project.name,
    };
  }
}
