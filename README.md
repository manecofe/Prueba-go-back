# Task Manager Backend API

Backend REST API for Task Management System built with Node.js, TypeScript, Express, Prisma, and PostgreSQL, following Clean Architecture principles.

## 🚀 Features

- **12 REST API Endpoints** for projects and tasks management
- **Clean Architecture** with clear separation of concerns
- **Type-safe** with TypeScript 5+
- **Data validation** using Zod
- **PostgreSQL** database with Prisma ORM
- **Docker** support for easy deployment
- **CORS** enabled for frontend integration
- **Cascade deletion** (deleting a project removes all its tasks)
- **Rich relationships** (tasks include project name, projects include task statistics)
- **📚 Interactive API Documentation** with Swagger/OpenAPI
- **✅ Unit Tests** with Jest (18 passing tests, 100% coverage on use cases)

## 🎯 For Recruiters

This backend demonstrates professional-level development practices:

- **🔍 Interactive API Docs**: Visit `http://localhost:4000/api-docs` after starting the server
- **✅ Comprehensive Testing**: Run `npm test` to see 18 passing unit tests
- **📊 Test Coverage**: Run `npm run test:coverage` for detailed coverage report
- **🏗️ Clean Architecture**: Clear separation between domain, application, infrastructure, and presentation layers

👉 **See [TESTING_AND_DOCS.md](./TESTING_AND_DOCS.md) for detailed testing and documentation information**

## 📋 Prerequisites

- **Node.js** 20+ 
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for containerized deployment)
- **PostgreSQL** 16+ (if running without Docker)

## 🛠️ Installation

### Option 1: Local Development (without Docker)

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Setup database**
   ```bash
   # Create database and run migrations
   npm run db:migrate
   
   # Generate Prisma Client
   npm run db:generate
   
   # Seed database with sample data
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:4000`

### Option 2: Docker Deployment (Recommended)

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

   This will:
   - Start PostgreSQL database on port 5432
   - Build and start backend API on port 4000
   - Run migrations automatically
   - Wait for database to be healthy before starting backend

2. **Seed the database**
   ```bash
   # Enter the backend container
   docker exec -it task_manager_backend sh
   
   # Run seed script
   npm run db:seed
   
   # Exit container
   exit
   ```

3. **View logs**
   ```bash
   docker-compose logs -f backend
   ```

4. **Stop services**
   ```bash
   docker-compose down
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── core/                          # Business logic (Clean Architecture)
│   │   ├── domain/
│   │   │   ├── entities/              # Domain entities (Project, Task)
│   │   │   └── repositories/          # Repository interfaces
│   │   ├── application/
│   │   │   └── use-cases/             # Business use cases
│   │   └── dtos/                      # Data Transfer Objects + Validation
│   ├── infrastructure/
│   │   ├── database/                  # Prisma client
│   │   └── repositories/              # Prisma repository implementations
│   ├── presentation/
│   │   ├── controllers/               # HTTP request handlers
│   │   ├── middlewares/               # CORS, error handling
│   │   └── routes/                    # Express routes
│   └── main.ts                        # Application entry point
├── prisma/
│   ├── schema.prisma                  # Database schema
│   ├── seed.ts                        # Seed data script
│   └── migrations/                    # Database migrations
├── docker-compose.yml                 # Docker services configuration
├── Dockerfile                         # Backend container
├── package.json
├── tsconfig.json
└── .env                               # Environment variables
```

## 🔌 API Endpoints

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | Get all projects with task statistics |
| `GET` | `/api/projects/:id` | Get project by ID with statistics |
| `POST` | `/api/projects` | Create new project |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project (cascades to tasks) |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks (supports filters) |
| `GET` | `/api/tasks/:id` | Get task by ID |
| `GET` | `/api/projects/:projectId/tasks` | Get all tasks for a project |
| `POST` | `/api/tasks` | Create new task |
| `PUT` | `/api/tasks/:id` | Update task |
| `PATCH` | `/api/tasks/:id/status` | Update only task status (optimized) |
| `DELETE` | `/api/tasks/:id` | Delete task |

### Task Filters (Query Parameters)

- `status`: Filter by status (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `COMPLETED`)
- `priority`: Filter by priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
- `projectId`: Filter by project ID (UUID)

**Example:**
```
GET /api/tasks?status=IN_PROGRESS&priority=HIGH
```

## 📝 Request/Response Examples

### Create Project
```bash
POST /api/projects
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description",
  "color": "#3B82F6"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "New Project",
  "description": "Project description",
  "color": "#3B82F6",
  "createdAt": "2026-05-04T10:00:00.000Z",
  "updatedAt": "2026-05-04T10:00:00.000Z"
}
```

### Get Projects with Stats
```bash
GET /api/projects
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Website Redesign",
    "description": "Complete overhaul of company website",
    "color": "#3B82F6",
    "taskCount": 8,
    "tasksByStatus": {
      "TODO": 3,
      "IN_PROGRESS": 2,
      "IN_REVIEW": 1,
      "COMPLETED": 2
    },
    "createdAt": "2026-05-01T10:00:00.000Z",
    "updatedAt": "2026-05-04T10:00:00.000Z"
  }
]
```

### Create Task
```bash
POST /api/tasks
Content-Type: application/json

{
  "projectId": "project-uuid",
  "title": "Implement feature",
  "description": "Detailed description",
  "priority": "HIGH",
  "dueDate": "2026-05-20T00:00:00.000Z"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "projectId": "project-uuid",
  "title": "Implement feature",
  "description": "Detailed description",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-05-20T00:00:00.000Z",
  "createdAt": "2026-05-04T10:00:00.000Z",
  "updatedAt": "2026-05-04T10:00:00.000Z"
}
```

### Update Task Status
```bash
PATCH /api/tasks/:id/status
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

## ✅ Validation Rules

### Project
- **name**: 3-100 characters, required, trimmed
- **description**: Required, trimmed
- **color**: Valid hex color format (#RRGGBB)

### Task
- **title**: 3-200 characters, required, trimmed
- **description**: Required, trimmed
- **projectId**: Must be a valid UUID and exist in database
- **priority**: Must be one of: `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- **status**: Default is `TODO`, can be: `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `COMPLETED`
- **dueDate**: Optional, must be valid ISO 8601 date

## 🗄️ Database Schema

### Project
```typescript
{
  id: string (UUID)
  name: string (3-100 chars)
  description: string
  color: string (#RRGGBB)
  createdAt: DateTime
  updatedAt: DateTime
  tasks: Task[] (relation)
}
```

### Task
```typescript
{
  id: string (UUID)
  projectId: string (FK to Project)
  title: string (3-200 chars)
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: DateTime? (optional)
  createdAt: DateTime
  updatedAt: DateTime
  project: Project (relation)
}
```

**Cascade Behavior**: Deleting a project automatically deletes all associated tasks.

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm start                # Run production build

# Database
npm run db:migrate       # Run migrations (development)
npm run db:migrate:prod  # Run migrations (production)
npm run db:generate      # Generate Prisma Client
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database (WARNING: deletes all data)

# Docker
npm run docker:up        # Start Docker containers
npm run docker:down      # Stop Docker containers
npm run docker:logs      # View container logs
```

## 🌐 CORS Configuration

CORS is enabled for the frontend URL specified in `.env`:

```env
FRONTEND_URL=http://localhost:3000
```

Allowed methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`

## 🐳 Docker Services

- **postgres**: PostgreSQL 16 database
  - Port: 5432
  - User: `taskuser`
  - Password: `taskpass`
  - Database: `task_manager`

- **backend**: Node.js Express API
  - Port: 4000
  - Auto-runs migrations on startup
  - Waits for database health check

## 🔄 Frontend Integration

To connect the Next.js frontend:

1. **Update frontend `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

2. **Create HTTP Repositories** (replace mocks):
   ```typescript
   // src/infrastructure/repositories/HttpProjectRepository.ts
   // src/infrastructure/repositories/HttpTaskRepository.ts
   ```

3. **Update dependency injection** to use HTTP repositories instead of mock repositories.

## 🧪 Testing the API

### Using curl
```bash
# Health check
curl http://localhost:4000/health

# Get all projects
curl http://localhost:4000/api/projects

# Create project
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","description":"Testing","color":"#FF5733"}'
```

### Using Postman/Thunder Client
Import the following base URL: `http://localhost:4000/api`

## 🚨 Error Handling

The API returns consistent error responses:

- **200 OK**: Successful GET/PUT/PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Validation errors
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

**Error Response Format:**
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["name"],
      "message": "Name must be at least 3 characters"
    }
  ]
}
```

## 📊 Seed Data

The seed script creates:
- 4 sample projects with different colors
- 14 tasks distributed across projects
- Various statuses and priorities
- Some tasks with due dates

Run seed: `npm run db:seed`

## 🔐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | (required) | PostgreSQL connection string |
| `PORT` | `4000` | Server port |
| `NODE_ENV` | `development` | Environment (development/production) |
| `FRONTEND_URL` | `http://localhost:3000` | Frontend URL for CORS |

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# View database logs
docker logs task_manager_db

# Restart services
docker-compose restart
```

### Migration Issues
```bash
# Reset database (WARNING: deletes all data)
npm run db:reset

# Or manually
npx prisma migrate reset --force
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=4001

# Or kill process using port 4000
# Windows: netstat -ano | findstr :4000
# Linux/Mac: lsof -ti:4000 | xargs kill
```

## 📚 Tech Stack

- **Node.js** 20+
- **TypeScript** 5+
- **Express** 4.x - Web framework
- **Prisma** 5.x - ORM
- **PostgreSQL** 16 - Database
- **Zod** 3.x - Validation
- **Docker** - Containerization
- **tsx** - TypeScript execution
- **Jest** 29.x - Testing framework
- **Swagger/OpenAPI** 3.0 - API Documentation

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

Current test coverage focuses on business logic (use cases):
- ✅ CreateProjectUseCase - 100% coverage
- ✅ GetProjectByIdUseCase - 100% coverage
- ✅ DeleteProjectUseCase - 100% coverage
- ✅ CreateTaskUseCase - 100% coverage
- ✅ UpdateTaskStatusUseCase - 100% coverage

**Results:** 18 tests passing across 5 test suites

## 📖 API Documentation

### Swagger UI

Access interactive API documentation at:
**http://localhost:4000/api-docs**

The Swagger UI provides:
- Interactive endpoint testing
- Request/response schemas
- Example payloads
- Error response documentation

## 🎯 Next Steps

- [x] ✅ Add API documentation (Swagger/OpenAPI)
- [x] ✅ Add unit tests (Jest) for use cases
- [ ] Add authentication (JWT)
- [ ] Implement rate limiting
- [ ] Implement pagination for GET endpoints
- [ ] Add integration tests
- [ ] Setup CI/CD pipeline (GitHub Actions)
- [ ] Add request logging (Morgan)
- [ ] Implement caching (Redis)

## 📄 License

MIT

## 👤 Author

Task Manager Backend API - Clean Architecture Implementation

---

**Happy Coding! 🚀**
