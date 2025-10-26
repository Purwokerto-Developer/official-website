import { createInsertSchema } from 'drizzle-zod';
import { event_categories } from '../schema';
import { z } from 'zod';

export const categoryInsertSchema = createInsertSchema(event_categories, {
  name: (schema) => schema.min(2, 'Nama minimal 2 karakter').max(50, 'Nama maksimal 50 karakter'),
  description: (schema) =>
    schema.min(5, 'Deskripsi minimal 5 karakter').max(255, 'Deskripsi maksimal 255 karakter'),
});

export const categoryFormSchema = categoryInsertSchema;

export type CategoryInsertInput = z.infer<typeof categoryInsertSchema>;
export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
