import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';

export function createProjectRoutes(projectController: ProjectController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/projects:
   *   get:
   *     summary: Get all projects
   *     tags: [Projects]
   *     description: Returns a list of all projects with task statistics
   *     responses:
   *       200:
   *         description: List of projects
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/ProjectWithStats'
   */
  router.get('/', (req, res) => projectController.getAll(req, res));

  /**
   * @swagger
   * /api/projects/{id}:
   *   get:
   *     summary: Get project by ID
   *     tags: [Projects]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Project details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProjectWithStats'
   *       404:
   *         description: Project not found
   */
  router.get('/:id', (req, res) => projectController.getById(req, res));

  /**
   * @swagger
   * /api/projects:
   *   post:
   *     summary: Create a new project
   *     tags: [Projects]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateProject'
   *     responses:
   *       201:
   *         description: Project created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Project'
   *       400:
   *         description: Validation error
   */
  router.post('/', (req, res) => projectController.create(req, res));

  /**
   * @swagger
   * /api/projects/{id}:
   *   put:
   *     summary: Update a project
   *     tags: [Projects]
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
   *             $ref: '#/components/schemas/UpdateProject'
   *     responses:
   *       200:
   *         description: Project updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Project'
   *       404:
   *         description: Project not found
   */
  router.put('/:id', (req, res) => projectController.update(req, res));

  /**
   * @swagger
   * /api/projects/{id}:
   *   delete:
   *     summary: Delete a project
   *     tags: [Projects]
   *     description: Deletes a project and all its associated tasks
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       204:
   *         description: Project deleted successfully
   *       404:
   *         description: Project not found
   */
  router.delete('/:id', (req, res) => projectController.delete(req, res));

  return router;
}
