import type { EventType } from '@/db/zod/events';

export type EventTypeAlias = EventType;

export interface EventListItem extends EventType {
  category_name?: string | null;
  collaborator_name?: string | null;
}

export type EventDetail = EventListItem;

export type EventList = EventListItem[];
