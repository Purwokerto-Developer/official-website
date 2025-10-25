import React from 'react';
import { getEventById } from '@/action/event-action';
import { forbidden, notFound, redirect } from 'next/navigation';
import AttendanceClient from '../_components/attendance-client';
import { getServerSession, isAuthenticated } from '@/lib/better-auth/get-session';

const AttendancePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) => {
  await isAuthenticated();
  const session = await getServerSession();
  const user = session?.user;
  const id = (await params).id;
  const mode = (await searchParams).mode ?? 'link';

  if (!user) {
    return redirect('/login');
  }

  const res = await getEventById(id);
  if (!res.success || !res.data) return notFound();

  const event = res.data;

  // Access control based on event type and mode
  if (event.event_type === 'online' && mode === 'qr') {
    return notFound();
  }

  if (event.event_type === 'offline' && mode === 'link') {
    return notFound();
  }

  // QR mode is only accessible by admin users
  if (mode === 'qr' && user.role !== 'admin') {
    return forbidden();
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10">
      <AttendanceClient eventId={id} mode={mode as 'link' | 'qr'} detailEvent={event} />
    </div>
  );
};

export default AttendancePage;
