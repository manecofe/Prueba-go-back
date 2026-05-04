# Task Manager Backend API

API REST Backend para Sistema de Gestión de Tareas construido con Node.js, TypeScript, Express, Prisma y PostgreSQL, siguiendo principios de Clean Architecture.

## 🚀 Características

- **12 Endpoints REST API** para gestión de proyectos y tareas
- **Clean Architecture** con clara separación de responsabilidades
- **Type-safe** con TypeScript 5+
- **Validación de datos** usando Zod
- **Base de datos PostgreSQL** con Prisma ORM
- **Soporte Docker** para despliegue fácil
- **CORS** habilitado para integración con frontend
- **Eliminación en cascada** (eliminar un proyecto elimina todas sus tareas)
- **Relaciones enriquecidas** (tareas incluyen nombre del proyecto, proyectos incluyen estadísticas de tareas)
- **📚 Documentación Interactiva API** con Swagger/OpenAPI
- **✅ Tests Unitarios** con Jest (18 tests pasando, 100% cobertura en casos de uso)
- **☁️ Listo para Vercel** con configuración optimizada para serverless

## 🎯 Para Reclutadores

Este backend demuestra prácticas de desarrollo de nivel profesional:

- **🔍 Documentación API Interactiva**: Visita `http://localhost:4000/api-docs` después de iniciar el servidor
- **✅ Testing Comprehensivo**: Ejecuta `npm test` para ver 18 tests unitarios pasando
- **📊 Cobertura de Tests**: Ejecuta `npm run test:coverage` para reporte detallado de cobertura
- **🏗️ Clean Architecture**: Separación clara entre capas de dominio, aplicación, infraestructura y presentación
- **☁️ Deployado en Vercel**: Configuración lista para producción en ambiente serverless

👉 **Ver [TESTING_AND_DOCS.md](./TESTING_AND_DOCS.md) para información detallada sobre testing y documentación**

## 📋 Requisitos Previos

- **Node.js** 20+ 
- **npm** o **yarn**
- **Docker** y **Docker Compose** (para despliegue con contenedores)
- **PostgreSQL** 16+ (si ejecutas sin Docker)

## 🛠️ Instalación

### Opción 1: Desarrollo Local (sin Docker)

1. **Clonar el repositorio**
   ```bash
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Edita .env con tus credenciales de base de datos
   ```

4. **Configurar base de datos**
   ```bash
   # Crear base de datos y ejecutar migraciones
   npm run db:migrate
   
   # Generar Prisma Client
   npm run db:generate
   
   # Poblar base de datos con datos de ejemplo
   npm run db:seed
   ```

5. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

   El servidor se ejecutará en `http://localhost:4000`

### Opción 2: Despliegue con Docker (Recomendado)

1. **Iniciar todos los servicios**
   ```bash
   docker-compose up -d
   ```

   Esto hará:
   - Iniciar base de datos PostgreSQL en puerto 5432
   - Construir e iniciar API backend en puerto 4000
   - Ejecutar migraciones automáticamente
   - Esperar a que la base de datos esté saludable antes de iniciar backend

2. **Poblar la base de datos**
   ```bash
   # Entrar al contenedor backend
   docker exec -it task_manager_backend sh
   
   # Ejecutar script de seed
   npm run db:seed
   
   # Salir del contenedor
   exit
   ```

3. **Ver logs**
   ```bash
   docker-compose logs -f backend
   ```

4. **Detener servicios**
   ```bash
   docker-compose down
   ```

### Opción 3: Despliegue en Vercel (Producción)

1. **Conectar repositorio de GitHub a Vercel**

2. **Configurar variables de entorno en Vercel:**
   ```env
   DATABASE_URL=postgresql://user:pass@host:port/database?sslmode=require
   NODE_ENV=production
   PORT=4000
   FRONTEND_URL=https://tu-frontend.vercel.app
   ```

3. **Vercel detectará automáticamente:**
   - Build command: `npm run build`
   - Output directory: `api/`
   - Node.js version: 20+

4. **El despliegue ejecutará automáticamente:**
   - `npm install` (con postinstall que genera Prisma Client)
   - `npm run build` (que ejecuta `prisma generate && tsc`)
   - Deploy serverless function en `api/index.ts`

## 📁 Estructura del Proyecto

```
backend/
├── api/
│   └── index.ts                       # Entry point para Vercel serverless
├── src/
│   ├── config/
│   │   └── swagger.ts                 # Configuración Swagger/OpenAPI
│   ├── core/                          # Lógica de negocio (Clean Architecture)
│   │   ├── domain/
│   │   │   ├── entities/              # Entidades de dominio (Project, Task)
│   │   │   └── repositories/          # Interfaces de repositorios
│   │   ├── application/
│   │   │   └── use-cases/             # Casos de uso de negocio
│   │   │       ├── projects/
│   │   │       │   └── __tests__/     # Tests unitarios de proyectos
│   │   │       └── tasks/
│   │   │           └── __tests__/     # Tests unitarios de tareas
│   │   └── dtos/                      # Data Transfer Objects + Validación
│   ├── infrastructure/
│   │   ├── database/                  # Cliente Prisma
│   │   └── repositories/              # Implementaciones de repositorios Prisma
│   ├── presentation/
│   │   ├── controllers/               # Manejadores de peticiones HTTP
│   │   ├── middlewares/               # CORS, manejo de errores
│   │   └── routes/                    # Rutas Express con anotaciones Swagger
│   └── main.ts                        # Punto de entrada de la aplicación
├── prisma/
│   ├── schema.prisma                  # Schema de base de datos
│   ├── seed.ts                        # Script de datos de ejemplo
│   └── migrations/                    # Migraciones de base de datos
├── docker-compose.yml                 # Configuración de servicios Docker
├── Dockerfile                         # Contenedor backend
├── vercel.json                        # Configuración Vercel
├── jest.config.js                     # Configuración Jest
├── package.json
├── tsconfig.json
└── .env                               # Variables de entorno
```

## 🔌 Endpoints de la API

### Proyectos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/projects` | Obtener todos los proyectos con estadísticas de tareas |
| `GET` | `/api/projects/:id` | Obtener proyecto por ID con estadísticas |
| `POST` | `/api/projects` | Crear nuevo proyecto |
| `PUT` | `/api/projects/:id` | Actualizar proyecto |
| `DELETE` | `/api/projects/:id` | Eliminar proyecto (en cascada a tareas) |

### Tareas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Obtener todas las tareas (soporta filtros) |
| `GET` | `/api/tasks/:id` | Obtener tarea por ID |
| `GET` | `/api/projects/:projectId/tasks` | Obtener todas las tareas de un proyecto |
| `POST` | `/api/tasks` | Crear nueva tarea |
| `PUT` | `/api/tasks/:id` | Actualizar tarea |
| `PATCH` | `/api/tasks/:id/status` | Actualizar solo el estado de la tarea (optimizado) |
| `DELETE` | `/api/tasks/:id` | Eliminar tarea |

### Filtros de Tareas (Query Parameters)

- `status`: Filtrar por estado (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `COMPLETED`)
- `priority`: Filtrar por prioridad (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
- `projectId`: Filtrar por ID de proyecto (UUID)

**Ejemplo:**
```
GET /api/tasks?status=IN_PROGRESS&priority=HIGH
```

## 📝 Ejemplos de Request/Response

### Crear Proyecto
```bash
POST /api/projects
Content-Type: application/json

{
  "name": "Nuevo Proyecto",
  "description": "Descripción del proyecto",
  "color": "#3B82F6"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Nuevo Proyecto",
  "description": "Descripción del proyecto",
  "color": "#3B82F6",
  "createdAt": "2026-05-04T10:00:00.000Z",
  "updatedAt": "2026-05-04T10:00:00.000Z"
}
```

### Obtener Proyectos con Estadísticas
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

### Crear Tarea
```bash
POST /api/tasks
Content-Type: application/json

{
  "projectId": "project-uuid",
  "title": "Implementar funcionalidad",
  "description": "Descripción detallada",
  "priority": "HIGH",
  "dueDate": "2026-05-20T00:00:00.000Z"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "projectId": "project-uuid",
  "title": "Implementar funcionalidad",
  "description": "Descripción detallada",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-05-20T00:00:00.000Z",
  "createdAt": "2026-05-04T10:00:00.000Z",
  "updatedAt": "2026-05-04T10:00:00.000Z"
}
```

### Actualizar Estado de Tarea
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

## 🗄️ Schema de Base de Datos

### Proyecto
```typescript
{
  id: string (UUID)
  name: string (3-100 caracteres)
  description: string
  color: string (#RRGGBB)
  createdAt: DateTime
  updatedAt: DateTime
  tasks: Task[] (relación)
}
```

### Tarea
```typescript
{
  id: string (UUID)
  projectId: string (FK a Project)
  title: string (3-200 caracteres)
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: DateTime? (opcional)
  createdAt: DateTime
  updatedAt: DateTime
  project: Project (relación)
}
```

**Comportamiento en Cascada**: Eliminar un proyecto automáticamente elimina todas las tareas asociadas.

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor dev con hot reload
npm run build            # Compilar para producción (ejecuta prisma generate && tsc)
npm start                # Ejecutar build de producción

# Testing
npm test                 # Ejecutar tests
npm run test:watch       # Ejecutar tests en modo watch
npm run test:coverage    # Generar reporte de cobertura

# Base de Datos
npm run db:migrate       # Ejecutar migraciones (desarrollo)
npm run db:migrate:prod  # Ejecutar migraciones (producción)
npm run db:generate      # Generar Prisma Client
npm run db:seed          # Poblar BD con datos de ejemplo
npm run db:studio        # Abrir Prisma Studio
npm run db:reset         # Resetear BD (ADVERTENCIA: elimina todos los datos)

# Docker
npm run docker:up        # Iniciar contenedores Docker
npm run docker:down      # Detener contenedores Docker
npm run docker:logs      # Ver logs de contenedores
```

## 🌐 Configuración CORS

CORS está habilitado para la URL del frontend especificada en `.env`:

```env
FRONTEND_URL=http://localhost:3000
```

Métodos permitidos: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`

## 🐳 Servicios Docker

- **postgres**: Base de datos PostgreSQL 16
  - Puerto: 5432
  - Usuario: `taskuser`
  - Contraseña: `taskpass`
  - Base de datos: `task_manager`

- **backend**: API Node.js Express
  - Puerto: 4000
  - Ejecuta migraciones automáticamente al iniciar
  - Espera health check de la base de datos

## 🔄 Integración con Frontend

Para conectar el frontend Next.js:

1. **Actualizar `.env.local` del frontend:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

2. **Crear Repositorios HTTP** (reemplazar mocks):
   ```typescript
   // src/infrastructure/repositories/HttpProjectRepository.ts
   // src/infrastructure/repositories/HttpTaskRepository.ts
   ```

3. **Actualizar inyección de dependencias** para usar repositorios HTTP en lugar de repositorios mock.

## 🧪 Probar la API

### Usando curl
```bash
# Health check
curl http://localhost:4000/health

# Obtener todos los proyectos
curl http://localhost:4000/api/projects

# Crear proyecto
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Proyecto de Prueba","description":"Probando","color":"#FF5733"}'
```

### Usando Postman/Thunder Client
Importar la siguiente URL base: `http://localhost:4000/api`

## 🚨 Manejo de Errores

La API retorna respuestas de error consistentes:

- **200 OK**: GET/PUT/PATCH exitoso
- **201 Created**: POST exitoso
- **204 No Content**: DELETE exitoso
- **400 Bad Request**: Errores de validación
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Errores del servidor

**Formato de Respuesta de Error:**
```json
{
  "error": "Error de validación",
  "details": [
    {
      "path": ["name"],
      "message": "El nombre debe tener al menos 3 caracteres"
    }
  ]
}
```

## 📊 Datos de Ejemplo (Seed)

El script de seed crea:
- 4 proyectos de ejemplo con diferentes colores
- 14 tareas distribuidas entre proyectos
- Varios estados y prioridades
- Algunas tareas con fechas de vencimiento

Ejecutar seed: `npm run db:seed`

## 🔐 Variables de Entorno

| Variable | Por Defecto | Descripción |
|----------|-------------|-------------|
| `DATABASE_URL` | (requerido) | Cadena de conexión PostgreSQL |
| `PORT` | `4000` | Puerto del servidor |
| `NODE_ENV` | `development` | Entorno (development/production) |
| `FRONTEND_URL` | `http://localhost:3000` | URL del frontend para CORS |

## 🐛 Solución de Problemas

### Problemas de Conexión a Base de Datos
```bash
# Verificar si PostgreSQL está corriendo
docker ps

# Ver logs de base de datos
docker logs task_manager_db

# Reiniciar servicios
docker-compose restart
```

### Problemas con Migraciones
```bash
# Resetear base de datos (ADVERTENCIA: elimina todos los datos)
npm run db:reset

# O manualmente
npx prisma migrate reset --force
```

### Puerto Ya en Uso
```bash
# Cambiar PORT en archivo .env
PORT=4001

# O matar proceso usando puerto 4000
# Windows: netstat -ano | findstr :4000
# Linux/Mac: lsof -ti:4000 | xargs kill
```

### Errores de Despliegue en Vercel
```bash
# Verificar que las variables de entorno estén configuradas
# DATABASE_URL debe incluir ?sslmode=require para conexiones SSL
# Verificar que postinstall esté ejecutando prisma generate
```

## 📚 Stack Tecnológico

- **Node.js** 20+
- **TypeScript** 5+
- **Express** 4.x - Framework web
- **Prisma** 5.x - ORM
- **PostgreSQL** 16 - Base de datos
- **Zod** 3.x - Validación
- **Docker** - Contenedorización
- **tsx** - Ejecución TypeScript
- **Jest** 29.x - Framework de testing
- **Swagger/OpenAPI** 3.0 - Documentación API

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### Cobertura de Tests

La cobertura actual de tests se enfoca en lógica de negocio (casos de uso):
- ✅ CreateProjectUseCase - 100% cobertura
- ✅ GetProjectByIdUseCase - 100% cobertura
- ✅ DeleteProjectUseCase - 100% cobertura
- ✅ CreateTaskUseCase - 100% cobertura
- ✅ UpdateTaskStatusUseCase - 100% cobertura

**Resultados:** 18 tests pasando en 5 test suites

## 📖 Documentación API

### Swagger UI

Accede a la documentación interactiva de la API en:
**http://localhost:4000/api-docs**

El Swagger UI proporciona:
- Testing interactivo de endpoints
- Schemas de request/response
- Payloads de ejemplo
- Documentación de respuestas de error

## 🎯 Próximos Pasos

- [x] ✅ Agregar documentación API (Swagger/OpenAPI)
- [x] ✅ Agregar tests unitarios (Jest) para casos de uso
- [x] ✅ Configuración para despliegue en Vercel
- [ ] Agregar autenticación (JWT)
- [ ] Implementar rate limiting
- [ ] Implementar paginación para endpoints GET
- [ ] Agregar tests de integración
- [ ] Configurar CI/CD pipeline (GitHub Actions)
- [ ] Agregar logging de requests (Morgan)
- [ ] Implementar caché (Redis)

## 📄 Licencia

MIT

## 👤 Autor

Task Manager Backend API - Implementación con Clean Architecture

**Desarrollado por:** Manuel ([feelmaneco@gmail.com](mailto:feelmaneco@gmail.com))

---

**¡Happy Coding! 🚀**
