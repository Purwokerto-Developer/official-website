import { Separator } from '@/components/ui/separator';
import React from 'react';

interface StatItem {
  label: string;
  value: string | number;
}

interface EventStatsProps {
  stats: StatItem[];
}

export const EventStats: React.FC<EventStatsProps> = ({ stats }) => {
  return (
    <div className="mb-4 flex w-full items-center justify-between rounded-lg border px-2 py-4 lg:w-3/12">
      {stats.map((stat, idx) => (
        <div key={stat.label} className="flex flex-1 flex-col items-center">
          <span className="font-bold">{stat.value}</span>
          <span className="text-muted-foreground mt-1 text-xs">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};
