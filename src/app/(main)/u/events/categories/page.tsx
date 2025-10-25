import { getServerSession, isAdmin, isAuthenticated } from '@/lib/better-auth/get-session';
import { forbidden, redirect } from 'next/navigation';
import React from 'react';
import ListCategories from './_components/list-categories';
import { Suspense } from 'react';
import { getCategories } from '@/action/event-action';

const EventCategoryPage = async () => {
  await isAuthenticated();
  await isAdmin();
  const categories = await getCategories();

  return (
    <Suspense
      fallback={<div className="text-muted-foreground py-10 text-center">Loading kategori...</div>}
    >
      <ListCategories categories={categories?.data || []} />
    </Suspense>
  );
};

export default EventCategoryPage;
