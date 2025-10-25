'use client';

import CardSwap, { Card as CardSwapContent } from '@/components/CardSwap';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import { useIsMobile } from '@/hooks/use-mobile';
import { Calendar, Location, TickCircle } from 'iconsax-reactjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type EventItem = {
  id: string | number;
  title?: string;
  date?: string;
  status?: string;
  eventStatus?: string;
  registered?: boolean;
  location?: string;
  image?: string | null;
  description?: string | null;
};

const ActivityCard = ({ events }: { events: EventItem[] }) => {
  const isMobile = useIsMobile();
  const [showAll, setShowAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const upcomingEvents = events ?? [];

  const swapWidth = isMobile ? 360 : 520;
  const swapHeight = isMobile ? 520 : 400;
  const swapClassName = isMobile
    ? '!translate-x-[45%] !translate-y-[40%] !scale-[1] '
    : '!translate-x-[45%] lg:!translate-y-[40%] !scale-[1] h-full border-card';

  const visibleEvents = isMobile
    ? upcomingEvents
    : showAll
      ? upcomingEvents
      : upcomingEvents.slice(0, 3);
  const isEmpty = upcomingEvents.length === 0;

  useEffect(() => {
    if (visibleEvents.length === 0) {
      setActiveIndex(0);
      return;
    }
    if (activeIndex >= visibleEvents.length) {
      setActiveIndex(0);
    }
  }, [visibleEvents, activeIndex]);

  return (
    <Card className="relative h-full w-full overflow-hidden py-0">
      <CardContent className="relative h-[440px] p-0 pb-20">
        {isEmpty ? (
          <div className="p-6">
            <EmptyState
              title="Tidak ada event mendatang"
              description="Saat ini belum ada event baru. Tetap pantau halaman komunitas untuk info event selanjutnya!"
              actionLabel="Lihat Semua Event"
              href="/u/events"
            />
          </div>
        ) : (
          <div className="relative h-full w-full">
            <div className="flex h-full w-full flex-col md:flex-row">
              {/* Left column: centered heading/subtitle (desktop) */}
              <div className="hidden items-center justify-center md:flex md:w-1/2">
                <div className="flex h-full flex-col items-start justify-center pl-8">
                  <h2 className="text-foreground mb-2 text-3xl leading-tight font-bold">
                    See what the next events
                    <br />
                    are coming up!
                  </h2>
                  <p className="text-muted-foreground text-base">Just look at it go!</p>
                </div>
              </div>

              {/* Right column: CardSwap centered */}
              <div className="flex w-full items-center justify-center md:w-1/2">
                <div className="flex w-full max-w-[720px] items-center justify-center">
                  <CardSwap
                    cardDistance={30}
                    verticalDistance={120}
                    delay={5000}
                    pauseOnHover={false}
                    onCardClick={(i) => setActiveIndex(i)}
                    onActiveChange={(i) => setActiveIndex(i)}
                    width={swapWidth}
                    height={swapHeight}
                    className={swapClassName}
                  >
                    {visibleEvents.map((ev) => (
                      <CardSwapContent key={ev.id} className="h-full overflow-hidden rounded-t-lg">
                        {ev.image ? (
                          <div className="relative h-full w-full">
                            <Image
                              src={ev.image as string}
                              alt={String(ev.title ?? '')}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-full items-center justify-center">No image</div>
                        )}
                      </CardSwapContent>
                    ))}
                  </CardSwap>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {upcomingEvents.length > 0 && (
        <CardFooter className="absolute bottom-4 left-0 z-40 w-full px-4 md:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <div className="from-bg/95 flex flex-col gap-3 rounded-lg bg-gradient-to-t to-transparent p-4 backdrop-blur-lg md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="truncate text-xl font-semibold">
                    {visibleEvents[activeIndex]?.title}
                  </h3>
                  <Badge variant="green" className="ml-4">
                    {visibleEvents[activeIndex]?.status ?? 'offline'}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" variant="Bulk" />
                    <span className="truncate">{visibleEvents[activeIndex]?.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Location className="size-4" variant="Bulk" />
                    <span className="truncate">{visibleEvents[activeIndex]?.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TickCircle className="size-4" variant="Bulk" />
                    <span>
                      {visibleEvents[activeIndex]?.registered ? 'Terdaftar' : 'Belum Terdaftar'}
                    </span>
                  </div>
                </div>

                <p className="mt-2 line-clamp-3 max-w-prose text-sm">
                  {visibleEvents[activeIndex]?.description ??
                    'Deskripsi singkat event bisa ditaruh di sini jika tersedia.'}
                </p>
              </div>
            </div>
          </div>
        </CardFooter>
      )}

      {/* Optional: show See More on desktop below footer */}
      {!isMobile && upcomingEvents.length > 4 && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'See Less' : 'See More'}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ActivityCard;
