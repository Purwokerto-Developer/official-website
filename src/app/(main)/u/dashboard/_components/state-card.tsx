import React from 'react';
import { cn } from '@/lib/utils';
import CountUp from '@/components/count-up';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardState } from '@/types/dashboard-state-type';
import { Badge } from '@/components/ui/badge';
import { Chart, MoneySend, Calendar, DocumentText, Archive } from 'iconsax-reactjs';

const accentColors: Record<string, string> = {
  'Total Events': 'bg-blue-100 text-blue-600',
  Upcoming: 'bg-green-100 text-green-600',
  'My Articles': 'bg-purple-100 text-purple-600',
  'Past Events': 'bg-gray-100 text-gray-600',
};

export const StateCard = ({ state }: { state: DashboardState }) => {
  const { title, description, count, icon, status } = state;

  const ICONS: Record<string, React.ComponentType<any>> = {
    MoneySend,
    Calendar,
    DocumentText,
    Archive,
  };

  const IconComp = icon ? (ICONS[icon] ?? null) : null;

  return (
    <>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <CountUp
              from={0}
              to={count}
              separator=","
              direction="up"
              duration={0.8}
              className="text-foreground text-4xl font-extrabold tracking-tight"
            />
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={cn(accentColors[title] || 'bg-accent text-accent-foreground')}
            >
              {IconComp &&
                React.createElement(IconComp as any, { className: 'size-4', variant: 'Bulk' })}{' '}
              {status}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Data terbaru <Chart className="size-4" variant="Bulk" />
          </div>
          <div className="text-muted-foreground">{description}</div>
        </CardFooter>
      </Card>
    </>
  );
};
