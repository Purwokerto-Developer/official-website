import React from 'react';
import { getEventById } from '@/action/event-action';
import { forbidden, notFound, redirect } from 'next/navigation';
import AttendanceClient from '../_components/attendance-client';
import { getServerSession } from '@/lib/better-auth/get-session';

const AttendancePage = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { mode?: string };
}) => {
  const session = await getServerSession();
  const user = session?.user;

  // Check if user is authenticated
  if (!user) {
    return redirect('/login');
  }

  const res = await getEventById(params.id);
  if (!res.success || !res.data) return notFound();

  const event = res.data;
  const mode = searchParams?.mode ?? 'link';

  // Access control based on event type and mode
  if (event.event_type === 'online' && mode === 'qr') {
    // Online events cannot use QR mode
    return notFound();
  }

  if (event.event_type === 'offline' && mode === 'link') {
    // Offline events cannot use link mode
    return notFound();
  }

  // QR mode is only accessible by admin users
  if (mode === 'qr' && user.role !== 'admin') {
    return forbidden();
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10">
      <AttendanceClient eventId={params.id} mode={mode as any} detailEvent={event} />
    </div>
  );
};

export default AttendancePage;
