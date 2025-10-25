import { Colorfilter, HeartCircle, MonitorRecorder, UserOctagon } from 'iconsax-reactjs';
import Image from 'next/image';
import React from 'react';

import { EventDetail } from '@/types/event-type';

type DetailEventHeaderProps = {
  data: EventDetail;
};

export const DetailEventHeader = ({ data }: DetailEventHeaderProps) => {
  return (
    <div className="relative z-0 h-[300px] w-full">
      <Image
        src={'/event-banner.jpg'}
        height={300}
        width={1200}
        alt={'Event Banner'}
        className="absolute inset-0 z-10 h-full w-full rounded-2xl object-cover"
        priority={true}
        sizes="(max-width: 768px) 100vw, 1200px"
      />
      <div className="absolute bottom-0 left-0 z-20 flex flex-col gap-4 p-6 text-white">
        <h1 className="line-clamp-3 w-9/12 text-base font-bold md:text-3xl">{data.title}</h1>
        <div className="flex items-center gap-8">
          <div className="capitalize">
            <p>Collaborator</p>
            <div className="flex items-center gap-2">
              <UserOctagon size="20" variant="Bulk" />
              <span className="line-clamp-1 font-semibold">{data.collaborator_name || '-'}</span>
            </div>
          </div>
          <div className="capitalize">
            <p>Category</p>
            <div className="flex items-center gap-2">
              <Colorfilter size="20" variant="Bulk" />
              <span className="line-clamp-1 font-semibold">{data.category_name || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
