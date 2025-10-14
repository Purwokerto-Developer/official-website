import { getServerSession } from '@/lib/better-auth/get-session';
import { forbidden, redirect } from 'next/navigation';
import React from 'react';

const CreateEventPage = async () => {
  const { user } = await getServerSession();
  if (!user) {
    return redirect('/login');
  }

  if (user.role !== 'admin') {
    return forbidden();
  }
  return <div>CreateEventPage</div>;
};

export default CreateEventPage;
