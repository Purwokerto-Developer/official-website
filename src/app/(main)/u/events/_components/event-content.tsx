import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { demoEventStats, demoEventList } from '@/constants';
import { EventList } from './event-list';
import Image from 'next/image';
import { EventStats } from './event-stats';

const EventContent = () => {
  return (
    <div>
      <Image
        src={'/event-banner.jpg'}
        height={200}
        width={400}
        alt="Event Banner"
        className="h-[300px] w-full rounded-2xl object-cover object-center"
      />
      <div className="flex flex-col items-center justify-center gap-4">
        <Avatar className="border-background -mt-10 h-24 w-24 border-8">
          <AvatarImage src={'/img-logo.png'} className="h-32 w-32 bg-slate-500 object-cover" />
        </Avatar>

        <h1 className="text-3xl font-bold">Event Collections</h1>
        <p className="text-muted-foreground text-center text-sm">Purwokerto Dev</p>
        <EventStats {...demoEventStats} />
        <div className="mt-8 w-full">
          <EventList items={demoEventList} />
        </div>
      </div>
    </div>
  );
};

export default EventContent;
