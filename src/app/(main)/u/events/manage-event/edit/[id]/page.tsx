import React from 'react';
import { getCategories, getEventById } from '@/action/event-action';
import { forbidden } from 'next/navigation';
import EditEventForm from '../_components/edit-event-form';

const EditEventPage = async ({ params }: { params: { id: string } }) => {
  const res = await getEventById(params.id);
  if (!res.success || !res.data) return forbidden();
  return (
    <div className="mx-auto w-full  px-4 py-8">
      <EditEventForm initial={res.data} id={params.id} />
    </div>
  );
};

export default EditEventPage;


