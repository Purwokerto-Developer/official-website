import { getServerSession } from '@/lib/better-auth/get-session';
import { forbidden, redirect } from 'next/navigation';
import React from 'react';
import ListCategories from './_components/list-categories';

const EventCategoryPage = async () => {
  const { user } = await getServerSession();
  if (!user) {
    return redirect('/login');
  }

  if (user.role !== 'admin') {
    return forbidden();
  }
  return <ListCategories />;
};

export default EventCategoryPage;
