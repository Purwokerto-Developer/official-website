'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Calendar, Location } from 'iconsax-reactjs';
import { joinEvent, cancelEventJoin } from '@/action/event-action';
import { showToast } from '@/components/custom-toaster';

type EventItem = {
  id: string | number;
  title?: string;
  date?: string;
  registered?: boolean;
  location?: string;
  image?: string | null;
  description?: string | null;
};

const ActivityCard = ({ events }: { events: EventItem[] }) => {
  const [localEvents, setLocalEvents] = useState<EventItem[]>(events ?? []);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocalEvents(events ?? []);
  }, [events]);

  const handleJoin = async (id: string | number) => {
    setLoadingMap((m) => ({ ...m, [id]: true }));
    try {
      const res = await joinEvent(String(id));
      if (res.success) {
        setLocalEvents((prev) => prev.map((e) => (e.id === id ? { ...e, registered: true } : e)));
        showToast('success', 'Successfully joined the event');
      } else {
        showToast('error', res.error || 'Failed to join');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to join');
    } finally {
      setLoadingMap((m) => ({ ...m, [id]: false }));
    }
  };

  const handleCancel = async (id: string | number) => {
    setLoadingMap((m) => ({ ...m, [id]: true }));
    try {
      const res = await cancelEventJoin(String(id));
      if (res.success) {
        setLocalEvents((prev) => prev.map((e) => (e.id === id ? { ...e, registered: false } : e)));
        showToast('success', 'Join cancelled');
      } else {
        showToast('error', res.error || 'Failed to cancel');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to cancel');
    } finally {
      setLoadingMap((m) => ({ ...m, [id]: false }));
    }
  };

  if (!localEvents || localEvents.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            title="Tidak ada event mendatang"
            description="Saat ini belum ada event baru. Tetap pantau halaman komunitas untuk info event selanjutnya!"
            actionLabel="Lihat Semua Event"
            href="/u/events"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Upcoming events</h3>
            <p className="text-muted-foreground text-sm">Events happening soon in your community</p>
          </div>
          <div className="text-muted-foreground text-sm">{localEvents.length} items</div>
        </div>

        <div className="grid gap-3">
          {localEvents.map((ev) => (
            <div key={String(ev.id)} className="flex items-center gap-4 rounded-md border p-3">
              <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                {ev.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ev.image} alt={ev.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{ev.title}</div>
                    <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" variant="Bulk" />
                        <span className="truncate">{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Location className="size-4" variant="Bulk" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                      {ev.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {ev.registered ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(ev.id)}
                        disabled={!!loadingMap[String(ev.id)]}
                      >
                        {loadingMap[String(ev.id)] ? '...' : 'Cancel'}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleJoin(ev.id)}
                        disabled={!!loadingMap[String(ev.id)]}
                      >
                        {loadingMap[String(ev.id)] ? '...' : 'Join'}
                      </Button>
                    )}
                    <a
                      href={`/u/events/${ev.id}`}
                      className="text-muted-foreground text-xs hover:underline"
                    >
                      Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
