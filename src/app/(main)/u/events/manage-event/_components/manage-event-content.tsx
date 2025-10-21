'use client';

import { deleteEvent } from '@/action/event-action';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { formatDateID } from '@/lib/utils';
import { EventListItem } from '@/types/event-type';
import { Edit2, SearchNormal, Trash } from 'iconsax-reactjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

interface ManageEventContentProps {
  events: EventListItem[];
  page: number;
  pageSize: number;
}

export default function ManageEventContent({
  events = [],
  page,
  pageSize,
}: ManageEventContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get('q')?.toLowerCase() ?? '';
  const sort = searchParams.get('sort') ?? 'latest';
  const filter = searchParams.get('filter') ?? 'all';

  let filteredEvents = events.filter(
    (e) =>
      (filter === 'all' || e.event_type === filter) &&
      (e.title.toLowerCase().includes(query) ||
        (e.collaborator_name?.toLowerCase().includes(query) ?? false) ||
        (e.location_name?.toLowerCase().includes(query) ?? false)),
  );

  filteredEvents.sort((a, b) => {
    if (sort === 'az') return a.title.localeCompare(b.title);
    const timeA = new Date(a.start_time).getTime();
    const timeB = new Date(b.start_time).getTime();
    return sort === 'latest' ? timeB - timeA : timeA - timeB;
  });

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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

  const isEmpty = filteredEvents.length === 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <Link href="/u/events/create">
          <Button variant="gradient_blue">Create Event</Button>
        </Link>
      </header>

      <form
        action={handleSearch}
        className="mb-6 flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
      >
        <Input
          name="q"
          defaultValue={query}
          placeholder="Search events"
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

      {isEmpty ? (
        <div className="rounded-lg border border-dashed border-neutral-100 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
          <EmptyState
            title={query ? 'No results for your search' : 'No events to manage'}
            description={
              query
                ? `We couldn't find any events matching "${query}".`
                : 'There are no events yet. Create one to get started.'
            }
            heightClassName="min-h-[240px]"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEvents.map((item) => (
            <Card key={item.id} className="relative overflow-hidden rounded-xl">
              <CardContent className="p-0">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-xl">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="bg-muted flex h-full w-full items-center justify-center">
                      <span className="text-muted-foreground text-sm">No image</span>
                    </div>
                  )}
                </div>
                <div className="px-4 pt-4 pb-3">
                  <div className="mb-1 line-clamp-1 w-full truncate text-base font-semibold">
                    {item.title}
                  </div>
                  <div className="mb-2 text-xs text-neutral-500">
                    {formatDateID(item.start_time)}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Link href={`/u/events/manage-event/edit/${item.id}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Edit2 size={16} /> Edit
                        </Button>
                      </Link>
                      <Link href={`/u/events/manage-event/detail/${item.id}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          Detail
                        </Button>
                      </Link>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          disabled={isDeleting === item.id}
                        >
                          <Trash size={16} /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-background rounded-xl border-0 shadow-xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{item.title}" will be permanently deleted. This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={async () => {
                              setIsDeleting(item.id);
                              await deleteEvent(item.id);
                              setIsDeleting(null);
                              router.refresh();
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
