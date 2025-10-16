export type EventListItem = {
  id: string;
  title: string;
  description?: string | null;
  address: string;
  start_time: Date;
  event_type: 'online' | 'offline';
  image?: string | null;
  collaborator_name?: string | null;
};
