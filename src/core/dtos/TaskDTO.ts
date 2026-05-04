import { z } from 'zod';

export const TaskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED']);
export const TaskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const CreateTaskSchema = z.object({
  projectId: z
    .string()
    .uuid('Project ID must be a valid UUID'),
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be at most 200 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required'),
  priority: TaskPriorityEnum,
  dueDate: z
    .string()
    .datetime('Due date must be a valid ISO 8601 date')
    .optional()
    .transform((val) => val ? new Date(val) : undefined),
});

export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be at most 200 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .min(1, 'Description cannot be empty')
    .optional(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  dueDate: z
    .string()
    .datetime('Due date must be a valid ISO 8601 date')
    .optional()
    .nullable()
    .transform((val) => val ? new Date(val) : null),
}).refine(
  (data) => Object.keys(data).length > 0,
  'At least one field must be provided for update'
);

export const UpdateTaskStatusSchema = z.object({
  status: TaskStatusEnum,
});

export const TaskFiltersSchema = z.object({
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  projectId: z.string().uuid().optional(),
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;
export type UpdateTaskStatusDTO = z.infer<typeof UpdateTaskStatusSchema>;
export type TaskFiltersDTO = z.infer<typeof TaskFiltersSchema>;
