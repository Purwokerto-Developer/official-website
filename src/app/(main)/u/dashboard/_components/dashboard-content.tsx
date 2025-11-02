import { getDashboardStates, getUpcomingEvents } from '@/action/dashboard-action';
import { getServerSession } from '@/lib/better-auth/get-session';
import ActivityCard from './activity-card';
import ProfileCard from './profile-card';
import EventChart from './event-chart';
import { StateCard } from './state-card';

const DashboardContent = async () => {
  const session = await getServerSession();

  const [dashboardStates, upcomingEvents] = await Promise.all([
    getDashboardStates(),
    getUpcomingEvents(),
  ]);
  return (
    <div className="pb-20">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStates.map((state, index) => (
          <StateCard key={index} state={state} />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="col-span-8">
          <ActivityCard events={upcomingEvents} />
        </div>
        <div className="col-span-4 flex flex-col gap-4">
          <div>
            <ProfileCard session={session} />
          </div>

          <div className="mt-0">
            {/* Chart container: keep chart compact and bounded so it doesn't overflow h-screen */}
            <div className="w-full max-w-full">
              <EventChart events={upcomingEvents} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
