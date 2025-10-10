import React from 'react';
import { StateCard } from './state-card';
import { stateData } from '@/constants';
import ProfileCard from './profile-card';
import ActivityCard from './activity-card';
import { getServerSession } from '@/lib/better-auth/get-session';

const DashboardContent = async () => {
  const session = await getServerSession();
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stateData.map((state, index) => (
          <StateCard key={index} state={state} />
        ))}
      </div>

      <div className="mt-4 flex w-full flex-col-reverse gap-4 lg:flex-row">
        <div className="w-full">
          <ActivityCard />
        </div>
        <div className="w-full lg:w-5/12">
          <ProfileCard session={session} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
