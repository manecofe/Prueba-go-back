import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

export function createTaskRoutes(taskController: TaskController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/tasks:
   *   get:
   *     summary: Get all tasks
   *     tags: [Tasks]
   *     description: Returns a list of all tasks with optional filters
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [TODO, IN_PROGRESS, IN_REVIEW, COMPLETED]
   *       - in: query
   *         name: priority
   *         schema:
   *           type: string
   *           enum: [LOW, MEDIUM, HIGH, URGENT]
   *       - in: query
   *         name: projectId
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: List of tasks
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/TaskWithProject'
   */
  router.get('/', (req, res) => taskController.getAll(req, res));

  /**
   * @swagger
   * /api/tasks/{id}:
   *   get:
   *     summary: Get task by ID
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Task details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TaskWithProject'
   *       404:
   *         description: Task not found
   */
  router.get('/:id', (req, res) => taskController.getById(req, res));

  /**
   * @swagger
   * /api/tasks:
   *   post:
   *     summary: Create a new task
   *     tags: [Tasks]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTask'
   *     responses:
   *       201:
   *         description: Task created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       400:
   *         description: Validation error
   */
  router.post('/', (req, res) => taskController.create(req, res));

  /**
   * @swagger
   * /api/tasks/{id}:
   *   put:
   *     summary: Update a task
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTask'
   *     responses:
   *       200:
   *         description: Task updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       404:
   *         description: Task not found
   */
  router.put('/:id', (req, res) => taskController.update(req, res));

  /**
   * @swagger
   * /api/tasks/{id}/status:
   *   patch:
   *     summary: Update task status
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTaskStatus'
   *     responses:
   *       200:
   *         description: Task status updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       404:
   *         description: Task not found
   */
  router.patch('/:id/status', (req, res) => taskController.updateStatus(req, res));

  /**
   * @swagger
   * /api/tasks/{id}:
   *   delete:
   *     summary: Delete a task
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       204:
   *         description: Task deleted successfully
   *       404:
   *         description: Task not found
   */
  router.delete('/:id', (req, res) => taskController.delete(req, res));

  return router;
}
