import React from 'react';
import { getEventById } from '@/action/event-action';
import { forbidden, redirect } from 'next/navigation';
import AttendanceClient from '../_components/attendance-client';
import { getServerSession } from '@/lib/better-auth/get-session';

const AttendancePage = async ({ params, searchParams }: { params: { id: string }; searchParams: { mode?: string } }) => {
  const session = await getServerSession();
  const user = session?.user;
  
  // Check if user is authenticated
  if (!user) {
    return redirect('/login');
  }

  const res = await getEventById(params.id);
  if (!res.success || !res.data) return forbidden();
  
  const event = res.data;
  const mode = searchParams?.mode ?? 'link';

  // Access control based on event type and mode
  if (event.event_type === 'online' && mode === 'qr') {
    // Online events cannot use QR mode
    return forbidden();
  }
  
  if (event.event_type === 'offline' && mode === 'link') {
    // Offline events cannot use link mode
    return forbidden();
  }

  // QR mode is only accessible by admin users
  if (mode === 'qr' && user.role !== 'admin') {
    return forbidden();
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="mb-4 text-2xl font-bold">Attendance</h1>
      <p className="mb-6 text-sm text-neutral-500">{event.title}</p>
      <AttendanceClient eventId={params.id} mode={mode as any} />
    </div>
  );
};

export default AttendancePage;


