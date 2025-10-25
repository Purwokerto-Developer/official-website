import { getDashboardStates, getUpcomingEvents } from '@/action/dashboard-action';
import { getServerSession } from '@/lib/better-auth/get-session';
import ActivityCard from './activity-card';
import ProfileCard from './profile-card';
import { StateCard } from './state-card';

const DashboardContent = async () => {
  const session = await getServerSession();
  const dashboardStates = await getDashboardStates();
  const upcomingEvents = await getUpcomingEvents();
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStates.map((state, index) => (
          <StateCard key={index} state={state} />
        ))}
      </div>

      <div className="mt-4 flex w-full flex-col gap-4 lg:flex-row">
        <div className="w-full">
          <ActivityCard events={upcomingEvents} />
        </div>
        <div className="w-full lg:w-5/12">
          <ProfileCard session={session} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
