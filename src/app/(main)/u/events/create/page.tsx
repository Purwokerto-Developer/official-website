import { getServerSession, isAdmin, isAuthenticated } from '@/lib/better-auth/get-session';
import { forbidden, redirect } from 'next/navigation';
import React from 'react';
import CreateEventForm from './_components/create-event-form';

const CreateEventPage = async () => {
  await isAuthenticated();
  await isAdmin();

  return <CreateEventForm />;
};

export default CreateEventPage;
