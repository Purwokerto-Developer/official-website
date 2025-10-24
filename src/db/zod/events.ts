import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { events } from '../schema';
import { z } from 'zod';

export const eventInsertSchema = createInsertSchema(events, {
  title: (schema) => schema.min(5, 'Judul minimal 5 karakter'),
  description: (schema) => schema.min(10, 'Deskripsi minimal 10 karakter'),
  location_name: (schema) => schema.min(3, 'Nama lokasi wajib diisi'),
  start_time: (schema) =>
    schema.refine((val) => val instanceof Date, 'Tanggal atau waktu tidak valid'),
});

export const eventFormSchema = eventInsertSchema
  .omit({ slug: true })
  .extend({
    image: z.any().refine((val) => val instanceof File && val.size > 0, {
      message: 'Gambar wajib diisi',
    }),
  })
  .superRefine((val, ctx) => {
    if (val.event_type === 'online') {
      if (!val.location_url || val.location_url.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['location_url'],
          message: 'Meeting link wajib diisi untuk event online',
        });
      }
    }
  });

export const eventSelectSchema = createSelectSchema(events);

export type EventInsertInput = z.infer<typeof eventInsertSchema>;
export type EventFormInput = z.infer<typeof eventFormSchema>;
export type EventType = z.infer<typeof eventSelectSchema>;
