import DetailEventContent from '@/app/(main)/u/events/detail/_components/detail-event-content';
import AdminAttendanceSection from './admin-attendance-section';
import { EventDetail } from '@/types/event-type';

type Props = { data: EventDetail };

export default function ManageEventDetail({ data }: Props) {
  return (
    <div className="space-y-6">
      {/* Reuse the same visual layout as user detail, but with admin button replacing Join */}
      <DetailEventContent data={data} adminMode />

      {/* Admin Quick Actions for Attendance Management */}
      {data.is_attendance_open && (
        <AdminAttendanceSection
          eventId={data.id}
          eventType={data.event_type}
          isAttendanceOpen={data.is_attendance_open}
          eventTitle={data.title}
        />
      )}
    </div>
  );
}
