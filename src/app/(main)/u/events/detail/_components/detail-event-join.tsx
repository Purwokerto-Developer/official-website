'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Airdrop,
  Calendar,
  Colorfilter,
  InfoCircle,
  Location,
  User,
  WristClock,
} from 'iconsax-reactjs';
import { useEffect, useState } from 'react';

export const DetailEventJoin = () => {
  // simulasi tanggal event
  const eventDate = new Date('2025-11-01T10:00:00');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isRegistered, setIsRegistered] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full flex-col justify-between gap-8 md:flex-row">
      {/* Kiri – Banner */}
      <div className="flex h-[700px] flex-1 items-center justify-center rounded-2xl bg-slate-100 dark:bg-neutral-900">
        <div className="text-centertext-neutral-600">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-xl bg-slate-300 dark:bg-neutral-800">
            <User size={40} />
          </div>
        </div>
      </div>

      {/* Kanan – Detail & Status */}
      <div className="w-6/12 space-y-6">
        {/* CARD STATUS */}
        <Card className="bg-card border-primary/20 rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="mb-2 flex items-center gap-2">
              <Calendar size="20" variant="Bulk" className="text-primary" />
              <span className="font-medium">Event starts in</span>
            </div>
            <div
              className={`rounded-full px-3 py-1 text-sm ${
                isRegistered ? 'bg-green-600/10 text-green-600' : 'bg-red-600/10 text-red-600'
              }`}
            >
              {isRegistered ? 'Registered' : 'Not Registered'}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Countdown */}
            <div>
              <div className="flex justify-between gap-2">
                {/* Hari */}
                <div className="flex w-1/4 flex-col items-center justify-center rounded-md bg-slate-100 px-4 py-3 dark:bg-neutral-800">
                  <span className="text-primary text-2xl font-bold">{timeLeft.days}</span>
                  <span className="text-xs">Days</span>
                </div>
                {/* Jam */}
                <div className="flex w-1/4 flex-col items-center justify-center rounded-md bg-slate-100 px-4 py-3 dark:bg-neutral-800">
                  <span className="text-primary text-2xl font-bold">{timeLeft.hours}</span>
                  <span className="text-xs">Hours</span>
                </div>
                {/* Menit */}
                <div className="flex w-1/4 flex-col items-center justify-center rounded-md bg-slate-100 px-4 py-3 dark:bg-neutral-800">
                  <span className="text-primary text-2xl font-bold">{timeLeft.minutes}</span>
                  <span className="text-xs">Minutes</span>
                </div>
                {/* Detik */}
                <div className="flex w-1/4 flex-col items-center justify-center rounded-md bg-slate-100 px-4 py-3 dark:bg-neutral-800">
                  <span className="text-primary text-2xl font-bold">{timeLeft.seconds}</span>
                  <span className="text-xs">Seconds</span>
                </div>
              </div>
            </div>

            {/* Alert */}
            <div
              className={`flex items-start gap-2 rounded-md border-none p-3 text-sm ${
                isRegistered ? 'bg-green-600/10 text-green-600' : 'bg-yellow-600/10 text-yellow-600'
              }`}
            >
              <InfoCircle size="18" className="mt-0.5" />
              {isRegistered
                ? 'You’re registered! Don’t forget to attend and check your email for details.'
                : 'Registration closes soon — sign up before it’s too late!'}
            </div>

            {/* Join Button */}
            <Button
              onClick={() => setIsRegistered(!isRegistered)}
              variant="gradient_blue"
              className="mt-3 w-full rounded-full"
            >
              {isRegistered ? 'Cancel Registration' : 'Join Event'}
            </Button>
          </CardContent>
        </Card>

        {/* Description */}
        <div>
          <h3 className="mb-1 font-semibold">Description</h3>
          <p className="text-sm">
            Seminar ini membahas ancaman tersembunyi di balik kelalaian pengelolaan domain dan
            kontrol akses yang lemah. Pelajari cara mendeteksi serta mencegah serangan yang sering
            luput dari perhatian namun berdampak besar.
          </p>
        </div>

        {/* Detail */}
        <div>
          <h3 className="mb-1 font-semibold">Detail</h3>
          <div className="flex flex-col gap-5">
            {/* Location */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Location size="20" variant="Bulk" className="text-primary" />
                <span className="">Location</span>
              </div>
              <p className="text-muted-foreground text-sm">Purwokerto</p>
            </div>

            {/* Event type */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Airdrop size="20" className="text-primary" variant="Bulk" />
                <span className="">Event type</span>
              </div>
              <p className="text-muted-foreground text-sm">Offline</p>
            </div>

            {/* Time */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <WristClock size="20" className="text-primary" variant="Bulk" />
                <span className="">Time</span>
              </div>
              <p className="text-muted-foreground text-sm">10:00 AM - 12:00 PM</p>
            </div>

            {/* Speaker */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <User size="20" className="text-primary" variant="Bulk" />
                <span className="">Speaker</span>
              </div>
              <p className="text-muted-foreground text-sm">John Doe</p>
            </div>

            {/* Collaborator */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Colorfilter size="20" variant="Bulk" className="text-primary" />
                <span className="">Collaborator</span>
              </div>
              <p className="text-muted-foreground text-sm">Tegalsec</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
