import { getServerSession } from '@/lib/better-auth/get-session';
import { forbidden, redirect } from 'next/navigation';
import React from 'react';
import ListCategories from './_components/list-categories';
import { Suspense } from 'react';
import { getCategories } from '@/action/event-action';

const EventCategoryPage = async () => {
  const { user } = await getServerSession();
  if (!user) {
    return redirect('/login');
  }
  if (user.role !== 'admin') {
    return forbidden();
  }
  const categories = await getCategories();
  return (
    <Suspense
      fallback={<div className="text-muted-foreground py-10 text-center">Loading kategori...</div>}
    >
      <ListCategories categories={categories} />
    </Suspense>
  );
};

export default EventCategoryPage;
