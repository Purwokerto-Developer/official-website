'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Gallery, Heart, Verify, SearchNormal1, ArrowDown2, ArrowUp2, Sort } from 'iconsax-reactjs';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export interface EventListItem {
  id: number | string;
  title: string;
  creator: string;
  image?: string;
  likes?: number;
  buyNow?: string;
  highestBid?: string;
  type?: string;
  date?: string;
  location?: string;
}

interface EventListProps {
  items: EventListItem[];
}

export const EventList: React.FC<EventListProps> = ({ items }) => {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'online' | 'offline'>('all');
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState<'az' | 'latest' | 'old'>('latest');
  const pageSize = 6;

  // Filter, search, and sort logic
  const filteredItems = React.useMemo(() => {
    let result = items;

    // Filter
    if (filter !== 'all') {
      result = result.filter((item) => item.type === filter);
    }

    // Search
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(lower) || item.creator.toLowerCase().includes(lower),
      );
    }

    // Sort
    if (sort === 'az') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'latest') {
      result = [...result].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    } else if (sort === 'old') {
      result = [...result].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    }

    return result;
  }, [items, filter, search, sort]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full">
      {/* Filter & Sort Bar */}
      <div className="mb-6 flex gap-4 md:items-center md:justify-between">
        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" aria-label="Filter">
              {filter === 'all' && <span>All Event</span>}
              {filter === 'online' && <span>Online</span>}
              {filter === 'offline' && <span>Offline</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                setFilter('all');
                setPage(1);
              }}
            >
              All Event
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setFilter('online');
                setPage(1);
              }}
            >
              Online
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setFilter('offline');
                setPage(1);
              }}
            >
              Offline
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-background focus:ring-primary rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-1/2 right-1 -translate-y-1/2"
              aria-label="Search"
              onClick={() => setPage(1)}
            >
              <SearchNormal1 size={18} />
            </Button>
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Sort">
                {sort === 'az' && (
                  <>
                    <Sort size={18} className="mr-1" />{' '}
                    <span className="hidden sm:inline">A-Z</span>
                  </>
                )}
                {sort === 'latest' && (
                  <>
                    <ArrowDown2 size={18} className="mr-1" />{' '}
                    <span className="hidden sm:inline">Latest</span>
                  </>
                )}
                {sort === 'old' && (
                  <>
                    <ArrowUp2 size={18} className="mr-1" />{' '}
                    <span className="hidden sm:inline">Old Event</span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSort('latest')}>
                <ArrowDown2 size={16} className="mr-2" /> Latest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('old')}>
                <ArrowUp2 size={16} className="mr-2" /> Old Event
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('az')}>
                <Sort size={16} className="mr-2" /> A-Z
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Event Grid */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {paginatedItems.map((item) => (
          <Link href={`events/detail/${item.id}`} key={item.id}>
            <Card className="bg-muted relative rounded-xl p-0">
              <div className="flex h-full flex-col">
                {/* Image */}
                <div className="bg-background relative flex h-48 flex-1 items-center justify-center rounded-t-xl">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      height={96}
                      width={96}
                      className="h-24 w-24 object-contain"
                    />
                  ) : (
                    <div className="flex h-72 w-24 items-center justify-center rounded-md">
                      <Gallery size="100" color="#FF8A65" variant="Bulk" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <Badge
                      className="rounded-full"
                      variant={item.type === 'online' ? 'green' : 'yellow'}
                    >
                      {item.type}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="px-4 pt-4 pb-2">
                  <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs">
                    <span className="font-medium">{item.creator}</span>
                    <Verify size={20} className="text-blue-500" variant="Bulk" />
                  </div>
                  <div className="mb-2 truncate text-base font-semibold">{item.title}</div>
                  <Separator className="mb-2" />

                  {/* Info */}
                  <div className="flex justify-between text-xs">
                    <div>
                      <div className="text-muted-foreground">LOCATION</div>
                      <div className="font-bold">{item.location ?? 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">DATE</div>
                      <div className="font-bold">{item.date ?? 'Unknown'}</div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="my-8 flex items-center justify-center gap-2 md:justify-end">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="mx-2 text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
