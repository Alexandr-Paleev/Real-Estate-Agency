import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  price: z.number().min(0, 'Price must be positive'),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
