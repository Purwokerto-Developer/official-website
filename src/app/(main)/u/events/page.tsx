import React from 'react';
import EventContent from './_components/event-content';
import { getEvent } from '@/action/event-action';
import { forbidden } from 'next/navigation';

interface EventPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    sort?: string;
    filter?: string;
  }>;
}

const EventPage = async ({ searchParams }: EventPageProps) => {
  const params = await searchParams;

  const page = parseInt(params?.page ?? '') || 1;
  const pageSize = parseInt(params?.pageSize ?? '') || 5;
  const search = params?.search ?? '';

  const result = await getEvent(page, pageSize, search);
  const events = result.success ? (result.data ?? []) : [];

  if (!events.length) return forbidden();

  return <EventContent events={events} page={page} pageSize={pageSize} />;
};

export default EventPage;
