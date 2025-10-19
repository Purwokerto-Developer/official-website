import { events } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type EventListItem = {
  id: string;
  title: string;
  slug?: string;
  description?: string | null;
  location_name: string;
  start_time: Date;
  event_type: 'online' | 'offline';
  image?: string | null;
  collaborator_name?: string | null;
};

export type Event = InferSelectModel<typeof events>;

export type EventDetail = {
  id: string;
  title: string;
  description: string | null;
  location_name: string;
  start_time: Date | string;
  event_type: 'online' | 'offline';
  is_attendance_open: boolean;
  image: string | null;
  collaborator_id: string | null;
  category_id: string | null;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  category_name?: string | null;
  collaborator_name?: string | null;
  location_url?: string | null;
};


