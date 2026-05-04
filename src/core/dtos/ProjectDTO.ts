import { z } from 'zod';

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const CreateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required'),
  color: z
    .string()
    .regex(hexColorRegex, 'Color must be a valid hex color (#RRGGBB)'),
});

export const UpdateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .min(1, 'Description cannot be empty')
    .optional(),
  color: z
    .string()
    .regex(hexColorRegex, 'Color must be a valid hex color (#RRGGBB)')
    .optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  'At least one field must be provided for update'
);

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof UpdateProjectSchema>;
