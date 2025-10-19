import React from 'react';
import { DetailEventHeader } from './detail-event-hrader';
import { DetailEventJoin } from './detail-event-join';
import { EventDetail } from '@/types/event-type';
import { getServerSession } from '@/lib/better-auth/get-session';

type DetailEventContentProps = {
  data: EventDetail;
  adminMode?: boolean;
};

const DetailEventContent = async ({ data, adminMode }: DetailEventContentProps) => {
  const session = await getServerSession();
  const userRole = session?.user?.role;

  return (
    <div className="container mx-auto flex flex-col gap-8 py-8">
      <DetailEventHeader data={data} />
      <DetailEventJoin data={data} adminMode={adminMode} userRole={userRole} />
    </div>
  );
};

export default DetailEventContent;
