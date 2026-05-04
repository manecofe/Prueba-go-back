import express, { Express } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { prisma } from './infrastructure/database/prisma';
import { corsMiddleware } from './presentation/middlewares/cors';
import { errorHandler, notFoundHandler } from './presentation/middlewares/errorHandler';
import { PrismaProjectRepository } from './infrastructure/repositories/PrismaProjectRepository';
import { PrismaTaskRepository } from './infrastructure/repositories/PrismaTaskRepository';
import { GetAllProjectsUseCase } from './core/application/use-cases/projects/GetAllProjectsUseCase';
import { GetProjectByIdUseCase } from './core/application/use-cases/projects/GetProjectByIdUseCase';
import { CreateProjectUseCase } from './core/application/use-cases/projects/CreateProjectUseCase';
import { UpdateProjectUseCase } from './core/application/use-cases/projects/UpdateProjectUseCase';
import { DeleteProjectUseCase } from './core/application/use-cases/projects/DeleteProjectUseCase';
import { GetAllTasksUseCase } from './core/application/use-cases/tasks/GetAllTasksUseCase';
import { GetTaskByIdUseCase } from './core/application/use-cases/tasks/GetTaskByIdUseCase';
import { GetTasksByProjectIdUseCase } from './core/application/use-cases/tasks/GetTasksByProjectIdUseCase';
import { CreateTaskUseCase } from './core/application/use-cases/tasks/CreateTaskUseCase';
import { UpdateTaskUseCase } from './core/application/use-cases/tasks/UpdateTaskUseCase';
import { UpdateTaskStatusUseCase } from './core/application/use-cases/tasks/UpdateTaskStatusUseCase';
import { DeleteTaskUseCase } from './core/application/use-cases/tasks/DeleteTaskUseCase';
import { ProjectController } from './presentation/controllers/ProjectController';
import { TaskController } from './presentation/controllers/TaskController';
import { createProjectRoutes } from './presentation/routes/projectRoutes';
import { createTaskRoutes } from './presentation/routes/taskRoutes';
import { createProjectTaskRoutes } from './presentation/routes/projectTaskRoutes';

dotenv.config();

const PORT = process.env.PORT || 4000;
const projectRepository = new PrismaProjectRepository(prisma);
const taskRepository = new PrismaTaskRepository(prisma);

// Initialize use cases - Projects
const getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepository);
const getProjectByIdUseCase = new GetProjectByIdUseCase(projectRepository);
const createProjectUseCase = new CreateProjectUseCase(projectRepository);
const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);
const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository);

const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
const getTaskByIdUseCase = new GetTaskByIdUseCase(taskRepository);
const getTasksByProjectIdUseCase = new GetTasksByProjectIdUseCase(taskRepository);
const createTaskUseCase = new CreateTaskUseCase(taskRepository, projectRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const updateTaskStatusUseCase = new UpdateTaskStatusUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

const projectController = new ProjectController(
  getAllProjectsUseCase,
  getProjectByIdUseCase,
  createProjectUseCase,
  updateProjectUseCase,
  deleteProjectUseCase
);

const taskController = new TaskController(
  getAllTasksUseCase,
  getTaskByIdUseCase,
  getTasksByProjectIdUseCase,
  createTaskUseCase,
  updateTaskUseCase,
  updateTaskStatusUseCase,
  deleteTaskUseCase
);

const app: Express = express();
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Task Manager API Docs',
}));

app.use('/api/projects', createProjectRoutes(projectController));
app.use('/api/projects', createProjectTaskRoutes(taskController));
app.use('/api/tasks', createTaskRoutes(taskController));

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`� API Docs available at http://localhost:${PORT}/api-docs`);
  console.log(`�📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
