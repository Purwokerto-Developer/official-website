import { getServerSession } from '@/lib/better-auth/get-session';
import { forbidden, redirect } from 'next/navigation';
import React from 'react';
import CreateEventForm from './_components/create-event-form';

const CreateEventPage = async () => {
  const { user } = await getServerSession();
  if (!user) {
    return redirect('/login');
  }

  if (user.role !== 'admin') {
    return forbidden();
  }
  return (
    <div className="">
      <CreateEventForm />
    </div>
  );
};

export default CreateEventPage;
