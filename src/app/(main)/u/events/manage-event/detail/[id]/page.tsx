import React from 'react';
import { getEventById, getEventParticipants } from '@/action/event-action';
import { forbidden } from 'next/navigation';
import ManageEventDetail from '../_components/manage-event-detail';
import ManageEventParticipants from '../_components/manage-event-participants';
import AreaChart from '../_components/area-chart';
import DonutChart from '../_components/donut-chart';

const ManageEventDetailPage = async ({ params }: { params: { id: string } }) => {
  const res = await getEventById(params.id);
  if (!res.success || !res.data) return forbidden();
  // Server-side counts for charts/state
  const participants = await getEventParticipants(res.data.id);
  const rows = participants.success && Array.isArray(participants.data) ? participants.data : [];
  const total = rows.length;
  const attended = rows.filter((r) => r.status === 'attended').length;
  const notAttended = Math.max(0, total - attended);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <ManageEventDetail data={res.data} />
      <div className="mt-8 grid grid-cols-1 gap-6">
        {/* Summary state above charts */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border p-3">
            <div className="text-neutral-500 text-sm">Registered</div>
            <div className="text-xl font-bold">{total}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-neutral-500 text-sm">Attended</div>
            <div className="text-xl font-bold">{attended}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-neutral-500 text-sm">Absent</div>
            <div className="text-xl font-bold">{notAttended}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-neutral-500 text-sm">Attendance Rate</div>
            <div className="text-xl font-bold">{total ? Math.round((attended / total) * 100) : 0}%</div>
          </div>
        </div>

        {/* Charts fed by server counts */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AreaChart
            title="Joined vs Attended"
            data={[
              { label: 'Start', joined: 0, attended: 0 },
              { label: 'Now', joined: total, attended },
            ]}
          />
          <DonutChart
            title="Attendance Breakdown"
            data={[
              { label: 'Attended', value: attended },
              { label: 'Not Attended', value: notAttended },
            ]}
          />
        </div>
        {/* Participants list */}
        <ManageEventParticipants eventId={res.data.id} />
      </div>
    </div>
  );
};

export default ManageEventDetailPage;


