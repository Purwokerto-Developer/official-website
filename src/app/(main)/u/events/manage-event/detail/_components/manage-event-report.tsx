import React from 'react'
import EventStatChart from './event-stat-chart'

type Props = {
  total: number
  attended: number
}

export default function ManageEventReport({ total, attended }: Props) {
  const absent = Math.max(0, total - attended)
  const attendedPct = total ? Math.round((attended / total) * 100) : 0
  const absentPct = 100 - attendedPct

  return (
    <div className="rounded-xl border p-4">
      <h3 className="mb-2 text-base font-semibold">Event Statistics</h3>
      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <div className="rounded-lg border p-3">
          <div className="text-neutral-500">Registered</div>
          <div className="text-xl font-bold">{total}</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-neutral-500">Attended</div>
          <div className="text-xl font-bold">{attended}</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-neutral-500">Absent</div>
          <div className="text-xl font-bold">{absent}</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-neutral-500">Attendance Rate</div>
          <div className="text-xl font-bold">{attendedPct}%</div>
        </div>
      </div>
      <div className="mt-6">
        <EventStatChart
          data={[
            { label: 'Attended', value: attended, color: '#22c55e' },
            { label: 'Absent', value: absent, color: '#f59e0b' },
          ]}
        />
      </div>
    </div>
  )
}


