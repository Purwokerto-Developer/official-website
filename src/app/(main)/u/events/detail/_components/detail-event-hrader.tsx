import { Colorfilter, HeartCircle, MonitorRecorder, UserOctagon } from 'iconsax-reactjs';
import Image from 'next/image';
import React from 'react';

export const DetailEventHeader = () => {
  return (
    <div className="relative z-0 h-[300px] w-full">
      <Image
        src="/event-banner.jpg"
        height={300}
        width={1200}
        alt="Event Banner"
        className="absolute inset-0 z-10 h-full w-full rounded-2xl object-cover"
      />
      <div className="absolute bottom-0 left-0 z-20 flex flex-col gap-4 p-6 text-white">
        <h1 className="text-3xl font-bold">StartUp Pitch Day</h1>
        <div className="flex items-center gap-8">
          <div className="capitalize">
            <p>Speaker</p>
            <div className="flex items-center gap-2">
              <UserOctagon size="20" variant="Bulk" />
              <span className="font-semibold">Speaker Name</span>
            </div>
          </div>
          <div className="capitalize">
            <p>Collaboration</p>
            <div className="flex items-center gap-2">
              <Colorfilter size="20" variant="Bulk" />
              <span className="font-semibold">Tegalsec</span>
            </div>
          </div>
          <div className="capitalize">
            <p>Topic</p>
            <div className="flex items-center gap-2">
              <MonitorRecorder size="20" variant="Bulk" />
              <span className="font-semibold">Cyber Security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
