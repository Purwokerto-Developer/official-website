'use client';

import { TrendingUp } from 'lucide-react';
import React from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

type UpcomingEvent = {
  id: string | number;
  title?: string;
  date?: string;
  registered?: boolean;
  participants_count?: number;
  capacity?: number;
  event_type?: 'online' | 'offline' | string;
  category?: string;
  created_at?: string;
  rating?: number;
};

function toNumber(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeRatio(r: number) {
  if (!isFinite(r) || r <= 0) return 0;
  return Math.min(100, Math.round(r * 100));
}

export default function EventChart({ events }: { events?: UpcomingEvent[] }) {
  const list = events ?? [];

  const metrics = React.useMemo(() => {
    const total = list.length;

    const registeredCount = list.filter(
      (e) => e.registered || toNumber(e.participants_count) > 0,
    ).length;
    const onlineCount = list.filter((e) => e.event_type === 'online').length;
    const offlineCount = list.filter((e) => e.event_type === 'offline').length;

    // capacity utilization average
    let capSum = 0;
    let capItems = 0;
    list.forEach((e) => {
      const p = toNumber(e.participants_count);
      const c = toNumber(e.capacity);
      if (c > 0) {
        capSum += Math.min(p, c) / c;
        capItems++;
      }
    });
    const avgCapUtil = capItems > 0 ? capSum / capItems : 0;

    // attendance heuristic
    const attendanceRate = total > 0 ? registeredCount / Math.max(1, total) : 0;

    // recency score (0..1)
    let recencyScore = 0;
    if (total > 0) {
      const now = Date.now();
      const ages = list.map((e) => {
        const d = e.date ?? e.created_at;
        const t = d ? new Date(d).getTime() : now;
        const days = Math.max(0, (now - t) / (1000 * 60 * 60 * 24));
        return days;
      });
      const maxDays = Math.max(...ages, 1);
      const inverted = ages.map((d) => 1 - Math.min(d / maxDays, 1));
      recencyScore = inverted.reduce((s, v) => s + v, 0) / inverted.length;
    }

    const regNorm = normalizeRatio(total > 0 ? registeredCount / Math.max(1, total) : 0);
    const attendNorm = normalizeRatio(attendanceRate);
    const onlineNorm = normalizeRatio(total > 0 ? onlineCount / Math.max(1, total) : 0);
    const capNorm = normalizeRatio(avgCapUtil);
    const recencyNorm = normalizeRatio(recencyScore);

    const axes = [
      { subject: 'Registration', score: regNorm },
      { subject: 'Attendance', score: attendNorm },
      { subject: 'Online', score: onlineNorm },
      { subject: 'Capacity', score: capNorm },
      { subject: 'Recency', score: recencyNorm },
    ];

    return {
      axes,
      totals: {
        total,
        online: onlineCount,
        offline: offlineCount,
        avgCapacity: Math.round(avgCapUtil * 100),
      },
    };
  }, [list]);

  const chartData = metrics.axes.map((a) => ({ subject: a.subject, score: a.score }));

  const chartConfig = {
    score: {
      label: 'Score',
      color: 'var(--chart-1)',
    },
  } as ChartConfig;

  return (
    <Card className="px-4">
      <CardHeader className="items-center">
        <CardTitle>Event Insights</CardTitle>
        <CardDescription>Overview of upcoming events</CardDescription>
      </CardHeader>
      <CardContent className="rounded-lg border pb-0">
        {/* make chart slightly smaller to better fit the right column */}
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={chartData} outerRadius="55%">
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="subject" />
            <PolarGrid />
            <Radar dataKey="score" fill="var(--color-score)" fillOpacity={0.6} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
