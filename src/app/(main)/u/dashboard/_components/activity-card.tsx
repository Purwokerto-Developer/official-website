'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Calendar, Location, Activity, TickCircle, ArrowRight2 } from 'iconsax-reactjs';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

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
    event: 'Next.js Advanced Workshop',
    date: 'Tue, 25 November 2025',
    status: 'online',
    eventStatus: 'Upcoming',
    registered: false,
    location: 'Zoom',
    image: '/img-logo.png',
  },
  {
    id: 5,
    event: 'Purwokerto Tech Festival',
    date: 'Fri, 10 December 2025',
    status: 'offline',
    eventStatus: 'Upcoming',
    registered: false,
    location: 'Auditorium Soedirman',
    image: '/img-logo.png',
  },
];

const upcomingEvents = activities.filter((act) => act.eventStatus === 'Upcoming');

const ActivityCard = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleEvents = isMobile
    ? upcomingEvents
    : showAll
      ? upcomingEvents
      : upcomingEvents.slice(0, 3);
  const isEmpty = upcomingEvents.length === 0;

  return (
    <Card className="h-[500px] w-full overflow-hidden">
      <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-50 p-2">
            <Activity className="text-primary size-[30px]" variant="Bulk" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
            <CardDescription>Event komunitas yang akan datang untuk kamu.</CardDescription>
          </div>
        </div>
        {!isMobile && upcomingEvents.length > 4 && (
          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'See Less' : 'See More'}
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="px-6">
        {isEmpty ? (
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
            className={cn('grid gap-2', isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3')}
          >
            {visibleEvents.map((act) => (
              <motion.div
                key={act.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* CARD */}
                <Card className="flex flex-col overflow-hidden rounded-xl pt-0 pb-0 shadow-sm transition-all hover:shadow-md">
                  <div className="relative h-40 w-full">
                    <Image
                      src={act.image}
                      alt={act.event}
                      fill
                      className="bg-primary/10 object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between px-4 pb-2">
                    <div>
                      <Badge
                        className={cn(
                          act.status === 'online'
                            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300',
                          'rounded-full capitalize',
                        )}
                      >
                        {act.status}
                      </Badge>
                      <h3 className="mt-2 line-clamp-1 text-base leading-tight font-semibold">
                        {act.event}
                      </h3>

                      <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} variant="Bulk" />
                          <span className="line-clamp-1">{act.date}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Location size={14} variant="Bulk" />
                          <span className="line-clamp-1">{act.location}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <TickCircle
                            size={14}
                            variant={act.registered ? 'Bulk' : 'Linear'}
                            color={act.registered ? '#22c55e' : '#9ca3af'}
                          />
                          <span className="line-clamp-1">
                            {act.registered ? 'Registered' : 'Belum Register'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
