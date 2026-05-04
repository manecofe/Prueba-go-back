import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

export function createProjectTaskRoutes(taskController: TaskController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/projects/{projectId}/tasks:
   *   get:
   *     summary: Get all tasks for a project
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: List of tasks for the project
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/TaskWithProject'
   */
  router.get('/:projectId/tasks', (req, res) => taskController.getByProjectId(req, res));

  return router;
}
