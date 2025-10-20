import { getEventById } from '@/action/event-action';
import { isAdmin, isAuthenticated } from '@/lib/better-auth/get-session';
import EditEventForm from '../_components/edit-event-form';

const EditEventPage = async ({ params }: { params: { id: string } }) => {
  await isAuthenticated();
  await isAdmin();
  const res = await getEventById(params.id);
  return (
    <div className="mx-auto w-full px-4 py-8">
      <EditEventForm initial={res.data} id={params.id} />
    </div>
  );
};

export default EditEventPage;
