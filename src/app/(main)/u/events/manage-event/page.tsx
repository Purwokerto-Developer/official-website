import React from 'react';
import { getEvent } from '@/action/event-action';
import ManageEventContent from './_components/manage-event-content';
import { isAdmin, isAuthenticated } from '@/lib/better-auth/get-session';

interface ManageEventPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
  }>;
}

const ManageEventPage = async ({ searchParams }: ManageEventPageProps) => {
  await isAuthenticated();
  await isAdmin();

  const params = await searchParams;
  const page = parseInt(params?.page ?? '') || 1;
  const pageSize = parseInt(params?.pageSize ?? '') || 10;
  const search = params?.search ?? '';

  const result = await getEvent(page, pageSize, search);
  const events = result.success ? (result.data ?? []) : [];

  return <ManageEventContent events={events} page={page} pageSize={pageSize} />;
};

export default ManageEventPage;
