// components/event-list.tsx
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDateID } from '@/lib/utils';
import type { EventListItem } from '@/types/event-type';
import { Gallery, Verify } from 'iconsax-reactjs';
import Image from 'next/image';
import Link from 'next/link';

interface EventListProps {
  item: EventListItem;
}

export const EventList: React.FC<EventListProps> = ({ item }) => {
  return (
    <Link href={`events/detail/${item.id}`}>
      <Card className="bg-muted relative rounded-xl p-0 transition-shadow hover:shadow-md">
        <div className="flex h-full flex-col">
          {/* Image */}
          <div className="bg-background relative aspect-[4/5] w-full overflow-hidden rounded-t-xl">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="bg-muted flex h-full w-full items-center justify-center">
                <Gallery size="100" color="#FF8A65" variant="Bulk" />
              </div>
            )}
            <div className="absolute top-4 right-4">
              <Badge
                className="rounded-full"
                variant={item.event_type === 'online' ? 'green' : 'yellow'}
              >
                {item.event_type}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <CardContent className="px-4 pt-4 pb-2">
            <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs">
              <span className="font-medium">{item.collaborator_name ?? 'Unknown'}</span>
              <Verify size={20} className="text-blue-500" variant="Bulk" />
            </div>
            <div className="mb-2 truncate text-base font-semibold">{item.title}</div>
            <Separator className="mb-2" />
            <div className="flex justify-between text-xs">
              <div>
                <div className="text-muted-foreground">LOCATION</div>
                <div className="line-clamp-1 w-11/12 font-bold">{item.address ?? 'Unknown'}</div>
              </div>
              <div>
                <div className="text-muted-foreground">DATE</div>
                <div className="font-bold">
                  {formatDateID(item.start_time) ? formatDateID(item.start_time) : 'Unknown'}
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};
