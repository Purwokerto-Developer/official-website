'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { EventListItem } from '@/types/event-type';
import { motion } from 'framer-motion';
import { ArrowDown2, ArrowUp2, SearchNormal, Sort } from 'iconsax-reactjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { EventList } from './event-list';
import EmptyState from '@/components/ui/empty-state';

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
        (e.location_name?.toLowerCase().includes(query) ?? false)),
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
      { label: 'Total', value: total },
      { label: 'Online', value: online },
      { label: 'Offline', value: offline },
    ],
  };

  // State for UI label
  const [filterLabel, setFilterLabel] = useState(
    filter === 'online' ? 'Online' : filter === 'offline' ? 'Offline' : 'All Events',
  );
  const [sortLabel, setSortLabel] = useState(
    sort === 'oldest' ? 'Oldest' : sort === 'az' ? 'A–Z' : 'Latest',
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
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <header className="mb-8 rounded-2xl border border-neutral-200 bg-white px-5 py-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Left: logo + title */}
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-800">
              <Image
                src="/img-logo.png"
                alt="logo"
                fill
                sizes="96px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl leading-tight font-extrabold text-neutral-800 dark:text-white">
                Event Collections
              </h1>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Discover upcoming events and join the community.
              </p>
            </div>
          </div>

          {/* Right: stats */}
          <div className="flex flex-wrap justify-center gap-3 md:justify-end">
            {stats.stats.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                <span className="text-sm text-neutral-500 dark:text-neutral-400">{item.label}</span>
                <span className="rounded-md bg-white px-3 py-1 text-sm font-semibold text-sky-600 shadow-sm dark:bg-neutral-900 dark:text-sky-400">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* TOOLBAR: clean, minimal, dark-mode friendly */}
      <nav className="mb-8 flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search bar */}
        <form
          action={handleSearch}
          className="order-2 flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2 shadow-sm md:order-1 md:w-1/2 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <Input
            name="q"
            defaultValue={query}
            placeholder="Search events, title, or location"
            className="bg-transparent px-2 py-1 text-sm text-neutral-700 placeholder:text-neutral-400 focus-visible:ring-0 dark:text-neutral-200 dark:placeholder:text-neutral-500"
          />
          <Button
            type="submit"
            variant="gradient_blue"
            className="rounded-md px-3 py-1 text-sm font-medium"
          >
            <SearchNormal size="18" className="text-white" variant="Bulk" />
            <span className="ml-1 hidden sm:inline">Search</span>
          </Button>
        </form>

        {/* Filter & Sort controls */}
        <div className="order-1 flex flex-wrap items-center justify-between gap-3 md:order-2 md:justify-end">
          {/* Filter chips */}
          <div className="flex gap-2">
            {[
              { label: 'All', value: 'all' },
              { label: 'Online', value: 'online' },
              { label: 'Offline', value: 'offline' },
            ].map((btn) => (
              <Button
                key={btn.value}
                size="sm"
                variant={filter === btn.value ? undefined : 'ghost'}
                className={`border px-3 py-1 text-sm transition-all duration-150 ${
                  filter === btn.value
                    ? 'bg-sky-50 text-sky-600 shadow-sm dark:bg-sky-950 dark:text-sky-400'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800'
                }`}
                onClick={() => {
                  setFilterLabel(btn.label);
                  handleFilterChange(btn.value);
                }}
              >
                {btn.label}
              </Button>
            ))}
          </div>

          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="border border-neutral-200 px-3 py-1 text-sm text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Sort: {sortLabel}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="rounded-xl border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
              <DropdownMenuItem
                onClick={() => {
                  setSortLabel('Latest');
                  handleSortChange('latest');
                }}
                className="cursor-pointer rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-sky-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <ArrowDown2 className="mr-2 inline-block h-4 w-4 text-sky-500" /> Latest
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortLabel('Oldest');
                  handleSortChange('oldest');
                }}
                className="cursor-pointer rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-sky-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <ArrowUp2 className="mr-2 inline-block h-4 w-4 text-sky-500" /> Oldest
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortLabel('A–Z');
                  handleSortChange('az');
                }}
                className="cursor-pointer rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-sky-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <Sort className="mr-2 inline-block h-4 w-4 text-sky-500" /> A–Z
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* CONTENT */}
      {isEmpty ? (
        <div className="rounded-lg border border-dashed border-neutral-100 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
          <EmptyState
            title={query ? 'No results for your search' : 'No upcoming events'}
            description={
              query
                ? `We couldn't find any events matching "${query}". Try another keyword or clear filters.`
                : 'We couldn\'t find events that match your filters. Remove filters or try another search.'
            }
            actionLabel={query || filter !== 'all' || sort !== 'latest' ? 'Reset filters' : undefined}
            onAction={
              query || filter !== 'all' || sort !== 'latest'
                ? () => {
                    setFilterLabel('All Events');
                    handleFilterChange('all');
                    handleSortChange('latest');
                    router.push('?');
                  }
                : undefined
            }
            heightClassName="min-h-[240px]"
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
              >
                {/* EventList is assumed to be a card. If not, it will render inside this motion wrapper */}
                <EventList item={event} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {filteredEvents.length > pageSize && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href={`?page=${Math.max(1, page - 1)}&pageSize=${pageSize}`}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  page === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-sky-50'
                }`}
                aria-disabled={page === 1}
              >
                Previous
              </Link>
              <span className="text-sm text-neutral-600">Page {page}</span>
              <Link
                href={`?page=${page + 1}&pageSize=${pageSize}`}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  events.length < pageSize ? 'pointer-events-none opacity-50' : 'hover:bg-sky-50'
                }`}
                aria-disabled={events.length < pageSize}
              >
                Next
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
