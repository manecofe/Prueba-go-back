# API Examples

Quick reference for all API endpoints.

## 📊 Projects

### GET /api/projects
Returns array of all projects with `taskCount` and `tasksByStatus` statistics.

### GET /api/projects/:id
Returns single project with stats. **404** if not found.

### POST /api/projects
**Body:** `{name, description, color}`  
**Returns:** Created project with generated ID and timestamps. **201**

### PUT /api/projects/:id
**Body:** `{name?, description?, color?}` (all optional)  
**Returns:** Updated project. **200** or **404**

### DELETE /api/projects/:id
Deletes project and ALL its tasks (CASCADE). **204** or **404**

---

## ✅ Tasks

### GET /api/tasks
Returns array of tasks with `projectName` included.  
**Filters:** `?status=TODO&priority=HIGH&projectId=uuid`

### GET /api/tasks/:id
Returns single task with `projectName`. **404** if not found.

### GET /api/projects/:projectId/tasks
Returns all tasks for specified project with `projectName`.

### POST /api/tasks
**Body:** `{projectId, title, description, priority, dueDate?}`  
**Returns:** Created task with `status: "TODO"`. **201** or **400** if project not found.

### PUT /api/tasks/:id
**Body:** `{title?, description?, status?, priority?, dueDate?}` (all optional)  
**Returns:** Updated task. **200** or **404**

### PATCH /api/tasks/:id/status
**Body:** `{status}`  
**Returns:** Updated task (optimized for drag & drop). **200** or **404**

### DELETE /api/tasks/:id
Deletes task. **204** or **404**

---

## 📝 Valid Values

- **Status:** `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `COMPLETED`
- **Priority:** `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- **Color:** Hex format `#RRGGBB` (e.g., `#3B82F6`)
- **Dates:** ISO 8601 format `2026-05-25T00:00:00.000Z`
- **IDs:** UUID format (auto-generated)

---

## ❌ Common Errors

- **400:** Validation error (invalid data, missing fields, wrong format)
- **404:** Resource not found (project or task doesn't exist)
- **500:** Internal server error

**Error format:**
```json
{
  "error": "Validation error",
  "details": [{"path": ["name"], "message": "Name must be at least 3 characters"}]
}
```

---

## 🧪 Postman Examples

**Base URL:** `http://localhost:4000`

### Create Project
```
POST /api/projects
Body: {"name":"E-commerce","description":"Online store","color":"#8B5CF6"}
```

### Create Task
```
POST /api/tasks
Body: {
  "projectId": "uuid-from-get-projects",
  "title": "Build shopping cart",
  "description": "Implement cart functionality",
  "priority": "HIGH",
  "dueDate": "2026-05-30T00:00:00.000Z"
}
```

### Update Task Status
```
PATCH /api/tasks/{task-id}/status
Body: {"status": "COMPLETED"}
```

### Get Filtered Tasks
```
GET /api/tasks?status=IN_PROGRESS&priority=URGENT
```

### Delete Project (and all tasks)
```
DELETE /api/projects/{project-id}
```

---

## 💡 Tips

1. Use Postman variables: `{{base_url}}`, `{{project_id}}`, `{{task_id}}`
2. All dates must be in ISO 8601 format
3. Color must be valid hex (#RRGGBB)
4. Deleting a project automatically deletes all its tasks
5. Task status defaults to `TODO` on creation
6. `projectName` is automatically included in task responses
