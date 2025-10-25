import { getEventBySlug } from '@/action/event-action';
import { notFound } from 'next/navigation';
import DetailEventContent from '../_components/detail-event-content';

const DetailEvent = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const response = await getEventBySlug(slug);
  if (!response.success || !response.data) return notFound();

  const event = response.data;
  return <DetailEventContent data={event} />;
};

export const revalidate = 30;

export default DetailEvent;
