# Quick Start Guide 🚀

## Option 1: Docker (Fastest) ⚡

```bash
# 1. Start all services
docker-compose up -d

# 2. Wait ~30 seconds for services to be ready, then seed the database
docker exec -it task_manager_backend npm run db:seed

# 3. Test the API
curl http://localhost:4000/health
curl http://localhost:4000/api/projects

# ✅ Done! API is running on http://localhost:4000
```

## Option 2: Local Development 💻

```bash
# 1. Install dependencies
npm install

# 2. Setup database (make sure PostgreSQL is running)
npm run db:migrate

# 3. Seed database
npm run db:seed

# 4. Start development server
npm run dev

# ✅ Done! API is running on http://localhost:4000
```

## Testing Endpoints 🧪

```bash
# Get all projects
curl http://localhost:4000/api/projects

# Get all tasks
curl http://localhost:4000/api/tasks

# Create a project
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New Project",
    "description": "This is a test project",
    "color": "#FF5733"
  }'

# Create a task (replace PROJECT_ID with actual ID from above)
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "PROJECT_ID",
    "title": "My First Task",
    "description": "Task description",
    "priority": "HIGH"
  }'
```

## Useful Commands 🛠️

```bash
# View logs (Docker)
docker-compose logs -f backend

# Stop services (Docker)
docker-compose down

# Reset database (Local)
npm run db:reset

# Open Prisma Studio (Database GUI)
npm run db:studio
```

## Next Steps 📝

1. Check the full [README.md](README.md) for complete documentation
2. View API endpoints in [README.md](README.md#-api-endpoints)
3. Connect your Next.js frontend by updating the API URL
4. Explore the Clean Architecture structure in `src/`

---

Need help? Check [README.md](README.md#-troubleshooting) for troubleshooting tips!
