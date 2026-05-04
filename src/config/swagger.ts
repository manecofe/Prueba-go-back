import swaggerJsdoc from 'swagger-jsdoc';
import { TaskStatus, TaskPriority } from '../core/domain/entities/enums';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'REST API for managing projects and tasks with Clean Architecture',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Projects',
        description: 'Project management endpoints',
      },
      {
        name: 'Tasks',
        description: 'Task management endpoints',
      },
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
    ],
    components: {
      schemas: {
        Project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            name: {
              type: 'string',
              example: 'Website Redesign',
            },
            description: {
              type: 'string',
              nullable: true,
              example: 'Complete overhaul of company website',
            },
            color: {
              type: 'string',
              pattern: '^#[0-9A-Fa-f]{6}$',
              example: '#3B82F6',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ProjectWithStats: {
          allOf: [
            { $ref: '#/components/schemas/Project' },
            {
              type: 'object',
              properties: {
                taskCount: {
                  type: 'integer',
                  example: 12,
                },
                tasksByStatus: {
                  type: 'object',
                  properties: {
                    TODO: { type: 'integer' },
                    IN_PROGRESS: { type: 'integer' },
                    IN_REVIEW: { type: 'integer' },
                    COMPLETED: { type: 'integer' },
                  },
                },
              },
            },
          ],
        },
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
              example: 'Design homepage mockup',
            },
            description: {
              type: 'string',
              nullable: true,
              example: 'Create a modern, responsive design for the homepage',
            },
            status: {
              type: 'string',
              enum: Object.values(TaskStatus),
              example: 'TODO',
            },
            priority: {
              type: 'string',
              enum: Object.values(TaskPriority),
              example: 'HIGH',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            projectId: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        TaskWithProject: {
          allOf: [
            { $ref: '#/components/schemas/Task' },
            {
              type: 'object',
              properties: {
                projectName: {
                  type: 'string',
                  example: 'Website Redesign',
                },
              },
            },
          ],
        },
        CreateProject: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              example: 'Mobile App Development',
            },
            description: {
              type: 'string',
              maxLength: 500,
              example: 'Build a cross-platform mobile app',
            },
            color: {
              type: 'string',
              pattern: '^#[0-9A-Fa-f]{6}$',
              example: '#10B981',
            },
          },
        },
        UpdateProject: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
            },
            description: {
              type: 'string',
              maxLength: 500,
            },
            color: {
              type: 'string',
              pattern: '^#[0-9A-Fa-f]{6}$',
            },
          },
        },
        CreateTask: {
          type: 'object',
          required: ['title', 'projectId', 'status', 'priority'],
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              example: 'Implement user authentication',
            },
            description: {
              type: 'string',
              maxLength: 1000,
              example: 'Add JWT-based authentication system',
            },
            status: {
              type: 'string',
              enum: Object.values(TaskStatus),
              example: 'TODO',
            },
            priority: {
              type: 'string',
              enum: Object.values(TaskPriority),
              example: 'HIGH',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
            },
            projectId: {
              type: 'string',
              format: 'uuid',
            },
          },
        },
        UpdateTask: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
            },
            description: {
              type: 'string',
              maxLength: 1000,
            },
            status: {
              type: 'string',
              enum: Object.values(TaskStatus),
            },
            priority: {
              type: 'string',
              enum: Object.values(TaskPriority),
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
            },
            projectId: {
              type: 'string',
              format: 'uuid',
            },
          },
        },
        UpdateTaskStatus: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: Object.values(TaskStatus),
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Resource not found',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/presentation/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
