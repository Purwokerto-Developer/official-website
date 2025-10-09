'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Calendar, Location, Activity, TickCircle, ArrowRight2 } from 'iconsax-reactjs';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const activities = [
  {
    id: 1,
    event: 'JS Meetup Vol.3',
    date: 'Sat, 12 October 2025',
    status: 'offline',
    eventStatus: 'Upcoming',
    registered: true,
    location: 'Amikom Purwokerto',
    image: '/img-logo.png',
  },
  {
    id: 2,
    event: 'Docker Workshop: Container from Scratch',
    date: 'Sun, 21 September 2025',
    status: 'online',
    eventStatus: 'Upcoming',
    registered: false,
    location: 'Google Meet',
    image: '/img-logo.png',
  },
  {
    id: 3,
    event: 'PurwokertoDev Community Gathering',
    date: 'Mon, 15 August 2025',
    status: 'offline',
    eventStatus: 'Upcoming',
    registered: true,
    location: 'Cozy Space Purwokerto',
    image: '/img-logo.png',
  },
  {
    id: 4,
    event: 'React Native Workshop for Beginners',
    date: 'Fri, 5 July 2025',
    status: 'online',
    eventStatus: 'Upcoming',
    registered: false,
    location: 'Zoom',
    image: '/img-logo.png',
  },
];

// hanya tampilkan event upcoming
const upcomingEvents = activities.filter((act) => act.eventStatus === 'Upcoming');

const ActivityCard = () => {
  const isEmpty = upcomingEvents.length === 0;

  return (
    <Card className="h-[500px] w-full border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-50 p-2">
            <Activity className="text-primary size-[30px]" variant="Bulk" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
            <CardDescription>Event komunitas yang akan datang untuk kamu.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2">
        {isEmpty ? (
          // 🌙 Empty State
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex h-[380px] flex-col items-center justify-center text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <Image src={'/img-logo.png'} width={60} height={60} alt="Logo" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-gray-800">
              Tidak ada event mendatang
            </h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Saat ini belum ada event baru. Tetap pantau halaman komunitas untuk info event
              selanjutnya!
            </p>
            <Button className="mt-4">Lihat Semua Event</Button>
          </motion.div>
        ) : (
          // 🪄 Animated Event List
          <ScrollArea className="h-[380px] pr-3">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 },
                },
              }}
              className="space-y-3"
            >
              {upcomingEvents.map((act) => (
                <motion.div
                  key={act.id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Card className="flex flex-row items-center gap-4 rounded-xl p-4 shadow-sm transition-all hover:shadow-md">
                    {/* Left: Image */}

                    <Image
                      src={act.image}
                      width={90}
                      height={90}
                      alt={act.event}
                      className="bg-primary/10 rounded-md object-cover object-center"
                    />

                    {/* Middle: Details */}
                    <div className="flex w-full flex-col space-y-2">
                      <Badge
                        className={cn(
                          act.status.toLocaleLowerCase() === 'online'
                            ? 'bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300',
                          'rounded-full capitalize',
                        )}
                      >
                        {act.status}
                      </Badge>
                      <h3 className="line-clamp-1 text-sm leading-tight font-semibold">
                        {act.event}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} variant="Bulk" /> {act.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Location size={14} variant="Bulk" /> {act.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <TickCircle
                            size={14}
                            variant={act.registered ? 'Bulk' : 'Linear'}
                            color={act.registered ? '#22c55e' : '#9ca3af'}
                          />
                          {act.registered ? 'Registered' : 'Belum Register'}
                        </div>
                      </div>
                    </div>

                    {/* Right: Button */}
                    <div className="ml-auto flex flex-col items-end">
                      <Button className="text-white">
                        Detail Event <ArrowRight2 size="32" variant="Bulk" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
