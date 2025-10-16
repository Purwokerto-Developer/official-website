'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { EventStats } from './event-stats';
import type { EventListItem } from '@/types/event-type';
import { motion } from 'framer-motion';
import { EventList } from './event-list';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FilterSearch, ArrowDown2, ArrowUp2, Sort } from 'iconsax-reactjs';

interface EventContentProps {
  events: EventListItem[];
  page: number;
  pageSize: number;
}

export default function EventContent({ events = [], page, pageSize }: EventContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get('q')?.toLowerCase() ?? '';
  const sort = searchParams.get('sort') ?? 'latest';
  const filter = searchParams.get('filter') ?? 'all';

  // Filter events
  let filteredEvents = events.filter(
    (e) =>
      (filter === 'all' || e.event_type === filter) &&
      (e.title.toLowerCase().includes(query) ||
        (e.collaborator_name?.toLowerCase().includes(query) ?? false) ||
        (e.address?.toLowerCase().includes(query) ?? false)),
  );

  // Sort events
  filteredEvents.sort((a, b) => {
    if (sort === 'az') return a.title.localeCompare(b.title);
    const timeA = new Date(a.start_time).getTime();
    const timeB = new Date(b.start_time).getTime();
    return sort === 'latest' ? timeB - timeA : timeA - timeB;
  });

  // Stats
  const total = filteredEvents.length;
  const online = filteredEvents.filter((e) => e.event_type === 'online').length;
  const offline = filteredEvents.filter((e) => e.event_type === 'offline').length;
  const stats = {
    stats: [
      { label: 'total', value: total },
      { label: 'online', value: online },
      { label: 'offline', value: offline },
    ],
  };

  // State for UI label
  const [filterLabel, setFilterLabel] = useState(
    filter === 'online' ? 'Online' : filter === 'offline' ? 'Offline' : 'All Event',
  );
  const [sortLabel, setSortLabel] = useState(
    sort === 'oldest' ? 'Old Event' : sort === 'az' ? 'A-Z' : 'Latest',
  );

  // Handlers
  const handleSearch = useCallback(
    (formData: FormData) => {
      const q = formData.get('q')?.toString().trim() || '';
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set('q', q);
      else params.delete('q');
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleSortChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', value);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleFilterChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'all') params.delete('filter');
      else params.set('filter', value);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const isEmpty = filteredEvents.length === 0;

  return (
    <div>
      {/* Header Banner */}
      <Image
        src="/event-banner.jpg"
        height={200}
        width={400}
        alt="Event Banner"
        className="h-[300px] w-full rounded-2xl object-cover object-center"
      />

      <div className="flex flex-col items-center justify-center gap-4">
        <Avatar className="border-background -mt-10 h-24 w-24 border-8">
          <AvatarImage src="/img-logo.png" className="h-32 w-32 bg-slate-500 object-cover" />
        </Avatar>

        <h1 className="text-3xl font-bold">Event Collections</h1>
        <p className="text-muted-foreground text-center text-sm">Purwokerto Dev</p>
        <EventStats {...stats} />

        {/* Toolbar: Filter | Search | Sort */}
        <div className="mb-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {filterLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="rounded-2xl p-2">
              <DropdownMenuItem
                onClick={() => {
                  setFilterLabel('All Event');
                  handleFilterChange('all');
                }}
              >
                All Event
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setFilterLabel('Online');
                  handleFilterChange('online');
                }}
              >
                Online
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setFilterLabel('Offline');
                  handleFilterChange('offline');
                }}
              >
                Offline
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search + Sort */}
          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            <form action={handleSearch}>
              <Input type="text" name="q" defaultValue={query} placeholder="Search events..." />
            </form>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {sortLabel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl p-2">
                <DropdownMenuItem
                  onClick={() => {
                    setSortLabel('Latest');
                    handleSortChange('latest');
                  }}
                >
                  <ArrowDown2 className="mr-2 h-4 w-4" /> Latest
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortLabel('Old Event');
                    handleSortChange('oldest');
                  }}
                >
                  <ArrowUp2 className="mr-2 h-4 w-4" /> Old Event
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortLabel('A-Z');
                    handleSortChange('az');
                  }}
                >
                  <Sort className="mr-2 h-4 w-4" /> A-Z
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Event Grid */}
        <div className="mt-8 w-full">
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex h-[380px] flex-col items-center justify-center text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                <Image src="/img-logo.png" width={60} height={60} alt="Logo" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-gray-800">
                Tidak ada event mendatang
              </h2>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Saat ini belum ada event baru. Tetap pantau halaman komunitas untuk info event
                selanjutnya!
              </p>
              <button className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white">
                Lihat Semua Event
              </button>
            </motion.div>
          ) : (
            <>
              <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
                {filteredEvents.map((event) => (
                  <EventList key={event.id} item={event} />
                ))}
              </div>

              {/* Pagination */}
              <div className="my-8 flex items-center justify-center gap-2 md:justify-end">
                <Link
                  href={`?page=${page - 1}&pageSize=${pageSize}`}
                  className={`border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm font-medium shadow-sm transition-colors ${
                    page === 1 ? 'pointer-events-none opacity-50' : ''
                  }`}
                  aria-disabled={page === 1}
                >
                  Previous
                </Link>
                <span className="mx-2 text-sm">Page {page}</span>
                <Link
                  href={`?page=${page + 1}&pageSize=${pageSize}`}
                  className={`border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm font-medium shadow-sm transition-colors ${
                    events.length < pageSize ? 'pointer-events-none opacity-50' : ''
                  }`}
                  aria-disabled={events.length < pageSize}
                >
                  Next
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
