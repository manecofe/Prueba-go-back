# Architecture Documentation

This document describes the Clean Architecture implementation used in this backend API.

## 🏗️ Clean Architecture Overview

This project follows **Clean Architecture** principles, separating concerns into distinct layers with clear dependencies flowing from outer layers to inner layers.

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  (Controllers, Routes, Middlewares, HTTP Handlers)          │
│                                                              │
│  Dependencies: Express, Zod                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│              (Use Cases, Business Logic)                     │
│                                                              │
│  Dependencies: Domain Entities, Repository Interfaces        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                             │
│        (Entities, Interfaces, Business Rules)                │
│                                                              │
│  Dependencies: NONE (Pure TypeScript)                        │
└─────────────────────────────────────────────────────────────┘
                     ↑
                     │
┌────────────────────┴────────────────────────────────────────┐
│                 Infrastructure Layer                         │
│         (Database, Repositories, External Services)          │
│                                                              │
│  Dependencies: Prisma, PostgreSQL                            │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
src/
├── core/                           # Core business logic
│   ├── domain/                     # Domain Layer (innermost)
│   │   ├── entities/               # Business entities
│   │   │   ├── Project.ts          # Project entity & types
│   │   │   ├── Task.ts             # Task entity & types
│   │   │   └── enums.ts            # Shared enums
│   │   └── repositories/           # Repository interfaces
│   │       ├── IProjectRepository.ts
│   │       └── ITaskRepository.ts
│   │
│   ├── application/                # Application Layer
│   │   └── use-cases/              # Business use cases
│   │       ├── projects/           # Project use cases
│   │       │   ├── GetAllProjectsUseCase.ts
│   │       │   ├── GetProjectByIdUseCase.ts
│   │       │   ├── CreateProjectUseCase.ts
│   │       │   ├── UpdateProjectUseCase.ts
│   │       │   └── DeleteProjectUseCase.ts
│   │       └── tasks/              # Task use cases
│   │           ├── GetAllTasksUseCase.ts
│   │           ├── GetTaskByIdUseCase.ts
│   │           ├── GetTasksByProjectIdUseCase.ts
│   │           ├── CreateTaskUseCase.ts
│   │           ├── UpdateTaskUseCase.ts
│   │           ├── UpdateTaskStatusUseCase.ts
│   │           └── DeleteTaskUseCase.ts
│   │
│   └── dtos/                       # Data Transfer Objects
│       ├── ProjectDTO.ts           # Project DTOs with Zod schemas
│       └── TaskDTO.ts              # Task DTOs with Zod schemas
│
├── infrastructure/                 # Infrastructure Layer (outermost)
│   ├── database/
│   │   └── prisma.ts               # Prisma client instance
│   └── repositories/               # Repository implementations
│       ├── PrismaProjectRepository.ts
│       └── PrismaTaskRepository.ts
│
├── presentation/                   # Presentation Layer
│   ├── controllers/                # HTTP controllers
│   │   ├── ProjectController.ts
│   │   └── TaskController.ts
│   ├── middlewares/                # Express middlewares
│   │   ├── cors.ts
│   │   └── errorHandler.ts
│   └── routes/                     # Express routes
│       ├── projectRoutes.ts
│       ├── taskRoutes.ts
│       └── projectTaskRoutes.ts
│
└── main.ts                         # Application entry point
```

## 🎯 Layer Responsibilities

### 1. Domain Layer (Core/Domain)

**Purpose:** Contains the business entities and rules. No external dependencies.

**Components:**
- **Entities:** Define the structure of business objects (Project, Task)
- **Repository Interfaces:** Define contracts for data access without implementation details
- **Enums:** Shared enumerations (TaskStatus, TaskPriority)

**Rules:**
- ✅ Pure TypeScript/JavaScript
- ✅ No external library dependencies
- ✅ No framework dependencies
- ✅ Contains business rules and validations
- ❌ Should NOT know about databases
- ❌ Should NOT know about HTTP

**Example:**
```typescript
// core/domain/entities/Project.ts
export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Application Layer (Core/Application)

**Purpose:** Orchestrates business logic through use cases. Depends only on Domain layer.

**Components:**
- **Use Cases:** Implement specific business operations
- **DTOs:** Define data structures for input/output with validation

**Rules:**
- ✅ Can depend on Domain layer
- ✅ Implements business workflows
- ✅ Technology agnostic
- ❌ Should NOT know about HTTP/REST
- ❌ Should NOT know about databases
- ❌ Should NOT implement repository logic

**Example:**
```typescript
// core/application/use-cases/projects/CreateProjectUseCase.ts
export class CreateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(data: CreateProjectData): Promise<Project> {
    return await this.projectRepository.create(data);
  }
}
```

### 3. Infrastructure Layer

**Purpose:** Implements technical details like database access. Depends on Domain interfaces.

**Components:**
- **Database Client:** Prisma configuration
- **Repository Implementations:** Concrete implementations of repository interfaces
- **External Services:** Third-party integrations (future: email, storage, etc.)

**Rules:**
- ✅ Implements domain repository interfaces
- ✅ Can use external libraries (Prisma, etc.)
- ✅ Handles database queries and connections
- ❌ Should NOT contain business logic
- ❌ Should NOT know about HTTP/controllers

**Example:**
```typescript
// infrastructure/repositories/PrismaProjectRepository.ts
export class PrismaProjectRepository implements IProjectRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<ProjectWithStats[]> {
    const projects = await this.prisma.project.findMany({
      include: { tasks: true },
    });
    return projects.map(this.mapToProjectWithStats);
  }
}
```

### 4. Presentation Layer

**Purpose:** Handles HTTP communication. Depends on Application layer (use cases).

**Components:**
- **Controllers:** Handle HTTP requests and responses
- **Routes:** Define API endpoints
- **Middlewares:** CORS, error handling, authentication (future)

**Rules:**
- ✅ Handles HTTP concerns (request/response)
- ✅ Validates request data (using DTOs)
- ✅ Maps HTTP status codes
- ❌ Should NOT contain business logic
- ❌ Should NOT directly access database

**Example:**
```typescript
// presentation/controllers/ProjectController.ts
export class ProjectController {
  constructor(private getAllProjectsUseCase: GetAllProjectsUseCase) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const projects = await this.getAllProjectsUseCase.execute();
    res.status(200).json(projects);
  }
}
```

## 🔄 Dependency Flow

```
main.ts (Composition Root)
   ↓
Creates instances following this flow:
   ↓
1. Infrastructure Layer (Repositories)
   → PrismaProjectRepository
   → PrismaTaskRepository
   ↓
2. Application Layer (Use Cases)
   → GetAllProjectsUseCase(projectRepository)
   → CreateTaskUseCase(taskRepository, projectRepository)
   ↓
3. Presentation Layer (Controllers)
   → ProjectController(useCases...)
   → TaskController(useCases...)
   ↓
4. Routes (Express)
   → projectRoutes(projectController)
   → taskRoutes(taskController)
```

## 🎯 Key Principles Applied

### 1. Dependency Inversion Principle (DIP)
- High-level modules (use cases) don't depend on low-level modules (repositories)
- Both depend on abstractions (interfaces)

### 2. Single Responsibility Principle (SRP)
- Each class has one reason to change
- Controllers handle HTTP, Use Cases handle business logic, Repositories handle data

### 3. Interface Segregation Principle (ISP)
- Repository interfaces are focused and specific
- Clients only depend on methods they use

### 4. Open/Closed Principle (OCP)
- Easy to extend with new use cases without modifying existing code
- New repositories can be added without changing use cases

## 🔌 Dependency Injection

All dependencies are injected through constructors:

```typescript
// Infrastructure → Application
const projectRepository = new PrismaProjectRepository(prisma);
const createProjectUseCase = new CreateProjectUseCase(projectRepository);

// Application → Presentation
const projectController = new ProjectController(
  getAllProjectsUseCase,
  getProjectByIdUseCase,
  createProjectUseCase,
  updateProjectUseCase,
  deleteProjectUseCase
);
```

## 📝 Data Flow Example

**User Request:** `POST /api/projects`

```
1. HTTP Request arrives at Express
   ↓
2. Route directs to ProjectController.create()
   ↓
3. Controller validates with Zod (DTO)
   ↓
4. Controller calls CreateProjectUseCase.execute()
   ↓
5. Use Case calls projectRepository.create()
   ↓
6. Repository uses Prisma to insert into PostgreSQL
   ↓
7. Database returns created project
   ↓
8. Repository returns Project entity
   ↓
9. Use Case returns Project to Controller
   ↓
10. Controller sends HTTP 201 response with JSON
```

## 🧪 Testing Strategy

Clean Architecture enables easy testing at each layer:

### Unit Tests (Domain & Application)
```typescript
// Test use cases with mock repositories
const mockRepository = {
  create: jest.fn().mockResolvedValue(mockProject),
};
const useCase = new CreateProjectUseCase(mockRepository);
```

### Integration Tests (Infrastructure)
```typescript
// Test repositories with real database
const repository = new PrismaProjectRepository(prisma);
const result = await repository.create(testData);
```

### E2E Tests (Presentation)
```typescript
// Test API endpoints with supertest
const response = await request(app)
  .post('/api/projects')
  .send(testData);
```

## 🚀 Benefits

1. **Testability:** Easy to mock dependencies at each layer
2. **Maintainability:** Clear separation of concerns
3. **Flexibility:** Easy to swap implementations (e.g., MongoDB instead of PostgreSQL)
4. **Scalability:** Add new features without modifying existing code
5. **Independence:** Business logic independent of frameworks and databases

## 🔄 Adding New Features

### Example: Add a new "Comments" feature

1. **Domain Layer:**
   - Create `Comment.ts` entity
   - Create `ICommentRepository.ts` interface

2. **Application Layer:**
   - Create use cases in `use-cases/comments/`
   - Create `CommentDTO.ts` with validation

3. **Infrastructure Layer:**
   - Create `PrismaCommentRepository.ts`
   - Update Prisma schema

4. **Presentation Layer:**
   - Create `CommentController.ts`
   - Create `commentRoutes.ts`
   - Wire up in `main.ts`

## 📚 References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)

---

This architecture ensures the codebase remains **clean, testable, and maintainable** as the project grows.
